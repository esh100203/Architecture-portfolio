import * as THREE from 'three'
import Sizes    from './Sizes.js'
import Time     from './Time.js'
import Camera   from './Camera.js'
import Renderer from './Renderer.js'
import Loader   from './Loader.js'
import World    from './World/World.js'

let instance = null

export default class Experience {
  constructor(canvas, isPhone) {
    if (instance) return instance
    instance = this
    window.experience = this

    this.canvas  = canvas
    this.isPhone = isPhone
    this.scene   = new THREE.Scene()
    this.sizes   = new Sizes()
    this.time    = new Time()
    this.camera  = new Camera(this)
    this.renderer = new Renderer(this)

    this.canvas.style.opacity = '1'

    this.loader = new Loader()
    this.loader.on('ready', () => {
      this.world = new World(this)
      this._showSceneHint()
      this._initIdleControl()
    })

    this.time.on('tick', () => this._update())
  }

  _initIdleControl() {
    let idleTimer = null
    const IDLE_MS = 2000

    const wake = () => {
      this.time.wake()
      clearTimeout(idleTimer)
      idleTimer = setTimeout(() => this.time.sleep(), IDLE_MS)
    }

    ;['keydown','keyup','mousemove','mousedown','touchstart','touchmove','wheel'].forEach(evt => {
      window.addEventListener(evt, wake, { passive: true })
    })

    wake()
  }

  _showSceneHint() {
    const overlay = document.getElementById('scene_blur_overlay')
    const hint    = document.getElementById('scene_hint')
    if (!overlay || !hint) return

    setTimeout(() => {
      overlay.classList.add('active')
      hint.classList.add('active')
      setTimeout(() => {
        overlay.classList.add('fade')
        hint.classList.add('fade')
        setTimeout(() => { overlay.remove(); hint.remove() }, 550)
      }, 2000)
    }, 600)
  }

  _update() {
    this.world?.update()
    this.renderer.update()
  }
}
