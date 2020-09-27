<template>
  <div v-if="gameData">
    <p class="question-text">
      {{ gameData.gameProperties.gameQuestion.questionDetails.questionText }}
    </p>
  </div>
</template>

<script>
export default {
  props: {
    // eslint-disable-next-line vue/require-default-prop
    gameData: {
      type: Object,
      defualt: () => {
        return {}
      }
    }
  },
  data () {
    return {}
  },
  methods: {
    preparePath (path) {
      // TODO : add base path of server
      let basePath = ''
      return basePath + path
    }
    // INIT () {
    // }
  },
  mounted () {
    // this.INIT()
  }
}
</script>

<style lang="scss" scoped></style>
