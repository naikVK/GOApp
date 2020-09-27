<template>
  <div
    v-if="questionExtendedData && questionExtendedData.questionStaticData"
    class="col-12"
  >
    <p>
      {{ $t('ClassificationOptions.coming_soon') }}
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
