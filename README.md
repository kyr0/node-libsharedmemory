# `node-libsharedmemory`

`node-libsharedmemory` is a native Node.js module that is based on [`libsharedmemory`](https://github.com/kyr0/libsharedmemory). It can be used to read and write to shared memory on Windows, Linux and macOS. `node-libsharedmemory` makes it easy to transfer data between isolated host OS processes and Node.js applications. It also helps inter-connecting modules of applications that are implemented in different programming languages.

<img src="screenshot.png" width="350px" />

## Example

```js
const {
    NodeSharedMemoryWriteStream,
    NodeSharedMemoryReadStream
} = require("node-libsharedmemory");

// this can happen in other Node.js processes or any other application
// using libsharedmemory to write data
const streamWriter = new NodeSharedMemoryWriteStream();

streamWriter.writeString(`{ remoteApp: { is: 'sending', data: 'ab😃ab😃ab😃' } }`);

const streamReader = new NodeSharedMemoryReadStream();

const data = streamReader.readString();

// data equals the data written via .write() before
console.log('Data received from shared memory', data);
```

## Use

Just install it via:

`npm install node-libsharedmemory`

The example `examples/basic` should be pretty self-explanatory.

## Limits

`libsharedmemory` does only support the following datatypes:
- `String` (`readString`, `writeString`)
- `Float32Array` (`readFloatArray`, `writeFloatArray`)
- `Float64Array` (`readDoubleArray`, `writeDoubleArray`)

- This library doesn't care for endinanness. This should be naturally fine
because shared memory shouldn't be shared between different machine 
architectures. However, if you plan to copy the shared buffer onto a 
network layer prototcol, make sure to add an endianess indication bit.

- At the time of writing, there is no support for shared memory persistency
on Windows. Shared memory is lost after the writing process is killed.

## Build

To re-build the module from source call: `npm run rebuild`

## Test

The module can be tested via: `npm test`

## License

`node-libsharedmemory` is released under the MIT license, see the `LICENSE` file.

## Roadmap

1) Native `onChange()` event handling abstraction (currently needs a for-loop change detection in V8)
2) Windows shared memory persistency support