const {
    NodeSharedMemoryWriteStream,
    NodeSharedMemoryReadStream
} = require("../dist/binding.js");

const assert = require("assert");

// --- NodeSharedMemoryWriteStream

assert(NodeSharedMemoryWriteStream, "The expected class NodeSharedMemoryWriteStream is undefined");

const SHM_SEGMENT_NAME = "foo" + Date.now();
const SHM_SEGMENT_SIZE = 65535;
const SHM_PERSISTENT = true;

const testNodeSharedMemoryWriteStream = () => {

    const streamWriter = new NodeSharedMemoryWriteStream(SHM_SEGMENT_NAME, SHM_SEGMENT_SIZE, SHM_PERSISTENT);

    streamWriter.writeString("ab😃", SHM_SEGMENT_NAME, SHM_SEGMENT_SIZE, SHM_PERSISTENT);
}
testNodeSharedMemoryWriteStream();

// --- NodeSharedMemoryReadStream

assert(NodeSharedMemoryReadStream, "The expected class NodeSharedMemoryReadStream is undefined");

const testNodeSharedMemoryReadStream = () => {

    const streamReader = new NodeSharedMemoryReadStream(SHM_SEGMENT_NAME, SHM_SEGMENT_SIZE, SHM_PERSISTENT);

    const data = streamReader.readString(SHM_SEGMENT_NAME, SHM_SEGMENT_SIZE, SHM_PERSISTENT);

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

    const streamWriter = new NodeSharedMemoryWriteStream(SHM_SEGMENT_NAME, SHM_SEGMENT_SIZE, SHM_PERSISTENT);

    streamWriter.writeString(testLongString, SHM_SEGMENT_NAME, SHM_SEGMENT_SIZE, SHM_PERSISTENT);

    const streamReader = new NodeSharedMemoryReadStream(SHM_SEGMENT_NAME, SHM_SEGMENT_SIZE, SHM_PERSISTENT);

    const data = streamReader.readString(SHM_SEGMENT_NAME, SHM_SEGMENT_SIZE, SHM_PERSISTENT);

    console.log('Received UTF8 string', data);

    assert.strictEqual(data, testLongString, "Buffer read doesnt equal the written one")
}
testNodeSharedMemoryWriteReadBigStream();

// --- Write/Read Float32Array

const testFloat32Data = Float32Array.from([3.234,4.2222,5.6667,]);

const testNodeSharedMemoryWriteReadFloat32Array = () => {

    const streamWriter = new NodeSharedMemoryWriteStream(SHM_SEGMENT_NAME, SHM_SEGMENT_SIZE, SHM_PERSISTENT);

    streamWriter.writeFloat32Array(testFloat32Data, SHM_SEGMENT_NAME, SHM_SEGMENT_SIZE, SHM_PERSISTENT);

    const streamReader = new NodeSharedMemoryReadStream(SHM_SEGMENT_NAME, SHM_SEGMENT_SIZE, SHM_PERSISTENT);

    //console.log('flags!' , streamReader.readFlags());

    const data = streamReader.readFloat32Array(SHM_SEGMENT_NAME, SHM_SEGMENT_SIZE, SHM_PERSISTENT);

    console.log('Received Float32Array', data);

    assert.strictEqual(data[0], testFloat32Data[0], "Float32Array read doesn't equal the written one");
    assert.strictEqual(data[1], testFloat32Data[1], "Float32Array read doesn't equal the written one");
    assert.strictEqual(data[2], testFloat32Data[2], "Float32Array read doesn't equal the written one");
}
testNodeSharedMemoryWriteReadFloat32Array();


// --- NodeSharedMemoryReadStream OnChange handler

/*
const testNodeSharedMemoryReadStreamOnChangeHandler = () => {

    const streamWriter = new NodeSharedMemoryWriteStream(
        "lala", SHM_SEGMENT_SIZE, SHM_PERSISTENT);


    const streamReader = new NodeSharedMemoryReadStream(
        "lala", SHM_SEGMENT_SIZE, SHM_PERSISTENT);


    streamReader.onChange(function(data) {

        console.log('got called!', data);
    })

    streamWriter.write("abc");

}
testNodeSharedMemoryReadStreamOnChangeHandler();
*/

console.log("Tests passed -- everything looks OK!");