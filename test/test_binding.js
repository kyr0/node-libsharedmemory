const {
    NodeSharedMemoryWriteStream,
    NodeSharedMemoryReadStream,
    kMemoryChanged,
    kMemoryTypeString,
    kMemoryTypeFloat,
    kMemoryTypeDouble
} = require("../dist/binding.js");

const assert = require("assert");

// --- NodeSharedMemoryWriteStream

const renderBinaryString = (num, bits = 8) => {
    let mask = "";
    const rebasedNum = num.toString(2);
    for (let i=0; i<(bits-rebasedNum.length); i++) {
        mask += "0";
    }
  return "0b" + mask + rebasedNum;
}

assert(
    NodeSharedMemoryWriteStream, 
    "The expected class NodeSharedMemoryWriteStream is undefined");

// --- NodeSharedMemoryWriteStream default

const testNodeSharedMemoryWriteReadStreamsDefault = () => {

    new NodeSharedMemoryWriteStream().writeString("ab😃!!");

    assert.strictEqual(
        new NodeSharedMemoryReadStream().readString(), 
        "ab😃!!", 
        "String read doesnt equal the written one"
    )
}
testNodeSharedMemoryWriteReadStreamsDefault();

// non-defaults; specific settings
const SHM_SEGMENT_NAME = "foo" + Date.now();
const SHM_SEGMENT_SIZE = 65535;
const SHM_PERSISTENT = true;

const testNodeSharedMemoryWriteStream = () => {

    const streamWriter = new NodeSharedMemoryWriteStream(
        SHM_SEGMENT_NAME, SHM_SEGMENT_SIZE, SHM_PERSISTENT);

    streamWriter.writeString("ab😃");
}
testNodeSharedMemoryWriteStream();

// --- NodeSharedMemoryReadStream

assert(
    NodeSharedMemoryReadStream, 
    "The expected class NodeSharedMemoryReadStream is undefined");

const testNodeSharedMemoryReadStream = () => {

    const streamReader = new NodeSharedMemoryReadStream(
        SHM_SEGMENT_NAME, SHM_SEGMENT_SIZE, SHM_PERSISTENT);

    const data = streamReader.readString();

    console.log('Received utf8 string:', data);

    const flags = streamReader.readFlags();

    console.log('Flags read', renderBinaryString(flags))
    
    /* (flags & kMemoryChanged) should lead to 1; then !! for boolean cast */
    assert.strictEqual(
        !!(flags & kMemoryChanged), 
        true, 
        "Change bit is NOT set")

    assert.strictEqual(
        !!(flags & kMemoryTypeString), 
        true, 
        "Data type is NOT set to string")

    assert.strictEqual(
        !!(flags & kMemoryTypeDouble), 
        false, 
        "Data type is set to double but is string")

    assert.strictEqual(
        !!(flags & kMemoryTypeFloat), 
        false, 
        "Data type is set to float but is string")

    assert.strictEqual(
        data, 
        "ab😃", 
        "String read doesnt equal the written one")
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

    const streamWriter = new NodeSharedMemoryWriteStream(
        SHM_SEGMENT_NAME, SHM_SEGMENT_SIZE, SHM_PERSISTENT);

    streamWriter.writeString(testLongString);

    const streamReader = new NodeSharedMemoryReadStream(
        SHM_SEGMENT_NAME, SHM_SEGMENT_SIZE, SHM_PERSISTENT);

    const data = streamReader.readString();

    console.log('Received UTF8 string', data);

    assert.strictEqual(
        data, 
        testLongString, 
        "Buffer read doesnt equal the written one")
}
testNodeSharedMemoryWriteReadBigStream();

// --- Write/Read Float32Array

const testFloat32Data = Float32Array.from([3.234,4.2222,5.6667,]);

const testNodeSharedMemoryWriteReadFloat32Array = () => {

    const streamWriter = new NodeSharedMemoryWriteStream(
        SHM_SEGMENT_NAME, SHM_SEGMENT_SIZE, SHM_PERSISTENT);

    streamWriter.writeFloat32Array(testFloat32Data);

    const streamReader = new NodeSharedMemoryReadStream(
        SHM_SEGMENT_NAME, SHM_SEGMENT_SIZE, SHM_PERSISTENT);

    //console.log('flags!' , streamReader.readFlags());

    const data = streamReader.readFloat32Array();

    console.log('Received Float32Array', data);

    assert.strictEqual(
        data[0], 
        testFloat32Data[0], 
        "Float32Array read doesn't equal the written one");

    assert.strictEqual(
        data[1], 
        testFloat32Data[1], 
        "Float32Array read doesn't equal the written one");

    assert.strictEqual(
        data[2], 
        testFloat32Data[2], 
        "Float32Array read doesn't equal the written one");
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