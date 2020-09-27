<template>
  <div>
    <TopMenu />
    <div class="ViewPresentation wrap-alt">
      <div class="page-title">
        {{ $store.getters.selectedTOCNode.topicName }}
      </div>

      <div class="row">
        <div class="col-12">
          <div class="row">
            <div class="col-12 mt-4">
              <div
                class="unit-title d-flex align-items-center justify-content-between mb-0"
                :class="visible ? null : 'collapsed'"
                :aria-expanded="visible ? 'true' : 'false'"
                aria-controls="collapse-4"
                @click="visible = !visible"
              >
                <div class="row align-items-center">
                  <!-- <div class="col-auto">
                    <i class="mdi mdi-presentation-play" />
                  </div>-->
                  <div class="col">
                    {{ $t('TopicDetails.presentation') }}
                    <!-- <div class="sub-text">
                      Unit 1
                    </div>-->
                  </div>
                </div>
                <div class>
                  <span class="when-opened">
                    <i
                      class="mdi mdi-chevron-down"
                      aria-hidden="true"
                    />
                  </span>
                  <span class="when-closed">
                    <i
                      class="mdi mdi-chevron-right"
                      aria-hidden="true"
                    />
                  </span>
                </div>
              </div>
            </div>
          </div>
          <b-collapse
            id="collapse-4"
            v-model="visible"
            class="mt-2"
          >
            <div
              class="col-12 pl-0 light-text"
              v-if="isLoading || errorText"
            >
              <span v-if="isLoading">
                <i class="mdi mdi-spin mdi-chart-donut" />
                {{ $t('TeachingPlanDashboard.please_wait') }}
              </span>
              <span
                class="mb-2"
                v-if="errorText"
              >{{ errorText }}</span>
              <button
                v-if="isError && errorText"
                class="btn btn-blue"
                @click="fetchTeachingPlan"
              >
                {{ $t('TeachingPlanDashboard.try_again') }}
              </button>
            </div>
            <div class="presentation-holder">
              <div
                class="row"
                v-for="(presentation, index) in activityList"
                :key="'presentation' + index"
              >
                <!-- :disabled="startInProgress" -->
                <div
                  class="col-12 "
                  :disabled="startInProgress"
                  @click="startPresentation(presentation)"
                >
                  <div class="card-default">
                    <div class="row align-items-center">
                      <div class="col-auto">
                        <i class="mdi mdi-presentation-play" />
                      </div>

                      <div class="col">
                        <div class="main-text">
                          {{ presentation.name }}
                        </div>
                        <div class="sub-text">
                          {{ presentation.description }}
                        </div>
                        <!-- <span class="tags">Tag name</span>
                        <span class="tags">Another tag</span>-->
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </b-collapse>
        </div>
        <Resource />
        <SummaryList :presentation-list="activityList" />
      </div>
    </div>
  </div>
</template>

<script>
// import TopMenu from '@/components/common/TopMenu'
// import BottomMenu from '@/components/common/BottomMenu'
import MQL from '@/plugins/mql.js'
import TopMenu from '../components/common/TopMenu'
import SystemDialog from '../utils/SystemDialog'
import Resource from '@/components/Resource'
import SummaryList from '@/components/SummaryList'
import { ClassroomModes } from '@/utils/Constants'
import Configs from '../utils/Configs'

