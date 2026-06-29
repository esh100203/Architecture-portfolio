import * as THREE from 'three'

// Room constants — exported so other modules can reference them
export const ROOM = { W: 12, L: 30, H: 5.5, RIDGE: 8.5 }

export default class Environment {
  constructor(experience) {
    this.experience = experience
    this.scene = experience.scene
    this._build()
  }

  _build() {
    const { W, L, H, RIDGE } = ROOM
    this.scene.background = new THREE.Color(0xf0eeea)
    this.scene.fog = new THREE.Fog(0xf0eeea, 28, 52)

    const wallMat  = new THREE.MeshStandardMaterial({ color: 0xedeae5, roughness: 0.88, side: THREE.DoubleSide })
    const roofMat  = new THREE.MeshStandardMaterial({ color: 0xe4e2dd, roughness: 0.9,  side: THREE.DoubleSide })
    const beamMat  = new THREE.MeshStandardMaterial({ color: 0x1e1712, roughness: 0.9  })
    const postMat  = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.7, metalness: 0.15 })

    // Crumpled paper texture for back wall + ceiling
    const crumpledTex = this._makeCrumpledTexture()
    // No tiling on wall — seams show; ceiling uses its own repeat in crumpledCeilMat
    crumpledTex.wrapS = THREE.ClampToEdgeWrapping
    crumpledTex.wrapT = THREE.ClampToEdgeWrapping
    // Back wall uses MeshBasicMaterial so texture shows without flat-lighting washout
    // fog:false prevents the scene fog from washing out the texture at distance
    const crumpledMat = new THREE.MeshBasicMaterial({
      map: crumpledTex, side: THREE.DoubleSide, fog: false
    })
    // Ceiling gets its own tiling texture (same noise, tiled to cover 30-unit length)
    const ceilTex = this._makeCrumpledTexture()
    ceilTex.wrapS = THREE.RepeatWrapping
    ceilTex.wrapT = THREE.RepeatWrapping
    ceilTex.repeat.set(3, 2)
    const crumpledCeilMat = new THREE.MeshStandardMaterial({
      map: ceilTex, roughness: 0.92, side: THREE.DoubleSide
    })

    // ── Floor ──────────────────────────────────────────────────────
    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(W, L),
      new THREE.MeshStandardMaterial({ color: 0xf4f2ee, roughness: 0.65 })
    )
    floor.rotation.x = -Math.PI / 2
    floor.receiveShadow = true
    this.scene.add(floor)

    // ── Side walls ─────────────────────────────────────────────────
    const lWall = new THREE.Mesh(new THREE.PlaneGeometry(L, H), wallMat)
    lWall.rotation.y = Math.PI / 2
    lWall.position.set(-W / 2, H / 2, 0)
    lWall.receiveShadow = true
    this.scene.add(lWall)

    const rWall = new THREE.Mesh(new THREE.PlaneGeometry(L, H), wallMat.clone())
    rWall.rotation.y = -Math.PI / 2
    rWall.position.set(W / 2, H / 2, 0)
    rWall.receiveShadow = true
    this.scene.add(rWall)

    // ── Back wall ──────────────────────────────────────────────────
    const bkWall = new THREE.Mesh(new THREE.PlaneGeometry(W, H), crumpledMat)
    bkWall.position.set(0, H / 2, -L / 2)
    bkWall.receiveShadow = true
    this.scene.add(bkWall)

    // ── Bio panel on back wall ─────────────────────────────────────
    this._addBioPanel(W, H, L)

    // ── Statement text panel on back wall ──────────────────────────
    this._addStatementText(W, H, L)

    // ── Gable triangles ────────────────────────────────────────────
    // Back gable gets the plaster texture; UVs map x→[0,1], y→[0,1] over the triangle
    this.scene.add(this._tri(-W/2, H, -L/2,  W/2, H, -L/2,  0, RIDGE, -L/2, crumpledMat.clone(), [0,0, 1,0, 0.5,1]))
    this.scene.add(this._tri( W/2, H,  L/2, -W/2, H,  L/2,  0, RIDGE,  L/2, wallMat.clone()))

    // ── Pitched roof panels ────────────────────────────────────────
    this.scene.add(this._quad(
      -W/2, H,     L/2,   0, RIDGE,  L/2,
         0, RIDGE, -L/2, -W/2, H,   -L/2, crumpledCeilMat
    ))
    this.scene.add(this._quad(
       0, RIDGE,  L/2,  W/2, H,     L/2,
       W/2, H,   -L/2,   0, RIDGE, -L/2, crumpledCeilMat.clone()
    ))

    // ── Ridge beam ─────────────────────────────────────────────────
    const ridgeBeam = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.18, L + 0.4), beamMat)
    ridgeBeam.position.set(0, RIDGE, 0)
    this.scene.add(ridgeBeam)

    // ── Cross beams + king posts ───────────────────────────────────
    const roofAngle = Math.atan2(RIDGE - H, W / 2)
    ;[-8, 0, 8].forEach(z => {
      const tie = new THREE.Mesh(new THREE.BoxGeometry(W + 0.1, 0.12, 0.14), beamMat)
      tie.position.set(0, H + 0.05, z)
      this.scene.add(tie)

      const kh = RIDGE - H - 0.08
      const kpost = new THREE.Mesh(new THREE.BoxGeometry(0.14, kh, 0.14), beamMat)
      kpost.position.set(0, H + 0.05 + kh / 2, z)
      this.scene.add(kpost)
    })

    // ── Skylight emissive panels ───────────────────────────────────
    const sklMat = new THREE.MeshStandardMaterial({
      color: 0xfff9f0, emissive: 0xfff8e8, emissiveIntensity: 1.8, side: THREE.DoubleSide
    })
    const sklFrameMat = new THREE.MeshStandardMaterial({ color: 0x1e1712, roughness: 0.85 })
    ;[-11, 0, 11].forEach(z => {
      const gl = new THREE.Group()
      gl.position.set(-W / 4 + 0.5, (H + RIDGE) / 2 + 0.5, z)
      gl.rotation.z = roofAngle
      const fL = new THREE.Mesh(new THREE.BoxGeometry(2.6, 1.7, 0.06), sklFrameMat.clone())
      fL.position.z = -0.04
      gl.add(fL)
      gl.add(new THREE.Mesh(new THREE.PlaneGeometry(2.4, 1.5), sklMat))
      this.scene.add(gl)

      const gr = new THREE.Group()
      gr.position.set(W / 4 - 0.5, (H + RIDGE) / 2 + 0.5, z)
      gr.rotation.z = -roofAngle
      const fR = new THREE.Mesh(new THREE.BoxGeometry(2.6, 1.7, 0.06), sklFrameMat.clone())
      fR.position.z = -0.04
      gr.add(fR)
      gr.add(new THREE.Mesh(new THREE.PlaneGeometry(2.4, 1.5), sklMat.clone()))
      this.scene.add(gr)

      const pl = new THREE.PointLight(0xfff5e0, 5, 14)
      pl.position.set(0, RIDGE - 1.5, z)
      this.scene.add(pl)
    })

    // ── Ceiling purlins (horizontal battens along each slope) ──────
    const purlinMat = new THREE.MeshStandardMaterial({ color: 0x2a2318, roughness: 0.9 })
    const slopeLen = Math.sqrt((W / 2) ** 2 + (RIDGE - H) ** 2)
    const purlinSpacing = 1.4
    const numPurlins = Math.floor(slopeLen / purlinSpacing)
    for (let i = 1; i <= numPurlins; i++) {
      const t = i * purlinSpacing
      // Left slope: starts at (-W/2, H), direction towards (0, RIDGE)
      const lx = -W / 2 + t * Math.cos(roofAngle)
      const ly = H + t * Math.sin(roofAngle)
      const purlinL = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.07, L + 0.2), purlinMat.clone())
      purlinL.position.set(lx, ly, 0)
      purlinL.rotation.z = roofAngle
      this.scene.add(purlinL)
      // Right slope: mirror
      const rx = W / 2 - t * Math.cos(roofAngle)
      const ry = H + t * Math.sin(roofAngle)
      const purlinR = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.07, L + 0.2), purlinMat.clone())
      purlinR.position.set(rx, ry, 0)
      purlinR.rotation.z = -roofAngle
      this.scene.add(purlinR)
    }

    // ── Lighting ───────────────────────────────────────────────────
    this.scene.add(new THREE.AmbientLight(0xffffff, 2.2))

    const sun = new THREE.DirectionalLight(0xfff8f0, 1.2)
    sun.position.set(3, RIDGE + 3, 6)
    sun.castShadow = true
    sun.shadow.mapSize.set(2048, 2048)
    sun.shadow.camera.left   = -10
    sun.shadow.camera.right  =  10
    sun.shadow.camera.top    =  22
    sun.shadow.camera.bottom = -22
    sun.shadow.camera.far    =  50
    sun.shadow.bias = -0.001
    this.scene.add(sun)

    // Artwork wall spotlights (3 per side)
    const artZ = [-11, 0, 11]
    artZ.forEach(z => {
      const sl = new THREE.SpotLight(0xfffaf0, 6, 10, Math.PI / 7, 0.35, 1.5)
      sl.position.set(-W / 2 + 2.5, H - 0.3, z)
      sl.target.position.set(-W / 2 + 0.1, 3.2, z)
      this.scene.add(sl, sl.target)

      const sr = new THREE.SpotLight(0xfffaf0, 6, 10, Math.PI / 7, 0.35, 1.5)
      sr.position.set(W / 2 - 2.5, H - 0.3, z)
      sr.target.position.set(W / 2 - 0.1, 3.2, z)
      this.scene.add(sr, sr.target)
    })

    // ── Museum barriers ────────────────────────────────────────────
    const barrierX = W / 2 - 2.2  // 3.8 from centre
    ;[-1, 1].forEach(side => {
      const x = side * barrierX

      // Top rail
      const topRail = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.04, L), postMat)
      topRail.position.set(x, 0.92, 0)
      this.scene.add(topRail)
      // Mid rail
      const midRail = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.04, L), postMat.clone())
      midRail.position.set(x, 0.50, 0)
      this.scene.add(midRail)

      // Vertical posts every 2.5 units
      for (let z = -L / 2; z <= L / 2 + 0.1; z += 2.5) {
        const post = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.94, 0.04), postMat.clone())
        post.position.set(x, 0.47, z)
        this.scene.add(post)
      }

    })

    // End caps connecting left barrier to right barrier (z = ±L/2), forming a closed loop
    const crossLen = barrierX * 2
    ;[-L / 2, L / 2].forEach(endZ => {
      const topCross = new THREE.Mesh(new THREE.BoxGeometry(crossLen, 0.04, 0.04), postMat.clone())
      topCross.position.set(0, 0.92, endZ)
      this.scene.add(topCross)

      const midCross = new THREE.Mesh(new THREE.BoxGeometry(crossLen, 0.04, 0.04), postMat.clone())
      midCross.position.set(0, 0.50, endZ)
      this.scene.add(midCross)

      // Vertical posts along end-cap rail
      for (let xp = -barrierX; xp <= barrierX + 0.01; xp += 2.5) {
        const post = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.94, 0.04), postMat.clone())
        post.position.set(xp, 0.47, endZ)
        this.scene.add(post)
      }
    })

    // ── Floor spotlight circles ────────────────────────────────────
    const ringMat = new THREE.MeshStandardMaterial({ color: 0x5a5550, roughness: 0.9 })
    ;[[-3.0, -11], [3.0, -11], [-3.0, 0], [3.0, 0.5], [-3.0, 11], [3.0, 11]].forEach(([x, z]) => {
      const ring = new THREE.Mesh(new THREE.RingGeometry(0.44, 0.54, 40), ringMat)
      ring.rotation.x = -Math.PI / 2
      ring.position.set(x, 0.003, z)
      this.scene.add(ring)
    })
  }

  _makeCrumpledTexture() {
    const size = 1024
    const canvas = document.createElement('canvas')
    canvas.width = size; canvas.height = size
    const ctx = canvas.getContext('2d')

    let s = 137
    const rand = () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646 }

    // Paper base — off-white like sketch paper
    ctx.fillStyle = '#e8e8e8'
    ctx.fillRect(0, 0, size, size)

    ctx.lineCap = 'round'

    // ── STIPPLING ── thousands of tiny pencil dots
    for (let i = 0; i < 55000; i++) {
      const x = rand() * size
      const y = rand() * size
      const r = 0.4 + rand() * 1.6
      const dark = Math.round(20 + rand() * 90)   // pencil dark 20–110
      const hx = dark.toString(16).padStart(2, '0')
      ctx.fillStyle = `#${hx}${hx}${hx}`
      ctx.globalAlpha = 0.10 + rand() * 0.55
      ctx.beginPath()
      ctx.arc(x, y, r, 0, Math.PI * 2)
      ctx.fill()
    }

    // ── SCRIBBLE STROKES ── short marks in all directions
    for (let i = 0; i < 12000; i++) {
      const x  = rand() * size
      const y  = rand() * size
      const len   = 3 + rand() * 22
      const angle = rand() * Math.PI * 2
      const dark  = Math.round(15 + rand() * 75)
      const hx = dark.toString(16).padStart(2, '0')
      ctx.strokeStyle = `#${hx}${hx}${hx}`
      ctx.globalAlpha = 0.06 + rand() * 0.28
      ctx.lineWidth   = 0.3 + rand() * 1.4
      // Slightly bent for organic scribble feel
      const bx = x + Math.cos(angle) * len * 0.5 + (rand() - 0.5) * 5
      const by = y + Math.sin(angle) * len * 0.5 + (rand() - 0.5) * 5
      ctx.beginPath()
      ctx.moveTo(x, y)
      ctx.quadraticCurveTo(bx, by, x + Math.cos(angle) * len, y + Math.sin(angle) * len)
      ctx.stroke()
    }

    // ── LOOSE HATCHING ── a handful of longer sweeping pencil lines
    for (let i = 0; i < 400; i++) {
      const x  = rand() * size
      const y  = rand() * size
      const len   = 30 + rand() * 120
      const angle = rand() * Math.PI * 2
      ctx.strokeStyle = '#444444'
      ctx.globalAlpha = 0.02 + rand() * 0.06
      ctx.lineWidth   = 0.4 + rand() * 1.0
      ctx.beginPath()
      ctx.moveTo(x, y)
      ctx.lineTo(x + Math.cos(angle) * len, y + Math.sin(angle) * len)
      ctx.stroke()
    }

    ctx.globalAlpha = 1
    return new THREE.CanvasTexture(canvas)
  }

  // Triangle helper — optional uvs array [u1,v1, u2,v2, u3,v3]
  _tri(x1, y1, z1, x2, y2, z2, x3, y3, z3, mat, uvs) {
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(
      new Float32Array([x1,y1,z1, x2,y2,z2, x3,y3,z3]), 3
    ))
    if (uvs) {
      geo.setAttribute('uv', new THREE.BufferAttribute(new Float32Array(uvs), 2))
    }
    geo.computeVertexNormals()
    return new THREE.Mesh(geo, mat)
  }

  _addBioPanel(W, H, L) {
    const cw = 1520, ch = 1000
    const canvas = document.createElement('canvas')
    canvas.width = cw; canvas.height = ch
    const ctx = canvas.getContext('2d')

    const wrapText = (text, x, y, maxW, lineH) => {
      const words = text.split(' ')
      let line = ''
      for (let i = 0; i < words.length; i++) {
        const test = line + words[i] + ' '
        if (ctx.measureText(test).width > maxW && i > 0) {
          ctx.fillText(line.trim(), x, y)
          line = words[i] + ' '
          y += lineH
        } else {
          line = test
        }
      }
      ctx.fillText(line.trim(), x, y)
      return y + lineH
    }

    const draw = () => {
      ctx.clearRect(0, 0, cw, ch)
      ctx.fillStyle = '#0a0a0a'
      ctx.textAlign = 'left'

      // Name
      ctx.font = '600 96px "Futura", "Century Gothic", "Trebuchet MS", sans-serif'
      ctx.letterSpacing = '2px'
      ctx.fillText('Eshitha Hebbale', 30, 108)

      // Line under name
      ctx.strokeStyle = '#0a0a0a'
      ctx.lineWidth = 1.5
      ctx.beginPath()
      ctx.moveTo(30, 128)
      ctx.lineTo(cw - 30, 128)
      ctx.stroke()

      // Subtitle
      ctx.font = '300 22px "Josefin Sans", sans-serif'
      ctx.letterSpacing = '8px'
      ctx.fillStyle = '#0a0a0a'
      ctx.fillText('architecture graduate', 30, 168)

      // Body text
      ctx.fillStyle = '#0a0a0a'
      ctx.font = '300 45px "Josefin Sans", sans-serif'
      ctx.letterSpacing = '0.5px'
      const maxW = cw - 80
      const lineH = 62

      let y = 240
      const p1 = 'An Architecture graduate, skilled in industry standard software, with strong time management and a collaborative mindset in dynamic environments. Shaped by the perception of space as a medium for movement and interaction, where voids as speak as loud as solids, giving importance to the in-betweens: the gaps, the thresholds and the pauses that define experience.'
      const p2 = 'I see architecture not as an isolated object but as an extension of the everyday city- where spaces don\'t behave.'

      y = wrapText(p1, 30, y, maxW, lineH) + 28
      const lastY = wrapText(p2, 30, y, maxW, lineH)

      // Corner detail — bottom-right bracket, anchored where text ends
      const bx = cw - 30, by = lastY + 40, len = 80
      ctx.strokeStyle = '#0a0a0a'
      ctx.lineWidth = 1.5
      ctx.beginPath()
      ctx.moveTo(bx - len, by)
      ctx.lineTo(bx, by)
      ctx.lineTo(bx, by - len)
      ctx.stroke()
    }

    draw()
    const tex = new THREE.CanvasTexture(canvas)
    tex.needsUpdate = true

    const mat = new THREE.MeshBasicMaterial({ map: tex, transparent: true, depthWrite: false, fog: false })
    // Panel: 6.0 wide × 5.0 tall, centred on back wall, just in front of it
    const panel = new THREE.Mesh(new THREE.PlaneGeometry(7.6, 5.0), mat)
    panel.position.set(0, H / 2 - 0.2, -L / 2 + 0.04)

    this.scene.add(panel)

    Promise.all([
      document.fonts.load('600 96px "Futura"'),
      document.fonts.load('600 96px "Century Gothic"'),
      document.fonts.load('600 96px "Josefin Sans"'),
    ]).then(() => { draw(); tex.needsUpdate = true })
  }

  // Quad helper (two triangles)
  _addStatementText(W, H, L) {
    // Panel spans exactly the frame height: top=4.4, bottom=1.4 (FRAME_H=3.0, 3.2=2.9)
    // Canvas aspect matches panel: 5.5 wide × 3.0 tall → 2048 × 1116
    const cw = 2048, ch = 1116
    const canvas = document.createElement('canvas')
    canvas.width = cw; canvas.height = ch
    const ctx = canvas.getContext('2d')

    const fontSize = 118
    // Tight line gap within each phrase (160px), large gap between phrases
    // Phrase 1: lines at y=130, 290  |  Phrase 2: lines at y=826, 986
    // Middle gap ≈ 536px vs within-phrase gap 160px — clearly distinct
    const ys = [130, 290, 826, 986]

    const drawText = () => {
      ctx.clearRect(0, 0, cw, ch)
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillStyle = '#111111'
      ctx.font = `italic 600 ${fontSize}px 'Josefin Sans', sans-serif`
      if (ctx.letterSpacing !== undefined) ctx.letterSpacing = '8px'

      ctx.fillText('CRAFTING SPACES',      cw / 2, ys[0])
      ctx.fillText('SHAPED BY STORIES',    cw / 2, ys[1])

      // Thin divider centred between the two phrases
      ctx.strokeStyle = '#111111'
      ctx.globalAlpha = 0.15
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(cw * 0.22, ch / 2)
      ctx.lineTo(cw * 0.78, ch / 2)
      ctx.stroke()
      ctx.globalAlpha = 1

      ctx.fillText('TRANSLATING MEMORIES', cw / 2, ys[2])
      ctx.fillText('INTO EXPERIENCE',      cw / 2, ys[3])
    }

    drawText()

    const tex = new THREE.CanvasTexture(canvas)
    tex.needsUpdate = true

    const mat = new THREE.MeshBasicMaterial({
      map: tex,
      transparent: true,
      depthWrite: false,
    })

    // Panel matches frame span: height 3.0, centred at y=2.9 (same as frame 3.2)
    const panel = new THREE.Mesh(new THREE.PlaneGeometry(4.5, 3.0), mat)
    panel.rotation.y = Math.PI / 2
    panel.position.set(-W / 2 + 0.02, 2.9, 6.0)
    this.scene.add(panel)

    document.fonts.load(`italic 600 ${fontSize}px 'Josefin Sans'`).then(() => {
      drawText()
      tex.needsUpdate = true
    })

    // ── Second statement panel — gap between z=-8 and z=0 frames ──
    this._addStatementText2(W)
  }

  _addStatementText2(W) {
    const cw = 2048, ch = 1116
    const canvas2 = document.createElement('canvas')
    canvas2.width = cw; canvas2.height = ch
    const ctx2 = canvas2.getContext('2d')

    const fontSize = 118
    // 3 lines per phrase, symmetric around canvas centre (ch=1116)
    // Within-phrase gap: 140px  |  Between-phrase gap: ~276px
    const ys = [140, 280, 420, 696, 836, 976]

    const drawText2 = () => {
      ctx2.clearRect(0, 0, cw, ch)
      ctx2.textAlign = 'center'
      ctx2.textBaseline = 'middle'
      ctx2.fillStyle = '#111111'
      ctx2.font = `italic 600 ${fontSize}px 'Josefin Sans', sans-serif`
      if (ctx2.letterSpacing !== undefined) ctx2.letterSpacing = '8px'

      ctx2.fillText('SPACE AS A MEDIUM',      cw / 2, ys[0])
      ctx2.fillText('FOR MOVEMENT AND',       cw / 2, ys[1])
      ctx2.fillText('ENCOUNTER',              cw / 2, ys[2])

      ctx2.strokeStyle = '#111111'
      ctx2.globalAlpha = 0.15
      ctx2.lineWidth = 2
      ctx2.beginPath()
      ctx2.moveTo(cw * 0.22, ch / 2)
      ctx2.lineTo(cw * 0.78, ch / 2)
      ctx2.stroke()
      ctx2.globalAlpha = 1

      ctx2.fillText('EXPLORING THE',          cw / 2, ys[3])
      ctx2.fillText('ARCHITECTURE',           cw / 2, ys[4])
      ctx2.fillText('OF IN-BETWEENS',         cw / 2, ys[5])
    }

    drawText2()

    const tex2 = new THREE.CanvasTexture(canvas2)
    tex2.needsUpdate = true

    const mat2 = new THREE.MeshBasicMaterial({
      map: tex2,
      transparent: true,
      depthWrite: false,
    })

    const panel2 = new THREE.Mesh(new THREE.PlaneGeometry(4.5, 3.0), mat2)
    panel2.rotation.y = Math.PI / 2
    panel2.position.set(-W / 2 + 0.02, 2.9, -6.0)
    this.scene.add(panel2)

    document.fonts.load(`italic 600 118px 'Josefin Sans'`).then(() => {
      drawText2()
      tex2.needsUpdate = true
    })

    // ── Right wall statement panel — gap between z=-8 and z=0 frames ──
    this._addStatementText3(W)
  }

  _addStatementText3(W) {
    const cw = 2048, ch = 1116
    const canvas3 = document.createElement('canvas')
    canvas3.width = cw; canvas3.height = ch
    const ctx3 = canvas3.getContext('2d')

    const fontSize = 118
    const ys = [130, 290, 826, 986]

    const drawText3 = () => {
      ctx3.clearRect(0, 0, cw, ch)
      ctx3.textAlign = 'center'
      ctx3.textBaseline = 'middle'
      ctx3.fillStyle = '#111111'
      ctx3.font = `italic 600 ${fontSize}px 'Josefin Sans', sans-serif`
      if (ctx3.letterSpacing !== undefined) ctx3.letterSpacing = '8px'

      // phrases removed
    }

    drawText3()

    const tex3 = new THREE.CanvasTexture(canvas3)
    tex3.needsUpdate = true

    const mat3 = new THREE.MeshBasicMaterial({
      map: tex3,
      transparent: true,
      depthWrite: false,
    })

    // Right wall: x = +W/2, rotation.y = -PI/2 to face interior
    const panel3 = new THREE.Mesh(new THREE.PlaneGeometry(4.5, 3.0), mat3)
    panel3.rotation.y = -Math.PI / 2
    panel3.position.set(W / 2 - 0.02, 2.9, -6.0)
    this.scene.add(panel3)

    document.fonts.load(`italic 600 ${fontSize}px 'Josefin Sans'`).then(() => {
      drawText3()
      tex3.needsUpdate = true
    })

    // ── CV image — fills space between z=0 frame and back wall ──
    new THREE.TextureLoader().load('assets/cv3.png', (tex) => {
      const aspect = tex.image.width / tex.image.height
      const maxW = 12.17
      const w = maxW
      const h = w / aspect
      const mat = new THREE.MeshBasicMaterial({ map: tex, transparent: true, depthWrite: false, color: 0xe0ddd7 })
      const mesh = new THREE.Mesh(new THREE.PlaneGeometry(w, h), mat)
      mesh.rotation.y = -Math.PI / 2
      mesh.position.set(W / 2 - 0.02, 3.0, -8.9)
      this.scene.add(mesh)
    })

    // ── Right wall second panel — gap between z=0 and z=8 frames ──
    this._addStatementText4(W)
  }

  _addStatementText4(W) {
    const cw = 2048, ch = 1116
    const canvas4 = document.createElement('canvas')
    canvas4.width = cw; canvas4.height = ch
    const ctx4 = canvas4.getContext('2d')

    const fontSize = 118
    const ys = [130, 290, 826, 986]

    const drawText4 = () => {
      ctx4.clearRect(0, 0, cw, ch)
      ctx4.textAlign = 'center'
      ctx4.textBaseline = 'middle'
      ctx4.fillStyle = '#111111'
      ctx4.font = `italic 600 ${fontSize}px 'Josefin Sans', sans-serif`
      if (ctx4.letterSpacing !== undefined) ctx4.letterSpacing = '8px'

      ctx4.fillText('WEAVING MEMORY',          cw / 2, ys[0])
      ctx4.fillText('INTO SPACE',              cw / 2, ys[1])

      ctx4.strokeStyle = '#111111'
      ctx4.globalAlpha = 0.15
      ctx4.lineWidth = 2
      ctx4.beginPath()
      ctx4.moveTo(cw * 0.22, ch / 2)
      ctx4.lineTo(cw * 0.78, ch / 2)
      ctx4.stroke()
      ctx4.globalAlpha = 1

      ctx4.fillText('TRACING CULTURE',         cw / 2, ys[2])
      ctx4.fillText('THROUGH LANDSCAPE',       cw / 2, ys[3])
    }

    drawText4()

    const tex4 = new THREE.CanvasTexture(canvas4)
    tex4.needsUpdate = true

    const mat4 = new THREE.MeshBasicMaterial({
      map: tex4,
      transparent: true,
      depthWrite: false,
    })

    const panel4 = new THREE.Mesh(new THREE.PlaneGeometry(4.5, 3.0), mat4)
    panel4.rotation.y = -Math.PI / 2
    panel4.position.set(W / 2 - 0.02, 2.9, 6.0)
    this.scene.add(panel4)

    document.fonts.load(`italic 600 ${fontSize}px 'Josefin Sans'`).then(() => {
      drawText4()
      tex4.needsUpdate = true
    })
  }

  _addCVCanvas_unused(W) {
    const img = new window.Image()
    img.onload = () => {
      const CW = 4096, CH = 1800
      const can = document.createElement('canvas')
      can.width = CW; can.height = CH
      const ctx = can.getContext('2d')

      // Background
      ctx.fillStyle = '#f5f3ef'
      ctx.fillRect(0, 0, CW, CH)

      // Photo — crop left 29% of source image
      const photoW = Math.round(CW * 0.245)
      ctx.drawImage(img, 0, 0, Math.round(img.naturalWidth * 0.29), img.naturalHeight, 0, 0, photoW, CH)

      // Gradient contact overlay at bottom of photo
      const overlayH = Math.round(CH * 0.32)
      const grad = ctx.createLinearGradient(0, CH - overlayH, 0, CH)
      grad.addColorStop(0, 'rgba(15,15,15,0)')
      grad.addColorStop(0.3, 'rgba(15,15,15,0.88)')
      grad.addColorStop(1, 'rgba(15,15,15,0.96)')
      ctx.fillStyle = grad
      ctx.fillRect(0, CH - overlayH, photoW, overlayH)

      const cty = CH - overlayH + 90
      ctx.textAlign = 'left'
      ctx.fillStyle = '#ffffff'
      ctx.font = 'bold 30px Arial'
      ctx.fillText('CONTACT INFO', 36, cty)
      ctx.font = '22px Arial'
      ctx.fillStyle = '#dddddd'
      ctx.fillText('eshithahebbale@gmail.com', 36, cty + 50)
      ctx.fillText('+91 6363333743', 36, cty + 88)
      ctx.fillText('linkedin.com/in/eshitha-hebbale-868ba5360', 36, cty + 126)

      ctx.fillStyle = '#aaaaaa'
      ctx.font = '22px Arial'
      ctx.textAlign = 'center'
      ctx.fillText('10.02.2003', photoW / 2, CH - 28)

      // Name strip
      const stripX = photoW
      const stripW = Math.round(CW * 0.052)
      ctx.fillStyle = '#232323'
      ctx.fillRect(stripX, 0, stripW, CH)

      ctx.save()
      ctx.translate(stripX + stripW / 2, CH / 2)
      ctx.rotate(-Math.PI / 2)
      ctx.fillStyle = '#f0eeea'
      ctx.font = 'bold 54px Arial'
      ctx.textAlign = 'center'
      if (ctx.letterSpacing !== undefined) ctx.letterSpacing = '12px'
      ctx.fillText('ESHITHA HEBBALE', 0, 20)
      ctx.restore()
      if (ctx.letterSpacing !== undefined) ctx.letterSpacing = '0px'

      // CV content area
      const cvX = stripX + stripW + 80
      const cvW = CW - cvX - 80
      const col1X = cvX
      const col2X = cvX + Math.round(cvW * 0.50)

      // Title
      ctx.fillStyle = '#b53a2a'
      ctx.textAlign = 'center'
      if (ctx.letterSpacing !== undefined) ctx.letterSpacing = '5px'
      ctx.font = '500 42px Georgia, serif'
      ctx.fillText('CURRICULUM  VITAE', cvX + cvW / 2, 72)
      if (ctx.letterSpacing !== undefined) ctx.letterSpacing = '0px'

      ctx.strokeStyle = '#c0bcb6'
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(cvX, 96)
      ctx.lineTo(CW - 80, 96)
      ctx.stroke()

      // Section heading
      const heading = (x, y, text) => {
        ctx.font = 'bold 26px Arial'
        ctx.fillStyle = '#1a1a1a'
        ctx.textAlign = 'left'
        ctx.fillText(text, x, y)
        const tw = ctx.measureText(text).width
        ctx.strokeStyle = '#1a1a1a'
        ctx.lineWidth = 1.5
        ctx.beginPath()
        ctx.moveTo(x, y + 7)
        ctx.lineTo(x + tw, y + 7)
        ctx.stroke()
        return y + 46
      }

      // Education entry
      const entry = (x, y, date, title, sub) => {
        ctx.font = '20px Arial'
        ctx.fillStyle = '#888'
        ctx.textAlign = 'left'
        ctx.fillText(date, x, y)
        ctx.font = '500 23px Arial'
        ctx.fillStyle = '#1a1a1a'
        ctx.fillText(title, x + 230, y)
        if (sub) {
          ctx.font = '19px Arial'
          ctx.fillStyle = '#666'
          ctx.fillText(sub, x + 230, y + 30)
          return y + 68
        }
        return y + 48
      }

      // Skill row
      const skill = (x, y, label, val) => {
        ctx.font = 'bold 21px Arial'
        ctx.fillStyle = '#1a1a1a'
        ctx.textAlign = 'left'
        ctx.fillText(label, x, y)
        ctx.font = '20px Arial'
        ctx.fillStyle = '#444'
        ctx.fillText(val, x + 210, y)
        return y + 40
      }

      // ── LEFT COLUMN ──
      let y1 = heading(col1X, 136, 'EDUCATION')
      y1 = entry(col1X, y1, '2025 – 2026', 'Architecture Dialogue', '5 Months architecture internship')
      y1 = entry(col1X, y1, '2021 – 2026', 'RV College of Architecture', 'Bachelors in Architecture')
      y1 = entry(col1X, y1, '2019 – 2021', "Kumaran's PU College", 'Physics, Chemistry, Mathematics, Electronics')
      y1 = entry(col1X, y1, '2009 – 2019', 'JSS Public School', 'CBSE')

      y1 += 28
      y1 = heading(col1X, y1, 'COMPETITIONS')
      y1 = entry(col1X, y1, 'Oct 2024', 'Transperance 19.0', 'Saint - Gobain')
      y1 = entry(col1X, y1, 'Oct – Feb 2025', 'Solar Decathlon India', 'Qualified deliverable 3/4')
      ctx.font = '500 23px Arial'
      ctx.fillStyle = '#1a1a1a'
      ctx.fillText('Monsoon Playground', col1X + 230, y1)
      ctx.font = '19px Arial'
      ctx.fillStyle = '#888'
      ctx.fillText('May 2025', col1X, y1)
      ctx.fillStyle = '#666'
      ctx.fillText('Land Optimizer International pvt Ltd  ·  Group work – 3rd Place', col1X + 230, y1 + 30)

      // ── RIGHT COLUMN ──
      let y2 = heading(col2X, 136, 'SOFTWARE SKILLS')
      y2 = skill(col2X, y2, 'MS Office', 'Word  |  Powerpoint  |  Excel')
      y2 = skill(col2X, y2, 'Autodesk', 'Auto Cad  |  Revit')
      ctx.font = 'bold 21px Arial'
      ctx.fillStyle = '#1a1a1a'
      ctx.fillText('Adobe', col2X, y2)
      ctx.font = '20px Arial'
      ctx.fillStyle = '#444'
      ctx.fillText('Photoshop  |  Indesign  |  Illustrator', col2X + 210, y2)
      ctx.fillText('Lightroom  |  Premium Pro', col2X + 210, y2 + 30)
      y2 += 68
      y2 = skill(col2X, y2, 'Modelling', 'Sketchup  |  Rhinoceros')
      y2 = skill(col2X, y2, 'Rendering', 'Lumion  |  D5  |  AI assisted')

      y2 += 26
      y2 = heading(col2X, y2, 'CERTIFICATIONS / WORKSHOPS')
      const certR = col2X + Math.round((CW - 80 - col2X) * 0.52)
      const certs = [
        ['Hafele Kitchen Workshop', 'Fitting Designing and Installation'],
        ['Lighting in Design Workshop', 'Women in lighting'],
        ['USGKnauff Training', ''],
      ]
      for (const [c1, c2] of certs) {
        ctx.font = '20px Arial'
        ctx.fillStyle = '#1a1a1a'
        ctx.textAlign = 'left'
        ctx.fillText(c1, col2X, y2)
        if (c2) { ctx.fillStyle = '#555'; ctx.fillText(c2, certR, y2) }
        y2 += 40
      }

      y2 += 24
      y2 = heading(col2X, y2, 'LANGUAGES')
      ctx.font = '22px Arial'
      ctx.fillStyle = '#1a1a1a'
      ctx.textAlign = 'left'
      ctx.fillText('English  |  Kannada  |  Hindi', col2X, y2)

      // Build mesh
      const tex = new THREE.CanvasTexture(can)
      tex.needsUpdate = true

      const meshW = 10.14
      const meshH = meshW / (CW / CH)
      const mat = new THREE.MeshBasicMaterial({ map: tex, depthWrite: false })
      const mesh = new THREE.Mesh(new THREE.PlaneGeometry(meshW, meshH), mat)
      mesh.rotation.y = -Math.PI / 2
      mesh.position.set(W / 2 - 0.02, 3.0, -11.1)
      this.scene.add(mesh)
    }
    img.src = 'assets/cv2.png'
  }

  _quad(x1,y1,z1, x2,y2,z2, x3,y3,z3, x4,y4,z4, mat) {
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array([
      x1,y1,z1, x2,y2,z2, x3,y3,z3,
      x1,y1,z1, x3,y3,z3, x4,y4,z4,
    ]), 3))
    const uvs = new Float32Array([0,0, 1,0, 1,1, 0,0, 1,1, 0,1])
    geo.setAttribute('uv', new THREE.BufferAttribute(uvs, 2))
    geo.computeVertexNormals()
    return new THREE.Mesh(geo, mat)
  }
}
