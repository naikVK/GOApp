<template>
  <div v-if="gameData && currentComponent">
    <p
      v-if="gameProperties.gameType!='Rating'"
      class="templateText"
    >
      {{ gameData.isSentenceAllowed ? templateText + ' - Brief description' : templateText + ' - In one word' }}
    </p>
    <p
      v-else
      class="templateText"
    >
      {{ templateText }}-{{ grideType }}
    </p>

    <component
      :is="componentLoader"
      :game-data="gameData"
    />
    <!-- <p class="templateText">
      {{ templateText }}
    </p>-->
    <!-- {{ questionExtendedData.questionStaticData.questiondetails.questiontextmcq }} -->
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
      gameData: {},
      gameProperties: {},
      currentComponent: '',
      templateText: '',
      grideType: '',
      isSentenceAllowed: false
    }
  },
  components: {},
  computed: {
    componentLoader () {
      return () =>
        import(
          `@/components/superPointPlugins/Game/Gamecomponents/${this.currentComponent}.vue`
        )
      // return () => import(`@/components/WC.vue`)
    }
  },
  methods: {
    INIT () {
      this.gameData = storeDataOperation.getCurrentSlideData()
      this.gameProperties = storeDataOperation.getCurrentPluginProperties()
      this.currentComponent = this.gameProperties.gameType
      this.templateText = this.gameProperties.templateText
      this.grideType = this.gameData.gameLayout
    }
  },
  mounted () {
    storeDataOperation = new StoreDataOperation(this.index, this.slidePosition)
    this.INIT()
  }
}
</script>

<style lang="scss">
</style>
