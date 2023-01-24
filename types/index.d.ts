
declare module '@neumatter/event-emitter'

export interface EventEmitterEvents {
  newListener: (callback: () => any) => void
  removeListener: (callback: () => any) => void
}

export default class EventEmitter {
  constructor (options?: { captureRejections?: false, maxListeners?: 10 })

  get captureRejections (): boolean
  get maxListeners (): number

  addListener<E extends keyof EventEmitterEvents>(
    eventName: E, listener: EventEmitterEvents[E]
  ): this

  eventNames () {
    return Object.keys(this.#internal)
  }

  emit<E extends keyof EventEmitterEvents>(
    eventName: E, ...args: Parameters<EventEmitterEvents[E]>
  ): this

  listenerCount<E extends keyof EventEmitterEvents>(
    eventName: E
  ): number

  listeners<E extends keyof EventEmitterEvents>(
    eventName: E
  ): Array<EventEmitterEvents[E]>

  on<E extends keyof EventEmitterEvents>(
    eventName: E, listener: EventEmitterEvents[E]
  ): this

  once<E extends keyof EventEmitterEvents>(
    eventName: E, listener: EventEmitterEvents[E]
  ): this

  prependListener<E extends keyof EventEmitterEvents>(
    eventName: E, listener: EventEmitterEvents[E]
  ): this

  prependOnceListener<E extends keyof EventEmitterEvents>(
    eventName: E, listener: EventEmitterEvents[E]
  ): this

  off<E extends keyof EventEmitterEvents>(
    eventName: E, listener: EventEmitterEvents[E]
  ): this

  rawListeners<E extends keyof EventEmitterEvents>(
    eventName: E
  ): Array<EventEmitterEvents[E]>

  removeAllListeners<E extends keyof EventEmitterEvents>(
    eventNames: Array<E>
  ): this

  removeListener<E extends keyof EventEmitterEvents>(
    eventName: E, listener: EventEmitterEvents[E]
  ): this
}
