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

    // Show canvas
    this.canvas.style.opacity = '1'

    // Start loader, then build world
    this.loader = new Loader()
    this.loader.on('ready', () => {
      this.world = new World(this)
      this._showSceneHint()
    })

    // RAF loop
    this.time.on('tick', () => this._update())
  }

  _showSceneHint() {
    const overlay = document.getElementById('scene_blur_overlay')
    const hint    = document.getElementById('scene_hint')
    if (!overlay || !hint) return

    // Fade in
    setTimeout(() => {
      overlay.classList.add('active')
      hint.classList.add('active')

      // Hold 2s then fade out
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
