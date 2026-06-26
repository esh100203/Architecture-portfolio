import Environment from './Environment.js'
import Personnage  from './Personnage.js'
import Home        from './Home.js'
import Menu        from './Menu.js'
import { buildNeeradiPortal }        from './projects/Neeradi.js'
import { buildThirdPlacePortal }     from './projects/ThirdPlace.js'
import { buildCityLivingRoomPortal } from './projects/CityLivingRoom.js'
import { buildUnEarthedPortal }      from './projects/UnEarthed.js'
import { buildInternshipPortal }     from './projects/Internship.js'

const PROJECT_BUILDERS = {
  neeradi:             buildNeeradiPortal,
  'third-place':       buildThirdPlacePortal,
  'citys-living-room': buildCityLivingRoomPortal,
  unearthed:           buildUnEarthedPortal,
  internship:          buildInternshipPortal,
}

export default class World {
  constructor(experience) {
    this.experience = experience
    this.environment = new Environment(experience)
    this.menu        = new Menu(experience)
    this.personnage  = new Personnage(experience)
    this.page        = new Home(experience)

    if (!experience.isPhone) {
      const ctrl = document.getElementById('controls_overlay')
      if (ctrl) requestAnimationFrame(() => { ctrl.style.opacity = '1' })
    }

    this._portal = null
  }

  enterProject(proj) {
    if (!proj.title) return

    this._portal = document.createElement('div')
    this._portal.className = 'project_portal'

    const builder = PROJECT_BUILDERS[proj.uid]
    if (builder) {
      this._portal.innerHTML = builder()
    } else {
      this._portal.innerHTML = `
        <div class="pp_header">
          <span class="pp_header_title">${proj.title}</span>
          <button class="pp_back_btn">✕ Close</button>
        </div>
        <div class="pp_scroll">
          <div class="pp_placeholder">
            <p>Content coming soon</p>
          </div>
        </div>
      `
    }

    document.body.appendChild(this._portal)
    requestAnimationFrame(() => this._portal.classList.add('open'))

    // Wire horizontal reel scroll
    const wireReel = (stripId, sectionClass) => {
      const reel = this._portal.querySelector(stripId)
      if (!reel) return
      let reelActive = false
      const reelSection = reel.closest(sectionClass)
      let activateTimer = null
      let exitTimer = null

      // 0.85 threshold — activates even if section slightly clips viewport edge
      const observer = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting) {
          activateTimer = setTimeout(() => { reelActive = true }, 150)
        } else {
          clearTimeout(activateTimer)
          clearTimeout(exitTimer)
          reelActive = false
        }
      }, { threshold: 0.85 })
      observer.observe(reelSection)

      this._portal.addEventListener('wheel', e => {
        const scale = e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? 300 : 1

        // Horizontal swipe (trackpad two-finger): always route to reel when in view
        const isHorizontal = Math.abs(e.deltaX) > 3
        if (isHorizontal && reelActive) {
          e.preventDefault()
          reel.scrollLeft += e.deltaX * scale
          return
        }

        if (!reelActive) return

        const delta = e.deltaY * scale
        if (Math.abs(delta) < 1) return // ignore sub-pixel inertia noise

        const atEnd = reel.scrollLeft >= reel.scrollWidth - reel.clientWidth - 2
        if (atEnd && delta > 0) {
          // Brief grace period so momentum events don't cause a page-scroll jolt
          clearTimeout(exitTimer)
          exitTimer = setTimeout(() => { reelActive = false }, 120)
          e.preventDefault()
          return
        }

        e.preventDefault()
        reel.scrollLeft += delta
      }, { passive: false })
    }
    wireReel('#nr_reel_strip', '.nr_reel_section')
    wireReel('#ue_reel_strip', '.ue_reel_section')
    wireReel('#ue_sections_reel_strip', '.ue_sections_reel_section')
    wireReel('#in_reel_strip', '.in_reel_section')

this._portal.querySelectorAll('.pp_back_btn').forEach(btn => btn.addEventListener('click', () => this.leaveProject()))
    this._portalKey = e => { if (e.key === 'Escape') this.leaveProject() }
    window.addEventListener('keydown', this._portalKey)
  }

  leaveProject() {
    if (!this._portal) return
    this._portal.classList.remove('open')
    this._portal.addEventListener('transitionend', () => {
      this._portal?.remove()
      this._portal = null
    }, { once: true })
    window.removeEventListener('keydown', this._portalKey)
  }

  update() {
    this.personnage?.update()
    this.page?.update()
  }
}
