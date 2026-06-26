export default class Joystick {
  constructor(container) {
    this.dx = 0   // -1 left … +1 right
    this.dy = 0   // -1 up  … +1 down (screen space)
    this.active = false
    this.angle  = null   // game-world angle, matches Personnage angle convention
    this.magnitude = 0   // 0..1

    const RADIUS = 55    // half of 110px base

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
      if (touchId !== null) return          // only track one finger
      const t = e.changedTouches[0]
      touchId = t.identifier
      originX = t.clientX
      originY = t.clientY

      // Show base centred on touch
      this._base.style.left   = (originX - RADIUS) + 'px'
      this._base.style.top    = (originY - RADIUS) + 'px'
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

      // Move handle visually
      this._handle.style.transform =
        `translate(calc(-50% + ${hx}px), calc(-50% + ${hy}px))`

      this.dx = hx / RADIUS
      this.dy = hy / RADIUS
      this.magnitude = clamp / RADIUS

      // Map screen-space (dx, dy) → game angle:
      //   screen up   (dy=-1) → angle 0   (forward, -Z)
      //   screen right(dx=+1) → angle -π/2 (strafe right, +X)
      //   screen down (dy=+1) → angle π   (backward, +Z)
      //   screen left (dx=-1) → angle +π/2 (strafe left, -X)
      this.angle = dist > 6 ? Math.atan2(-this.dx, -this.dy) : null
    }

    const onEnd = e => {
      const t = [...e.changedTouches].find(x => x.identifier === touchId)
      if (!t) return
      touchId = null
      this.dx = 0; this.dy = 0
      this.magnitude = 0; this.angle = null
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
