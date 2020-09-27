<template>
  <div>
    <object
      id="svg-renderer"
      type="image/svg+xml"
      :data="svgURL"
    />
  </div>
</template>

<script>
import pako from 'pako'

export default {
  data () {
    return {
      svgURL: ''
    }
  },
  props: {
    slideSvgUrl: {
      type: String,
      default: ''
    }
  },
  methods: {
    getSvgData (svg) {
      let originURL = window.location.origin
      let pathName = window.location.pathname
      let svgData = svg.replace(
        'assets/plugins/svg.js',
        originURL + pathName + 'SVGData/svg.js'
      )
      const blob = new Blob([svgData], { type: 'image/svg+xml' })
      this.svgURL = URL.createObjectURL(blob)
    }
  },
  mounted () {
    if (this.slideSvgUrl) {
      this.getSvgData(this.slideSvgUrl)
    }
  },
  watch: {
    slideSvgUrl (newValue, oldValue) {
      this.getSvgData(newValue)
    }
  }
}
</script>

<style lang="scss" scoped>
  #svg-renderer {
    transform: scale(1.8);
    width: 100%;
    height: 100px;
    overflow-x: hidden;
  }
</style>
