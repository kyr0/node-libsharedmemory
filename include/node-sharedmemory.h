#include <iostream>
#include "libsharedmemory.hpp"
#include "napi.h"

using namespace Napi;
using namespace lsm;

struct StreamConfig {
  std::string sharedMemoryIdent;
  size_t bufferSize;
  bool isPersistent;
};

class NodeSharedMemoryReadStream : public ObjectWrap<NodeSharedMemoryReadStream> {
public:

    explicit NodeSharedMemoryReadStream(const Napi::CallbackInfo &);

    inline Napi::Value readString(const Napi::CallbackInfo &);
    inline Napi::Value readFloatArray(const Napi::CallbackInfo &);
    inline Napi::Value readDoubleArray(const Napi::CallbackInfo &);
    inline Napi::Value readFlags(const Napi::CallbackInfo &);

    static Napi::Function GetClass(Napi::Env);

  private:
    SharedMemoryReadStream _readStream;
};

class NodeSharedMemoryWriteStream : public ObjectWrap<NodeSharedMemoryWriteStream> {
public:
    explicit NodeSharedMemoryWriteStream(const Napi::CallbackInfo &);

    inline void writeString(const Napi::CallbackInfo &);
    inline void writeFloatArray(const Napi::CallbackInfo &);
    inline void writeDoubleArray(const Napi::CallbackInfo &);
  
    static Napi::Function GetClass(Napi::Env);

  private:
    SharedMemoryWriteStream _writeStream;
};
