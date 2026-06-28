export default class Joystick {
  constructor(container) {
    this.dx = 0   // -1 left … +1 right
    this.dy = 0   // -1 up  … +1 down (screen space)
    this.active  = false
    this.forward = 0    // +1 forward, -1 backward (swipe up/down)
    this.dAngle  = 0    // +1 rotate left, -1 rotate right (swipe left/right)
    this.magnitude = 0  // 0..1

    const RADIUS = 55    // half of 110px base
    const DEAD   = 8     // px dead zone before registering direction

    // DOM
    this._base   = document.createElement('div')
    this._handle = document.createElement('div')
    this._base.className   = 'joystick-base'
    this._handle.className = 'joystick-handle'
    this._base.appendChild(this._handle)
    container.appendChild(this._base)

    let touchId = null
    let originX = 0, originY = 0

    const onStart = e => {
      e.preventDefault()
      if (touchId !== null) return
      const t = e.changedTouches[0]
      touchId = t.identifier
      originX = t.clientX
      originY = t.clientY

      this._base.style.left    = (originX - RADIUS) + 'px'
      this._base.style.top     = (originY - RADIUS) + 'px'
      this._base.style.display = 'block'
      this.active = true
    }

    const onMove = e => {
      e.preventDefault()
      const t = [...e.changedTouches].find(x => x.identifier === touchId)
      if (!t) return

      const rawX = t.clientX - originX
      const rawY = t.clientY - originY
      const dist  = Math.sqrt(rawX * rawX + rawY * rawY)
      const clamp = Math.min(dist, RADIUS)
      const a     = Math.atan2(rawY, rawX)

      const hx = Math.cos(a) * clamp
      const hy = Math.sin(a) * clamp

      this._handle.style.transform =
        `translate(calc(-50% + ${hx}px), calc(-50% + ${hy}px))`

      this.dx = hx / RADIUS
      this.dy = hy / RADIUS
      this.magnitude = clamp / RADIUS

      if (dist < DEAD) {
        this.forward = 0
        this.dAngle  = 0
        return
      }

      // Dominant axis: up/down → move forward/backward; left/right → rotate
      if (Math.abs(rawY) >= Math.abs(rawX)) {
        this.forward = rawY < 0 ? 1 : -1
        this.dAngle  = 0
      } else {
        this.forward = 0
        this.dAngle  = rawX < 0 ? 1 : -1   // left = +1 (CCW), right = -1 (CW)
      }
    }

    const onEnd = e => {
      const t = [...e.changedTouches].find(x => x.identifier === touchId)
      if (!t) return
      touchId = null
      this.dx = 0; this.dy = 0
      this.magnitude = 0; this.forward = 0; this.dAngle = 0
      this.active = false
      this._handle.style.transform = 'translate(-50%, -50%)'
      this._base.style.display = 'none'
    }

    container.addEventListener('touchstart',  onStart, { passive: false })
    container.addEventListener('touchmove',   onMove,  { passive: false })
    container.addEventListener('touchend',    onEnd,   { passive: false })
    container.addEventListener('touchcancel', onEnd,   { passive: false })
  }
}
