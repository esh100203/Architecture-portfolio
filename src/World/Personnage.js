import * as THREE from 'three'
import Footprint from './Footprint.js'
import Joystick  from './Joystick.js'

export default class Personnage {
  constructor(experience) {
    this.experience = experience
    this.scene      = experience.scene
    this.camera     = experience.camera
    this.time       = experience.time

    this.velocity   = 3.0
    this.walkDir    = new THREE.Vector3()
    this.rotateQuaternion = new THREE.Quaternion()
    this.rotateAngle      = new THREE.Vector3(0, 1, 0)
    this.controlsEnabled  = true
    this.currentAction    = 'stay'

    this.keyPressed      = {}
    this.directions      = ['keyw','keya','keys','keyd','arrowleft','arrowright','arrowup','arrowdown']
    this.directionPressed = false

    this._facingAngle = 0

    // Footprint state
    this._speedFactor  = 0
    this._stepTimer    = 0
    this._stepInterval = 0.38
    this._isLeftFoot   = true
    this._footprints   = []

    // Animation phases
    this._walkPhase = 0
    this._idlePhase = 0

    // Limb references for procedural animation
    this._leftLeg  = null
    this._rightLeg = null
    this._leftArm  = null
    this._rightArm = null

    // Mobile joystick
    this._joystick = null
    if (experience.isPhone) {
      const jc = document.getElementById('joystick_container')
      if (jc) this._joystick = new Joystick(jc)
    }

    this._buildGroup()
    this._buildProceduralCharacter()
    this._setupControls()
  }

  _buildGroup() {
    this.group = new THREE.Group()
    this.group.position.set(0, 0, 13)
    this.scene.add(this.group)
  }

