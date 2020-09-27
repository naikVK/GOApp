<template>
  <div
    class="container-fluid pt-2"
    height="100%"
    width="100%"
  >
    <div v-if="showFlag">
      <bubble-chart
        :datacollection="datacollection"
        :options="options"
        height="250"
        width="380"
      />
    </div>
  </div>
</template>

<script>
// import VueWordCloud from 'vuewordcloud'

import BubbleChart from './BubbleChart'
export default {
  components: {
    // [VueWordCloud.name]: VueWordCloud
    BubbleChart
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
    },
    gameData: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data () {
    return {
      showFlag: false,
      datacollection: {
        datasets: []
        // Data to be represented on x-axis
      },
      colors: [
             'red',
        'blue',
        'orange',
        'lime',
        'yellow',
        '#FF0090',
        'purple',
        'aqua',
        'navy',
        'coral',
        'green',
        'teal',
        'brown',
        'black',
        'violet',
        'indigo',
        'pink',
        'Gray',
        '#98FB98',
        '#29ABB7',
        '#F9E29C'
      ],
      annotation: {
        annotations: [
          {
            type: 'line',
            mode: 'horizontal',
            scaleID: 'y-axis-0',
            value:
              (this.gameData.gameProperties.axisRange.min +
                this.gameData.gameProperties.axisRange.max * 2) /
              2,
            borderColor: 'black',
            borderWidth: 2
          },
          {
            type: 'line',
            mode: 'vertical',
            scaleID: 'x-axis-0',
            value:
              (this.gameData.gameProperties.axisRange.min +
                this.gameData.gameProperties.axisRange.max * 2) /
              2,
            borderColor: 'black',
            borderWidth: 2
          }
        ]
        // drawTime: "afterDraw" // (default)
      },
      options: {
        responsive: true,
        annotation: {},
        tooltips: {
          enabled: false
        },
        scales: {
          yAxes: [
            {
              ticks: {
                //  max: 20,
                //                  min: 10,
                max: this.gameData.gameProperties.axisRange.max,
                min: this.gameData.gameProperties.axisRange.min,
                stepSize: 1
              },
              gridLines: {
                display: true
              },
              scaleLabel: {
                display: true,
                labelString: ''
              }
            }
          ],
          xAxes: [
            {
              ticks: {
                max: this.gameData.gameProperties.axisRange.max,
                min: this.gameData.gameProperties.axisRange.min,
                stepSize: 1
              },
              gridLines: {
                display: true
              },
              scaleLabel: {
                display: true,
                labelString: ''
              }
            }
          ]
        },
        legend: {
          display: true
        },
        maintainAspectRatio: false
      }
    }
  },
  computed: {},
  methods: {
    CalculateData () {
      this.prepareDataforOptionDetails().then(res => {
        if (this.gameData.gameLayout == '4*4') {
          this.options.annotation = this.annotation
        }
        this.prepareData()
        // this.showFlag = true
      })
    },
     checkSameCoordinate (answer) {
      return new Promise(resolve => {
      // console.log("before szxs", answer);
      // console.log(answer)
        let dumy = {}
      let temp = { ...answer }
        for (let key in answer) {
          for (let key2 in temp) {
            if (
              key !== key2 &&
              answer[key].horizontal === temp[key2].horizontal &&
              answer[key].vertical === temp[key2].vertical
            ) {
              // alert('called')
              let count = 0
              for (let keys in dumy) {
                if (answer[key].horizontal === dumy[keys].horizontal &&
                  answer[key].vertical === dumy[keys].vertical) {
                  count = count + 1
                }
              }
              if (count > 5) {
                answer[key].bubblesize = -(2 + 1 * count)
              } else {
              answer[key].bubblesize = -(2 + 2 * count)
              }
              delete temp[key]
            }
          }
          dumy[key] = answer[key]
        }
        // console.log("anserrr", answer)
      resolve(answer)
      })
    },
    prepareData () {
      var ans = this.statsData

      // let answer = {};
      this.prepareDataOfSubmitedAnswer(ans).then(response => {
         this.checkSameCoordinate(response).then(answer => {
        this.gameData.gameProperties.gameQuestion.optionDetails.optionsList.forEach(
          (element, index) => {
            if (answer) {
            let bubblesize = 0
            if (answer[element.optId].bubblesize) {
             bubblesize = answer[element.optId].bubblesize
            }
            let preparedData = {
              label: element.optionText,
              backgroundColor: this.colors[index % this.colors.length],
              pointBackgroundColor: 'white',
              borderWidth: 1,
              pointBorderColor: '#249EBF',
              // Data to be represented on y-axis
              data: [
                {
                  y: answer[element.optId].vertical,
                  x: answer[element.optId].horizontal,
                  r: 14 + bubblesize
                }
              ]
            }
            this.datacollection.datasets.push(preparedData)
            }
          })
           this.datacollection.datasets.sort(function (a, b) {
            return parseFloat(a.data[0].r) - parseFloat(b.data[0].r)
          })
         })
        this.showFlag = true
      })
    },

    prepareDataOfSubmitedAnswer (ans) {
      return new Promise(resolve => {
        let updatedAnswer = {}
        for (let key in ans) {
          let slite = key.split('_')[0]
          let slite1 = key.split('_')[1]
          if (slite !== 'totalResponses') {
            if (slite1 == 'horizontal') {
              let obj = updatedAnswer[slite]
              if (!obj) {
                obj = {}
              }
              obj['horizontal'] = ans[key] / ans['totalResponses']
              updatedAnswer[slite] = obj
            } else {
              let obj = updatedAnswer[slite]
              if (!obj) {
                obj = {}
              }
              obj['vertical'] = ans[key] / ans['totalResponses']
              updatedAnswer[slite] = obj
            }
          }
        }

        resolve(updatedAnswer)
      })
    },
    prepareDataforOptionDetails () {
      return new Promise(resolve => {
        this.gameData.gameProperties.gameDimensions.forEach(
          (element, index) => {
            if (this.gameData.gameLayout == '2*2') {
              if (element.axisDirection == 'horizontal') {
                this.options.scales.yAxes[0].scaleLabel.labelString =
                  element.axisLabel
              } else {
                this.options.scales.xAxes[0].scaleLabel.labelString =
                  element.axisLabel
              }
            } else {
              switch (element.axisDirection) {
                case 'bottom':
                  this.options.scales.xAxes[0].scaleLabel.labelString =
                    element.axisLabel
                  this.options.scales.xAxes[0].ticks.max =
                    this.gameData.gameProperties.axisRange.max * 2
                  this.options.scales.xAxes[0].ticks.min = this.gameData.gameProperties.axisRange.min
                  this.options.scales.xAxes[0].ticks.display = false
                  break
                case 'left':
                  this.options.scales.yAxes[0].scaleLabel.labelString =
                    element.axisLabel
                  this.options.scales.yAxes[0].ticks.max =
                    this.gameData.gameProperties.axisRange.max * 2
                  this.options.scales.yAxes[0].ticks.min = this.gameData.gameProperties.axisRange.min
                  this.options.scales.yAxes[0].ticks.display = false
                  break
                case 'top':
                  let temp = {
                    scaleLabel: {}
                  }
                  temp['position'] = element.axisDirection
                  temp.scaleLabel['labelString'] = element.axisLabel
                  temp.scaleLabel['display'] = true
                  this.options.scales.xAxes.push(temp)
                  break

                case 'right':
                  var Temp = {
                    scaleLabel: {},
                    ticks: {}
                  }
                  Temp['position'] = element.axisDirection
                  Temp.scaleLabel['labelString'] = element.axisLabel
                  Temp.scaleLabel['display'] = true
                  Temp.ticks[
                    'max'
                  ] = this.gameData.gameProperties.axisRange.max
                  Temp.ticks[
                    'min'
                  ] = this.gameData.gameProperties.axisRange.min
                  Temp.ticks['display'] = false
                  this.options.scales.yAxes.push(Temp)
                  break
              }
            }
            if (
              this.gameData.gameProperties.gameDimensions.length - 1 ==
              index
            ) {
              resolve('true')
            }
          }
        )

        // resolve("hh");
      })
    }
  },
  mounted () {
    this.CalculateData()
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
