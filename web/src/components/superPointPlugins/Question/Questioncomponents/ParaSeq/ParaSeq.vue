<template>
  <div v-if="questionExtendedData && questionExtendedData.questionStaticData">
    <p>
      {{ questionExtendedData.questionStaticData.questionDetails.questionTextParaSeq }}
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
    //   questionData: {},
    //   questionExtendedData: {}
    }
  },
  components: {
  },
  methods: {
  },
  mounted () {
  }

}
</script>

<style lang="scss">
</style>
