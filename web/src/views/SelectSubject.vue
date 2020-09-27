<template>
  <div class="selectSubject">
    <div>
      <TopMenu :title="$t('SelectSubject.select_subject')" />
    </div>
    <div class="SelectSubject wrap-alt">
      <div class="row">
        <div class="col-12 search">
          <div class="input-group mt-4 mb-2">
            <input
              v-model="searchKey"
              @input="searchSubjects"
              type="text"
              class="form-control"
              aria-label="Search topic"
              aria-describedby="basic-addon1"
              :placeholder="$t('SelectSubject.search')"
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
        class="row"
        v-if="isLoading || errorText"
      >
        <div class="col-12 loader-box">
          <span v-if="isLoading">
            <i class="mdi mdi-spin mdi-chart-donut" />
            {{ $t('SelectSubject.please_wait') }}
          </span>
          <span v-if="errorText">{{ errorText }}</span>
          <br>
          <button
            v-if="isError && errorText"
            class="btn btn-blue"
            @click="fetchData"
          >
            {{ $t('SelectSubject.try_again') }}
          </button>
        </div>
      </div>
      <div class="row no-gutters">
        <div
          v-if="recentActivityData && filteredRecent.length !== 0"
          class="col-12"
        >
          <h4
            v-b-toggle.recent-selection
            class="recently-used-title mb-3"
          >
            {{ $t('SelectSubject.recently_used') }}
            <span class="when-opened">
              <i
                aria-hidden="true"
                class="mdi mdi-chevron-down"
              />
            </span>
            <span class="when-closed">
              <i
                aria-hidden="true"
                class="mdi mdi-chevron-up"
              />
            </span>
          </h4>
          <b-collapse
            id="recent-selection"
            visible
          >
            <div class="row">
              <template v-for="(subject, index) in filteredRecent">
                <div
                  @click="selectSubject(subject)"
                  :key="'subject' + index"
                  class="col-12"
                >
                  <div class="card-default">
                    <div class="row align-items-center">
                      <div class="col-auto teal-text">
                        <i class="mdi mdi-book mdi-24px" />
                        <!-- <img src="/assets/images/icon-class.svg"> -->
                      </div>
                      <div class="col">
                        <div class="main-text">
                          {{ subject.paperName }}
                        </div>
                        <!-- <div class="sub-text">
                    Maths
                  </div>-->
                      </div>
                      <div class="col-auto icon light-text">
                        <i class="mdi mdi-chevron-right" />
                      </div>
                    </div>
                  </div>
                </div>
              </template>
            </div>
          </b-collapse>
        </div>
      </div>
      <!-- <hr v-if="recentActivityData"> -->
      <div v-if="filteredWithoutRecent">
        <div
          class="row"
          @click="selectSubject(subject)"
          v-for="(subject, index) in filteredWithoutRecent"
          :key="'subject' + index"
        >
          <div class="col-12">
            <div class="card-default">
              <div class="row align-items-center">
                <div class="col-auto teal-text">
                  <i class="mdi mdi-book mdi-24px" />
                  <!-- <img src="/assets/images/icon-class.svg"> -->
                </div>
                <div class="col">
                  <div class="main-text">
                    {{ subject.paperName }}
                  </div>
                  <!-- <div class="sub-text">
                    Maths
                  </div>-->
                </div>
                <div class="col-auto icon light-text">
                  <i class="mdi mdi-chevron-right" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- <div class="row">
      <div class="col-md-6">
        <div class="section">
          <div class="title">
            Student Performance Month-wise
          </div>
          <div class="content graph">
            <vue-frappe
              id="test1"

              :labels="[
                '12am-3am', '3am-6am', '6am-9am', '9am-12pm','12pm-3pm', '3pm-6pm','2pm-8pm'
              ]"
              title=""
              type="bar"
              :height="419"
              :colors="[ '#ED3836']"
              :data-sets="this.data1"
            />
          </div>
        </div>
      </div>
      <div class="col-md-6">
        <div class="section">
          <div class="title">
            Announcements
          </div>
          <div class="content">
            <div
              class="card"
              v-for="n in 2"
            >
              <div class="row">
                <div class="col-md-12">
                  <div class="task">
                    Examination Pattern & Format Discussion
                  </div>
                  <div class="details">
                    A meeting has been scheduled on <span class="cyan-text">January 10, 2019</span> at 10:00PM for the same.
                  </div>
                  <div class="d-flex task-info">
                    <div>
                      <img
                        src="../../public/assets/images/user.jpg"
                        class="user-img"
                      >
                    </div>
                    <div class="details">
                      Sent by <span class="black-text"> Mr. Harvey Specter</span><br>
                      January 8, 2019
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        </disv>
      </div>
      <div class="col-md-6">
        <div class="section">
          <div class="title">
            Student Performance Month-wise
          </div>
          <div class="content graph">
            <vue-frappe
              id="test"
              :labels="[
                '12am-3am', '3am-6am', '6am-9am', '9am-12pm',
                '12pm-3pm', '3pm-6pm'
              ]"
              title=""
              type="axis-mixed"
              :height="419"
              :colors="['#D7DCE0', '#1F83F6', 'light-blue']"
              :data-sets="this.data"
            />
          </div>
        </div>
      </div>
    </div>-->
    <!-- <BottomMenu /> -->
  </div>
