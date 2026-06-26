export default class EventEmitter {
  constructor() { this._callbacks = {} }

  on(names, callback) {
    names.split(' ').forEach(name => {
      if (!this._callbacks[name]) this._callbacks[name] = []
      this._callbacks[name].push(callback)
    })
    return this
  }

  off(names) {
    names.split(' ').forEach(name => { delete this._callbacks[name] })
    return this
  }

  trigger(name, args = []) {
    const callbacks = this._callbacks[name]
    if (callbacks) callbacks.forEach(cb => cb(...args))
    return this
  }
}
