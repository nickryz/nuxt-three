import {
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
  sRGBEncoding,
  ReinhardToneMapping,
} from 'three'
import Stats from 'three/examples/jsm/libs/stats.module.js'

let webgl = null
export default ({ app }, inject) => {
  class WebGl {
    constructor() {
      // app
      this.events = app.$events
      this.viewport = app.$viewport
      // Stats
      this.stats = null
      // Scene
      this.scene = new Scene()
      // Camera
      this.camera = null
      // Renderer
      this.renderer = null

      this.init()

      // Listeners
      this.events.on('viewport:resize', this.onWindowResize)
      this.events.on('frame:render', this.loop)
    }

    init() {
      // stats
      if (process.env.NODE_ENV === 'development') this.initStats()
      // camera
      this.initCamera()
      // renderer
      this.initRenderer()
    }

    /* Camera */
    initCamera() {
      this.camera = new PerspectiveCamera(
        70,
        this.viewport.width / this.viewport.height,
        0.1,
        150
      )
    }
    updateCamera() {
      this.camera.aspect = this.viewport.width / this.viewport.height
      this.camera.updateProjectionMatrix()
    }

    /* Renderer */
    initRenderer() {
      this.renderer = new WebGLRenderer({
        alpha: true,
        powerPreference: 'high-performance',
        antialias: false,
        stencil: false,
        depth: false,
      })
      this.renderer.outputEncoding = sRGBEncoding
      this.renderer.shadowMap.autoUpdate = false
      this.renderer.shadowMap.needsUpdate = true
      this.renderer.shadowMap.enabled = true
      this.renderer.info.autoReset = false
      this.renderer.physicallyCorrectLights = true
      this.renderer.toneMapping = ReinhardToneMapping
      this.renderer.toneMappingExposure = 2
      this.renderer.setSize(this.viewport.width, this.viewport.height)
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    }

    /* Stats */
    initStats() {
      this.stats = new Stats()
      document.body.appendChild(this.stats.dom)
      this.events.on('frame:statsBegin', this.stats.begin)
      this.events.on('frame:statsEnd', this.stats.end)
    }

    onWindowResize = () => {
      this.renderer.setSize(this.viewport.width, this.viewport.height)
      this.updateCamera()
    }

    loop =
      () =>
      ({ time, deltaTime, frame }) => {
        this.renderer.render(this.scene, this.camera)
        this.renderer.renderLists.dispose()
      }

    destroy() {
      this.events.off('viewport:resize', this.onWindowResize)
      this.events.off('frame:statsBegin', this.stats.begin)
      this.events.off('frame:statsEnd', this.stats.end)
      this.events.off('frame:render', this.loop)
    }
  }

  const useWebGL = () => {
    return webgl || (webgl = new WebGl())
  }
  inject('webgl', useWebGL)
}
