#include "node-sharedmemory.h"
#include <ostream>
#include <string>

// --- NodeSharedMemoryReadStream

NodeSharedMemoryReadStream::NodeSharedMemoryReadStream(
    const Napi::CallbackInfo &info)
    : ObjectWrap(info), _readStream ("__void", 64, true) {
  
  Napi::Env env = info.Env();
  
  if (info.Length() < 1 || !info[0].IsString()) {
        Napi::TypeError::New(env, 
            "Expected shared memory identifier to be a string.")
            .ThrowAsJavaScriptException();
    }

    if (info.Length() < 2 || !info[1].IsNumber()) {
        Napi::TypeError::New(env, 
            "Expected shared memory buffer size to be a number.")
            .ThrowAsJavaScriptException();
    }

    if (info.Length() < 3 || !info[2].IsBoolean()) {
        Napi::TypeError::New(env, 
            "Expected shared memory persistence flag to be a boolean.")
            .ThrowAsJavaScriptException();
    }

    std::string sharedMemoryIdent = info[0].As<Napi::String>().Utf8Value();
    size_t bufferSize = info[1].As<Napi::Number>().Uint32Value();
    bool isPersistent = info[2].As<Napi::Boolean>().Value();

    _readStream = SharedMemoryReadStream{sharedMemoryIdent, bufferSize, isPersistent};
}

Napi::Value NodeSharedMemoryReadStream::readFlags(const Napi::CallbackInfo &info) {
  Napi::Env env = info.Env();

  return Napi::Number::New(env, 0b00000001);
}

Napi::Value NodeSharedMemoryReadStream::readString(const Napi::CallbackInfo &info) {

  Napi::Env env = info.Env();
  
  if (info.Length() < 1 || !info[0].IsString()) {
        Napi::TypeError::New(env, 
            "Expected shared memory identifier to be a string.")
            .ThrowAsJavaScriptException();
    }

    if (info.Length() < 2 || !info[1].IsNumber()) {
        Napi::TypeError::New(env, 
            "Expected shared memory buffer size to be a number.")
            .ThrowAsJavaScriptException();
    }

    if (info.Length() < 3 || !info[2].IsBoolean()) {
        Napi::TypeError::New(env, 
            "Expected shared memory persistence flag to be a boolean.")
            .ThrowAsJavaScriptException();
    }

    std::string sharedMemoryIdent = info[0].As<Napi::String>().Utf8Value();
    size_t bufferSize = info[1].As<Napi::Number>().Uint32Value();
    bool isPersistent = info[2].As<Napi::Boolean>().Value();

    /*
    SharedMemoryReadStream reader =
        SharedMemoryReadStream {sharedMemoryIdent, bufferSize, isPersistent};
    */
    // return Napi::String::New(info.Env(), reader.readString());
    return Napi::String::New(info.Env(), _readStream.readString());
}

Napi::Value NodeSharedMemoryReadStream::readFloat32Array(const Napi::CallbackInfo &info) {

  Napi::Env env = info.Env();
  
  if (info.Length() < 1 || !info[0].IsString()) {
        Napi::TypeError::New(env, 
            "Expected shared memory identifier to be a string.")
            .ThrowAsJavaScriptException();
    }

    if (info.Length() < 2 || !info[1].IsNumber()) {
        Napi::TypeError::New(env, 
            "Expected shared memory buffer size to be a number.")
            .ThrowAsJavaScriptException();
    }

    if (info.Length() < 3 || !info[2].IsBoolean()) {
        Napi::TypeError::New(env, 
            "Expected shared memory persistence flag to be a boolean.")
            .ThrowAsJavaScriptException();
    }

    std::string sharedMemoryIdent = info[0].As<Napi::String>().Utf8Value();
    size_t bufferSize = info[1].As<Napi::Number>().Uint32Value();
    bool isPersistent = info[2].As<Napi::Boolean>().Value();
    
    SharedMemoryReadStream reader =
        SharedMemoryReadStream {sharedMemoryIdent, bufferSize, isPersistent};

    float *floatArrayData = reader.readFloatArray();

    ArrayBuffer ar = ArrayBuffer::New(info.Env(), floatArrayData, reader.readSize(kMemoryTypeFloat));
    
    return Float32Array::New(info.Env(), reader.readLength(kMemoryTypeFloat), ar, 0);
}

Napi::Function NodeSharedMemoryReadStream::GetClass(Napi::Env env) {
    return DefineClass(env, "NodeSharedMemoryReadStream", {
        NodeSharedMemoryReadStream::InstanceMethod("readString", &NodeSharedMemoryReadStream::readString),
        NodeSharedMemoryReadStream::InstanceMethod("readFloat32Array", &NodeSharedMemoryReadStream::readFloat32Array),
        NodeSharedMemoryReadStream::InstanceMethod("readFlags", &NodeSharedMemoryReadStream::readFlags),
        //NodeSharedMemoryReadStream::InstanceMethod("readDoubleArray", &NodeSharedMemoryReadStream::readDoubleArray),
    });
}

// --- NodeSharedMemoryWriteStream