  _buildProceduralCharacter() {
    const mat = new THREE.MeshStandardMaterial({ color: 0x1e1e1e, roughness: 0.80, metalness: 0.08 })

    const char = new THREE.Group()

    // Legs — rounded capsules, pivot at hip
    this._leftLeg  = new THREE.Group()
    this._rightLeg = new THREE.Group()

    const makeLegMesh = () => {
      const m = new THREE.Mesh(new THREE.CapsuleGeometry(0.065, 0.24, 4, 10), mat)
      m.position.y = -0.18
      m.castShadow = true
      return m
    }
    this._leftLeg.add(makeLegMesh())
    this._rightLeg.add(makeLegMesh())
    this._leftLeg.position.set(-0.09, 0.36, 0)
    this._rightLeg.position.set( 0.09, 0.36, 0)

    // Torso — rounded capsule body
    const torso = new THREE.Mesh(new THREE.CapsuleGeometry(0.14, 0.08, 6, 12), mat)
    torso.position.set(0, 0.52, 0)
    torso.castShadow = true

    // Arms — thin capsules, pivot at shoulder
    const makeArm = (x) => {
      const g = new THREE.Group()
      const m = new THREE.Mesh(new THREE.CapsuleGeometry(0.052, 0.22, 4, 8), mat)
      m.position.y = -0.16
      m.castShadow = true
      g.add(m)
      g.position.set(x, 0.72, 0)
      return g
    }
    this._leftArm  = makeArm(-0.195)
    this._rightArm = makeArm( 0.195)

    // Head — sphere
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.17, 14, 10), mat)
    head.position.set(0, 0.82, 0)
    head.castShadow = true

    char.add(this._leftLeg, this._rightLeg, torso, this._leftArm, this._rightArm, head)

    // Auto-scale to 1.4 world units tall
    const box  = new THREE.Box3().setFromObject(char)
    const h    = box.max.y - box.min.y
    char.scale.setScalar(1.4 / h)

    // Sit flush on floor
    const box2 = new THREE.Box3().setFromObject(char)
    char.position.y = -box2.min.y

    this.group.add(char)
    this._model = char
  }

  _setupControls() {
    window.addEventListener('keydown', e => {
      const k = e.code.toLowerCase()
      if (this.directions.includes(k)) { this.keyPressed[k] = true; e.preventDefault() }
    })
    window.addEventListener('keyup', e => {
      this.keyPressed[e.code.toLowerCase()] = false
    })
  }

  _getTankInput() {
    if (this._joystick?.active) {
      const forward = this._joystick.forward
      const dAngle  = this._joystick.dAngle
      if (forward !== 0 || dAngle !== 0) {
        return { forward: forward * 2, dAngle: dAngle * 2, magnitude: this._joystick.magnitude ?? 1 }
      }
    }
    const k = this.keyPressed
    const forward = (k.keyw || k.arrowup) ? 1 : (k.keys || k.arrowdown) ? -1 : 0
    const dAngle  = (k.keyd || k.arrowright) ? -1 : (k.keya || k.arrowleft) ? 1 : 0
    return { forward, dAngle, magnitude: 1 }
  }

  _spawnFootprint() {
    const offset = new THREE.Vector3(
      this._isLeftFoot ? -0.09 : 0.09, 0,
      this._isLeftFoot ?  0.05 : -0.05
    ).applyQuaternion(this.group.quaternion)
    const pos = this.group.position.clone().add(offset)
    pos.y = 0
    this._footprints.push(new Footprint(this.experience, pos, this._isLeftFoot))
    this._isLeftFoot = !this._isLeftFoot
  }

  _animateLimbs(swing) {
    if (!this._leftLeg) return
    this._leftLeg.rotation.x  =  swing
    this._rightLeg.rotation.x = -swing
    this._leftArm.rotation.x  = -swing * 0.55
    this._rightArm.rotation.x =  swing * 0.55
  }

  _applyWalkBob(dt) {
    this.group.position.y = Math.abs(Math.sin(this._walkPhase)) * 0.04
  }

  _applyIdleBob(dt) {
    this._idlePhase += dt * 1.2
    this.group.position.y = Math.sin(this._idlePhase) * 0.008
    this._animateLimbs(0)
  }

  update() {
    if (!this.controlsEnabled) return
    const dt = Math.min(this.time.delta, 0.05)

    const input = this._getTankInput()
    const { joystickAngle, magnitude = 1 } = input
    const forward = input.forward ?? 0
    const dAngle  = input.dAngle  ?? 0

    const anyInput = joystickAngle != null || forward !== 0 || dAngle !== 0
    this.directionPressed = anyInput

    if (anyInput) {
      if (joystickAngle != null) {
        this._facingAngle = joystickAngle
      } else {
        this._facingAngle += dAngle * dt * 2.2
      }

      this.rotateQuaternion.setFromAxisAngle(this.rotateAngle, this._facingAngle)
      this.group.quaternion.rotateTowards(this.rotateQuaternion, 0.10)

      const isMoving = joystickAngle != null || forward !== 0

      if (isMoving) {
        this._speedFactor = Math.min(1, this._speedFactor + dt * 7)
        const spd = this.velocity * this._speedFactor * magnitude * (joystickAngle != null ? 1 : forward)

        this.group.position.x -= Math.sin(this._facingAngle) * spd * dt
        this.group.position.z -= Math.cos(this._facingAngle) * spd * dt
        this.group.position.x = Math.max(-3.5, Math.min(3.5,  this.group.position.x))
        this.group.position.z = Math.max(-14.5, Math.min(14.5, this.group.position.z))

        this._stepTimer += dt
        if (this._stepTimer >= this._stepInterval) {
          this._stepTimer = 0
          this._spawnFootprint()
        }

        this._walkPhase += dt * (Math.PI / this._stepInterval)
        this._applyWalkBob(dt)
        this._animateLimbs(Math.sin(this._walkPhase) * 0.38 * this._speedFactor)

        this.currentAction = 'walk'
      } else {
        this._speedFactor = Math.max(0, this._speedFactor - dt * 10)
        this.currentAction = 'stay'
        this._applyIdleBob(dt)
      }
    } else {
      this._speedFactor = Math.max(0, this._speedFactor - dt * 10)
      this.currentAction = 'stay'
      this._applyIdleBob(dt)
    }

    // Tick footprints
    this._footprints.forEach(f => f.tick())
    this._footprints = this._footprints.filter(f => !f._done)

    // Camera
    this.camera.follow(this.group.position, this.group.quaternion)
  }
}
