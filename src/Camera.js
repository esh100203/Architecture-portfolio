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

  follow(charPos, charQuat) {
    // ── Position: adult eye level, 1.2 units behind character ──
    // +Z in character's local space = behind (character faces -Z)
    this._offset.set(0, 0, 2.4)
    this._offset.applyQuaternion(charQuat)

    this._targetPos.set(
      charPos.x + this._offset.x,
      charPos.y + 1.65,          // adult eye height
      charPos.z + this._offset.z
    )
    this.instance.position.lerp(this._targetPos, 0.14)

    // ── Look-at: ahead of character at mid-body height ──────────
    this._fwd.set(0, 0, -1).applyQuaternion(charQuat)

    const lx = charPos.x + this._fwd.x * 5
    const ly = charPos.y + 0.9
    const lz = charPos.z + this._fwd.z * 5

    // Smooth pan — weighted lerp on the look target
    this._lookTarget.x += (lx - this._lookTarget.x) * 0.10
    this._lookTarget.y += (ly - this._lookTarget.y) * 0.10
    this._lookTarget.z += (lz - this._lookTarget.z) * 0.10

    this.instance.lookAt(this._lookTarget)
  }

  _resize() {
    this.instance.aspect = this.sizes.width / this.sizes.height
    this.instance.updateProjectionMatrix()
  }
}
