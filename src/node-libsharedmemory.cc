#include "libsharedmemory.hpp"
#include "napi.h"
#include "node-sharedmemory.h"
#include <memory>
#include <ostream>
#include <string>

StreamConfig getStreamConfig(const Napi::CallbackInfo &info) {

    std::string sharedMemoryIdent = "__node-sharedmemory$";
    if (info.Length() >= 1 && info[0].IsString()) {
        sharedMemoryIdent = info[0].As<Napi::String>().Utf8Value();
    }

    size_t bufferSize = 65535;
    if (info.Length() >= 2 && info[1].IsNumber()) {
        bufferSize = info[1].As<Napi::Number>().Uint32Value();
    }

    bool isPersistent = true;
    if (info.Length() >= 3 && info[2].IsBoolean()) {
        isPersistent = info[2].As<Napi::Boolean>().Value();
    }

    return StreamConfig {
      sharedMemoryIdent,
      bufferSize,
      isPersistent
    };
}

// --- NodeSharedMemoryReadStream

NodeSharedMemoryReadStream::NodeSharedMemoryReadStream(
    const Napi::CallbackInfo &info)
    : ObjectWrap(info), _readStream("__void", 64, true) {

    StreamConfig streamConfig = getStreamConfig(info);

    this->_readStream = *new SharedMemoryReadStream(
        streamConfig.sharedMemoryIdent, streamConfig.bufferSize,
        streamConfig.isPersistent);
}

Napi::Value NodeSharedMemoryReadStream::readFlags(const Napi::CallbackInfo &info) {
  return Napi::Number::New(info.Env(), _readStream.readFlags());
}

Napi::Value NodeSharedMemoryReadStream::readString(const Napi::CallbackInfo &info) {
    return Napi::String::New(info.Env(), _readStream.readString());
}

Napi::Value NodeSharedMemoryReadStream::readFloatArray(const Napi::CallbackInfo &info) {

    float *floatArrayData = _readStream.readFloatArray();
    ArrayBuffer ab = ArrayBuffer::New(info.Env(), floatArrayData, _readStream.readSize(kMemoryTypeFloat));
    
    return Float32Array::New(info.Env(), _readStream.readLength(kMemoryTypeFloat), ab, 0);
}

Napi::Value NodeSharedMemoryReadStream::readDoubleArray(const Napi::CallbackInfo &info) {

    double *doubleArrayData = _readStream.readDoubleArray();
    ArrayBuffer ab = ArrayBuffer::New(info.Env(), doubleArrayData, _readStream.readSize(kMemoryTypeDouble));
    
    return Float64Array::New(info.Env(), _readStream.readLength(kMemoryTypeDouble), ab, 0);
}

Napi::Function NodeSharedMemoryReadStream::GetClass(Napi::Env env) {
    return DefineClass(env, "NodeSharedMemoryReadStream", {
        NodeSharedMemoryReadStream::InstanceMethod("readString", &NodeSharedMemoryReadStream::readString),
        NodeSharedMemoryReadStream::InstanceMethod("readFloatArray", &NodeSharedMemoryReadStream::readFloatArray),
        NodeSharedMemoryReadStream::InstanceMethod("readFlags", &NodeSharedMemoryReadStream::readFlags),
        NodeSharedMemoryReadStream::InstanceMethod("readDoubleArray", &NodeSharedMemoryReadStream::readDoubleArray),
    });
}

// --- NodeSharedMemoryWriteStream

NodeSharedMemoryWriteStream::NodeSharedMemoryWriteStream(
    const Napi::CallbackInfo &info)
    : ObjectWrap(info), _writeStream("__void", 64, true) {

    StreamConfig streamConfig = getStreamConfig(info);

    this->_writeStream = *new SharedMemoryWriteStream(
        streamConfig.sharedMemoryIdent, streamConfig.bufferSize,
        streamConfig.isPersistent);
}

void NodeSharedMemoryWriteStream::writeString(const Napi::CallbackInfo &info) {
    std::string data = info[0].As<Napi::String>().Utf8Value();
    _writeStream.write(data);
}

void NodeSharedMemoryWriteStream::writeFloatArray(const Napi::CallbackInfo &info) {
    Napi::Float32Array numberArray = info[0].As<Napi::Float32Array>();
    float* numbers = numberArray.Data();
    _writeStream.write(numbers, numberArray.ElementLength());
}

void NodeSharedMemoryWriteStream::writeDoubleArray(const Napi::CallbackInfo &info) {
    Napi::Float64Array numberArray = info[0].As<Napi::Float64Array>();
    double* numbers = numberArray.Data();
    _writeStream.write(numbers, numberArray.ElementLength());
}

Napi::Function NodeSharedMemoryWriteStream::GetClass(Napi::Env env) {
    return DefineClass(env, "NodeSharedMemoryWriteStream", {
        NodeSharedMemoryWriteStream::InstanceMethod("writeString", &NodeSharedMemoryWriteStream::writeString),
        NodeSharedMemoryWriteStream::InstanceMethod("writeFloatArray", &NodeSharedMemoryWriteStream::writeFloatArray),
        NodeSharedMemoryWriteStream::InstanceMethod("writeDoubleArray", &NodeSharedMemoryWriteStream::writeDoubleArray),
    });
}

Napi::Object Init(Napi::Env env, Napi::Object exports) {

    // memory type / change bit exports
    exports.Set(Napi::String::New(env, "kMemoryChanged"), Napi::Number::New(env, kMemoryChanged));
    exports.Set(Napi::String::New(env, "kMemoryTypeString"), Napi::Number::New(env, kMemoryTypeString));
    exports.Set(Napi::String::New(env, "kMemoryTypeFloat"), Napi::Number::New(env, kMemoryTypeFloat));
    exports.Set(Napi::String::New(env, "kMemoryTypeDouble"),
                Napi::Number::New(env, kMemoryTypeDouble));

    // stream class exports
    exports.Set(Napi::String::New(env, "NodeSharedMemoryReadStream"), NodeSharedMemoryReadStream::GetClass(env));
    exports.Set(Napi::String::New(env, "NodeSharedMemoryWriteStream"),
                NodeSharedMemoryWriteStream::GetClass(env));

    return exports;
}

NODE_API_MODULE(addon, Init);