<template>
  <div class="selectClass">
    <div>
      <TopMenu :title="$t('SelectClass.select_class')" />
    </div>
    <div class="SelectClass wrap-alt">
      <div
        class="mt-4 mb-3"
        v-if="isTemplateDownloading"
      >
        {{ $t('SelectClass.downloading_required_files') }}
        <!-- <div> {{ progress.index }}%  complete</div> -->
        <!-- </div> -->

        <div class="mt-2">
          <b-progress
            :max="progress.count"
            height="0.5rem"
            class="progress-bar-teal"
          >
            <b-progress-bar :value="progress.index" />
          </b-progress>
        </div>
      </div>

      <!-- <div v-if="isTemplateDownloading" class="row">
        <div class="col-12">
          <b-progress :max="progress.count" height="0.5rem">
            <b-progress-bar :value="progress.index" />
          </b-progress>
        </div>
        <div class="col-12">
          <span>Downloading required files...</span>
        </div>
      </div> -->
      <div class="row">
        <div class="col-12 search">
          <div class="input-group mt-4 mb-2">
            <input
              v-model="searchKey"
              @input="searchClassroom"
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
        class="row"
        v-if="isLoading || errorText"
      >
        <div class="col-12 loader-box">
          <span v-if="isLoading">
            <i class="mdi mdi-spin mdi-chart-donut" />
            {{ $t('SelectClass.please_wait') }}
          </span>
          <span v-if="errorText">{{ errorText }}</span>
          <br>
          <button
            v-if="isError && errorText"
            class="btn btn-blue"
            @click="fetchData"
          >
            {{ $t('SelectClass.try_again') }}
          </button>
        </div>
      </div>
      <div class="row">
        <div
          v-if="recentActivityData && filteredRecent.length !== 0"
          class="col-12"
        >
          <h4
            v-b-toggle.recent-selection
            class="recently-used-title mb-3"
          >
            {{ $t('SelectClass.recently_used') }}
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
              <template v-for="(classroom, index) in filteredRecent">
                <div
                  @click="selectClassroom(classroom)"
                  :key="'class' + index"
                  class="col-12"
                >
                  <div class="card-default">
                    <div class="row align-items-center">
                      <div class="col-auto">
                        <!-- <i class="mdi mdi-projector-screen mdi-24px" /> -->
                        <img src="../../public/assets/images/icon-class.svg">
                      </div>
                      <div class="col">
                        <div class="main-text">
                          {{ classroom.name }}
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
      <div
        class="row"
        @click="selectClassroom(superGroup)"
        v-for="(superGroup, index) in filteredWithoutRecent"
        :key="'class' + index"
      >
        <div class="col-12">
          <div class="card-default">
            <div class="row align-items-center">
              <div class="col-auto">
                <!-- <i class="mdi mdi-projector-screen mdi-24px" /> -->
                <img src="../../public/assets/images/icon-class.svg">
              </div>
              <div class="col">
                <div class="main-text">
                  {{ superGroup.name }}
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
    <!-- <div class="class-holder">
      <div
        @click="selectClassroom(classroom)"
        v-for="(classroom,index) in classroomList"
        :key="'class'+index"
        class="card card-class"
      >
        <div class="row align-items-center">
          <div class="col-auto icon-blue">
            <div class="icon">{{ index + 1 }}</div>
          </div>
          <div class="col">
            <div class="card-title">{{classroom.classroomName}}</div>
            <div class="sub-text">Last visited 2 days back</div>
          </div>
        </div>
      </div>
    </div>-->
    <!-- <BottomMenu /> -->
  </div>
</template>

<script>
import MQL from '@/plugins/mql.js'
import TopMenu from '@/components/common/TopMenu'
import { LOGOUT_PROCESS_STATUS } from '../utils/Constants'
// import TemplateDownload from '../utils/TemplateDownload'

