
# EventEmitter
[![JavaScript Style Guide](https://cdn.rawgit.com/standard/standard/master/badge.svg)](https://github.com/standard/standard)

An EventEmitter for client side and server side support.

<br />

## Table of Contents
- [ Installation ](#install)
- [ Usage ](#usage)

<br />

<a name="install"></a>
## Install

```console
npm i @neumatter/event-emitter
```

<br />

<a name="usage"></a>
## Usage


### constructor:
Args: `options?: { captureRejections?: boolean, maxListeners?: number }`

```js
import EventEmitter from '@neumatter/event-emitter'

// default options when undefined:
const eventEmitter = new EventEmitter({ captureRejections: false, maxListeners: 10 })
```


### addListener | on:
Args: `eventName: string, listener: (...args) => void`

```js
import EventEmitter from '@neumatter/event-emitter'

// default options when undefined:
const eventEmitter = new EventEmitter()

const errorHandler = (err) => {
  console.error(err)
}

eventEmitter.addListener('error', errorHandler)
```


### removeListener | off:
Args: `eventName: string, listener: (...args) => void`

```js
import EventEmitter from '@neumatter/event-emitter'

// default options when undefined:
const eventEmitter = new EventEmitter()

const errorHandler = (err) => {
  console.error(err)
}

eventEmitter.removeListener('error', errorHandler)
```


### emit:
Args: `eventName: string, ...args: any[]`

```js
import EventEmitter from '@neumatter/event-emitter'

// default options when undefined:
const eventEmitter = new EventEmitter()

eventEmitter.emit('error', new Error('error message'))
```
