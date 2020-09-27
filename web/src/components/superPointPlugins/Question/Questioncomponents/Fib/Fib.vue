<template>
  <div v-if="questionExtendedData && questionExtendedData.questionStaticData">
    <p>
      <!-- {{ questionExtendedData.questionStaticData.questionDetails.questionTextFib }}
       -->
      {{ questionText }}
    </p>
  </div>
</template>

<script>
export default {
  props: {

    questionData: {
      type: Object,
      default: () => {
        return {}
      }
    },

    questionExtendedData: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data () {
    return {
      questionText: ''
    //   questionData: {},
    //   questionExtendedData: {}
    }
  },
  components: {

  },
  methods: {

    extractHash (arr) {
      var finalarr = []
      for (var i = 0; i < arr.length; i++) {
        if (arr[i].match(/(^|\s)__[a-z0-9]+/i)) {
          finalarr.push(arr[i].split('__')[1].split('.')[0])
        }
      }
      return finalarr
    },
    extractOptions (arr) {
      var finalarr = []
      for (var i = 0; i < arr.length; i++) {
        if (arr[i].match(/(^|\s)__[a-z0-9]+/i)) {
          finalarr.push(arr[i].split('__')[1].split('.')[1])
        }
      }
      return finalarr
    },
    prepareQuestion () {
      this.questionText = this.questionExtendedData.questionStaticData.questionDetails['questionTextFib']

      // questionText = questionText.replace('#city.2', '____')
      // var lenthis = this.questionExtendedData.questionLogicalData.questionDetails.optionBucketDetails.length
      var hashwords = this.extractHash(this.questionText.split(' '))
      var optionIds = this.extractOptions(this.questionText.split(' '))

      for (var key in this.questionExtendedData.questionStaticData.questionDetails) {
      // if (this.questionExtendedData.questionStaticData.questionDetails[key] === text) {
        for (var i = 1; i <= hashwords.length; i++) {
          if (this.questionExtendedData.questionStaticData.questionDetails[key] === hashwords[i - 1]) {
            var re = new RegExp('__' + this.questionExtendedData.questionStaticData.questionDetails[key] + '.' + optionIds[i - 1])
            this.questionText = this.questionText.replace(re, '__')
          }
          // }

          // if (key.includes('optionBucketName')) {
          //   let temp = key.split('_')
          //   this.questionName = questionText.replace(/#[a-zA-z]*/g, this.questionExtendedData.questionStaticData.questionDetails['optTextTf_' + temp[1]])
          // }
        }
      }
    }
  },
  mounted () {
    this.prepareQuestion()
  }

}
</script>

<style lang="scss">
</style>
