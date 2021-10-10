#include "node-sharedmemory.h"

// --- NodeSharedMemoryReadStream

NodeSharedMemoryReadStream::NodeSharedMemoryReadStream(
    const Napi::CallbackInfo &info)
    : ObjectWrap(info) {}

Napi::Value NodeSharedMemoryReadStream::read(const Napi::CallbackInfo &info) {

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
    
    return Napi::String::New(info.Env(), reader.read());
}

Napi::Function NodeSharedMemoryReadStream::GetClass(Napi::Env env) {
    return DefineClass(env, "NodeSharedMemoryReadStream", {
        NodeSharedMemoryReadStream::InstanceMethod("read", &NodeSharedMemoryReadStream::read),
    });
}

// --- NodeSharedMemoryWriteStream

NodeSharedMemoryWriteStream::NodeSharedMemoryWriteStream(
    const Napi::CallbackInfo &info)
    : ObjectWrap(info) {}


void NodeSharedMemoryWriteStream::write(const Napi::CallbackInfo &info) {

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

    std::string data = info[0].As<Napi::String>().Utf8Value();
    std::string sharedMemoryIdent = info[1].As<Napi::String>().Utf8Value();
    size_t bufferSize = info[2].As<Napi::Number>().Uint32Value();
    bool isPersistent = info[3].As<Napi::Boolean>().Value();

    SharedMemoryWriteStream writer =
        SharedMemoryWriteStream{sharedMemoryIdent, bufferSize, isPersistent};
    
    writer.write(data);
}

Napi::Function NodeSharedMemoryWriteStream::GetClass(Napi::Env env) {
    return DefineClass(env, "NodeSharedMemoryWriteStream", {
        NodeSharedMemoryWriteStream::InstanceMethod("write", &NodeSharedMemoryWriteStream::write),
    });
}

Napi::Object Init(Napi::Env env, Napi::Object exports) {
    exports.Set(Napi::String::New(env, "NodeSharedMemoryReadStream"), NodeSharedMemoryReadStream::GetClass(env));
    exports.Set(Napi::String::New(env, "NodeSharedMemoryWriteStream"), NodeSharedMemoryWriteStream::GetClass(env));
    return exports;
}

NODE_API_MODULE(addon, Init);