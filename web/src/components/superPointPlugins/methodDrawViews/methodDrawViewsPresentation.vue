<template>
  <div>
    <div
      v-if="getSlidePosition === 'current'"
      class="canvas-wrapper"
    >
      <canvas id="canvasEditor" />
    </div>
    <div
      v-else
      class="svg-holder"
    >
      <section

        :id="'view' + getSlidePosition"
        class="view-svg view-only"
      />
    </div>
  </div>
</template>

<script>
import idb from '@/plugins/idb'
import StoreDataOperation from '@/plugins/StoreDataOperation.js'
import { fabric } from 'fabric'
import MQL from '@/plugins/mql.js'
import { eventBus } from '@/main'

let storeDataOperation
export default {
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
  data: () => {
    return {
      properties: {
        svg: {
          type: 'svg',
          value: ``
        }
      },
      canvas: null,
      imageUrls: [],
      objectIndexArray: [],
      backgroundImageUrl: null

    }
  },
  methods: {
    INIT () {
      this.properties = storeDataOperation.getCurrentSlideData()
      if (this.getSlidePosition === 'current') {
        this.properties = this.$store.getters.getCurrentSlide.data
        // var jsonData = this.properties.json.value
        // Getting json of slide and removing superpointasset URL if it is found in URL
        // this.properties = storeDataOperation.getCurrentSlideData().json.value
        let self = this
        // fabric.loadSVGFromString(this.svgStr, function(objects) { // For SVG  input(if svg string is provided to bind with canvas)
        //   self.canvas.clear()
        //   let json = { version: '3.4.0', objects: objects }
      this.renderFromIDB(this.properties.json.value).then(res => {
        if (res) {
        self.canvas.loadFromJSON(this.properties.json.value, () => {
          // Loading json data in canvas
          self.canvas.renderAll()
        })
        // fabric.Object.prototype.selectable = false
        // this.canvas.renderAll()
        // })
        this.canvas.freeDrawingBrush.color = 'hsla(360, 100%, 50%, 0.66)' // Selecting red brush color
        this.canvas.freeDrawingBrush.width = 5 // Selecting brush size
        this.canvas.isDrawingMode = true // Turning on drawing mode
        }
      })
      } else {
        // this.properties = {'svg': {
        //     'type': 'svg',
        //     'value': '<svg viewbox=\"0 0 1024 768\" width=\"1024\" height=\"768\" xmlns=\"http:\/\/www.w3.org\/2000\/svg\">\r\n <!-- Created with Method Draw - http:\/\/github.com\/duopixel\/Method-Draw\/ -->\r\n <g>\r\n  <title>background<\/title>\r\n  <rect fill=\"#fff\" id=\"canvas_background\" height=\"770\" width=\"1026\" y=\"-1\" x=\"-1\"\/>\r\n  <g display=\"none\" overflow=\"visible\" y=\"0\" x=\"0\" height=\"100%\" width=\"100%\" id=\"canvasGrid\">\r\n   <rect fill=\"url(#gridpattern)\" stroke-width=\"0\" y=\"0\" x=\"0\" height=\"100%\" width=\"100%\"\/>\r\n  <\/g>\r\n <\/g>\r\n <g>\r\n  <title>Layer 1<\/title>\r\n  <text xml:space=\"preserve\" text-anchor=\"start\" font-family=\"Helvetica, Arial, sans-serif\" font-size=\"57\" id=\"svg_1\" y=\"403.99789\" x=\"308.9713\" stroke-width=\"0\" stroke=\"#000\" fill=\"#000000\">This is slide test<\/text>\r\n  <rect stroke=\"#000\" id=\"svg_13\" height=\"130.00057\" width=\"213.33426\" y=\"9.75359\" x=\"801.58236\" stroke-opacity=\"null\" stroke-width=\"1.5\" fill=\"#56ff56\"\/>\r\n  <rect stroke=\"#000\" id=\"svg_15\" height=\"130.00057\" width=\"213.33426\" y=\"628.0896\" x=\"9.08337\" stroke-opacity=\"null\" stroke-width=\"1.5\" fill=\"#56ff56\"\/>\r\n  <rect stroke=\"#000\" id=\"svg_16\" height=\"130.00057\" width=\"213.33426\" y=\"14.75361\" x=\"7.4167\" stroke-opacity=\"null\" stroke-width=\"1.5\" fill=\"#56ff56\"\/>\r\n  <rect stroke=\"#000\" id=\"svg_17\" height=\"130.00057\" width=\"213.33426\" y=\"629.75627\" x=\"800.75347\" stroke-opacity=\"null\" stroke-width=\"1.5\" fill=\"#56ff56\"\/>\r\n <\/g>\r\n<\/svg>'
        //   }}
        let section = document.getElementById('view' + this.getSlidePosition)
        section.innerHTML = this.properties.svg.value
        this.$nextTick(() => {
          this.renderSVG()
        })
      }
    },
    renderFromIDB (properties) {
      return new Promise((resolve, reject) => {
        let self = this
        let canvasjson = JSON.parse(properties)
        let imageObjArray = canvasjson.objects.filter(object => object.type === 'image' || object.type === 'super-image')
        let backgroundImage = canvasjson.backgroundImage ? canvasjson.backgroundImage : null
        this.imageUrls = []
        this.objectIndexArray = []
        this.backgroundImageUrl = null
        let imagePromises = []
        for (let i = 0; i < imageObjArray.length; i++) {
          this.objectIndexArray.push(canvasjson.objects.findIndex(object => object === imageObjArray[i]))
          imagePromises.push(self.fetchFromIDB(imageObjArray[i].src))
        }

        Promise.all(imagePromises).then(images => {
          for (let j = 0; j < images.length; j++) {
            self.imageUrls.push(imageObjArray[j].src)
            imageObjArray[j].src = images[j]
            canvasjson.objects[this.objectIndexArray[j]] = imageObjArray[j]
          }
          if (backgroundImage) {
            self.fetchFromIDB(backgroundImage.src).then(res => {
              this.backgroundImageUrl = backgroundImage.src
              backgroundImage.src = res
              canvasjson.backgroundImage = backgroundImage
              self.properties.json.value = canvasjson
              resolve(true)
            })
          } else {
            self.properties.json.value = canvasjson
            resolve(true)
          }
        })
      })
    },
    fetchFromIDB (url) {
      return new Promise((resolve, reject) => {
        idb.getItem(url).then(res => {
          // console.log('from idb :', res)
          if (res) {
            resolve(res)
          } else {
            // console.log('Setting to idb')
            this.setDataToIDB(url).then(data => {
                resolve(res)
            })
          }
        })
      })
    },
    renderSVG () {
      let svgs = document.getElementsByTagName('svg')
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((svg) => {
          if (svg.isIntersecting) {
            for (var tags in svg.target.children) {
              var gtag = svg.target.children[tags]
              // console.log(gtag.tagName)
              if (typeof gtag.tagName === 'string' && gtag.tagName === 'g') {
                // console.log(gtag.children)
                for (var childtag in gtag.children) {
                  var image = gtag.children[childtag]
                  if (
                    typeof image.tagName === 'string' &&
                    image.tagName === 'image'
                  ) {
                    // image.removeAttribute('href')
                    this.svgurl = image.getAttribute('xlink:href')
                    // console.log('image::', image)
                    image.removeAttribute('xlink:href')
                    let temp = image
                    // let self = this
                    // let svgtarget = svg.target
                    idb.getItem(this.svgurl).then((data) => {
                      // console.log('data', data)
                      // console.log('image::', temp)
                      if (data) {
                        temp.setAttribute('href', data)
                        observer.unobserve(svg.target)
                      } else {
                        this.setDataToIDB(this.svgurl).then((newdata) => {
                          data = newdata
                          temp.setAttribute('href', data)
                          observer.unobserve(svg.target)
                        })
                      }
                      // self.showImg = true
                      // console.log(svg.isVisible = true)
                      // svg.target.children[tags].children[childtag].setAttribute('xlink:href', data)
                    })
                  }
                }
              }
            }
            // observer.unobserve(svgtarget)

            // svg.target.load()
          }
        })
      })
      for (let i = 0; i < svgs.length; i++) {
        // const element = svgs[i];

        observer.observe(svgs[i])
      }
    },
    setDataToIDB (url) {
      // eslint-disable-next-line promise/param-names
      return new Promise((resolve, _) => {
        this.toDataURL(url).then((res) => {
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
        // idbaxios({
        //   url: url,
        //   method: 'GET',
        //   responseType: 'blob'
        // }).then(res => {
        //   console.log(res.data)
        //   var reader = new FileReader()
        //   reader.readAsDataURL(res.data)

        //   resolve(reader.result)
        // })
        // axios.get('/assetfdb/' + url).then(res => {
        //   resolve(res)
        // })
      })
    },
    addCustomClasses () {
      // Define new class-SuperTextBox- having textbox with custom attributes like placeholder etc
      this.addSuperTextBox()
      // Define new class-SuperTextBox- having textbox with custom attribute like jsonData to mainain dataObject along with image
      this.addSuperImage()
    },
    addSuperTextBox () {
      let customProperties = [
        'showPlaceholder',
        'placeholderTextColor',
        'placeholderText',
        'fixedWidth',
        'showTextBoxBorder',
        'textboxBorderWidth',
        'textboxBorderColor',
        'fillBackupColor'
      ]
      // Initializing new class, extending from built-in textbox class
      fabric.SuperTextbox = fabric.util.createClass(fabric.Textbox, {
        // Defining type (for future reference)
        type: 'super-textbox',
        // Constructor function
        initialize: function (text, options) {
          options || (options = {})
          // Calling constructor function of parent class to set extra values
          this.callSuper('initialize', text, options)
          customProperties.forEach((property) => {
            this.set(property, options[property] || '')
            if (property === 'id') {
              this.set(property, options[property] || null)
            }
          })
        },

        // While converting to JSON object, consider custom variables also
        toObject: function () {
          let obj = {}
          customProperties.forEach((property) => {
            obj[property] = this.get(property)
          })
          return fabric.util.object.extend(this.callSuper('toObject'), obj)
        },

        // Actual rendered function: If we want any predefine styling with new variables, we can do it from here
        _render: function (ctx) {
          this.callSuper('_render', ctx)
          // To set textbox border
          if (this.showTextBoxBorder) {
            var w = this.width
            var h = this.height
            var x = -this.width / 2
            var y = -this.height / 2
            ctx.beginPath()
            ctx.moveTo(x, y)
            ctx.lineTo(x + w, y)
            ctx.lineTo(x + w, y + h)
            ctx.lineTo(x, y + h)
            ctx.lineTo(x, y)
            ctx.closePath()
            // ctx.setLineDash([12, 3, 3]);
            ctx.lineWidth = this.textboxBorderWidth
            var stroke = ctx.strokeStyle
            ctx.strokeStyle = this.textboxBorderColor
            ctx.stroke()
            ctx.strokeStyle = stroke
          }
        }
      })
      // While getting data from JSON object, consider custom variables also
      if (fabric.SuperTextbox) {
        fabric.SuperTextbox.fromObject = function (
          object,
          callback,
          forceAsync
        ) {
          return fabric.Object._fromObject(
            'SuperTextbox',
            object,
            callback,
            true,
            customProperties
          )
        }
      }
    },
    addSuperImage () {
      // Initializing new class, extending from built-in Image class
      fabric.SuperImage = fabric.util.createClass(fabric.Image, {
        // Defining type (for future reference)
        type: 'super-image',
        // Constructor function
        initialize: function (element, options) {
          this.callSuper('initialize', element, options)
          options && this.set('jsonData', options.jsonData)
        },
        // While converting to JSON object, consider custom variables also
        toObject: function () {
          return fabric.util.object.extend(this.callSuper('toObject'), {
            jsonData: this.jsonData
          })
        },
        // Actual rendered function: If we want any predefine styling with new variables, we can do it from here
        _render: function (ctx) {
          this.callSuper('_render', ctx)
        }
      })
      // While getting data from JSON object, consider custom variables also
      fabric.SuperImage.fromObject = function (object, callback) {
        fabric.util.loadImage(object.src, function (img) {
          callback && callback(new fabric.SuperImage(img, object))
        })
      }
      fabric.SuperImage.async = true
    },
    addActionListner () {
      this.canvas.on({
        // This listener will get triggered when any object get selected
        'mouse:up': () => {
          this.updateCurrentSlideData()
        }
      })
    },
    updateCurrentSlideData () {
      let tempcanvas = new fabric.Canvas('canvasEditor', {
        preserveObjectStacking: true,
        selection: false,
        selectable: false,
        height: 750,
        width: 1025
      })
      let modifiedcanvas = JSON.parse(JSON.stringify(this.canvas))
      for (let i = 0; i < this.objectIndexArray.length; i++) {
        modifiedcanvas.objects[this.objectIndexArray[i]].src = this.imageUrls[i]
      }
      if (modifiedcanvas.backgroundImage) {
        modifiedcanvas.backgroundImage.src = this.backgroundImageUrl
      }
      let self = this
      tempcanvas.loadFromJSON(JSON.stringify(modifiedcanvas), function () {
        // tempcanvas.renderAll()

      var slideData = {
        svg: {},
        json: {}
      }
      slideData.svg = {
        type: 'svg',
        value: tempcanvas.toSVG()
      }
      slideData.json = {
        type: 'json',
        value: JSON.stringify(modifiedcanvas)
      }
      var reqPayload = {
        slideData: slideData,
        slideId: self.$store.getters.getCurrentSlide.slideId,
        presentationId: self.$store.getters.getCurrentSlide.presentationId,
        sessionManagerId: self.$store.getters.getSessionManagerId,
        runningSlideLastModifiedBy: 'mobile'
      }
      new MQL()
        .setActivity('o.[UpdateCurrentSlideDetails]')
        .setData(reqPayload)
        .fetch()
        .then((rs) => {
          let res = rs.getActivity('UpdateCurrentSlideDetails', true)
          if (rs.isValid('UpdateCurrentSlideDetails')) {
          } else {
            rs.showErrorToast('UpdateCurrentSlideDetails')
          }
        })
      })
    },
    setSlideModificationListener () {
      eventBus.$on('slideModifiedEvent', () => {
        this.INIT()
      })
    }
  },
  mounted () {
    storeDataOperation = new StoreDataOperation(
      this.index,
      this.getSlidePosition
    )
    this.canvas = new fabric.Canvas('canvasEditor', {
      preserveObjectStacking: true,
      selection: false,
      selectable: false,
      height: 750,
      width: 1025
    })
    this.addActionListner()
    this.INIT()
    this.setSlideModificationListener()
  },
  computed: {
    getSlidePosition () {
      return this.slidePosition
    }
  },
  created () {
    this.addCustomClasses()
  },
  beforeDestroy () {
    eventBus.$off('slideModifiedEvent')
  }
}
</script>

