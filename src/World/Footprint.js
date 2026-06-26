import * as THREE from 'three'

// Procedurally generate a footprint texture on a canvas
function makeFootprintTexture(isLeft, size = 128) {
  const c = document.createElement('canvas')
  c.width = c.height = size
  const ctx = c.getContext('2d')

  const mx = size / 2
  const my = size / 2
  // Simple rounded oval matching the capsule leg cross-section
  ctx.beginPath()
  ctx.ellipse(mx, my, size * 0.22, size * 0.32, 0, 0, Math.PI * 2)
  ctx.fillStyle = 'black'
  ctx.fill()

  const tex = new THREE.CanvasTexture(c)
  return tex
}

// Generate smooth noise texture
function makeNoiseTexture(size = 128) {
  const c = document.createElement('canvas')
  c.width = c.height = size
  const ctx = c.getContext('2d')
  const d = ctx.createImageData(size, size)
  for (let i = 0; i < d.data.length; i += 4) {
    const v = Math.random() * 255
    d.data[i] = d.data[i+1] = d.data[i+2] = v
    d.data[i+3] = 255
  }
  ctx.putImageData(d, 0, 0)
  return new THREE.CanvasTexture(c)
}

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const fragmentShader = `
  uniform sampler2D u_tex;
  uniform sampler2D u_noise;
  uniform float u_progress;
  varying vec2 vUv;

  void main() {
    vec4 foot = texture2D(u_tex, vUv);
    vec4 noise = texture2D(u_noise, vUv * 1.8);

    float mask = foot.a;   // alpha channel = 1 on foot shape, 0 on transparent bg
    float n = noise.r;

    float t = u_progress;
    float edge = smoothstep(0.0, 0.25, t) * smoothstep(1.0, 0.7, t);
    float appear = smoothstep(0.0, 0.15, t);

    float alpha = mask * appear * (1.0 - n * 0.35);
    alpha = clamp(alpha, 0.0, 1.0);

    // fade out over the last 60%
    alpha *= (1.0 - smoothstep(0.40, 1.0, t));

    gl_FragColor = vec4(0.05, 0.05, 0.05, alpha * 0.85);
  }
`

// Cache textures — generate once, reuse
const _texL  = makeFootprintTexture(true)
const _texR  = makeFootprintTexture(false)
const _noise = makeNoiseTexture()

export default class Footprint {
  constructor(experience, position, isLeft) {
    this.experience = experience
    this.scene = experience.scene
    this._done = false

    const geo = new THREE.PlaneGeometry(0.32, 0.42)
    const mat = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        u_tex:      { value: isLeft ? _texL : _texR },
        u_noise:    { value: _noise },
        u_progress: { value: 0 }
      },
      transparent: true,
      depthWrite: false,
      depthTest: true,
      polygonOffset: true,
      polygonOffsetFactor: -2,
      polygonOffsetUnits: -2,
      side: THREE.DoubleSide
    })

    this.mesh = new THREE.Mesh(geo, mat)
    this.mesh.rotation.x = -Math.PI / 2
    this.mesh.position.copy(position)
    this.mesh.position.y = 0.005
    this.mesh.renderOrder = 1
    this.scene.add(this.mesh)

    this._mat = mat
    this._geo = geo
    this._startTime = performance.now()
    this._duration = 1000 // ms
  }

  // Called every frame from Personnage.update()
  tick() {
    if (this._done) return
    const t = Math.min((performance.now() - this._startTime) / this._duration, 1)
    this._mat.uniforms.u_progress.value = t
    if (t >= 1) {
      this.scene.remove(this.mesh)
      this._mat.dispose()
      this._geo.dispose()
      this._done = true
    }
  }
}
