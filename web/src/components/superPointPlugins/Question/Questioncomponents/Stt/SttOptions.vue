<template>
  <div
    class="col-12"
    v-if="questionExtendedData && questionExtendedData.questionStaticData"
  >
    <div
      class="card-ans-mcq"
      v-for="(option, index) in questionExtendedData.questionLogicalData.questionDetails.optionsList"
      :key="option.optId"
    >
      <div class="row align-items-center">
        <div class="col-auto no-holder">
          <div class="no">
            {{ index + 1 }}
          </div>
        </div>
        <div class="col">
          <div class="sub-text">
            {{ questionExtendedData.questionStaticData.questionDetails['optTextStt_' + option.optId] }}
          </div>
        </div>
        <!-- <div
          class="col-auto"
          v-if="getCorrectAnswerIndex(option, questionExtendedData.questionLogicalData.questionDetails.optionBucketDetails)"
        >
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
        </div> -->
      </div>
      <!-- <div class="options-mcq">
        <div class="options-img-wrapper">
          <img
            src="https://via.placeholder.com/150"
            alt="Sample image"
            class="img-fluid options-img"
            @click="togglelightBox"
          >
          <p class="sub-text">
            {{ questionExtendedData.questionStaticData.questionDetails.questionTextStt }}
          </p>
          <div
            class="check-icon"
            v-if="getCorrectAnswerIndex(option, questionExtendedData.questionLogicalData.questionDetails.optionBucketDetails)"
          >
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
          <a
            href="#"
            class="close"
            @click="lightboxFlag = false"
          >
            <span class="icon-close">&times;</span>
          </a>
          <img
            src="https://via.placeholder.com/150"
            alt="question image"
            class="lightbox-wrapper__media-content-img"
          >
        </div>
      </div>
    </div>
    Ends here -->
    </div>
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
      lightboxFlag: false
    //   questionData: {},
    //   questionExtendedData: {}
    }
  },
  components: {
  },
  computed: {
    getCorrectAnswerIndex () {
      return (option, backetList) => {
        let temp = backetList.find(bucket => bucket.isCorrectBucket)
        return option.optId === temp.optionBucketList[0].optionIdOpt
      }
    }
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
