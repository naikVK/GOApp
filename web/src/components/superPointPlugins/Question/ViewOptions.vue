<template>
  <div v-if="questionExtendedData && questionExtendedData.questionStaticData">
    <component
      :is="componentLoader"
      :question-data="questionData"
      :question-extended-data="questionExtendedData"
    />
  </div>
</template>

<script>
// import storeDataOperation from '@/../public/assets/tempFile/sampleSlides'
import StoreDataOperation from '@/plugins/StoreDataOperation.js'
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
  data () {
    return {
      questionData: {},
      questionExtendedData: {},
      questionProperties: {},
      currentComponent: ''
    }
  },
  components: {
  },
  computed: {
    componentLoader () {
      return () => import(`@/components/superPointPlugins/Question/Questioncomponents/${this.questionProperties.questionType}/${this.currentComponent}.vue`)
    }
  },
  methods: {
    INIT () {
      this.questionData = storeDataOperation.getCurrentSlideData()
      this.questionExtendedData = storeDataOperation.getCurrentSlideExtendedData()
      this.questionProperties = storeDataOperation.getCurrentQuestionProperties()
      this.currentComponent = this.questionProperties.questionType + 'Options'
    }
  },
  mounted () {
    // storeDataOperation = new StoreDataOperation()
    storeDataOperation = new StoreDataOperation(this.index, this.slidePosition)
    this.INIT()
  }
}
</script>

<style>

</style>
