import * as THREE from 'three'

const PROJECTS = [
  { title: 'Neeradi — The Water\'s Way',          uid: 'neeradi',           thumb: 'assets/projects/neeradi.jpg' },
  { title: 'UnEarthed — Journey to Destination', uid: 'unearthed',         thumb: 'assets/projects/unearthed.png' },
  { title: 'The Third Place',                     uid: 'third-place',       thumb: 'assets/projects/third-place.png' },
  { title: 'Internship',                          uid: 'internship',        thumb: null, canvas: true },
  { title: 'City\'s Living Room',                 uid: 'citys-living-room', thumb: 'assets/projects/citys-living-room.png' },
]

const WALL_POSITIONS = [
  { side: 'left',  z:  11 },
  { side: 'right', z:  11 },
  { side: 'left',  z:   0 },
  { side: 'right', z:   2 },
  { side: 'left',  z: -11 },
]

const WALL_X    = 6
const FRAME_W   = 5.5
const FRAME_H   = 3.09375
const ART_W     = 5.25
const ART_H     = 2.953125
const CENTER_Y  = 3.2
const PROXIMITY_IN  = 2.0   // appear as avatar walks near the frame
const PROXIMITY_OUT = 1.4   // disappear when avatar moves away

export default class Home {
  constructor(experience) {
    this.experience = experience
    this.scene      = experience.scene
    this.camera     = experience.camera
    this.sizes      = experience.sizes
    this._frames    = []
    this._active    = null

    this._buildArtworks()
    this._buildAuraRings()
    this._buildPrompt()
    this._setupEnter()
  }

  _buildArtworks() {
    const loader = new THREE.TextureLoader()

    PROJECTS.forEach((proj, i) => {
      const { side, z } = WALL_POSITIONS[i]
      const isLeft = side === 'left'

      const frameMat = new THREE.MeshStandardMaterial({
        color: 0x111111, roughness: 0.5
      })

      const frame = new THREE.Mesh(new THREE.BoxGeometry(FRAME_W, FRAME_H, 0.06), frameMat)
      frame.castShadow = true

      const artMat = new THREE.MeshStandardMaterial({ color: 0xcccccc, roughness: 0.9 })
      if (proj.thumb) {
        loader.load(proj.thumb, tex => {
          tex.colorSpace = THREE.SRGBColorSpace
          artMat.map = tex
          artMat.color.set(0xffffff)
          artMat.needsUpdate = true
        })
      } else if (proj.canvas) {
        const cv = document.createElement('canvas')
        cv.width = 1050; cv.height = 591
        const ctx = cv.getContext('2d')
        ctx.fillStyle = '#1e1e1e'
        ctx.fillRect(0, 0, cv.width, cv.height)
        ctx.fillStyle = '#f4f2ee'
        ctx.font = 'bold 130px "Josefin Sans", sans-serif'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.letterSpacing = '16px'
        ctx.fillText('INTERNSHIP', cv.width / 2, cv.height / 2)
        const tex = new THREE.CanvasTexture(cv)
        artMat.map = tex
        artMat.color.set(0xffffff)
        artMat.needsUpdate = true
      }

      const art = new THREE.Mesh(new THREE.PlaneGeometry(ART_W, ART_H), artMat)
      art.position.z = 0.035

      const labelMat = new THREE.MeshBasicMaterial({
        map: this._makeLabel(proj.title), transparent: true, depthWrite: false,
      })
      const label = new THREE.Mesh(new THREE.PlaneGeometry(5.5, 0.32), labelMat)
      label.position.set(0, -(FRAME_H / 2) - 0.24, 0.04)

      const group = new THREE.Group()
      group.add(frame, art, label)

      const wallX = isLeft ? -(WALL_X - 0.035) : (WALL_X - 0.035)
      group.position.set(wallX, CENTER_Y, z)
      group.rotation.y = isLeft ? Math.PI / 2 : -Math.PI / 2

      this.scene.add(group)

      const circleX = isLeft ? -3.5 : 3.5
      this._frames.push({ frameMat, artMat, group, proj, circleX, circleZ: z })
    })
  }

