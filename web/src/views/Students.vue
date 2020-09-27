<template>
  <div>
    <TopMenu title="Students" />
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
          <div class="input-group">
            <input
              v-model="searchKey"
              @input="searchStudents"
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
        v-if="filteredStudents.length > 0 && !isLoading"
      >
        <div
          v-for="(student, studentIndex) in filteredStudents"
          :key="studentIndex"
          class="emoji-comment"
        >
          <!-- v-if="emojiSuggest==='cry'" -->
          <div class>
            <img
              v-if="student.basicInfo.imgPath"
              :src="getProfileImg(student.basicInfo.imgPath)"
              class="std-img"
            >
            <div
              v-else
              class="first-letter indigo std-img"
              style="background:var(--blue);"
            >
              <span>{{ usernameInitital(student.basicInfo.fullName) }}</span>
            </div>
          </div>
          <div>
            <div class="prfmc-holder mb-0">
              <div class="details">
                <div class="title">
                  {{ student.basicInfo.fullName }}
                  <!-- Student Name -->
                </div>
              </div>
              <div class="prfmc-msg">
                {{ student.totalQuestions }}
                {{ $t('Students.questions_answered') }}
                <!-- Correct answer count -->
              </div>
            </div>
            <div class="col-md-12">
              <div id="chart">
                <apexchart
                  type="bar"
                  height="120"
                  width="100%"
                  :options="chartOptions"
                  :series="getSeriesData(student)"
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
          {{ $t('Students.no_students_found') }}
        </div>
        <div class="sub-title">
          {{ $t('Students.presentation_had_no_students') }}
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
import VueApexCharts from 'vue-apexcharts'
import { ClassroomModes } from '../utils/Constants'
import Configs from '../utils/Configs'
export default {
  name: 'ClassSummary',
  components: {
    apexchart: VueApexCharts,
    TopMenu
    // BottomMenu
  },
  data () {
    return {
      studentsList: [],
      filteredStudents: [],
      searchKey: '',
       presentationData: this.$store.getters.getSummary,
      runnableStats: {},
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
          categories: ['Questions answered'],
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
      // showStudents: false
      isLoading: true
    }
  },
  methods: {
    usernameInitital (name) {
      let initial = 'S'
      let char = name.charAt(0)
      if (char.length !== 0) {
        initial = char.toUpperCase()
      }

      return initial
    },
    fetchStudents () {
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

              this.runnableStats = res.result[0]
              this.prepareLearnerData().then((res) => {
                if (res) {
                  resolve(this.studentsList)
                }
              })

              // if (res && res.result === 'SUCCESS') {

              //   resolve(presentationId)
              // } else {
              //   reject(new Error('failed'))
              // }
            } else {
              this.isLoading = false
              // reject(new Error('failed'))
            }
          })
      })
      // TODO: fetch students list from mql
      // let inputData = {
      //   classRoomId: '111'
      // }

      // .catch(err => {
      //   // reject(err)
      // })

      // let outputData = [{ 'identificationNumber': '9873426453849374', 'institute': { 'instituteId': '2c24ce8c-4bc4-43be-ae9a-f87fc3d96c67', 'instituteName': 'D Y Patil Engineering College' }, 'basicInfo': { 'fullName': 'Swapnil', 'gender': 'Male', 'imgPath': './assets/images/students/student1.png' }, 'isDeleted': false, 'learnerPin': '334245', 'extended': {} }, { 'identificationNumber': '9873426453849374', 'institute': { 'instituteId': '2c24ce8c-4bc4-43be-ae9a-f87fc3d96c67', 'instituteName': 'D Y Patil Engineering College' }, 'basicInfo': { 'fullName': 'Priyanka', 'imgPath': './assets/images/students/student2.png' }, 'isDeleted': false, 'learnerPin': '334246', 'extended': {} }, { 'identificationNumber': '9873426453849374', 'institute': { 'instituteId': '2c24ce8c-4bc4-43be-ae9a-f87fc3d96c67', 'instituteName': 'D Y Patil Engineering College' }, 'basicInfo': { 'fullName': 'Vivek', 'gender': 'Male', 'imgPath': './assets/images/students/student3.png' }, 'isDeleted': false, 'learnerPin': '334247', 'extended': {} }]
      // let outputData = this.$store.state.Slide.currentSummary.listOfAllUsers
      // return outputData
    },
    searchStudents () {
      if (this.searchKey.length >= 3) {
        this.filteredStudents = this.studentsList.filter((student) =>
          student.basicInfo.fullName
            .toLowerCase()
            .includes(this.searchKey.toLowerCase())
        )
      }
      if (this.searchKey === '') {
        this.filteredStudents = this.studentsList
      }
    },
    setCurrentLearner (student) {
      this.$store.commit('setCurrentLearner', student)
    },
    prepareLearnerData () {
      return new Promise((resolve) => {
        for (const key in this.runnableStats.learners) {
          if (this.runnableStats.learners.hasOwnProperty(key)) {
            const learner = this.runnableStats.learners[key]
            let tempLearnerObj = {}
            // learner['answeredQuestions'].forEach(question => {
            //   if (question['correctnessPercentage'] === 100) {
            //     correctCount += 1
            //   }
            // })
            let questionArray = []
            let notKnownArray = []
            tempLearnerObj['inCorrectAnswer'] = 0
            tempLearnerObj['totalQuestions'] = 0
            if (learner && learner['answeredQuestions']) {
              questionArray = learner['answeredQuestions'].filter(
                (question) => question.correctnessPercentage === 100
              )
              notKnownArray = learner['answeredQuestions'].filter(
                (question) => question.selectedOption.optId === '999'
              )
              tempLearnerObj['inCorrectAnswer'] =
                this.runnableStats.questionIds.length - questionArray.length
              tempLearnerObj['totalQuestions'] = this.runnableStats.questionIds.length
            }

            tempLearnerObj['correctAnswer'] = questionArray.length
            tempLearnerObj['notKnown'] = notKnownArray.length
            tempLearnerObj['learnerId'] = key
            tempLearnerObj['basicInfo'] = this.runnableStats.listOfAllUsers.find(
              (learner) => learner.learnerId === key
            ).basicInfo

            this.studentsList.push(tempLearnerObj)
          }
        }
        resolve(true)
      })
    },
    getSeriesData (stats) {
      if (stats) {
        let inCorrectAnswer = stats.inCorrectAnswer ? stats.inCorrectAnswer : 0
        let notKnown = stats.notKnown ? stats.notKnown : 0
        inCorrectAnswer -= notKnown

        return [
          {
            name: 'Correct',
            data: [stats.correctAnswer ? stats.correctAnswer : 0]
          },
          {
            name: 'Incorrect',
            data: [inCorrectAnswer]
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
      this.filteredStudents.sort(function (a, b) {
        return b.correctAnswer - a.correctAnswer
      })
    },
    sortByInCorrect () {
      this.filteredStudents.sort(function (a, b) {
        return b.inCorrectAnswer - a.inCorrectAnswer
      })
    },
    sortByNotKnownHTL () {
      this.filteredStudents.sort(function (a, b) {
        return b.notKnown - a.notKnown
      })
    },
    sortByNotKnownLTH () {
      this.filteredStudents.sort(function (a, b) {
        return a.notKnown - b.notKnown
      })
    },
    sortByDescending () {
      this.filteredStudents.sort(function (a, b) {
        if (a.basicInfo.fullName > b.basicInfo.fullName) {
          return -1
        }
        if (b.basicInfo.fullName > a.basicInfo.fullName) {
          return 1
        }
        return 0
      })
    },
    sortByAscending () {
      this.filteredStudents.sort(function (a, b) {
        if (b.basicInfo.fullName > a.basicInfo.fullName) {
          return -1
        }
        if (a.basicInfo.fullName > b.basicInfo.fullName) {
          return 1
        }
        return 0
      })
    },
    getProfileImg (path) {
      if (this.$store.getters.classroomMode === ClassroomModes.offline) {
        return Configs.getLocalUrl() + '/o/assetfdb/' + path
      } else {
        return Configs.getOnlineClassroomURL() + '/o/assetfdb/' + path
      }
      // return Configs.prepareBaseUrl(this.$store.getters.serverIP) + '/o/assetfdb/' + path
      // return presentation.assetPath.embeddedAssets[presentation.slidesMetadata[0].previewImgURL]
    }
  },
  mounted () {
    // this.studentsList
    this.fetchStudents().then((res) => {
      this.filteredStudents = res
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
