<template>
  <div
    class="question-module"
    v-if="questionObject && questionObject.questionLogicalData"
  >
    <div class="question-options">
      <!-- <div @click="selectAnswer(option,index)" class="row option" v-for="(option, index) in questionObject.optionsList" :key="option.optionId">
        <div class="col-2 option-value" v-html="'&#'+ (65 + index)">
          	<!-- &# + {{65 + index}} A.
        </div>
        <div class="col-7">
          <b-progress
            :value="12"
            height="30px"
            class="bg-teal"
          />
        </div>
        <div class="col-2">
          12%
        </div>
      </div> -->
      <div class="question-block">
        <div class="question-text block-ellipsis-2">
          {{ questionProperties.templateText }}
          <!-- What is the capital of India? -->
          <!-- {{ questionObject.questionStaticData.questionDetails['questionText' + questionProperties.questionType] }} -->
        </div>

        <!-- answer is shown in the form of a check mark for true false type question and mcq question -->
        <div class="btn-option">
          <button
            @click="showOptions()"
            class="btn btn-ghost btn-blue"
            v-if="QUESTIONTYPE.MCQ === questionProperties.questionType || QUESTIONTYPE.TF === questionProperties.questionType"
          >
            {{ $t('TeacherPresentationModeMCQ.show_options') }}
          </button>
          <button
            @click="showAnswer()"
            class="btn btn-ghost btn-blue"
            v-else
          >
            {{ $t('TeacherPresentationModeMCQ.show_answer') }}
          </button>
        </div>
      </div>
      <!-- Mcq code start -->
      <div
        v-if="QUESTIONTYPE.MCQ === questionProperties.questionType"
        class="vertical-progress"
      >
        <div
          class="option"
          v-for="(option,index) in questionObject.questionLogicalData.questionDetails.optionsList"
          :key="index"
        >
          <div class="ans-percent">
            <div class="percent-val">
              <!-- 43% -->
              <!-- {{ calculatePercentage(option.optId) + '%' }} -->
              {{ statsData[option.optId] || 0 }}
            </div>
            <div v-if="getCorrectAnswerIndex(option, questionObject.questionLogicalData.questionDetails.optionBucketDetails)">
              <i class="mdi mdi-check-circle" />
            </div>
          </div>
          <div
            class="progress-holder"
            @click="showRelatedLearners(option.optId, 'dontknow')"
          >
            <!-- :value="calculatePercentage(option.optId)" -->
            <b-progress
              height="100px"
              :class="'progress-vertical bg-' + barClassList[(index % barClassList.length)]"
            >
              <b-progress-bar
                :value="49"
                :style="{height : calculatePercentage(option.optId)+'%',}"
              >
              <!-- :style="{height : 49+'%',}" -->
                <!-- Progress: <strong>{{ value.toFixed(2) }} / {{ max }}</strong> -->
              </b-progress-bar>
              <!-- <b-progress
              :value="calculatePercentage(option.optId)"
              height="100px"
              :class="'progress-vertical bg-' + barClassList[(index % barClassList.length)]"
            /> -->
            </b-progress>
          </div>
          <div class="option-value">
            <!-- A. -->
            {{ String.fromCharCode(65 + index) }}
          </div>
        </div>
      </div>
      <!-- Mcq code end -->
      <!-- <div class="option">
        <div class="option-value">
          B.
        </div>
        <div class="progress-holder">
          <b-progress
            :value="43"
            height="24px"
            class="bg-pink"
          />
        </div>
        <div class="ans-percent">
          <div class="percent-val">
            43%
          </div>
          <div>
            <i class="mdi mdi-check-circle" />
          </div>
        </div>
      </div> -->
      <!-- <div class=" option">
        <div class="option-value">
          C.
        </div>
        <div class="progress-holder">
          <b-progress
            :value="32"
            height="24px"
            class="bg-yellow"
          />
        </div>
        <div class="ans-percent">
          <div class="percent-val">
            43%
          </div>
          <div>
            <i class="mdi mdi-check-circle" />
          </div>
        </div>
      </div> -->
      <!-- <div class=" option">
        <div class="option-value">
          D.
        </div>
        <div class="progress-holder">
          <b-progress
            :value="32"
            height="24px"
            class="bg-teal"
          />
        </div>
        <div class="ans-percent">
          <div class="percent-val">
            43%
          </div>
          <div>
            <i class="mdi mdi-check-circle" />
          </div>
        </div>
      </div> -->
      <div>
        <!-- <div class="option">
        <div class="option-value">
          Pending responses
        </div>
        <div class="progress-holder">
          <b-progress
            :value="calculatePendingReponsesPercentage()"
            height="24px"
            class="bg-pink"
          />
        </div>
        <div class="ans-percent">
          <div class="percent-val">

          </div>
        </div>
      </div> -->
        <!-- <div class="note margin-custom-top">
          <span class="pending-count">{{ pendingResponses }}</span> Students left to respond out of {{ connectedUsersCount }}
          ( {{ totalSubmittedResponses }} / {{ connectedUsersCount }} )
        </div> -->
        <!-- <div
          class="option"
        >
          <div class="option-value-text">
            Pending response
          </div>
          <div class="progress-holder-alt">
            <b-progress
              :value="calculatePendingReponsesPercentage()"
              height="24px"
              class="bg-teal"
            />
          </div>
          <div class="ans-percent">
            <div class="percent-val">
              {{ pendingResponses}}
            </div>
          </div>
        </div> -->
        <div
          class="option"
          @click="showRelatedLearners('correctAnswer', 'correct')"
        >
          <div
            class="option-alt"
          >
            <div class="option-value-text">
              {{ $t('TeacherPresentationModeMCQ.correct') }} <i class="mdi mdi-chevron-right" />
            </div>
            <div class="ans-percent">
              <div class="percent-val">
                <!-- 43 -->
                {{ statsData["correctAnswer"] || 0 }}
              </div>
            </div>
          </div>
          <div class="progress-holder-alt">
            <b-progress
              :value="getPercentage('correctAnswer')"
              height="5px"
              class="bg-teal"
            />
          </div>
        </div>
        <div
          class="option"
          @click="showRelatedLearners('inCorrectAnswer', 'incorrect')"
        >
          <div class="option-alt">
            <div class="option-value-text">
              {{ $t('TeacherPresentationModeMCQ.incorrect') }} <i class="mdi mdi-chevron-right" />
            </div>
            <div class="ans-percent">
              <div class="percent-val">
                {{ statsData["inCorrectAnswer"] || 0 }}
                <!-- 32 -->
              </div>
            </div>
          </div>
          <div class="progress-holder-alt">
            <b-progress
              :value="getPercentage('inCorrectAnswer')"
              height="5px"
              class="bg-yellow"
            />
          </div>
        </div>
        <div
          class="option"
          @click="showRelatedLearners('notKnown', 'dontknow')"
        >
          <div class="option-alt">
            <div class="option-value-text">
              {{ $t('TeacherPresentationModeMCQ.dont_know') }} <i class="mdi mdi-chevron-right" />
            </div>
            <div class="ans-percent">
              <div class="percent-val">
                {{ statsData["notKnown"] || 0 }}
                <!-- 32 -->
              </div>
            </div>
          </div>
          <div class="progress-holder-alt">
            <b-progress
              :value="getPercentage('notKnown')"
              height="5px"
              class="bg-blue"
            />
          </div>
        </div>
      </div>
    </div>
    <!-- <div class="row">
      <div class="col-12">
        <button
          @click="publishAnswer"
          class="btn btn-block btn-blue"
        >
          Show results in class
        </button>
      </div>
    </div> -->
  </div>
