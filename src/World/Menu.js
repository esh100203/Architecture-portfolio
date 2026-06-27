export default class Menu {
  constructor(experience) {
    this.experience = experience
    this.isOpen = false
    this.isClickable = false

    this._openBtn  = document.querySelector('.menu_open button')
    this._closeBtn = document.querySelector('.menu_close')
    this._menuEl   = document.querySelector('.menu')
    this._menuText = document.querySelector('.menu_text')
    this._menuLine = document.querySelector('.menu_line')
    this._mainLinks = document.querySelectorAll('.menu_main_links a')
    this._linkItems = document.querySelectorAll('#menu_projects_list li a')
    this._canvasContainer = document.querySelector('.menu_canvas_container')
    this._contactBtn = null
    this._instaBtn   = null
    this._searchInput = document.querySelector('#search_input')

    this._populateLinks()
    this._initAppear()
    this._bindEvents()
  }

  _populateLinks() {
    const projects = [
      'Neeradi — The Water\'s Way',
      'UnEarthed — Journey to Destination',
      'The Third Place',
      'Internship',
      'City\'s Living Room',
    ]
    const ul = document.querySelector('#menu_projects_list')
    ul.innerHTML = ''
    projects.forEach((name, i) => {
      const li = document.createElement('li')
      li.innerHTML = `
        <a href="#project-${i+1}" class="menu_project_link">${name}</a>
        <div class="menu_links_hover"></div>
      `
      ul.appendChild(li)
    })
  }

  _initAppear() {
    // Slide in the menu button after a delay (called after loader finishes)
    gsap.fromTo('.menu_open button',
      { y: '100%' },
      { y: '0%', duration: 0.3, ease: 'sine.inOut', delay: 0.8 }
    )
    setTimeout(() => { this.isClickable = true }, 1200)
  }

  open() {
    if (!this.isClickable || this.isOpen) return
    this.isOpen = true

    // Enable menu pointer events
    this._menuEl.style.pointerEvents = 'all'
    this._menuText.classList.add('active')
    document.querySelector('.menu_close').style.display = 'block'

    // Pause character
    if (this.experience.world?.personnage) {
      this.experience.world.personnage.controlsEnabled = false
    }

    const tl = gsap.timeline()

    // Canvas container
    tl.to(this._canvasContainer, { opacity: 0.2, duration: 0.5, ease: 'sine.inOut' }, 0)

    // Main nav links slide in
    this._mainLinks.forEach((a, i) => {
      tl.fromTo(a, { y: '-110%' }, { y: '0%', duration: 0.5, ease: 'sine.inOut' }, i * 0.08)
    })

    // Line grows
    tl.to(this._menuLine, { height: '95%', duration: 0.6, ease: 'sine.inOut' }, 0.1)

    // Project links slide in
    const links = document.querySelectorAll('#menu_projects_list li a')
    links.forEach((a, i) => {
      tl.fromTo(a, { y: '-100%' }, { y: '0%', duration: 0.4, ease: 'sine.inOut' }, 0.2 + i * 0.05)
    })

    // Search
    tl.to('.search_bar', { opacity: 1, duration: 0.3, ease: 'sine.inOut' }, 0.5)

    // Swap menu/close button visibility
    gsap.to('.menu_open button', { opacity: 0, duration: 0.2 })
    gsap.fromTo('.menu_close button',
      { y: '100%' }, { y: '0%', duration: 0.3, ease: 'sine.inOut', delay: 0.1 }
    )
  }

  close() {
    if (!this.isOpen) return
    this.isOpen = false

    this._menuText.classList.remove('active')
    const tl = gsap.timeline({ onComplete: () => {
      this._menuEl.style.pointerEvents = 'none'
      document.querySelector('.menu_close').style.display = 'none'
      if (this.experience.world?.personnage) {
        this.experience.world.personnage.controlsEnabled = true
      }
    }})

    tl.to(this._mainLinks, { y: '-110%', duration: 0.3, ease: 'sine.inOut' }, 0)
    tl.to(this._menuLine, { height: '0%', duration: 0.4, ease: 'sine.inOut' }, 0)
    tl.to(document.querySelectorAll('#menu_projects_list li a'), { y: '-100%', duration: 0.3, ease: 'sine.inOut' }, 0)
    // Reset contact panel
    document.getElementById('menu_contact_block')?.classList.remove('open')
    document.getElementById('menu_projects_list').style.display = ''
    tl.to('.search_bar', { opacity: 0, duration: 0.2 }, 0)
    tl.to(this._canvasContainer, { opacity: 0, duration: 0.4, ease: 'sine.inOut' }, 0)

    gsap.to('.menu_open button', { opacity: 1, duration: 0.3, delay: 0.3 })
    gsap.to('.menu_close button', { y: '100%', duration: 0.2 })
  }

  _bindEvents() {
    document.querySelector('.menu_open').addEventListener('click', () => this.open())
    document.querySelector('.menu_close').addEventListener('click', () => this.close())

    // Contact toggle — swap project list for contact info on the right
    document.getElementById('menu_contact_toggle')?.addEventListener('click', e => {
      e.preventDefault()
      const list    = document.getElementById('menu_projects_list')
      const contact = document.getElementById('menu_contact_block')
      const isOpen  = contact.classList.contains('open')
      list.style.display    = isOpen ? '' : 'none'
      contact.classList.toggle('open', !isOpen)
    })

    // Projects link — switch back to project list
    document.querySelector('a[data-page="gallery"]')?.addEventListener('click', e => {
      e.preventDefault()
      document.getElementById('menu_projects_list').style.display = ''
      document.getElementById('menu_contact_block')?.classList.remove('open')
    })


    // Search filter
    this._searchInput?.addEventListener('input', () => {
      const q = this._searchInput.value.toLowerCase()
      document.querySelectorAll('#menu_projects_list li').forEach(li => {
        const name = li.querySelector('a')?.textContent.toLowerCase() || ''
        li.style.display = name.includes(q) ? 'block' : 'none'
      })
    })

    // Hide close button initially
    document.querySelector('.menu_close').style.display = 'none'
  }
}