export default {
  name: 'ViewPresentation',
  components: {
    TopMenu,
    Resource,
    SummaryList
  },
  data () {
    return {
      activityList: [],
      isLoading: false,
      errorText: '',
      isError: false,
      visible: true,
      startInProgress: false
    }
  },
  mounted () {
    this.getPresentationsList()
  },
  methods: {
    viewPresentationPreview (presentationId) {
      // let currentView = {
      //   viewName: "PresentationPreview",
      //   selectedPresentationId: presentationId
      //   // selectedSubject: JSON.parse(JSON.stringify(subject))
      // };
      // this.$viewSync.updateCurrentView(currentView);
      // this.$store.commit('selectedPresentationId',presentationId)
      // this.$router.push('PresentationSlide')
    },
    localNetworkError (err) {
      if (err && err === 'NETWORK_ERROR') {
        SystemDialog.show(
          this.$t('TopicDetails.unable_to_connect_server'),
          this.$t(
            'TopicDetails.please_make_sure_that_server_is_running_and_you_have_connected_to_the_same_wifi'
          ),
          this.$t('TopicDetails.okay'),
          () => {}
        )
      }
    },
    startPresentation (presentation) {
      this.startInProgress = true
      let slideId = ''
      if (
        presentation.slidesMetadata &&
        presentation.slidesMetadata.length > 0
      ) {
        slideId = presentation.slidesMetadata[0].slideId
      }
      if (slideId === '') {
        this.$toasted.error(
          this.$t('TopicDetails.presentation_does_not_contain_any_slide')
        )
        return
      }
      this.$store.commit('presentationDetails', presentation)
      // this.$store.dispatch("clearActiveUsers");
      this.setActiveUsersFromTeacher()
        .then((res) => {
          this.$store.commit(
            'presentationCacheId',
            res.activeUsers.presentationCacheId
          )
          this.setCurrentSessionDetails()
          this.setCurrentPresentation(presentation.presentationId)
            .then(() => {
              if (this.$store.getters.classroomMode === ClassroomModes.online) {
                this.setOnlineClassroom(presentation).then((result) => {
                  this.$store.dispatch('resetConnectedUsers')
                  this.setCurrentSessionDetails()
                  this.setTeacherRecentActivityDetails()
                  // this.$router.push({ name: 'SharePresentation' })
                  this.$store
                    .dispatch('getCurrentPresentationDetails', {})
                    .then((res) => {
                      if (
                        res &&
                        res.slidesMetadata &&
                        res.slidesMetadata.length > 0
                      ) {
                        this.$store.commit(
                          'setCurrentSelectedPresentation',
                          res
                        )
                      }
                      this.$router.push({ name: 'SharePresentation' })
                    })
                })
              } else {
                this.setCurrentSlide(presentation.presentationId, slideId)
                  .then(() => {
                    this.setTeacherRecentActivityDetails()
                    this.$router.push({ name: 'PresentationSlide' })
                  })
                  .catch((err) => {
                    this.localNetworkError(err)
                  })
              }
            })
            .catch((err) => {
              this.localNetworkError(err)
              this.startInProgress = false
            })
        })
        .catch((err) => {
          this.localNetworkError(err)
          this.startInProgress = false
        })
    },
    setCurrentSlide (presentationId, slideId) {
      return new Promise((resolve, reject) => {
        let self = this
        if (presentationId.length === 0) {
          reject(new Error(self.$t('TopicDetails.please_provide_valid_presentationid')))
        }
        new MQL()
          .setActivity('r.[SetCurrentSlide]')
          .setData({
            presentationId: presentationId,
            slideId: slideId,
            isShowWelcome: true,
            sessionManagerId: this.$store.getters.sessionManagerId
          })
          .fetch()
          .then((rs) => {
            if (rs.isValid('SetCurrentSlide')) {
              let res = rs.getActivity('SetCurrentSlide', false)

              if (res && res.result.currentSlide != null) {
                resolve(slideId)
              } else {
                reject(new Error(self.$t('TopicDetails.failed')))
              }
            } else {
              reject(new Error(self.$t('TopicDetails.failed')))
            }
          })
          .catch((err) => {
            reject('NETWORK_ERROR')
          })
      })
    },
    setCurrentPresentation (presentationId) {
      return new Promise((resolve, reject) => {
        let self = this
        if (presentationId.length === 0) {
          reject(new Error(self.$t('TopicDetails.please_provide_valid_presentationid')))
        }
        var url = new URL(Configs.getOnlineClassroomURL())
        let clientOriginURL = url.protocol + '//' + url.host
        new MQL()
          .setActivity('r.[SetCurrentPresentationRunnable]')
          .setData({
            instituteId: this.$store.getters.teacherDetails.instituteId,
            superGroupId: this.$store.getters.selectedClassroom._id,
            paperId: this.$store.getters.selectedSubject.paperId,
            presentationId: presentationId,
            superGroupName: this.$store.getters.selectedClassroom.name,
            teacherName: this.$store.getters.teacherDetails.basicInfo.fullName,
            classroomSubjectSessionId: this.$store.getters
              .classroomSubjectSessionId,
            presentationCacheId: this.$store.getters.presentationCacheId,
            sessionDateTime: this.$store.getters.sessionDateTime,
            teacherId: this.$store.getters.teacherDetails._id,
            teachingPlanId: this.$store.getters.teachingPlanId,
            teachingPlanName: this.$store.getters.currentTeachingPlan
              .teachingPlanName,
            unitId: this.$store.getters.selectedUnit.unitId,
            unitName: this.$store.getters.selectedUnit.unitName,
            topicId: this.$store.getters.selectedTOCNode.topicId,
            topicName: this.$store.getters.selectedTOCNode.topicName,
            status: 'NOT_COMPLETED',
            sessionManagerId: this.$store.getters.sessionManagerId,
            clientOriginURL: clientOriginURL,
            classroomMode: this.$store.getters.classroomMode
          })
          .fetch()
          .then((rs) => {
            if (rs.isValid('SetCurrentPresentationRunnable')) {
              let res = rs.getActivity('SetCurrentPresentationRunnable', false)

              if (res && res.result === 'SUCCESS') {
                resolve(presentationId)
              } else {
                reject(new Error(self.$t('TopicDetails.failed')))
              }
            } else {
               reject(new Error(self.$t('TopicDetails.failed')))
            }
          })
          .catch((err) => {
            reject('NETWORK_ERROR')
          })
      })
    },
    getPresentationsList () {
      // let presentationList = [];
      let selectedNode = this.$store.getters.selectedTOCNode
      let presentationIds = []
      if (selectedNode.activityDetails) {
        selectedNode.activityDetails.forEach((element) => {
          if (element.type === 'classroomSuperpoint') {
            presentationIds.push({ presentationId: element.activityId })
          }
        })
      }

      // let teachingPlan = this.$store.getters.currentTeachingPlan;
      // if (
      //   teachingPlan &&
      //   selectedNode &&
      //   selectedNode.isPresentationsAttached
      // ) {
      //   presentationList = teachingPlan[selectedNode.aggregationId];
      // }
      if (presentationIds.length === 0) {
        this.isError = false
        this.errorText = this.$t('TopicDetails.no_presentations_available')
        return
      }

      this.isLoading = true
      this.errorText = ''
      new MQL()
        .setActivity('r.[FetchPresentationsByIds]')
        .setData({
          presentationIds: presentationIds
        })
        .fetch()
        .then((rs) => {
          this.isLoading = false
          if (rs.isValid('FetchPresentationsByIds')) {
            let res = rs.getActivity('FetchPresentationsByIds', false)
            this.activityList = res.result
          } else {
            rs.showErrorToast('FetchPresentationsByIds')
          }
        })
        .catch(() => {
          this.isLoading = false
          this.isError = true
          this.errorText = this.$t('TopicDetails.unable_to_connect_server')
        })
    },
    setOnlineClassroom (presentation) {
      return new Promise((resolve, reject) => {
        new MQL()
          .setActivity('r.[SetOnlineClassroom]')
          .setData({
            sessionManagerId: this.$store.getters.getSessionManagerId,
            instituteId: this.$store.getters.teacherDetails.instituteId
          })
          .fetch()
          .then((rs) => {
            if (rs.isValid('SetOnlineClassroom')) {
              let res = rs.getActivity('SetOnlineClassroom', false)
              this.$store.commit(
                'setCurrentClassroomPin',
                res.result.classroomPin
              )
              // this.$store.commit('setCurrentSelectedPresentation', presentation)
              this.setLiveClassroomDetails(res.result.classroomPin)
              resolve(res.result)
            } else {
              rs.showErrorToast('SetOnlineClassroom')
              reject(false)
            }
          })
      })
    },
    setLiveClassroomDetails (classroomPin) {
      return new Promise((resolve, reject) => {
        new MQL()
          .setActivity('r.[SetLiveClassroomDetails]')
          .setData({
              "instituteId": this.$store.getters.teacherDetails.instituteId,
              "paperId": this.$store.getters.selectedSubject.paperId,
              "teacherId": this.$store.getters.teacherDetails._id,
              "classroomPin": classroomPin
          })
          .fetch()
          .then((rs) => {
            if (rs.isValid('SetLiveClassroomDetails')) {
              let res = rs.getActivity('SetLiveClassroomDetails', false)
              resolve(true)
            } else {
              rs.showErrorToast('SetLiveClassroomDetails')
              reject(false)
            }
          })
      })
    },
    setActiveUsersFromTeacher () {
      return new Promise((resolve, reject) => {
        new MQL()
          .setActivity('r.[SetActiveUsersFromTeacher]')
          .setData({
            activeUsers: {
              classroomSubjectSessionId: this.$store.getters
                .classroomSubjectSessionId,
              superGroupId: this.$store.getters.selectedClassroom._id,
              paperId: this.$store.getters.selectedSubject.paperId,
              listOfUsers: [],
              listOfAllUsers: []
            },
            sessionManagerId: this.$store.getters.sessionManagerId
          })
          .fetch()
          .then((rs) => {
            if (rs.isValid('SetActiveUsersFromTeacher')) {
              let res = rs.getActivity('SetActiveUsersFromTeacher', false)
              resolve(res.result)
            } else {
              rs.showErrorToast('SetActiveUsersFromTeacher')
              reject(res.getRaw().SetActiveUsersFromTeacher.error)
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
              .classroomSubjectSessionId,
            presentationCacheId: this.$store.getters.presentationCacheId,
            teachingPlanId: this.$store.getters.teachingPlanId,
            unitId: this.$store.getters.selectedUnit.unitId,
            topicId: this.$store.getters.selectedTOCNode.topicId
          },
          sessionManagerId: this.$store.getters.sessionManagerId
        })
        .fetch()
        .then((rs) => {
          if (rs.isValid('SetCurrentSessionDetails')) {
            rs.getActivity('SetCurrentSessionDetails', false)
          } else {
            rs.showErrorToast('SetCurrentSessionDetails')
          }
        })
    },
    setTeacherRecentActivityDetails () {
      let teacherRecentActivities = this.$store.getters.teacherRecentActivities
      if (!teacherRecentActivities) {
        teacherRecentActivities = {}
        teacherRecentActivities._id = this.$store.getters.teacherDetails._id
        teacherRecentActivities.instituteId = this.$store.getters.teacherDetails.instituteId
      }
      let currentDatTime = Math.round(new Date().getTime() / 1000)
      let selectedPaperId = this.$store.getters.selectedSubject.paperId
      if (
        !teacherRecentActivities.hasOwnProperty('recentlyUsedPaperIds') ||
        Array.isArray(teacherRecentActivities.recentlyUsedPaperIds)
      ) {
        teacherRecentActivities['recentlyUsedPaperIds'] = {}
      }
      teacherRecentActivities.recentlyUsedPaperIds[selectedPaperId] = currentDatTime

      let selectedsuperGrpId = this.$store.getters.selectedClassroom._id
      if (
        !teacherRecentActivities.hasOwnProperty('recentlyUsedSupergroupIds') ||
        Array.isArray(teacherRecentActivities.recentlyUsedSupergroupIds)
      ) {
        teacherRecentActivities['recentlyUsedSupergroupIds'] = {}
      }
      teacherRecentActivities.recentlyUsedSupergroupIds[selectedsuperGrpId] = currentDatTime

      new MQL()
        .setActivity('r.[UpsertTeacherRecentActivityDetails]')
        .setData(teacherRecentActivities)
        .fetch()
        .then(() => {
          this.$store.commit('teacherRecentActivities', teacherRecentActivities)
        })
    }
  }
}
</script>
