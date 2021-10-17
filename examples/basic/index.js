const {
    NodeSharedMemoryWriteStream,
    NodeSharedMemoryReadStream,
    kMemoryChanged,
    kMemoryTypeString,
    kMemoryTypeFloat,
    kMemoryTypeDouble,
} = require("node-libsharedmemory");

const assert = require("assert");


const renderBinaryString = (num, bits = 8) => {
    let mask = "";
    const rebasedNum = num.toString(2);
    for (let i=0; i<(bits-rebasedNum.length); i++) {
        mask += "0";
    }
  return "0b" + mask + rebasedNum;
}


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


// --- Write/Read Float64Array

const SHM_SEGMENT_NAME = "foo" + Date.now();
const SHM_SEGMENT_SIZE = 65535;
const SHM_PERSISTENT = true;

const testFloat64Data = Float64Array.from([
    3434367673.2334367434343433434,
    34343434467.2223434343343423434,
    534343676767.6663434343434,
]);

const testNodeSharedMemoryWriteReadFloat64Array = () => {

    const streamWriter = new NodeSharedMemoryWriteStream(
        SHM_SEGMENT_NAME, SHM_SEGMENT_SIZE, SHM_PERSISTENT);

    streamWriter.writeDoubleArray(testFloat64Data);

    const streamReader = new NodeSharedMemoryReadStream(
        SHM_SEGMENT_NAME, SHM_SEGMENT_SIZE, SHM_PERSISTENT);

    assert.strictEqual(renderBinaryString(streamReader.readFlags()), '0b00001001', 'Change bit missing or data type incorrect');

    const data = streamReader.readDoubleArray();

    console.log('Received Float64Array', data);

    assert.strictEqual(
        data[0], 
        testFloat64Data[0], 
        "Float64Array read doesn't equal the written one");

    assert.strictEqual(
        data[1], 
        testFloat64Data[1], 
        "Float64Array read doesn't equal the written one");

    assert.strictEqual(
        data[2], 
        testFloat64Data[2], 
        "Float64Array read doesn't equal the written one");
}
testNodeSharedMemoryWriteReadFloat64Array();


// --- Linear async read/write in non-deterministic time domain

const streamWriter = new NodeSharedMemoryWriteStream(
    SHM_SEGMENT_NAME, SHM_SEGMENT_SIZE, SHM_PERSISTENT);

const streamReader = new NodeSharedMemoryReadStream(
    SHM_SEGMENT_NAME, SHM_SEGMENT_SIZE, SHM_PERSISTENT);

const genFloat32Array = () => {
    const floats = [];
    for (let i=0; i<255; i++) {
        floats.push(
            Math.exp(Math.floor(Math.random() * 9) + 1)
        );
    }
    return new Float32Array(floats);
}

let i = 0;
let prevDataRecieved;
let j = 0;
let prevChangeBitValue;

const readInterval = setInterval(() => {

    const currentDataReceived = streamReader.readFloatArray();
    if (typeof currentDataReceived === 'undefined' || !currentDataReceived[0]) return;

    const flags = streamReader.readFlags();
    const changeBitValue = flags & kMemoryChanged;
    const dataHasChanged = changeBitValue !== prevChangeBitValue;
    prevChangeBitValue = changeBitValue;

    // bitwise change detection
    if (!dataHasChanged) return;

    // end of test condition check
    if (i >= 100 && j >= 100) {
        console.log('Async/linear read/write test: Received', j, 'float samples.')
        clearInterval(readInterval)
    } else {

        if (currentDataReceived && currentDataReceived[0]) {
            j++;
        }
        prevDataRecieved = currentDataReceived;
    }
}, 0)

const writeInterval = setInterval(() => {

    streamWriter.writeFloatArray(genFloat32Array());

    if (i === 100) {
        clearInterval(writeInterval)
    }
    i++;
    
}, 0)

console.log("Tests passed -- everything looks OK!");

