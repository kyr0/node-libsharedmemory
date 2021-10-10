const {
    NodeSharedMemoryWriteStream,
    NodeSharedMemoryReadStream
} = require("node-libsharedmemory");

const assert = require("assert");

// --- NodeSharedMemoryWriteStream

assert(NodeSharedMemoryWriteStream, "The expected class NodeSharedMemoryWriteStream is undefined");

const SHM_SEGMENT_NAME = "foo" + Date.now();
const SHM_SEGMENT_SIZE = 65535;
const SHM_PERSISTENT = true;

const testNodeSharedMemoryWriteStream = () => {

    const streamWriter = new NodeSharedMemoryWriteStream();

    streamWriter.write("ab😃", SHM_SEGMENT_NAME, SHM_SEGMENT_SIZE, SHM_PERSISTENT);
}
testNodeSharedMemoryWriteStream();

// --- NodeSharedMemoryReadStream

assert(NodeSharedMemoryReadStream, "The expected class NodeSharedMemoryReadStream is undefined");

const testNodeSharedMemoryReadStream = () => {

    const streamReader = new NodeSharedMemoryReadStream();

    const data = streamReader.read(SHM_SEGMENT_NAME, SHM_SEGMENT_SIZE, SHM_PERSISTENT);

    console.log('Received UTF8 string', data);

    assert.strictEqual(data, "ab😃", "Buffer read doesnt equal the written one")
}
testNodeSharedMemoryReadStream();

// --- Write/Read big string (re-write/override case)

const testLongString = `ab😃ab😃ab😃ab😃ab😃ab😃ab😃ab😃ab😃ab😃ab
😃ab😃ab😃ab😃ab😃ab😃ab😃ab😃ab😃ab😃ab😃ab😃ab😃ab😃ab😃ab😃ab😃ab
😃ab😃ab😃ab😃ab😃ab😃ab😃ab😃ab😃ab😃ab😃ab😃ab😃ab😃ab😃ab😃ab😃ab
😃ab😃ab😃ab😃ab😃ab😃ab😃ab😃ab😃ab😃ab😃ab😃ab😃ab😃ab😃ab😃ab😃ab
😃ab😃ab😃ab😃ab😃ab😃ab😃ab😃ab😃ab😃ab😃ab😃ab😃ab😃ab😃ab😃ab😃ab
😃ab😃ab😃ab😃ab😃ab😃ab😃ab😃ab😃ab😃ab😃ab😃ab😃ab😃ab😃ab😃ab😃ab`;

const testNodeSharedMemoryWriteReadBigStream = () => {

    const streamWriter = new NodeSharedMemoryWriteStream();

    streamWriter.write(testLongString, SHM_SEGMENT_NAME, SHM_SEGMENT_SIZE, SHM_PERSISTENT);

    const streamReader = new NodeSharedMemoryReadStream();

    const data = streamReader.read(SHM_SEGMENT_NAME, SHM_SEGMENT_SIZE, SHM_PERSISTENT);

    console.log('Received UTF8 string', data);

    assert.strictEqual(data, testLongString, "Buffer read doesnt equal the written one")
}
testNodeSharedMemoryWriteReadBigStream();

console.log("Tests passed -- everything looks OK!");