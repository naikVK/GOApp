<template>
  <div
    class="container-fluid pt-2 word-cloud"
    height="550px"
    width="1330px"
  >
    <!-- font-family="Fredoka One" -->
    <vue-word-cloud
      width="170px"
      height="334px"
      :words="list"
      :spacing="spacing"
      :animation-easing="animationEasing"
      :animation-duration="animationDuration"
      :animation-overlap="animationOverlap"
    >
      <template
        slot-scope="{text, weight}"
      >
        <div
          style="cursor: pointer;"
          :style="{ color: colorList(weight,max,values)}"
        >
          {{ text }}
        </div>
      </template>
    </vue-word-cloud>
  </div>
</template>

<script>

import VueWordCloud from 'vuewordcloud'

export default {
  components: {
    [VueWordCloud.name]: VueWordCloud
  },
  name: 'WCStats',
  props: {
    statsData: {
      type: Object,
      // required: true,
      required: false,
      default: () => {
        return {}
      }
    }
  },
  data () {
    return {
      spacing: 0.5,
      animationDurationValueIndex: 0,
      animationDurationValues: [0, 1000, 5000, 10000],
      animationEasingValueIndex: 4,
      animationEasingValues: [
        'ease',
        'linear',
        'ease-in',
        'ease-out',
        'ease-in-out',
        'cubic-bezier(0.1,0.7,1.0,0.1)'
      ],
      animationOverlapValueIndex: 1,
      animationOverlapValues: [0, 1 / 5, 1 / 2, 1],
      animationItemIndex: 2,
      animationItems: [
        {
          text: 'bounce',
          value: ['bounceIn', 'bounceOut']
        },
        {
          text: 'fade',
          value: ['fadeIn', 'fadeOut']
        },
        {
          text: 'flipX',
          value: ['flipInX', 'flipOutX']
        },
        {
          text: 'flipY',
          value: ['flipInY', 'flipOutY']
        },
        {
          text: 'rotate',
          value: ['rotateIn', 'rotateOut']
        },
        {
          text: 'zoom',
          value: ['zoomIn', 'zoomOut']
        }
      ],
      list: [],
      values: {},
      max: 0,
      sum: 0,
      weight: 0,
      defaultWeight: 10,
      weightRatio: 0
    }
  },
  computed: {
    animationDuration: function () {
      return this.animationDurationValues[this.animationDurationValueIndex]
    },
    animationEasing: function () {
      return this.animationEasingValues[this.animationEasingValueIndex]
    },
    animationOverlap: function () {
      return this.animationOverlapValues[this.animationOverlapValueIndex]
    },
    animation: function () {
      return this.animationItems[this.animationItemIndex]
    },
    enterAnimation: function () {
      return ['animated', this.animationItems[this.animationItemIndex].value[0]].join(' ')
    },
    leaveAnimation: function () {
      return ['animated', this.animationItems[this.animationItemIndex].value[1]].join(' ')
    }
  },
  methods: {
    // To get dark random color
    random_rgba () {
      // Variation 1
      // var o = Math.round; var r = Math.random; var s = 255
      // return 'rgba(' + o(r() * s) + ',' + o(r() * s) + ',' + o(r() * s) + ',' + r().toFixed(1) + ')'

      // Variation 2
      // var letters = '0123456789'.split('')
      // var color = '#'
      // for (var i = 0; i < 6; i++) {
      //   color += letters[Math.round(Math.random() * 10)]
      // }
      // return color

      // Variation 3
      var lum = -0.25
      var hex = String('#' + Math.random().toString(16).slice(2, 8).toUpperCase()).replace(/[^0-9a-f]/gi, '')
      if (hex.length < 6) {
        hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2]
      }
      var rgb = '#'
      var c; var i
      for (i = 0; i < 3; i++) {
        c = parseInt(hex.substr(i * 2, 2), 16)
        c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16)
        rgb += ('00' + c).substr(c.length)
      }
      return rgb
    },
    sortList (list) {
      return new Promise((resolve, reject) => {
        list.sort(function (a, b) {
          if (a[1] === b[1]) {
            return 0
          } else {
            return a[1] < b[1] ? -1 : 1
          }
        })
        resolve(true)
      })
    },
    colorList (weight, max, values) {
      // return weight === max
      //   ? 'Maroon'
      //   : weight > 5 && weight <= 10
      //     ? 'Lemon'
      //     : weight > 10 && weight <= 15
      //       ? 'Red'
      //       : weight > 15 && weight <= 20
      //         ? 'Ultramarine'
      //         : weight > 20 && weight <= 25
      //           ? 'blue'
      //           : weight > 25 && weight <= 30
      //             ? 'blue'
      //             : weight > 30 && weight <= 35
      //               ? 'grey'
      //               : weight > 35 && weight <= 45
      //                 ? 'orange'
      //                 : weight > 45 && weight <= 55
      //                   ? 'pink'
      //                   : 'indigo'

      return weight === max
        ? 'Maroon'
        : this.random_rgba()
    },
    weightFactor () {
      return new Promise((resolve, reject) => {
        let self = this
        // Weight is being Taken out from the response list
        this.values = this.list.map(function (elt) {
          self.sum = self.sum + elt[1]
          return elt[1]
        })
        this.weight = (100 / this.sum)

        this.max = Math.max.apply(null, this.values)
        resolve(true)
      })
    },
    // Creating List in 2d Array from the student response object
    createList () {
      return new Promise((resolve, reject) => {
        for (const key in this.statsData) {
          if (this.statsData.hasOwnProperty(key) && key !== 'totalResponses') {
            const element = this.statsData[key]
            let temp = []
            temp.push(key)
            temp.push(element)
            this.list.push(temp)
          }
        }
        resolve(true)
      })
    }
  },
  mounted () {
    this.createList().then(() => {
      this.weightRatio = (this.defaultWeight / this.list.length)

      this.sortList(this.list).then(() => {
        this.weightFactor().then(() => {
          this.list.forEach(element => {
            // let weight = Math.round(Math.log2(element[1]) * 5, 2)
            // if (weight === 0) {
            //   weight = 1
            // }

            let weight = this.defaultWeight + (this.weight * element[1])
            // this.defaultWeight = this.defaultWeight - this.weightRatio
            // if
            element[1] = weight
          })
        })
      })
    })
  }

}
</script>
