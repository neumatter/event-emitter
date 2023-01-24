
const CAPTURE_REJECTION_SYMBOL = Symbol.for('neumatter.rejection')

export default class EventEmitter {
  #internal
  #captureRejections
  #maxListeners

  constructor (options = { captureRejections: false, maxListeners: 10 }) {
    this.#internal = {
      newListener: [],
      removeListener: []
    }

    const maxIsNumber = typeof options.maxListeners === 'number'
    this.#captureRejections = options.captureRejections === true
    this.#maxListeners = maxIsNumber ? options.maxListeners : 10
  }

  get captureRejections () {
    return this.#captureRejections
  }

  get maxListeners () {
    return this.#maxListeners
  }

  /**
   *
   * @param {string} eventName
   * @param {(...args: any[]) => void} callback
   * @return {EventEmitter}
   */
  addListener (eventName, callback) {
    assert(eventName, 'string')
    assert(callback, 'function')

    if (!this.#internal[eventName]) {
      this.#internal[eventName] = []
    }

    if (this.#internal[eventName].length >= this.maxListeners) {
      console.warn(
        `EventEmitter.maxListeners reached for eventName: ${eventName}` +
        `\n  EventEmitter.maxListeners: ${this.maxListeners}` +
        `\n  EventEmitter.listenerCount['${eventName}']: ${this.#internal[eventName].length}`
      )
    }

    if (this.#internal[eventName].indexOf(callback) === -1) {
      if (eventName !== 'newListener') {
        this.emit('newListener', callback)
      }

      this.#internal[eventName].push(callback)
    }

    return this
  }

  eventNames () {
    return Object.keys(this.#internal)
  }

  emit (eventName, ...args) {
    if (
      typeof this.#internal[eventName] !== 'object' ||
      this.#internal[eventName].length === 0
    ) {
      return this
    }

    let index = -1
    let length = 0

    while (++index < (length = this.#internal[eventName].length)) {
      const eventListener = this.#internal[eventName][index]

      if (this.captureRejections && eventName !== 'error') {
        const potentialPromise = eventListener(...args)
        if (
          typeof potentialPromise === 'object' &&
          typeof potentialPromise.then === 'function'
        ) {
          if (typeof this[CAPTURE_REJECTION_SYMBOL] === 'function') {
            potentialPromise.catch(err => {
              this[CAPTURE_REJECTION_SYMBOL](err, eventName, ...args)
            })
          } else {
            potentialPromise.catch(err => {
              this.emit('error', err)
            })
          }
        }
      } else {
        eventListener(...args)
      }

      if (length !== this.#internal[eventName].length) {
        --index
      }
    }

    return this
  }

  /**
   *
   * @param {string} eventName
   * @return {number}
   */
  listenerCount (eventName) {
    assert(eventName, 'string')
    if (!this.#internal[eventName]) return 0
    return this.#internal[eventName].length
  }

  /**
   *
   * @param {string} eventName
   * @return {Array<Function>}
   */
  listeners (eventName) {
    assert(eventName, 'string')
    if (!this.#internal[eventName]) return []
    return this.#internal[eventName]
  }

  /**
   *
   * @param {string} eventName
   * @param {(...args: any[]) => void} callback
   * @return {EventEmitter}
   */
  on (eventName, callback) {
    return this.addListener(eventName, callback)
  }

  /**
   *
   * @param {string} eventName
   * @param {(...args: any[]) => void} callback
   * @return {EventEmitter}
   */
  once (eventName, callback) {
    const onceCallback = (...args) => {
      /* eslint-disable-next-line */
      callback(...args)
      this.removeListener(eventName, onceCallback)
    }

    return this.addListener(eventName, onceCallback)
  }

  /**
   *
   * @param {string} eventName
   * @param {(...args: any[]) => void} callback
   * @return {EventEmitter}
   */
  prependListener (eventName, callback) {
    assert(eventName, 'string')
    assert(callback, 'function')

    if (!this.#internal[eventName]) {
      this.#internal[eventName] = []
    }

    if (this.#internal[eventName].indexOf(callback) === -1) {
      if (this.#internal[eventName].length === 0) {
        this.#internal[eventName].push(callback)
      } else {
        this.#internal[eventName] = [callback, ...this.#internal[eventName]]
      }
    }

    return this
  }

  /**
   *
   * @param {string} eventName
   * @param {(...args: any[]) => void} callback
   * @return {EventEmitter}
   */
  prependOnceListener (eventName, callback) {
    const onceCallback = (...args) => {
      /* eslint-disable-next-line */
      callback(...args)
      this.removeListener(eventName, onceCallback)
    }

    return this.prependListener(eventName, onceCallback)
  }

  /**
   *
   * @param {string} eventName
   * @param {(...args: any[]) => void} callback
   * @return {EventEmitter}
   */
  off (eventName, callback) {
    return this.removeListener(eventName, callback)
  }

  /**
   *
   * @param {string} eventName
   * @returns {Array<Function>}
   */
  rawListeners (eventName) {
    assert(eventName, 'string')
    if (
      typeof this.#internal[eventName] !== 'object' ||
      !this.#internal[eventName].length
    ) {
      return []
    }

    return [...this.#internal[eventName]]
  }

  removeAllListeners (eventNames = []) {
    let index = -1
    const { length } = eventNames

    while (++index < length) {
      this.#internal[eventNames[index]] = []
    }

    return this
  }

  /**
   *
   * @param {string} eventName
   * @param {(...args: any[]) => void} callback
   * @return {EventEmitter}
   */
  removeListener (eventName, callback) {
    assert(eventName, 'string')
    assert(callback, 'function')

    const eventIndex = !this.#internal[eventName] ? -1 : this.#internal[eventName].indexOf(callback)

    if (eventIndex !== -1) {
      this.#internal[eventName].splice(eventIndex, 1)
    }

    this.emit('removeListener', callback)

    return this
  }
}

function assert (input, expected) {
  const type = typeof input
  if (type !== expected) {
    const message = `expected type "${expected}" recieved type "${type}"`
    throw new TypeError(message)
  }
}
