import Vue from 'vue'

export default ({ app }, inject) => {
  const frame = new Vue({
    created() {
      if (!process.client) return
      app.$gsap.ticker.add(this.onTick)
    },
    beforeDestroy() {
      if (!process.client) return
      app.$gsap.ticker.remove(this.onTick)
    },
    methods: {
      onTick(time, deltaTime, frame) {
        const props = { time, deltaTime, frame }
        app.$events.emit('frame:statsBegin', props)

        app.$events.emit('frame:beforeFrame', props)
        app.$events.emit('frame:frame', props)
        app.$events.emit('frame:afterFrame', props)

        app.$events.emit('frame:beforeRender', props)
        app.$events.emit('frame:render', props)
        app.$events.emit('frame:afterRender', props)

        app.$events.emit('frame:statsEnd', props)
      },
    },
  })

  inject('frame', frame)
}
