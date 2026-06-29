import * as THREE from 'three'

export default class Camera {
  constructor(experience) {
    this.experience = experience
    this.sizes = experience.sizes
    this.scene = experience.scene

    this._offset      = new THREE.Vector3()
    this._fwd         = new THREE.Vector3()
    this._targetPos   = new THREE.Vector3()
    this._lookTarget  = new THREE.Vector3()

    this._setup()
    this.experience.sizes.on('resize', () => this._resize())
  }

  _setup() {
    this.instance = new THREE.PerspectiveCamera(
      72,
      this.sizes.width / this.sizes.height,
      0.05,
      200
    )
    // Start behind spawn position, at adult eye level
    this.instance.position.set(0, 1.65, 9.2)
    this._lookTarget.set(0, 0.9, 2)
    this.instance.lookAt(this._lookTarget)
    this.scene.add(this.instance)
  }

  follow(charPos, charQuat, dt = 0.016) {
    // Cap dt so slow frames don't cause camera jumps
    const safeDt = Math.min(dt, 0.022)
    const posAlpha  = 1
    const lookAlpha = 1 - Math.exp(-25 * safeDt)

    this._offset.set(0, 0, 2.8)
    this._offset.applyQuaternion(charQuat)

    this._targetPos.set(
      charPos.x + this._offset.x,
      1.9,                           // mid eye height between original and raised
      charPos.z + this._offset.z
    )
    this.instance.position.lerp(this._targetPos, posAlpha)

    this._fwd.set(0, 0, -1).applyQuaternion(charQuat)

    const lx = charPos.x + this._fwd.x * 5
    const lz = charPos.z + this._fwd.z * 5

    this._lookTarget.x += (lx - this._lookTarget.x) * lookAlpha
    this._lookTarget.y += (0.75 - this._lookTarget.y) * lookAlpha
    this._lookTarget.z += (lz - this._lookTarget.z) * lookAlpha

    this.instance.lookAt(this._lookTarget)
  }

  _resize() {
    this.instance.aspect = this.sizes.width / this.sizes.height
    this.instance.updateProjectionMatrix()
  }
}
