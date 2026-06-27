import * as THREE from 'three'

export default class Renderer {
  constructor(experience) {
    this.experience = experience
    this.sizes  = experience.sizes
    this.scene  = experience.scene
    this.camera = experience.camera
    this.canvas = experience.canvas

    this._setup()
    this.experience.sizes.on('resize', () => this._resize())
  }

  _setup() {
    // Low-end = fewer than 6 logical cores or pixel ratio <= 1
    const lowEnd = (navigator.hardwareConcurrency || 4) < 6
    const pixelRatio = lowEnd
      ? Math.min(window.devicePixelRatio, 1)
      : Math.min(window.devicePixelRatio, 1.5)

    this.instance = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: !lowEnd,
      powerPreference: 'high-performance',
    })
    this.instance.setSize(this.sizes.width, this.sizes.height)
    this.instance.setPixelRatio(pixelRatio)
    this.instance.shadowMap.enabled = !lowEnd
    this.instance.shadowMap.type = THREE.BasicShadowMap
    this.instance.outputColorSpace = THREE.SRGBColorSpace
    this.instance.toneMapping = THREE.ACESFilmicToneMapping
    this.instance.toneMappingExposure = 1.2
  }

  _resize() {
    this.instance.setSize(this.sizes.width, this.sizes.height)
  }

  update() {
    this.instance.render(this.scene, this.camera.instance)
  }
}
