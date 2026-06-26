import * as THREE from 'three'

export default class Renderer {
  constructor(experience) {
    this.experience = experience
    this.sizes = experience.sizes
    this.scene = experience.scene
    this.camera = experience.camera
    this.canvas = experience.canvas

    this._setup()
    this.experience.sizes.on('resize', () => this._resize())
  }

  _setup() {
    const pixelRatio = this.sizes.pixelRatio
    this.instance = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: pixelRatio < 1.5,
      powerPreference: 'high-performance'
    })
    this.instance.setSize(this.sizes.width, this.sizes.height)
    this.instance.setPixelRatio(pixelRatio)
    this.instance.shadowMap.enabled = true
    this.instance.shadowMap.type = THREE.BasicShadowMap
    this.instance.outputColorSpace = THREE.SRGBColorSpace
    this.instance.toneMapping = THREE.ACESFilmicToneMapping
    this.instance.toneMappingExposure = 1.2
  }

  _resize() {
    this.instance.setSize(this.sizes.width, this.sizes.height)
    this.instance.setPixelRatio(this.sizes.pixelRatio)
  }

  update() {
    this.instance.render(this.scene, this.camera.instance)
  }
}
