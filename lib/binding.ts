const nodeSharedMemory = require('bindings')('node-libsharedmemory')

export = {
    ...nodeSharedMemory
}