<style lang="scss">

.svg-holder { height: 230px; padding: 5px; border-radius: 5px;}
// @import url('../../../../public/superPointPluginAssets/methodDrawViews/scss/template.scss');
// #view {width: 100vw; display: flex; align-items: center; justify-content: center;
//   svg {width: 100% !important;}
// }

// @media (orientation : landscape) {
//   #view {
//     svg {height: 100% !important;
//     }

//   }
// }

  // working code with diff approach
  // .canvas-wrapper {
  //   transform: scale(0.322);
  //   -webkit-transform: scale(0.322);
  // }

  // .view-svg {
  //   width: 100%;
  //   height:100%;

  //   svg {
  //     transform:scale(0.19);
  //   }
  // }
  // .svg-holder{
  //   position:absolute;width:0;height: 0;top: 0;left: 0;
  // }

// .view-svg {
//   width: 100%;
//     height: 100%;
//     transform: scale(0.14);

// }

// below code added in template scss file
// .canvas-wrapper {
//   width:300px;
//   height:225px;
// }
// .canvas-container{
//   width:100% !important;
//   height: 100% !important;
// }
// #canvasEditor{
//   max-width:100% !important;
//   max-height: 100% !important;
// }

// .slide-holder{
//      position:relative;
//      overflow:hidden;
// }

// #SvgTemplate{
//   section{
//     div{

//       div{
//           position:absolute;width:0;height: 0;top: 40px;left: 0px;
//       }
//     }
//   }
// }

// @media screen and (max-width:321px){
//   .view-svg {
//     width: 100%;
//     height: 100%;
//     transform: scale(0.128);

//   }
// }
// @media screen and (min-width:322px) and (max-width:360px){
//   .view-svg {
//     width: 100%;
//     height: 100%;
//     transform: scale(0.14);

//   }
// }
// @media screen and (min-width:361px) {
//   .view-svg {
//     width: 100%;
//     height: 100%;
//     transform: scale(0.16);

//   }
// }
// @media (orientation: landscape) {
//   .view-svg {
//     svg {
//       height: 100% !important;
//       width: 30% !important;
//     }
//   }
// }
</style>