  // Fixed rings at each frame's floor circle — appear when avatar steps on them
  _buildAuraRings() {
    this._auraRings = []
    this._frames.forEach(f => {
      if (!f.proj.uid || f.proj.uid === 'empty') {
        this._auraRings.push(null)
        return
      }
      const geo = new THREE.TorusGeometry(0.55, 0.022, 12, 80)
      const mat = new THREE.MeshBasicMaterial({
        color: 0x111111, transparent: true, opacity: 0, depthWrite: false
      })
      const ring = new THREE.Mesh(geo, mat)
      ring.rotation.x = -Math.PI / 2
      ring.position.set(f.circleX, 0.62, f.circleZ)
      this.scene.add(ring)
      f.auraRing = ring
      this._auraRings.push(ring)
    })
  }

  _makeLabel(text) {
    const c = document.createElement('canvas')
    c.width = 1024; c.height = 72
    const ctx = c.getContext('2d')
    ctx.clearRect(0, 0, 1024, 48)
    if (!text) return new THREE.CanvasTexture(c)
    ctx.fillStyle = '#333333'
    ctx.font = '400 32px "Josefin Sans", sans-serif'
    ctx.letterSpacing = '5px'
    ctx.textAlign = 'center'
    ctx.fillText(text.toUpperCase(), 512, 34)
    return new THREE.CanvasTexture(c)
  }

  _buildPrompt() {
    this._promptEl = document.createElement('div')
    this._promptEl.className = 'project_prompt'
    this._promptEl.innerHTML = `
      <div class="project_prompt_title"></div>
      <button class="project_prompt_btn">Enter Project</button>
    `
    document.body.appendChild(this._promptEl)

    this._promptEl.querySelector('.project_prompt_btn').addEventListener('click', () => {
      if (this._active) this.experience.world.enterProject(this._active.proj)
    })
  }

  _setupEnter() {
    this._onKey = e => {
      if (e.key === 'Enter' && this._active) {
        this.experience.world.enterProject(this._active.proj)
      }
    }
    window.addEventListener('keydown', this._onKey)
  }

  _setActive(frame) {
    if (this._active === frame) return

    // Hide previous frame's ring
    if (this._active?.auraRing) {
      gsap.to(this._active.auraRing.material, { opacity: 0, duration: 0.25 })
    }

    this._active = frame

    if (frame) {
      gsap.to(frame.auraRing.material, { opacity: 1, duration: 0.35, ease: 'power2.out' })
      this._promptEl.querySelector('.project_prompt_title').textContent = frame.proj.title
      this._promptEl.classList.add('visible')
    } else {
      this._promptEl.classList.remove('visible')
    }
  }

  update() {
    const avatarPos = this.experience.world.personnage?.group?.position
    if (!avatarPos) return

    let nearest = null
    let nearestDist = Infinity

    for (const f of this._frames) {
      if (!f.proj.uid || f.proj.uid === 'empty' || !f.auraRing) continue
      const dx = avatarPos.x - f.circleX
      const dz = avatarPos.z - f.circleZ
      const dist = Math.sqrt(dx * dx + dz * dz)
      const threshold = (this._active === f) ? PROXIMITY_OUT : PROXIMITY_IN
      if (dist < threshold && dist < nearestDist) {
        nearestDist = dist
        nearest = f
      }
    }

    this._setActive(nearest)
  }

  destroy() {
    this._promptEl?.remove()
    window.removeEventListener('keydown', this._onKey)
    this._frames.forEach(({ group, auraRing }) => {
      group.traverse(obj => {
        if (obj.isMesh) { obj.geometry.dispose(); obj.material.dispose() }
      })
      this.scene.remove(group)
      if (auraRing) {
        this.scene.remove(auraRing)
        auraRing.geometry.dispose()
        auraRing.material.dispose()
      }
    })
  }
}
