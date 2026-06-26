import EventEmitter from './EventEmitter.js'

export default class Loader extends EventEmitter {
  constructor() {
    super()

    this._loaderEl   = document.querySelector('.loader')
    this._titleEl    = document.querySelector('.loader_title')
    this._lineEl     = document.querySelector('.loader_line')
    this._numberEl   = document.querySelector('.loader_number')
    this._subtitleEl = document.querySelector('.loader_subtitle')

    this._projectCount = 5  // Will be dynamic later
    // Defer one RAF tick so Experience.js can register the 'ready' listener first
    requestAnimationFrame(() => this._run())
  }

  _run() {
    // Show loader
    this._loaderEl.style.display = 'flex'

    const tl = gsap.timeline({ onComplete: () => this._finish() })

    // Title slides in from bottom
    tl.to(this._titleEl, { y: '0%', duration: 0.8, ease: 'sine.inOut' }, 0.1)

    // Line grows right to left (margin-left: auto so it grows from right)
    tl.to(this._lineEl, { width: '100%', duration: 0.8, ease: 'sine.inOut' }, 0.3)

    // Number + subtitle slide in
    tl.to(this._numberEl,   { y: '0%', duration: 0.8, ease: 'sine.inOut' }, 0.5)
    tl.to(this._subtitleEl, { y: '0%', duration: 0.8, ease: 'sine.inOut', delay: 0.15 }, 0.5)

    // Count up
    tl.to({ n: 0 }, {
      n: this._projectCount,
      duration: 0.6,
      ease: 'power2.out',
      onUpdate: function () {
        document.querySelector('.loader_number').textContent = Math.round(this.targets()[0].n)
      }
    }, 0.6)

    // Hold longer (was 1.6 → now 2.8) then slide everything back out
    tl.to(this._numberEl,   { y: '-110%', duration: 0.6, ease: 'sine.inOut' }, 2.8)
    tl.to(this._subtitleEl, { y: '-110%', duration: 0.6, ease: 'sine.inOut' }, 2.85)
    tl.to(this._lineEl,     { width: '0%', duration: 0.5, ease: 'sine.inOut' }, 2.9)
    tl.to(this._titleEl,    { y: '-110%', duration: 0.6, ease: 'sine.inOut' }, 2.95)
  }

  _finish() {
    this._loaderEl.style.display = 'none'
    this.trigger('ready')
  }
}
