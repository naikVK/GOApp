<template>
  <div>
    <zippedSvgRenderer
      class="prevent-click"
      v-if="svgUploadMode==='presentation-upload'"
      :id="'view'+ slidePosition"
      :slide-svg-url="importedSVGUrl"
    />
    <object
      v-if="svgUploadMode==='manual-upload'"
      :id="'view'+ slidePosition"
      type="image/svg+xml"
      :data="svgUrl"
      class="view-svg view-only"
    />
  </div>
</template>

<script>
import StoreDataOperation from '@/plugins/StoreDataOperation.js'
import zippedSvgRenderer from '@/components/superPointPlugins/SvgTemplate/zippedSvgRenderer'
import idb from '@/plugins/idb'

let storeDataOperation = new StoreDataOperation()

export default {
  components: {
    zippedSvgRenderer
  },
  data () {
    return {
      importedSVGUrl: '',
      svgUploadMode: '',
      svgContent: '',
      svgUrl: ''
    }
  },
  props: {
    slidePosition: {
      type: String,
      default: ''
    },
    index: {
      type: Number,
      default: 0
    }
  },
  methods: {
    INIT () {
      this.properties = storeDataOperation.getCurrentSlideData()
      this.svgContent = this.properties.svg.value
      this.svgUploadMode = this.properties.svg.mode
      this.renderSVG()
    },
    renderSVG () {
      idb.getItem(this.svgContent).then(data => {
        if (!data) {
          if (!this.svgContent.includes('undefined')) {
            this.setDataToIDB(this.svgContent).then(newdata => {
              data = newdata
            })
          }
        }
        if (this.svgUploadMode === 'presentation-upload' && data) {
          this.importedSVGUrl = decodeURIComponent(Array.prototype.map.call(atob(data.replace('data:image/svg+xml;base64,', '')), function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
          }).join('')) // Adding this code to support some breaking character issue during decoding base 64 string
        } else {
          this.svgUrl = data
        }
      })
    },
    setDataToIDB (url) {
      // eslint-disable-next-line promise/param-names
      return new Promise((resolve, _) => {
        this.toDataURL(url).then(res => {
          idb.setItem(url, res)
          resolve(res)
        })
      })
    },
    toDataURL (url) {
      return new Promise((resolve, reject) => {
        var xhr = new XMLHttpRequest()
        xhr.onload = function () {
          var reader = new FileReader()
          reader.onloadend = function () {
            resolve(reader.result)
          }
          reader.readAsDataURL(xhr.response)
        }
        xhr.open('GET', url)
        xhr.responseType = 'blob'
        xhr.send()
      })
    }
  },
  mounted () {
    storeDataOperation = new StoreDataOperation(this.index, this.slidePosition)
    this.INIT()
  }
}
</script>
