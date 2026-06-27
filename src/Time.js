import EventEmitter from './EventEmitter.js'

export default class Time extends EventEmitter {
  constructor() {
    super()
    this.start   = Date.now()
    this.current = this.start
    this.elapsed = 0
    this.delta   = 16
    this._active = true
    this._rafId  = null
    this._tick   = this._tick.bind(this)
    this._rafId  = requestAnimationFrame(this._tick)
  }

  _tick() {
    const now    = Date.now()
    this.delta   = (now - this.current) / 1000
    this.current = now
    this.elapsed = (now - this.start) / 1000
    if (this._active) this.trigger('tick')
    this._rafId = requestAnimationFrame(this._tick)
  }

  wake()  { this._active = true  }
  sleep() { this._active = false }
}
