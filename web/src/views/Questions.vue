<template>
  <div>
    <TopMenu title="Questions" />
    <div class="presentation-name mb-4">
      <!-- <span
        v-b-tooltip.hover
        :title="'This presentation is about '+ presentationData.description"
      >{{ presentationData.name || 'Topic Name' }}</span> -->
      <div> <i class="mdi mdi-theater" />   </div>
      <div>
        <div
          class="ppt-name"
        >
          {{ presentationData.name || 'Topic Name' }}
        </div>
        <!-- <div
        class="topic-name"
        v-b-tooltip.hover
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

    <div class="ViewPresentation alt-layout wrap-alt bg-main">
      <div class="row justify-content-center">
        <div class="col-12 search">
          <div class="input-group ">
            <input
              v-model="searchKey"
              @input="searchQuestion"
              type="text"
              class="form-control"
              aria-label="Search topic"
              aria-describedby="basic-addon1"
              :placeholder="$t('SelectClass.search')"
            >
            <div class="input-group-prepend">
              <span
                class="input-group-text"
                id="basic-addon1"
              >
                <i class="mdi mdi-magnify" />
              </span>
            </div>
          </div>
        </div>
      </div>
      <div
        class="topper-holder"
        v-if="filteredquestion.length > 0 && !isLoading"
      >
        <div
          v-for="(question, questionIndex) in filteredquestion"
          :key="questionIndex"
          class="emoji-comment"
        >
          <!-- v-if="emojiSuggest==='cry'" -->
          <!-- <div class>
            <img
              v-if="student.basicInfo.imgPath"
              :src="getProfileImg(student.basicInfo.imgPath)"
              class="std-img"
            />
            <div v-else class="first-letter indigo std-img" style="background:var(--blue);">
              <span>{{ usernameInitital(student.basicInfo.fullName) }}</span>
            </div>
          </div>-->
          <div>
            <div class="d-flex">
              <div>{{ questionIndex + 1 }}.</div>
              <div class="prfmc-holder-quest">
                <div class="details">
                  <div class="title">
                    {{ showQuestion([...question]) }}
                    <br>
                    <!-- <span class="sub-text"> {{ showQuestionType([...question]) }}</span> -->
                    <!-- Student Name -->
                  </div>
                </div>
                <div
                  v-if="
                    (question.stats && question.stats.totalResponses
                      ? question.stats.totalResponses
                      : 0) !== 0
                  "
                  class="prfmc-msg"
                >
                  {{
                    question.stats && question.stats.totalResponses
                      ? question.stats.totalResponses
                      : 0
                  }}
                  total responses - {{ showQuestionType([...question]) }}
                  <!-- Correct answer count -->
                </div>
                <div
                  v-else
                  class="prfmc-msg-alt"
                >
                  {{ $t('Questions.no_responses_were_recorded') }}
                  <!-- Correct answer count -->
                </div>
              </div>
            </div>
            <div
              v-if="
                (question.stats && question.stats.totalResponses
                  ? question.stats.totalResponses
                  : 0) !== 0
              "
              class="col-md-12 ml-3"
            >
              <div id="chart">
                <apexchart
                  type="bar"
                  height="120"
                  :options="chartOptions"
                  :series="getSeriesData(question.stats)"
                  :id="question.extendedData.questionLogicalData.questionId"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        class=" col-12 empty-state "
        v-else-if="!isLoading"
      >
        <div class="title ">
          {{ $t('Questions.no_questions_found') }}
        </div>
        <div class="sub-title">
          {{ $t('Questions.presentation_had_no_questions') }}
        </div>
      </div>
      <div class="row">
        <div class="col-12 text-center loader-box">
          <span v-if="isLoading">
            <i class="mdi mdi-spin mdi-chart-donut" />
            {{ $t('SelectSubject.please_wait') }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import TopMenu from '../components/common/TopMenu'
import MQL from '@/plugins/mql.js'
import dayjs from 'dayjs'
import LocalizedFormat from 'dayjs/plugin/localizedFormat'
import VueApexCharts from 'vue-apexcharts'
dayjs.extend(LocalizedFormat)
export default {
  name: 'ClassSummary',
  components: {
    apexchart: VueApexCharts,
    TopMenu
    // BottomMenu
  },
  data () {
    return {
      questionList: [],
      filteredquestion: [],
      searchKey: '',
      runnableStats: {},
      runnableData: [],
      currentComponent: '',
      currentquestionMediaType: '',
      currentquestionType: '',
      displayQuestion: false,
      currentQuestionData: undefined,
      visible: false,
      presentationData: this.$store.getters.getSummary,
      index: 0, // default: 0
      imgs: [
        { src: '/assets/images/presentation/6.png', title: 'this is title' }
      ],
      series: [
        {
          name: 'Correct',
          data: [52]
        },
        {
          name: 'Incorrect',
          data: [13]
        },
        {
          name: "Don't know",
          data: [5]
        }
      ],
      chartOptions: {
        chart: {
          width: '100%',
          type: 'bar',
          height: 350,
          stacked: true,
          toolbar: {
            show: true,
            offsetX: 0,
            offsetY: 0,
            tools: {
              download: false,
              selection: true,
              zoom: true,
              zoomin: true,
              zoomout: true,
              pan: true,
              reset: true | 'Reset',
              customIcons: []
            },
            autoSelected: 'zoom'
          },
          fontFamily: 'Avenir, Arial, sans-serif'
        },
        plotOptions: {
          bar: {
            horizontal: true
          }
        },
        stroke: {
          width: 1,
          colors: ['#fff']
        },
        title: {
          text: ''
        },
        grid: {
          show: false
        },
        colors: [
          '#77bbb2',
          '#efbd28',
          '#46517E',
          '#ff5891',
          '#ffc107',
          '#00bcd4'
        ],
        xaxis: {
          show: false,
          categories: ['Students who answered'],
          // labels: {
          //   formatter: function (val) {
          //     return val
          //   }
          // },
          axisBorder: {
            show: false
          },
          labels: {
            show: false
          },
          axisTicks: {
            show: false
          }
        },
        yaxis: {
          show: false,
          title: {
            text: undefined
          }
        },
        tooltip: {
          y: {
            formatter: function (val) {
              return val
            }
          }
        },
        fill: {
          opacity: 1
        },
        legend: {
          position: 'top',
          horizontalAlign: 'left',
          offsetX: -8,
          offsetY: 30
        }
      },
      isLoading: true
      // showslides: false
    }
  },
  filters: {
    calendar (date) {
      return dayjs(date).format('DD MMM, YYYY')
    }
  },
  // computed: {
  //   componentLoader () {
  //     let questionType = this.currentquestionType
  //     return () => import(`@/components/questionSummaryDisplay/${questionType}/${this.currentquestionMediaType}.vue`)
  //   }
  // },
  methods: {
    showImg (index) {
      this.index = index
      this.visible = true
    },
    handleHide () {
      this.visible = false
    },
    fetchQuestions () {
      return new Promise((resolve) => {
        new MQL()
          .setActivity('r.[FetchRunnableStatsDataByPresentationCacheId]')
          .setData({
            presentationCacheId: this.$store.state.Slide.currentSummary
              .presentationCacheId
          })
          .fetch()
          .then((rs) => {
            if (rs.isValid('FetchRunnableStatsDataByPresentationCacheId')) {
              let res = rs.getActivity(
                'FetchRunnableStatsDataByPresentationCacheId',
                true
              )
              // console.log(res.result)
              this.runnableStats = res.result[0]

              new MQL()
                .setActivity('r.[FetchRunnableDataByCacheId]')
                .setData({
                  presentationCacheId: this.$store.state.Slide.currentSummary
                    .presentationCacheId
                })
                .fetch()
                .then((rs) => {
                  if (rs.isValid('FetchRunnableDataByCacheId')) {
                    let res = rs.getActivity('FetchRunnableDataByCacheId', true)
                    // console.log(res.result[0])
                    this.runnableData = res.result[0]
                    // console.log(res.result[0])
                    this.prepareQuestionData().then((res) => {
                      if (res) {
                        // console.log('RETURNING FROM PREPARE______________________--')
                        // console.log(this.slidesList)
                        // new MQL()
                        //   .setActivity('r.[FetchRunnableDataByCacheId]')
                        //   .setData({ presentationCacheId: this.$store.state.Slide.currentSummary.presentationCacheId })
                        //   .fetch()
                        //   .then(rs => {
                        //     if (rs.isValid('FetchRunnableDataByCacheId')) {
                        //       let res = rs.getActivity('FetchRunnableDataByCacheId', true)
                        //       console.log('Runnable Data:', res.result)
                        //       // console.log(res.result[0])
                        //     }
                        //   })

                        resolve(this.questionList)
                      }
                    })
                  }
                })

              // console.log("GetTeachingPlanbyPaperId" + JSON.stringify(res));
              // if (res && res.result === 'SUCCESS') {
              //   // console.log(presentationList);
              //   resolve(presentationId)
              // } else {
              //   reject(new Error('failed'))
              // }
            } else {
              // reject(new Error('failed'))
              this.isLoading = false
            }
          })
      })
      // TODO: fetch slides list from mql
      // let inputData = {
      //   classRoomId: '111'
      // }
      // console.log('inputData', inputData)

      // .catch(err => {
      //   // reject(err)
      // })

      // let outputData = [{ 'identificationNumber': '9873426453849374', 'institute': { 'instituteId': '2c24ce8c-4bc4-43be-ae9a-f87fc3d96c67', 'instituteName': 'D Y Patil Engineering College' }, 'basicInfo': { 'fullName': 'Swapnil', 'gender': 'Male', 'imgPath': './assets/images/slides/slide1.png' }, 'isDeleted': false, 'learnerPin': '334245', 'extended': {} }, { 'identificationNumber': '9873426453849374', 'institute': { 'instituteId': '2c24ce8c-4bc4-43be-ae9a-f87fc3d96c67', 'instituteName': 'D Y Patil Engineering College' }, 'basicInfo': { 'fullName': 'Priyanka', 'imgPath': './assets/images/slides/slide2.png' }, 'isDeleted': false, 'learnerPin': '334246', 'extended': {} }, { 'identificationNumber': '9873426453849374', 'institute': { 'instituteId': '2c24ce8c-4bc4-43be-ae9a-f87fc3d96c67', 'instituteName': 'D Y Patil Engineering College' }, 'basicInfo': { 'fullName': 'Vivek', 'gender': 'Male', 'imgPath': './assets/images/slides/slide3.png' }, 'isDeleted': false, 'learnerPin': '334247', 'extended': {} }]
      // let outputData = this.$store.state.Slide.currentSummary.listOfAllUsers
      // return outputData
    },
    searchQuestion () {
      if (this.searchKey.length >= 3) {
        this.filteredquestion = this.questionList.filter((question) =>
          question.extendedData.questionStaticData[0].questionDetails[
            'questionText'
          ]
            .toLowerCase()
            .includes(this.searchKey.toLowerCase())
        )
      }
      if (this.searchKey === '') {
        this.filteredquestion = this.questionList
      }
    },
    setCurrentquestion (questionIndex, question) {
      this.displayQuestion = false
      // console.log('Current Question Data:', question)
      this.currentQuestionData = question
      this.currentquestionMediaType =
        question.extendedData.questionLogicalData.questionDetails.questionMediaType
      this.currentquestionType = question.questionProperties.questionType
      this.displayQuestion = true
      //   this.toggleModal()
      //   this.runnableStats.questionIds[questionIndex]
      // console.log('CurrentLearner: ', questionId)
      //   this.$store.commit('setCurrentQuestion', questionId)
    },
    prepareQuestionData () {
      return new Promise((resolve) => {
        this.runnableStats.questionIds.forEach((questionId) => {
          // console.log('Question Id:', questionId)
          // console.log('Runnable Data:', this.runnableData.slides)
          let Question = this.runnableData.slides.filter((slide) =>
            slide.extendedData.questionLogicalData
              ? slide.extendedData.questionLogicalData.questionId === questionId
              : null
          )
          let QuestionData = Question[0].extendedData.questionStaticData.filter(
            (question) => question.lang === 'en'
          )
          // console.log('QuestionData', QuestionData[0])
          let stats = this.prepareOptionStats(Question[0].slideId)
          Question[0].extendedData.questionStaticData = QuestionData
          Question[0].stats = stats || {}
          // console.log('Stats::', stats)
          Question[0].stats['inCorrectAnswer'] = stats.inCorrectAnswer
            ? stats.inCorrectAnswer
            : 0
          Question[0].stats['correctAnswer'] = stats.correctAnswer
            ? stats.correctAnswer
            : 0
          Question[0].stats['notKnown'] = stats.notKnown ? stats.notKnown : 0
          Question[0].stats['totalResponses'] = stats.totalResponses
            ? stats.totalResponses
            : 0
          //   this.$set(Question[0].extendedData, QuestionData[0])
          //   let Question = this.runnableData.slides.filter(slide => slide.extendedData.questionLogicalData ? slide.extendedData.questionLogicalData.questionId === questionId : [])
          //   let newQuestion = this.runnableStats[slide]
          //   if (curSlide[0].previewImgURL) {
          //     newSlide['previewImgURL'] = this.runnableData.assetPath.embeddedAssets[curSlide[0].previewImgURL]
          //   } else {
          //     // curSlide
          //     // newSlide['previewImgURL'] =
          //   }
          //   console.log('new Slide:', newSlide)
          this.questionList.push(Question[0])
          // console.log('Question::->', Question[0])
        })
        resolve(true)
      })
    },
    showQuestion (question) {
      let questionType = question[0].questionProperties.questionType
      let questionMediaType =
        question[0].extendedData.questionLogicalData.questionDetails
          .questionMediaType
      var questionText = ''
      // console.log('questionType', questionType)
      // console.log('questionMediaType', questionMediaType)
      // console.log('questionDetails', question[0].extendedData.questionStaticData[0].questionDetails)
      switch (questionMediaType) {
        case 'Text':
          questionText =
            question[0].extendedData.questionStaticData[0].questionDetails[
              'question' + questionMediaType + questionType
            ]
          question[0].extendedData.questionStaticData[0].questionDetails[
            'questionText'
          ] = questionText
          break
        case 'Image':
          questionText =
            question[0].extendedData.questionStaticData[0].questionDetails[
              'questionInMedia' + questionMediaType + 'Text' + questionType
            ]
          question[0].extendedData.questionStaticData[0].questionDetails[
            'questionText'
          ] = questionText

          break
        case 'Video':
          questionText =
            question[0].extendedData.questionStaticData[0].questionDetails[
              'questionInMedia' + questionMediaType + 'Text' + questionType
            ]
          question[0].extendedData.questionStaticData[0].questionDetails[
            'questionText'
          ] = questionText

          break
        case 'Audio':
          questionText =
            question[0].extendedData.questionStaticData[0].questionDetails[
              'questionInMedia' + questionMediaType + 'Text' + questionType
            ]
          question[0].extendedData.questionStaticData[0].questionDetails[
            'questionText'
          ] = questionText

          break

        default:
          break
      }
      if (questionType === 'Fib') {
        questionText = this.prepareFibQuestion(question[0])
        question[0].extendedData.questionStaticData[0].questionDetails[
          'questionText'
        ] = questionText
        // points.sort(function(a, b){return a-b});
      }
      // console.log(questionText)
      return questionText
    },
 showQuestionType (question) {
       let questionType = question[0].questionProperties.questionType
       return questionType
    },
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
    prepareFibQuestion (questionData) {
      // console.log('Fib question Data :', questionData)
      let questionText =
        questionData.extendedData.questionStaticData[0].questionDetails[
          'questionTextFib'
        ]
      // console.log('question Text::', questionText)
      var hashwords = this.extractHash(questionText.split(' '))
      var optionIds = this.extractOptions(questionText.split(' '))

      for (var key in questionData.extendedData.questionStaticData[0]
        .questionDetails) {
        // console.log('In question Loop')
        // if (questionData[0].extendedData.questionStaticData.questionDetails[key] === text) {
        for (var i = 1; i <= hashwords.length; i++) {
          if (
            questionData.extendedData.questionStaticData[0].questionDetails[
              key
            ] === hashwords[i - 1]
          ) {
            // console.log('__' + questionData.extendedData.questionStaticData[0].questionDetails[key] + '.' + optionIds[i - 1])
            var re = new RegExp(
              '__' +
                questionData.extendedData.questionStaticData[0].questionDetails[
                  key
                ] +
                '.' +
                optionIds[i - 1]
            )
            questionText = questionText.replace(re, '__')
          }
          // }

          // if (key.includes('optionBucketName')) {
          //   let temp = key.split('_')
          //   this.questionName = questionText.replace(/#[a-zA-z]*/g, this.questionExtendedData.questionStaticData.questionDetails['optTextTf_' + temp[1]])
          // }
        }
      }
      // questionData.extendedData.questionStaticData[0]
      // buckets.forEach(bucket => {
      //   questionText = questionText.replace(bucket, '___')
      // })
      return questionText
    },
    prepareOptionStats (slideId) {
      let stats = this.runnableStats[slideId].stats
        ? this.runnableStats[slideId].stats
        : {}
      // console.log('stats::::::', stats)
      return stats
    },
    toggleModal () {
      // We pass the ID of the button that we want to return focus to
      // when the modal has hidden
      this.$refs['my-modal'].toggle('#toggle-btn')
    },
    getSeriesData (stats) {
      if (stats) {
        return [
          {
            name: 'Correct',
            data: [stats.correctAnswer ? stats.correctAnswer : 0]
          },
          {
            name: 'Incorrect',
            data: [stats.inCorrectAnswer ? stats.inCorrectAnswer : 0]
          },
          {
            name: "Don't know",
            data: [stats.notKnown ? stats.notKnown : 0]
          }
        ]
      } else {
        return [
          {
            name: 'Correct',
            data: [0]
          },
          {
            name: 'Incorrect',
            data: [0]
          },
          {
            name: "Don't know",
            data: [0]
          }
        ]
      }
    },
    sortByCorrect () {
      this.filteredquestion.sort(function (a, b) {
        return b.stats.correctAnswer - a.stats.correctAnswer
      })
    },
    sortByInCorrect () {
      this.filteredquestion.sort(function (a, b) {
        return b.stats.inCorrectAnswer - a.stats.inCorrectAnswer
      })
    },
    sortByNotKnownHTL () {
      this.filteredquestion.sort(function (a, b) {
        return b.stats.notKnown - a.stats.notKnown
      })
    },
    sortByNotKnownLTH () {
      this.filteredquestion.sort(function (a, b) {
        return a.stats.notKnown - b.stats.notKnown
      })
    },
    filterByOnlyResponded () {
      this.filteredquestion = this.filteredquestion.filter(
        (question) => question.stats.totalResponses !== 0
      )
    },
    filterByWithNoResponses () {
      this.filteredquestion = this.questionList
    }
  },
  mounted () {
    // this.slidesList
    this.fetchQuestions().then((res) => {
      this.filteredquestion = res
      this.isLoading = false
    })
  }
}
</script>

<style lang="scss">
.ViewPresentation {
  background-attachment: fixed;
}
</style>