</template>

<script>
// import '../../public/assets/scss/teacherMobileApp.scss'
import { QUESTION_TYPES } from '../utils/Constants'
export default {
  props: {
    questionProperties: {
      type: Object,
      required: true,
      default: ''
    },
    statsData: {
      type: Object,
      required: true,
      default: () => {
        return {}
      }
    },
    questionObject: {
      type: Object,
      default: () => {
        return {}
      }
    },
    slideId: {
      type: String,
      required: true,
      default: ''
    },
    connectedUsersCount: {
      type: Number,
      required: true,
      default: 0
    },
    totalSubmittedResponses: {
      type: Number,
      required: false,
      default: 0
    }
  },
  computed: {
    getCorrectAnswerIndex () {
      return (option, backetList) => {
        let temp = backetList.find(bucket => bucket.isCorrectBucket)
        return option.optId === temp.optionBucketList[0].optionIdOpt
      }
    }
  },
  data () {
    return {
      selectAnswerIndex: '',
      barClassList: ['indigo', 'pink', 'yellow', 'teal'],
      correctAnswerColor: '',
      correctAnswerIndex: -1,
      pendingResponses: 0,
      QUESTIONTYPE: QUESTION_TYPES
    }
  },
  methods: {
    showRelatedLearners (textToSend, dynamicClass) {
      this.$emit('showRelatedLearners', { 'textToSend': textToSend, 'dynamicClass': dynamicClass })
    },
    showOptions () {
      this.$emit('showOptions')
    },
    showAnswer () {
      this.$emit('showOptions')
    },
    selectAnswer (data, index) {
      this.selectAnswerIndex = index
    },
    publishAnswer () {
      this.$store.dispatch('setStatsStatus', { slideId: this.slideId, showStats: true, sessionManagerId: this.$store.getters.sessionManagerId })
    },
    calculateTotal () {
      let total = 0
      for (const key in this.statsData) {
        if (this.statsData.hasOwnProperty(key)) {
          if (key !== 'correctAnswer' && key !== 'inCorrectAnswer' && key !== 'notKnown') {
            total += this.statsData[key]
          }
        }
      }
      return total
    },
    calculatePercentage (optId) {
      return Math.ceil((Number(this.statsData[optId]) / Number(this.calculateTotal())) * 100) || 0
    },
    calculatePendingReponsesPercentage () {
      let correctAnswer = Number(this.statsData['correctAnswer']) || 0
      let inCorrectAnswer = Number(this.statsData['inCorrectAnswer']) || 0
      let notKnown = Number(this.statsData['notKnown']) || 0
      this.totalSubmittedResponses = correctAnswer + inCorrectAnswer + notKnown
      this.pendingResponses = this.connectedUsers - this.totalSubmittedResponses
      return Math.ceil((Number(this.pendingResponses) / Number(this.connectedUsers)) * 100) || 0
    },
    getPercentage (data) {
      let correctAnswer = Number(this.statsData['correctAnswer']) || 0
      let inCorrectAnswer = Number(this.statsData['inCorrectAnswer']) || 0
      let notKnown = Number(this.statsData['notKnown']) || 0
      let total = correctAnswer + inCorrectAnswer + notKnown
      let temp = Number(this.statsData[data]) || 0
      return Math.ceil((temp / total) * 100) || 0
    },
    INIT () {
      if (this.questionObject && this.questionObject.questionLogicalData) {
        let temp = this.questionObject.questionLogicalData.questionDetails.optionBucketDetails.find(bucket => bucket.isCorrectBucket)
        this.correctAnswerIndex = this.questionObject.questionLogicalData.questionDetails.optionsList.findIndex(option => option.optId === temp.optionBucketList[0].optionIdOpt)
      // this.correctAnswerColor = this.barClassList[(this.correctAnswerIndex % this.barClassList.length)]
      }
    }
  },
  mounted () {
    this.INIT()
  }
}
</script>
