const {
    NodeSharedMemoryWriteStream,
    NodeSharedMemoryReadStream
} = require("node-libsharedmemory");

const assert = require("assert");

// --- NodeSharedMemoryWriteStream

assert(NodeSharedMemoryWriteStream, "The expected class NodeSharedMemoryWriteStream is undefined");

const testNodeSharedMemoryWriteStream = () => {

    const streamWriter = new NodeSharedMemoryWriteStream();

    streamWriter.writeString("ab😃");
}
testNodeSharedMemoryWriteStream();

// --- NodeSharedMemoryReadStream

assert(NodeSharedMemoryReadStream, "The expected class NodeSharedMemoryReadStream is undefined");

const testNodeSharedMemoryReadStream = () => {

    const streamReader = new NodeSharedMemoryReadStream();

    const data = streamReader.readString();

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

    streamWriter.writeString(testLongString);

    const streamReader = new NodeSharedMemoryReadStream();

    const data = streamReader.readString();

    console.log('Received UTF8 string', data);

    assert.strictEqual(data, testLongString, "Buffer read doesnt equal the written one")
}
testNodeSharedMemoryWriteReadBigStream();

console.log("Tests passed -- everything looks OK!");