<template>
  <div id="webglScene" />
</template>

<script>
export default {
  name: 'Scene',
  mounted() {
    this.webgl = this.$webgl()
    this.$el.appendChild(this.webgl.renderer.domElement)
  },
  beforeDestroy() {
    this.webgl.destroy()
  },
}
</script>

<style lang="scss">
#webglScene {
  height: 100vh;
  width: 100%;
  top: 0;
  left: 0;
  pointer-events: none;
  position: fixed;

  canvas {
    margin: 0;
    height: 100%;
    width: 100%;
  }
}
</style>
