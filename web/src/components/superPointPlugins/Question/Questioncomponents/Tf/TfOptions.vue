<template>
  <div v-if="questionExtendedData && questionExtendedData.questionStaticData">
    <!-- <p>
      Coming soon
    </p> -->
    <div
      class="card-ans-mcq tf-options"
    >
      <div class="tf-img-wrapper">
        <img
          src="https://via.placeholder.com/150"
          alt="sample image"
          class="img-fluid options-img"
          @click="togglelightBox"
        >
        <div class="sub-text">
          True
        </div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="#77bbb2"
          viewBox="0 0 24 24"
          width="24px"
          height="24px"
        >
          <path
            d="M12,2C6.477,2,2,6.477,2,12c0,5.523,4.477,10,10,10s10-4.477,10-10C22,6.477,17.523,2,12,2z M17.707,9.707l-7,7 C10.512,16.902,10.256,17,10,17s-0.512-0.098-0.707-0.293l-3-3c-0.391-0.391-0.391-1.023,0-1.414s1.023-0.391,1.414,0L10,14.586 l6.293-6.293c0.391-0.391,1.023-0.391,1.414,0S18.098,9.316,17.707,9.707z"
          />
        </svg>
      </div>
    </div>
    <div
      class="lightbox-wrapper"
    >
      <div
        class="lightbox-wrapper__media"
        :class="[lightboxFlag === true ? 'active' : '']"
      >
        <div class="lightbox-wrapper__media-content">
          <button
            class="close"
            @click="lightboxFlag = false"
          >
            <span class="icon-close">&times;</span>
          </button>
          <img
            src="https://via.placeholder.com/150"
            alt="question image"
            class="lightbox-wrapper__media-content-img"
          >
        </div>
      </div>
    </div>
  </div>
  <!-- </div>
  </div> -->
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
      questionName: '',
      lightboxFlag: false
      //   questionData: {},
      //   questionExtendedData: {}

    }
  },
  components: {
  },
  methods: {
    togglelightBox () {
      this.lightboxFlag = !this.lightboxFlag
    }
  },
  mounted () {
  }

}
</script>

<style lang="scss">
</style>