export default {
  name: 'Dashboard',
  components: {
    TopMenu
  },
  data () {
    return {
      isLoading: false,
      mainSuperGroupList: [],
      searchKey: '',
      errorText: '',
      isError: false,
      isTemplateDownloading: false,
      isTemplateDownloadSuccess: typeof cordova === 'undefined',
      progress: {
        index: 0,
        count: 0
      },
      recentActivityData: null,
      recentItemList: [],
      filteredRecent: [],
      withoutRecentList: [],
      filteredWithoutRecent: [],
      recentClassroomLimit: 10
    }
  },
  created () {
    // console.log("teacher-details:class", this.$store.getters.teacherDetails);
  },
  mounted () {
    // registering custom back button listener
    this.$router.setCustomBackListener(this.customBackListener)

    // set session details
    this.setCurrentSessionDetails()
    // clear Connected Users
    this.$store.dispatch('clearConnectedUsers')
    // clear Active Users
    this.$store.dispatch('clearActiveUsers')

    this.fetchData()

    // required for Cordova
    document.addEventListener('deviceready', this.onDeviceReady, false)

    if (this.$store.getters.studentResponseSyncStatus === 'readyToSync') {
      this.startStudentResponseSync()
    }
  },
  beforeDestroy () {
    // removing custom back button listener
    this.$router.setCustomBackListener(null)
  },
  methods: {
    onDeviceReady () {
      // this.checkAndDownloadTemplates()
    },
    setCurrentSessionDetails () {
      new MQL()
        .setActivity('r.[SetCurrentSessionDetails]')
        .setData({
          sessionDetails: {
            token: sessionStorage.getItem('user-token'),
            teacher: this.$store.getters.teacherDetails,
            sessionManagerId: this.$store.getters.sessionManagerId
          }
        })
        .fetch()
        .then((rs) => {
          if (rs.isValid('SetCurrentSessionDetails')) {
            rs.getActivity('SetCurrentSessionDetails', false)
          } else {
            // rs.showErrorToast('SetCurrentSessionDetails')
          }
        })
        .catch((err) => {
          console.error(err)
          // reject('NETWORK_ERROR')
        })
    },
    fetchData () {
      if (this.$store.getters.IsTeacherMappingOn) {
        this.getClassroomByTeacherId()
      } else {
        this.getClassroomsByInstId()
      }
    },
    customBackListener () {
      this.$store
        .dispatch('logout')
        .then((status) => {
          switch (status) {
            case LOGOUT_PROCESS_STATUS.CONFIRMING:
              break
            case LOGOUT_PROCESS_STATUS.CANCELLED:
              break
            case LOGOUT_PROCESS_STATUS.PROCESSING:
              break
            case LOGOUT_PROCESS_STATUS.DONE:
              break

            default:
              break
          }
        })
        .catch((err) => {
          console.error(err)
        })
    },
    selectClassroom (classroom) {
      // if (!this.isTemplateDownloadSuccess) {
      //   SystemDialog.show(
      //     this.$t('SelectClass.download_files'),
      //     this.$t(
      //       'SelectClass.please_give_permission_to_download_required_files'
      //     ),
      //     this.$t('SelectClass.okay'),
      //     () => {
      //       this.checkAndDownloadTemplates()
      //     }
      //   )
      //   return
      // }
      this.$store.commit('selectedClassroom', classroom)
      this.$router.push('SelectSubject')
      // let currentView = {
      //   viewName: "SelectSubject",
      //   selectedClassroom: classroom
      // };
      // this.$viewSync.updateCurrentView(currentView);
    },
    getClassroomsByInstId () {
      this.isLoading = true
      this.errorText = ''
      new MQL()
        .setActivity('r.[GetAllSupergroupByInstId]')
        .setData({
          instituteId: this.$store.getters.teacherDetails.institute.instituteId
        })
        .fetch()
        .then((rs) => {
          if (rs.isValid('GetAllSupergroupByInstId')) {
            let res = rs.getActivity('GetAllSupergroupByInstId', false)
            // console.log("GetAllSupergroupByInstId" + JSON.stringify(res));
            if (res && Array.isArray(res.result)) {
              // this.filteredClassrooms = res.result;
              let instituteClassroomList = res.result
              let teacherClassroomList = JSON.parse(
                JSON.stringify(this.$store.getters.teacherDetails)
              )
              // teacherClassroomList.extended.allocationDetails;
              // console.log(instituteClassroomList)

              // prepare final classroom list
              let finalClassroomList = []
              instituteClassroomList.forEach((classroom) => {
                let preparedClassroom = {
                  _id: classroom._id,
                  name: classroom.name,
                  papers: []
                }
                finalClassroomList.push(preparedClassroom)
              })
              // console.log(finalClassroomList)
              // got final list
              this.mainSuperGroupList = JSON.parse(
                JSON.stringify(finalClassroomList)
              )
            } else {
              this.$toasted.error(
                this.$t('SelectClass.failed_to_fetch_classrooms'), {
            theme: 'bubble',
            duration: 4000
          }
              )
              // reject(new Error("teaching plan not found"));
            }
          } else {
            rs.showErrorToast('GetAllSupergroupByInstId')
            // reject(new Error("teaching plan not found"));
          }
          this.isLoading = false
          this.getTeacherRecentActivities()
        })
        .catch(() => {
          this.isLoading = false
          this.isError = true
          this.errorText = this.$t('SelectClass.unable_to_connect_server')
        })
    },
    getClassroomByTeacherId () {
      let allocationDetails = this.$store.getters.teacherDetails.extended
        .allocationDetails
      // got all superGroups and Papers
      let superGroupWithPapers = JSON.parse(JSON.stringify(allocationDetails))
      let finalsuperGroupList = []
      for (let index = 0; index < superGroupWithPapers.length; index++) {
        const superGroup = superGroupWithPapers[index]
        // extract superGroup details

        let classIndex = finalsuperGroupList.findIndex((element) => {
          return element._id == superGroup._id
        })
        if (classIndex == -1) {
          // this is for first time
          finalsuperGroupList.push({
            _id: superGroup._id,
            name: superGroup.name,
            papers: [
              {
                paperId: superGroup.paperId,
                paperName: superGroup.paperName
              }
            ]
          })
        } else {
          // this is for first time
          finalsuperGroupList[classIndex].papers.push({
            paperId: superGroup.paperId,
            paperName: superGroup.paperName
          })
        }
      }
      this.getTeacherRecentActivities()

      // got final list

      // new MQL()
      //   .setActivity("r.[GetTeacherwiseClassroomandSubject]")
      //   .setData({ teacherId: "1NH2bljfobo9ou6561AIkZqkS6I" })
      //   .fetch()
      //   .then(rs => {
      //     let res = rs.getActivity("GetTeacherwiseClassroomandSubject", true);
      //     if (rs.isValid("GetTeacherwiseClassroomandSubject")) {
      //       console.log(res.result);
      //       // got all classrooms and subjects
      //       let classroomWithSubjects = JSON.parse(JSON.stringify(res.result));
      //       let finalClassroomList = [];
      //       for (let index = 0; index < classroomWithSubjects.length; index++) {
      //         const classroom = classroomWithSubjects[index];
      //         // extract classroom details

      //         let classIndex = finalClassroomList.findIndex(element => {
      //           return element.classroomId == classroom.classroomId;
      //         });
      //         if (classIndex == -1) {
      //           // this is for first time
      //           finalClassroomList.push({
      //             classroomId: classroom.classroomId,
      //             classroomName: classroom.classroomName,
      //             subjects: [
      //               {
      //                 subjectId: classroom.subjectId,
      //                 subjectName: classroom.subjectName
      //               }
      //             ]
      //           });
      //         } else {
      //           // this is for first time
      //           finalClassroomList[classIndex].subjects.push({
      //             subjectId: classroom.subjectId,
      //             subjectName: classroom.subjectName
      //           });
      //         }
      //       }

      //       // got final list
      //       console.log(finalClassroomList);
      //       this.classroomList = finalClassroomList;

      //       // if (this.classroomList.length === 1) {
      //       //   this.selectClassroom(this.classroomList[0]);
      //       // }
      //     } else {
      //       rs.showErrorToast("GetTeacherwiseClassroomandSubject");
      //     }
      //   });
    },
    searchClassroom () {
      if (this.isError && this.errorText) {
        return
      }
      this.errorText = ''
      if (this.searchKey === '') {
        this.filteredRecent = this.recentItemList
        this.filteredWithoutRecent = this.withoutRecentList
      }

      if (this.searchKey.trim().length >= 3) {
        this.filteredRecent = this.recentItemList.filter((classroom) =>
          classroom.name.toLowerCase().includes(this.searchKey.toLowerCase())
        )
        this.filteredWithoutRecent = this.withoutRecentList.filter(
          (classroom) =>
            classroom.name.toLowerCase().includes(this.searchKey.toLowerCase())
        )

        if (
          this.filteredWithoutRecent.length == 0 &&
          this.filteredRecent.length == 0
        ) {
          this.isError = false
          this.errorText = this.$t(
            'SelectClass.no_result_found_for_your_search'
          )
        }
      }
    },
    checkAndDownloadTemplates () {
      this.isTemplateDownloading = true
      TemplateDownload.commonDownload('Teacher', (index, count, percent) => {
        this.progress.count = count
        this.progress.index = index
      })
        .then((templatesRootPath) => {
          if (typeof cordova === 'undefined') {
            return
          }
          this.$store.dispatch('setTemplateFolderPath', templatesRootPath)

          this.isTemplateDownloading = false
          this.isTemplateDownloadSuccess = true
        })
        .catch((err) => {
          this.isTemplateDownloading = false
          if (err == 'Permission denied.') {
            this.$toasted.error(this.$t('SelectClass.permission_denied_by_you'), {
            theme: 'bubble',
            duration: 4000
          })
          }
        })
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
              this.$store.commit(
                'teacherRecentActivities',
                this.recentActivityData
              )
              if (
                this.recentActivityData.recentlyUsedSupergroupIds &&
                Object.keys(this.recentActivityData.recentlyUsedSupergroupIds)
                  .length > 0
              ) {
                this.sortClassroomIdByTimeModified()
                this.sortAndSeparateRecentClass()
              }
            } else {
              this.filteredWithoutRecent = JSON.parse(
                JSON.stringify(this.mainSuperGroupList)
              )
              this.withoutRecentList = JSON.parse(
                JSON.stringify(this.mainSuperGroupList)
              )
            }
          }
        })
    },

    sortClassroomIdByTimeModified () {
      if (this.recentActivityData.recentlyUsedSupergroupIds) {
        var sortable = []
        for (var key in this.recentActivityData.recentlyUsedSupergroupIds) {
          sortable.push([
            key,
            this.recentActivityData.recentlyUsedSupergroupIds[key]
          ])
        }
        sortable.sort(function (a, b) {
          return b[1] - a[1]
        })
        var objSorted = {}
        sortable.forEach(function (item) {
          objSorted[item[0]] = item[1]
        })
        this.recentActivityData.recentlyUsedSupergroupIds = objSorted
      }
    },
    sortAndSeparateRecentClass () {
      this.withoutRecentList = JSON.parse(
        JSON.stringify(this.mainSuperGroupList)
      )
      for (let key in this.recentActivityData.recentlyUsedSupergroupIds) {
        if (this.recentItemList.length < this.recentClassroomLimit) {
          this.recentItemList.push(
            this.withoutRecentList.filter((item) => item._id == key)
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
    },
    // To start exporting student response and sync, if status is readyToSync
    startStudentResponseSync () {
      this.checkRunningPresentationStatusForInst().then((status) => {
        if (status === 'readyToSync') {
          let reqObj = {}
          reqObj['instituteId'] = this.$store.getters.teacherDetails.institute.instituteId
          reqObj['instituteName'] = this.$store.getters.teacherDetails.institute.instituteName
          reqObj['uploadedBy'] = this.$store.getters.teacherDetails.employeeCode
          reqObj['uploadingMode'] = 'TEACHER_MOBILE'
          new MQL()
            .setActivity('r.[ExportResponseLogDataByInstId]')
            .setData(reqObj)
            .fetch()
            .then((rs) => {
              let res = rs.getActivity('ExportResponseLogDataByInstId', true)
              if (rs.isValid('ExportResponseLogDataByInstId')) {
                if (res.result.status === 'success') {
                  this.$store.commit('studentResponseSyncStatus', 'synced') // Changing status to synced to change status in header icon
                  } else if (res.result.status === 'no data found to sync') {
                  this.$store.commit('studentResponseSyncStatus', 'notToSync') // Changing status to synced to change status in header icon
                }
              } else {
                rs.showErrorToast('ExportResponseLogDataByInstId')
              }
            })
        }
      })
    },
    // Checking for institute's status. if it's: inprogress then start polling
    checkRunningPresentationStatusForInst () {
      return new Promise((resolve, reject) => {
        var reqObj = {
          instituteId: this.$store.getters.selectedInstitute.instituteId
        }
        new MQL()
          .setActivity('r.[CheckAndUpdateInstSyncStatusByInstId]')
          .setData(reqObj)
          .fetch()
          .then((rs) => {
            let res = rs.getActivity(
              'CheckAndUpdateInstSyncStatusByInstId',
              true
            )
            if (rs.isValid('CheckAndUpdateInstSyncStatusByInstId')) {
              if (res.result) {
               switch (res.result.instResSyncStatus) {
                  case 'readyToSync':
                    resolve('readyToSync')
                    break
                  case 'inProgress':
                    this.$store.dispatch('getSyncStatusByInstId')
                    resolve('inProgress')
                    break
                  case 'canNotSync':
                    this.$store.commit('studentResponseSyncStatus', 'notToSync')
                    resolve('notToSync')
                    break
                }
              }
            } else {
              rs.showErrorToast('CheckAndUpdateInstSyncStatusByInstId')
              resolve('notToSync')
            }
          })
      })
    }
  }
}
</script>

<style lang="scss">
.teal-text {
  &:before {
    content: '';
    width: 10px;
    left: 0;
    right: 0;
    height: 10px;
    background: var(--teal-dark);
  }
}
.selectClass {
  .progress-bar-teal {
    .progress-bar {
      background: var(--teal);
    }
  }
  // .msg{
  //   display: flex;
  //   justify-content: space-between;
  // }
}
</style>
