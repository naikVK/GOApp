<template>
  <div>
    <TopMenu :title="$t('ClassSummary.class_summary')" />
    <!-- <span> {{ $store.getters.getSummary.name }}</span> -->
    <div class="presentation-name">
      <!-- <span
        v-b-tooltip.hover
        :title="'This presentation is about '+ presentationData.description"
        class="ppt-name"
      >{{ presentationData.name || 'Topic Name' }}</span> -->
      <!-- <img src="../../public/assets/images/icon-class.svg"> -->
      <div> <i class="mdi mdi-theater" />   </div>
      <div>
        <div
          class="ppt-name"
        >
          {{ presentationData.name || $t('ClassSummary.topic_name') }}
        </div>

        <!-- <div
        class="topic-name"
        v-b-tooltip.hover.bottomleft
        :title="'Topic name'"
      >
        {{ presentationData.paperDetails.name }}
      </div> -->
        <div
          class="topic-name"
        >
          {{ presentationData.paperDetails.name }}
        </div>
      </div>
    </div>
    <div class="ViewPresentation wrap-alt bg-main">
      <div class="emoji-comment">
        <img
          v-if="emojiSuggest==='cry'"
          src="../../public/assets/images/emoji/cry.png"
          class="emoji-img"
        >
        <img
          v-if="emojiSuggest==='sad'"
          src="../../public/assets/images/emoji/sad.png"
          class="emoji-img"
        >
        <img
          v-if="emojiSuggest==='sweat'"
          src="../../public/assets/images/emoji/sweat.png"
          class="emoji-img"
        >
        <img
          v-if="emojiSuggest==='joy'"
          src="../../public/assets/images/emoji/joy.png"
          class="emoji-img"
        >
        <img
          v-if="emojiSuggest==='love'"
          src="../../public/assets/images/emoji/love.png"
          class="emoji-img"
        >
        <div class="prfmc-holder">
          <div class="details">
            <div class="title">
              {{ $t('ClassSummary.class_performance_is_0', {0:Math.round((summaryData.avgCorrectness * 100) / 100)+'%'}) }}
              <!-- {{ summaryData.sysSuggestion }} -->
              <!-- Class performed well! -->
              <!-- Students have not understood the topic
                  Students can perform well
                  Students need more clarity on this topic
                  Students performed well
              Students performed exceptionally well!-->
            </div>
          </div>
          <div class="prfmc-msg">
            {{ summaryData.sysSuggestion }}
          </div>
        </div>
      </div>
      <div class="card-q">
        <div
          class="row card-default"
          @click="$router.push('AllQuestions')"
        >
          <div class="col-auto">
            <i class="mdi mdi-forum" />
          </div>
          <div
            class="title q-count col"
          >
            <!-- {{ $t('ClassSummary.0_questions', {'0':summaryData.totalQuestionsTaken}) }} -->
            <span
              class="subtext"
              v-if="summaryData.totalQuestionsTaken > 1"
            >
              {{ summaryData.totalQuestionsTaken }} {{ $t('ClassSummary.questions') }}
            </span>
            <span
              class="subtext"
              v-else-if="summaryData.totalQuestionsTaken === 1"
            >
              {{ summaryData.totalQuestionsTaken }} {{ $t('ClassSummary.question') }}
            </span>
            <span
              class="subtext"
              v-else-if="summaryData.totalQuestionsTaken === 0"
            >
              {{ $t('ClassSummary.0_questions', {'0':summaryData.totalQuestionsTaken}) }}
            </span>
          </div>
          <!-- <div class="q-content title" /> -->

          <div class="col-auto">
            <i class="mdi mdi-chevron-right" />
          </div>
        </div>
        <div
          class="row card-default"
          @click="$router.push('Students')"
        >
          <div class="col-auto">
            <i class="mdi mdi-account-group" />
          </div>
          <div
            class="title q-count col"
          >
            <!-- {{ $t('ClassSummary.0_total_students', {'0':summaryData.totalLearners}) }} -->
            <span
              class="subtext"
              v-if="summaryData.totalLearners > 1"
            >
              {{ summaryData.totalLearners }} {{ $t('ClassSummary.students') }}
            </span>
            <span
              class="subtext"
              v-else-if="summaryData.totalLearners === 1"
            >
              {{ summaryData.totalLearners }} {{ $t('ClassSummary.student') }}
            </span>
            <span
              class="subtext"
              v-else-if="summaryData.totalLearners === 0"
            >
              {{ summaryData.totalLearners }} {{ $t('ClassSummary.students') }}
            </span>
          </div>

          <div class="col-auto">
            <i class="mdi mdi-chevron-right" />
          </div>
        </div>
        <div
          class="row card-default"
          @click="$router.push('GameSummary')"
        >
          <div class="col-auto">
            <i class="mdi mdi-gamepad-variant" />
          </div>
          <div
            class="title q-count col"
          >
            <!-- {{ summaryData.totalGames }} Games -->
            <span
              class="subtext"
            >
              {{ summaryData.totalGamesTaken }} {{ summaryData.totalGamesTaken > 1 ? $t('ClassSummary.games') : $t('ClassSummary.game') }}
            </span>
            <!-- <span
              class="subtext"
              v-else-if="summaryData.totalGamesTaken === 1"
            >
              {{ summaryData.totalGamesTaken }} Game
            </span> -->
            <!-- <span
              class="subtext"
              v-else-if="summaryData.totalGamesTaken === 0"
            >
              {{ summaryData.totalGamesTaken }} Game
            </span> -->
          </div>

          <div class="col-auto">
            <i class="mdi mdi-chevron-right" />
          </div>
        </div>
        <div
          class="row card-default"
          @click="$router.push('SlideSummary')"
        >
          <div class="col-auto">
            <i class="mdi mdi-presentation-play" />
          </div>
          <div
            class="title q-count col"
          >
            <!-- {{ summaryData.totalSlidesTaken }} Slides -->
            <span
              class="subtext"
              v-if="summaryData.totalSlidesTaken > 1"
            >
              {{ summaryData.totalSlidesTaken }} {{ summaryData.totalSlidesTaken > 1 ? $t('ClassSummary.slides'): $t('ClassSummary.slide') }}
            </span>
            <!-- <span
              class="subtext"
              v-else-if="summaryData.totalSlidesTaken === 1"
            >
              {{ summaryData.totalSlidesTaken }} Slide
            </span> -->
            <!-- <span
              class="subtext"
              v-else-if="summaryData.totalSlidesTaken === 0"
            >
              {{ summaryData.totalSlidesTaken }} Slide
            </span> -->
          </div>

          <div class="col-auto">
            <i class="mdi mdi-chevron-right" />
          </div>
        </div>
      </div>
      <div class="topper-holder">
        <span v-if="summaryData.toppers&&summaryData.toppers.length>0">{{ $t('ClassSummary.toppers') }}</span>
        <div
          v-for="(learner,index) in summaryData.toppers"
          :key="index"
          class="emoji-comment"
        >
          <!-- v-if="emojiSuggest==='cry'" -->
          <div class>
            <img
              v-if="learner.basicInfo.imgPath"
              :src="getProfileImg(learner.basicInfo.imgPath)"
              class="std-img"
            >
            <div
              v-else
              class="first-letter indigo std-img"
              style="background:var(--blue);"
            >
              <span>{{ usernameInitital(learner.basicInfo.fullName) }}</span>
            </div>
          </div>
          <div class>
            <div class="prfmc-holder">
              <div class="details">
                <div class="title">
                  {{ learner.basicInfo.fullName }}
                  <!-- Student Name -->
                </div>
              </div>
              <div class="prfmc-msg">
                <!-- {{ $t('ClassSummary.0_correct_answers', {'0':learner.correctAnswerCount}) }} -->
                <span
                  class="subtext"
                  v-if="learner.correctAnswerCount > 1"
                >
                  {{ learner.correctAnswerCount }} {{ $t('ClassSummary.correct_answers') }}
                </span>
                <span
                  class="subtext"
                  v-else-if="learner.correctAnswerCount === 1"
                >
                  {{ learner.correctAnswerCount }} {{ $t('ClassSummary.correct_answer') }}
                </span>
                <span
                  class="subtext"
                  v-else-if="learner.correctAnswerCount === 0"
                >
                  {{ $t('ClassSummary.0_correct_answers', {'0':learner.correctAnswerCount}) }}
                </span>
                <!-- Correct answer count -->
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="topper-holder mt-2">
        {{ $t('ClassSummary.conducted_by') }}
        <div class="emoji-comment">
          <!-- v-if="emojiSuggest==='cry'" -->
          <div>
            <!-- <img
              v-if="learner.basicInfo.imgPath"
              :src="getProfileImg(learner.basicInfo.imgPath)"
              class="std-img"
            />-->
            <div
              class="first-letter indigo std-img"
              style="background:var(--blue);"
            >
              <span>{{ usernameInitital(summaryData.teacherName) }}</span>
            </div>
          </div>
          <div>
            <div class="prfmc-holder">
              <div class="details">
                <div class="title">
                  {{ summaryData.teacherName }}
                  <!-- Teacher Name -->
                </div>
              </div>
              <div class="prfmc-msg">
                {{ $t('ClassSummary.on_0_in_1_for_2_mins', {'0': calendar(getDate()), '1':summaryData.superGroupName,'2':durationInMins}) }}
                <!-- on DATE and in CLASSNAMEE for PRESENTATIONTIME -->
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import TopMenu from '../components/common/TopMenu'
import dayjs from 'dayjs'
import calendar from 'dayjs/plugin/calendar'
import LocalizedFormat from 'dayjs/plugin/localizedFormat'
import { ClassroomModes } from '../utils/Constants'
import Configs from '../utils/Configs'
dayjs.extend(calendar)
dayjs.extend(LocalizedFormat)
dayjs().calendar(null, {
  sameDay: '[Today at] h:mm A', // The same day ( Today at 2:30 AM )
  nextDay: '[Tomorrow]', // The next day ( Tomorrow at 2:30 AM )
  nextWeek: 'dddd', // The next week ( Sunday at 2:30 AM )
  lastDay: '[Yesterday]', // The day before ( Yesterday at 2:30 AM )
  lastWeek: '[Last] dddd', // Last week ( Last Monday at 2:30 AM )
  sameElse: 'DD MMM, YYYY' // Everything else ( 7/10/2011 )
})
export default {
  name: 'ClassSummary',
  components: {
    TopMenu
    // BottomMenu
  },
  // filters: {
  //   calendar(date) {
  //     return dayjs(date).format('ll')
  //   }
  // },
  data () {
    return {
      time: 'null',
      series: [
        {
          name: 'Count',
          data: [20, 100, 40, 30]
        }
      ],
      chartOptions: {
        chart: {
          height: 350,
          type: 'radar'
        },
        dataLabels: {
          enabled: true
        },
        plotOptions: {
          radar: {
            size: 140,
            polygons: {
              strokeColor: '#e9e9e9',
              fill: {
                colors: ['#f8f8f8', '#fff']
              }
            }
          }
        },
        title: {
          text: this.$t('ClassSummary.students_performance_statistics')
        },
        colors: ['#FF4560'],
        markers: {
          size: 4,
          colors: ['#fff'],
          strokeColor: '#FF4560',
          strokeWidth: 2
        },
        tooltip: {
          y: {
            formatter: function (val) {
              return val
            }
          }
        },
        xaxis: {
          categories: [
            'Confident and wrong answer',
            'Confident and correct answer',
            'Not confident and correct answer',
            'Not confident and wrong answer'
          ]
        },
        yaxis: {
          tickAmount: 7,
          labels: {
            formatter: function (val, i) {
              if (i % 2 === 0) {
                return val
              } else {
                return ''
              }
            }
          }
        }
      },
      summaryData: {},
      showprofileImg: false,
      showSummary: false,
      emojiSuggest: 'joy',
      selectedTOCNode: this.$store.getters.selectedTOCNode,
      presentationData: this.$store.getters.getSummary
    }
  },
  computed: {
    durationInMins () {
      // return (this.summaryData.duration / 60).toFixed(2)
      var hours = Math.floor(this.summaryData.duration / 3600)
      var minutes = Math.floor((this.summaryData.duration - (hours * 3600)) / 60)
      var seconds = this.summaryData.duration - (hours * 3600) - (minutes * 60)

      // var timeString = hours.toString().padStart(2, '0') + 'hr' + ',' +
      // minutes.toString().padStart(2, '0') + ' ' + 'min' + ' ' + 'and' + ' ' +
      // seconds.toString().padStart(2, '0') + '' + 'sec'

      // return timeString
      var hDisplay = hours > 0 ? hours + (hours === 1 ? ' hr, ' : ' hrs, ') : ''
      var mDisplay = minutes > 0 ? minutes + (minutes === 1 ? ' min, ' : ' mins, ') : ''
      var sDisplay = seconds > 0 ? seconds + (seconds === 1 ? ' sec' : ' secs') : ''

      if (mDisplay && !sDisplay) {
        mDisplay = mDisplay + '0 sec'
      }

      if (hDisplay && !mDisplay) {
        hDisplay = hDisplay + '0 min'
      }

      return hDisplay + mDisplay + sDisplay

      // return timeString
    },

    timeInDateFormat () {
      return (
        this.$t('ClassSummary.started_at') +
        dayjs(this.summaryData.presentationStartTime * 1000).format('LT')
      )
    }
    // getDate() {
    //   return dayjs(this.summaryData.presentationStartTime * 1000)
    // }
  },
  methods: {

    getDate () {
      return dayjs(this.summaryData.presentationStartTime * 1000)
    },
    calendar (date) {
      return dayjs(date).format('DD MMM, YYYY')
    },
    // convertDatetoGivenFormat (date) {
    //   var finalTime = 'Started at ' + dayjs(date).format('LT')
    //   return finalTime
    // },
    usernameInitital (name) {
      if (!name) {
        return
      }
      let initial = 'S'
      let char = name.charAt(0)
      if (char.length !== 0) {
        initial = char.toUpperCase()
      }

      return initial
    },
    showSuggestion () {
      switch (true) {
        case this.summaryData.avgCorrectness.toFixed(2) < 20.0:
          this.emojiSuggest = 'cry'
          break
        case this.summaryData.avgCorrectness < 40:
          this.emojiSuggest = 'sad'
          break
        case this.summaryData.avgCorrectness < 60:
          this.emojiSuggest = 'sweat'
          break
        case this.summaryData.avgCorrectness < 80:
          this.emojiSuggest = 'joy'
          break
        case this.summaryData.avgCorrectness === 100:
          this.emojiSuggest = 'love'
          break

        default:
          this.emojiSuggest = 'love'
          break
      }
    },
    getProfileImg (imgPath) {
      if (this.$store.getters.classroomMode === ClassroomModes.offline) {
        return Configs.getLocalUrl() + '/o/assetfdb/' + imgPath
      } else {
        return Configs.getOnlineClassroomURL() + '/o/assetfdb/' + imgPath
      }
    }
  },
  mounted () {
    if (this.$store.state.Slide.currentSummary) {
      this.summaryData = this.$store.state.Slide.currentSummary.summary
      // individual summary report
      this.showSuggestion()
      this.showSummary = true
      return
    }

    // last presentation data
    this.$store.dispatch('getLastPresentationSummaryData').then(res => {
      this.summaryData = res.summary
      this.showSuggestion()
      this.showSummary = true
      this.$store.commit('setCurrentSummary', res)
    })
    // console.log(this.$store.state.Slide.currentSummary)
    // console.log('In summary page:', this.summaryData)
  }
}
</script>

<style lang="scss">
.ViewPresentation {
  background-attachment: fixed;
}
</style>
