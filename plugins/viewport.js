import Vue from 'vue'

export default ({ app }, inject) => {
  const viewport = new Vue({
    data() {
      return !process.client
        ? {}
        : {
          width:
            document.documentElement.clientWidth || document.body.clientWidth,
          height: Math.min(
            window.innerHeight,
            document.documentElement.clientHeight
          ),
          event: null
        }
    },
    computed: {
      ratio() {
        if (!process.client) return
        return this.width / this.height
      }
    },
    created() {
      if (!process.client) return
      addEventListener('resize', this.onWindowResize, false)
    },
    beforeDestroy() {
      if (!process.client) return
      removeEventListener('resize', this.onWindowResize)
    },
    methods: {
      onWindowResize(event) {
        if (!process.client) return
        this.width =
          document.documentElement.clientWidth || document.body.clientWidth
        this.height = Math.min(
          window.innerHeight,
          document.documentElement.clientHeight
        ) // fixing invalid value on chrome

        this.event = event

        // https://css-tricks.com/the-trick-to-viewport-units-on-mobile/
        const vh = this.height * 0.01
        document.documentElement.style.setProperty('--vh', `${vh}px`)
        app.$events.emit('viewport:resize', this.$data)
      }
    }
  })

  inject('viewport', viewport)
}