</template>

<script>
// @ is an alias to /src
// import HelloWorld from '@/components/HelloWorld.vue'
// import { swiper, swiperSlide } from 'vue-awesome-swiper'
// import 'swiper/dist/css/swiper.css'
// import Sparkline from 'vue-sparklines'
// import Chart from 'vue2-frappe'
import MQL from '@/plugins/mql.js'
import TopMenu from '@/components/common/TopMenu'

import SystemDialog from '../utils/SystemDialog'
import { ClassroomModes } from '@/utils/Constants'

export default {
  name: 'Dashboard',
  components: {
    TopMenu
    // Chart
    // Sparkline
    // swiper,
    // swiperSlide
  },
  data () {
    return {
      isLoading: false,
      mainSelectedSubjects: null,
      searchKey: '',
      errorText: '',
      isError: false,
      recentActivityData: null,
      recentItemList: [],
      filteredRecent: [],
      withoutRecentList: [],
      filteredWithoutRecent: [],
      recentSubjectsLimit: 10
    }
  },
  mounted () {
    // alert(this.$viewSync.currentViewData.selectedClassroom);
    // if (this.selectedClassroom.subjects.length === 1) {
    //   this.selectSubject(this.selectedClassroom.subjects[0]);
    // }

    // clear Connected Users
    this.$store.dispatch('clearConnectedUsers')
    // clear Active Users
    this.$store.dispatch('clearActiveUsers')

    this.fetchData()
  },
  computed: {
    // selectedClassroom() {
    //   //   return this.$viewSync.currentViewData.selectedClassroom;
    //   return this.$store.getters.selectedClassroom;
    // }
  },
  methods: {
    fetchData () {
      if (!this.$store.getters.IsTeacherMappingOn) {
        this.isLoading = true
        this.errorText = ''
        this.GetAllPapersByInstituteId()
          .then((papers) => {
            this.mainSelectedSubjects = JSON.parse(JSON.stringify(papers))
            this.isLoading = false
            this.getTeacherRecentActivities()
          })
          .catch((err) => {
            this.isLoading = false
            if (err && err === 'NETWORK_ERROR') {
              this.isError = true
              this.errorText = this.$t('SelectSubject.unable_to_connect_server')
            }
          })
      } else {
        this.mainSelectedSubjects = JSON.parse(
          JSON.stringify(this.$store.getters.selectedClassroom.papers)
        )
        this.getTeacherRecentActivities()
      }
    },
    GetAllPapersByInstituteId () {
      return new Promise((resolve, reject) => {
        new MQL()
          .setActivity('r.[GetAllPapersByInstId]')
          .setData({
            instituteId: this.$store.getters.teacherDetails.institute
              .instituteId
          })
          .fetch()
          .then((rs) => {
            if (rs.isValid('GetAllPapersByInstId')) {
              let res = rs.getActivity('GetAllPapersByInstId', true)
              // console.log("GetTeachingPlanbyPaperId" + JSON.stringify(res));
              if (res && Array.isArray(res.result)) {
                let papers = []
                res.result.forEach((paper) => {
                  papers.push({
                    paperId: paper._id,
                    paperName: paper.paperName
                  })
                })
                // console.log(papers);
                resolve(papers)
              } else {
                reject(
                  new Error(this.$t('SelectSubject.teaching_plan_not_found'))
                )
              }
            } else {
              reject(
                new Error(this.$t('SelectSubject.teaching_plan_not_found'))
              )
            }
          })
          .catch((err) => {
            reject('NETWORK_ERROR')
          })
      })
    },
    selectSubject (subject) {
      this.$store.commit('selectedSubject', JSON.parse(JSON.stringify(subject)))
      this.setConnectedUsersFromTeacher()
        .then((res) => {
          this.$store.commit(
            'classroomSubjectSessionId',
            res.connectedUsers.classroomSubjectSessionId
          )
          this.$store.commit(
            'sessionDateTime',
            res.connectedUsers.sessionDateTime
          )
          this.setCurrentSessionDetails()
          this.$store.commit('connectedLearners', 0)
          this.$router.push('TeachingPlanDashboard')
        })
        .catch((err) => {
          console.error(err)
          if (err && err === 'NETWORK_ERROR') {
            SystemDialog.show(
              this.$t('SelectSubject.unable_to_connect_server'),
              this.$t(
                'SelectSubject.please_make_sure_that_server_is_running_and_you_have_connected_to_the_same_wifi'
              ),
              this.$t('SelectSubject.okay'),
              () => {}
            )
          }
        })
      // this.$store.dispatch("clearConnectedUsers");

      // let currentView = {
      //   viewName: "TeachingPlanDashboard",
      //   selectedSubject: JSON.parse(JSON.stringify(subject))
      // };
      // this.$viewSync.updateCurrentView(currentView)
      //   this.getRunningClassroom(subject);
    },
    setConnectedUsersFromTeacher () {
      return new Promise((resolve, reject) => {
        new MQL()
          .setActivity('r.[SetConnectedUsersFromTeacher]')
          .setData({
            connectedUsers: {
              superGroupId: this.$store.getters.selectedClassroom._id,
              paperId: this.$store.getters.selectedSubject.paperId,
              listOfUsers: []
            },
            sessionManagerId: this.$store.getters.sessionManagerId
          })
          .fetch()
          .then((rs) => {
            if (rs.isValid('SetConnectedUsersFromTeacher')) {
              let res = rs.getActivity('SetConnectedUsersFromTeacher', false)
              resolve(res.result)
            } else {
              rs.showErrorToast('SetConnectedUsersFromTeacher')
              reject(res.getRaw().SetConnectedUsersFromTeacher.error)
            }
          })
          .catch((err) => {
            reject('NETWORK_ERROR')
          })
      })
    },
    setCurrentSessionDetails () {
      new MQL()
        .setActivity('r.[SetCurrentSessionDetails]')
        .setData({
          sessionDetails: {
            token: sessionStorage.getItem('user-token'),
            teacher: this.$store.getters.teacherDetails,
            classroom: this.$store.getters.selectedClassroom,
            subject: this.$store.getters.selectedSubject,
            classroomSubjectSessionId: this.$store.getters
              .classroomSubjectSessionId
          },
          sessionManagerId: this.$store.getters.sessionManagerId
        })
        .fetch()
        .then((rs) => {
          if (rs.isValid('SetCurrentSessionDetails')) {
            // let res = rs.getActivity('SetCurrentSessionDetails', true)
            if (this.$store.getters.classroomMode === ClassroomModes.offline) {
              this.setOfflineClassroom()
            }
          } else {
            rs.showErrorToast('SetCurrentSessionDetails')
          }
        })
        .catch((err) => {
          reject('NETWORK_ERROR')
        })
    },
    setOfflineClassroom () {
      new MQL()
        .setActivity('r.[SetDefaultClassroom]')
        .setData({})
        .fetch()
        .then((rs) => {
          if (rs.isValid('SetDefaultClassroom')) {
            rs.getActivity('SetDefaultClassroom', false)
          } else {
            rs.showErrorToast('SetDefaultClassroom')
          }
        })
    },
    getRunningClassroom (subject) {
      new MQL()
        .setActivity('o.[InsertCurrentClassroom]')
        .setData({
          classroomId: this.selectedClassroom._id,
          classroomName: this.selectedClassroom.name,
          subjectId: subject.paperId,
          subjectName: subject.paperName,
          teacherId: this.$store.getters.teacherDetails._id
        })
        .fetch()
        .then((rs) => {
          let res = rs.getActivity('InsertCurrentClassroom', false)
          if (rs.isValid('InsertCurrentClassroom')) {
            console.debug(res.result)
          } else {
            rs.showErrorToast('InsertCurrentClassroom')
          }
        })
        .catch((err) => {
          reject('NETWORK_ERROR')
        })
    },
    searchSubjects () {
      if (this.isError && this.errorText) {
        return
      }
      this.errorText = ''
      if (this.searchKey.trim() === '') {
        this.filteredRecent = this.recentItemList
        this.filteredWithoutRecent = this.withoutRecentList
      }

      if (this.searchKey.trim().length >= 3) {
        this.filteredRecent = this.recentItemList.filter((paper) =>
          paper.paperName.toLowerCase().includes(this.searchKey.toLowerCase())
        )
        this.filteredWithoutRecent = this.withoutRecentList.filter((paper) =>
          paper.paperName.toLowerCase().includes(this.searchKey.toLowerCase())
        )

        if (
          this.filteredRecent.length === 0 &&
          this.filteredWithoutRecent.length === 0
        ) {
          this.isError = false
          this.errorText = this.$t(
            'SelectSubject.no_result_found_for_your_search'
          )
        }
      }
    },
    getTeacherRecentActivities () {
      let teacherId = this.$store.getters.teacherDetails._id
      let data = { _id: teacherId }
      new MQL()
        .setActivity('r.[GetTeacherRecentActivityDetails]')
        .setData(data)
        .fetch()
        .then((rs) => {
          if (rs.isValid('GetTeacherRecentActivityDetails')) {
            let res = rs.getActivity('GetTeacherRecentActivityDetails', true)
            if (
              res.result &&
              Array.isArray(res.result) &&
              res.result.length > 0
            ) {
              this.recentActivityData = res.result[res.result.length - 1]
              if (
                this.recentActivityData.recentlyUsedPaperIds &&
                Object.keys(this.recentActivityData.recentlyUsedPaperIds)
                  .length > 0
              ) {
                this.sortPaperIdsByTimeModified()
                this.sortAndSeparateRecentPapers()
              }
            } else {
              this.filteredWithoutRecent = JSON.parse(
                JSON.stringify(this.mainSelectedSubjects)
              )
              this.withoutRecentList = JSON.parse(
                JSON.stringify(this.mainSelectedSubjects)
              )
            }
          }
        })
    },
    sortPaperIdsByTimeModified () {
      if (this.recentActivityData.recentlyUsedPaperIds) {
        var sortable = []
        for (var key in this.recentActivityData.recentlyUsedPaperIds) {
          sortable.push([
            key,
            this.recentActivityData.recentlyUsedPaperIds[key]
          ])
        }
        sortable.sort(function (a, b) {
          return b[1] - a[1]
        })
        var objSorted = {}
        sortable.forEach(function (item) {
          objSorted[item[0]] = item[1]
        })
        this.recentActivityData.recentlyUsedPaperIds = objSorted
      }
    },
    sortAndSeparateRecentPapers () {
      this.withoutRecentList = JSON.parse(
        JSON.stringify(this.mainSelectedSubjects)
      )
      for (let key in this.recentActivityData.recentlyUsedPaperIds) {
        if (this.recentItemList.length < this.recentSubjectsLimit) {
          this.recentItemList.push(
            this.withoutRecentList.filter((item) => item.paperId === key)
          )
        }
      }
      this.recentItemList = this.recentItemList.flat(1)
      this.withoutRecentList = this.withoutRecentList.filter(
        (x) => !this.recentItemList.includes(x)
      )
      this.filteredRecent = JSON.parse(JSON.stringify(this.recentItemList))
      this.filteredWithoutRecent = JSON.parse(
        JSON.stringify(this.withoutRecentList)
      )
    }
  }
}
</script>

<style lang="scss"></style>