NodeSharedMemoryWriteStream::NodeSharedMemoryWriteStream(
    const Napi::CallbackInfo &info)
    : ObjectWrap(info), _writeStream ("__void", 64, true) {

  Napi::Env env = info.Env();
  
  if (info.Length() < 1 || !info[0].IsString()) {
        Napi::TypeError::New(env, 
            "Expected shared memory identifier to be a string.")
            .ThrowAsJavaScriptException();
    }

    if (info.Length() < 2 || !info[1].IsNumber()) {
        Napi::TypeError::New(env, 
            "Expected shared memory buffer size to be a number.")
            .ThrowAsJavaScriptException();
    }

    if (info.Length() < 3 || !info[2].IsBoolean()) {
        Napi::TypeError::New(env, 
            "Expected shared memory persistence flag to be a boolean.")
            .ThrowAsJavaScriptException();
    }

    std::string sharedMemoryIdent = info[0].As<Napi::String>().Utf8Value();
    size_t bufferSize = info[1].As<Napi::Number>().Uint32Value();
    bool isPersistent = info[2].As<Napi::Boolean>().Value();

    _writeStream = SharedMemoryWriteStream{sharedMemoryIdent, bufferSize, isPersistent};
}


void NodeSharedMemoryWriteStream::writeString(const Napi::CallbackInfo &info) {

     Napi::Env env = info.Env();

    if (info.Length() < 1 || !info[0].IsString()) {
        Napi::TypeError::New(info.Env(), 
            "Expected data to write to be a string.")
            .ThrowAsJavaScriptException();
        return;
    }

    if (info.Length() < 2 || !info[1].IsString()) {
        Napi::TypeError::New(env, 
            "Expected shared memory identifier to be a string.")
            .ThrowAsJavaScriptException();
        return;
    }

    if (info.Length() < 3 || !info[2].IsNumber()) {
        Napi::TypeError::New(env, 
            "Expected shared memory buffer size to be a number.")
            .ThrowAsJavaScriptException();
        return;
    }

    if (info.Length() < 4 || !info[3].IsBoolean()) {
        Napi::TypeError::New(env, 
            "Expected shared memory persistence flag to be a boolean.")
            .ThrowAsJavaScriptException();
        return;
    }

    // TODO: DataView
    // https://github.com/nodejs/node-addon-api/blob/main/test/dataview/dataview.js

    std::string sharedMemoryIdent = info[1].As<Napi::String>().Utf8Value();
    size_t bufferSize = info[2].As<Napi::Number>().Uint32Value();
    bool isPersistent = info[3].As<Napi::Boolean>().Value();

    /*
    SharedMemoryWriteStream writer =
    SharedMemoryWriteStream{sharedMemoryIdent, bufferSize, isPersistent};
    */
    std::string data = info[0].As<Napi::String>().Utf8Value();

    // writer.write(data);
    _writeStream.write(data);
}

void NodeSharedMemoryWriteStream::writeFloat32Array(const Napi::CallbackInfo &info) {

  Napi::Env env = info.Env();

    if (info.Length() < 1 || !info[0].IsTypedArray()) {
        Napi::TypeError::New(info.Env(), 
            "Expected data to write to be a Float32Array or Float64Array.")
            .ThrowAsJavaScriptException();
        return;
    }

    if (info.Length() < 2 || !info[1].IsString()) {
        Napi::TypeError::New(env, 
            "Expected shared memory identifier to be a string.")
            .ThrowAsJavaScriptException();
        return;
    }

    if (info.Length() < 3 || !info[2].IsNumber()) {
        Napi::TypeError::New(env, 
            "Expected shared memory buffer size to be a number.")
            .ThrowAsJavaScriptException();
        return;
    }

    if (info.Length() < 4 || !info[3].IsBoolean()) {
        Napi::TypeError::New(env, 
            "Expected shared memory persistence flag to be a boolean.")
            .ThrowAsJavaScriptException();
        return;
    }

    // TODO: DataView
    // https://github.com/nodejs/node-addon-api/blob/main/test/dataview/dataview.js

    std::string sharedMemoryIdent = info[1].As<Napi::String>().Utf8Value();
    size_t bufferSize = info[2].As<Napi::Number>().Uint32Value();
    bool isPersistent = info[3].As<Napi::Boolean>().Value();

    SharedMemoryWriteStream writer =
        SharedMemoryWriteStream{sharedMemoryIdent, bufferSize, isPersistent};

    Napi::Float32Array numberArray = info[0].As<Napi::Float32Array>();
    float* numbers = numberArray.Data();
    writer.write(numbers, numberArray.ElementLength());
}

Napi::Function NodeSharedMemoryWriteStream::GetClass(Napi::Env env) {
    return DefineClass(env, "NodeSharedMemoryWriteStream", {
        NodeSharedMemoryWriteStream::InstanceMethod("writeString", &NodeSharedMemoryWriteStream::writeString),
        NodeSharedMemoryWriteStream::InstanceMethod("writeFloat32Array", &NodeSharedMemoryWriteStream::writeFloat32Array),
    });
}

Napi::Object Init(Napi::Env env, Napi::Object exports) {
    exports.Set(Napi::String::New(env, "NodeSharedMemoryReadStream"), NodeSharedMemoryReadStream::GetClass(env));
    exports.Set(Napi::String::New(env, "NodeSharedMemoryWriteStream"), NodeSharedMemoryWriteStream::GetClass(env));
    return exports;
}

NODE_API_MODULE(addon, Init);