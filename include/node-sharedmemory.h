#include <iostream>
#include "libsharedmemory.hpp"
#include "napi.h"

using namespace Napi;
using namespace lsm;

class NodeSharedMemoryReadStream : public ObjectWrap<NodeSharedMemoryReadStream> {
public:

    explicit NodeSharedMemoryReadStream(const Napi::CallbackInfo &);

    inline Napi::Value read(const Napi::CallbackInfo &);

    static Napi::Function GetClass(Napi::Env);

private:
    std::vector<SharedMemoryWriteStream> _readStreams;
};

class NodeSharedMemoryWriteStream : public ObjectWrap<NodeSharedMemoryWriteStream> {
public:
    explicit NodeSharedMemoryWriteStream(const Napi::CallbackInfo &);

    inline void write(const Napi::CallbackInfo &);
  
    static Napi::Function GetClass(Napi::Env);

  private:
    std::vector<SharedMemoryWriteStream> _writeStreams;
};
