import Experience from './Experience.js'

const canvas  = document.querySelector('.webgl')
const isPhone = window.innerWidth <= 820

new Experience(canvas, isPhone)
