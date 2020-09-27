<template>
  <div>
    <div>
      <TopMenu />
    </div>
    <div class="TeachingPlanDashboard wrap-alt bg-main">
      <!-- <div class="row">
        <div class="col-12 search">
          <div class="input-group mt-4 mb-2">
            <input
              type="text"
              class="form-control"
              aria-label="Search topic"
              aria-describedby="basic-addon1"
              placeholder="Search"
            >
            <div class="input-group-prepend">
              <span
                class="input-group-text"
                id="basic-addon1"
              ><i class="mdi mdi-magnify" /></span>
            </div>
          </div>
        </div>
      </div>-->
      <!-- <div class="row">
        <div class="col-md-12">
          <div class="form-group">
            <div class="form-label">
              And these checkboxes?
            </div>
            <div class="custom-control custom-checkbox">
              <input
                type="checkbox"
                class="custom-control-input"
                id="customCheck1"
              >
              <label
                class="custom-control-label"
                for="customCheck1"
              >Check this custom checkbox</label>
            </div>
          </div>
        </div>
      </div>-->
      <div class="row">
        <div class="col-12">
          <div class="page-title">
            {{ $store.getters.selectedClassroom.name }} -
            {{ $store.getters.selectedSubject.paperName }}
          </div>
          <div class="card-blue">
            <div class="row">
              <div class="col-12 mb-3">
                <span class="icon">
                  <i class="mdi mdi-account-multiple" />
                </span>
                <span class="sub-title">{{
                  $t('TeachingPlanDashboard.student_details')
                }}</span>
                <span style="float:right;font-size:25px;width: 25px;">
                  <i
                    :disabled="isLoadingLearners"
                    @click="fetchConnectedLearners"
                    :class="{
                      mdi: true,
                      'mdi-spin': isLoadingLearners,
                      'mdi-refresh': true
                    }"
                  />
                </span>
              </div>
              <div class="students-count">
                <!-- <div class="count pr-4 borderRight"> -->
                <!-- <div > -->
                <span class="count pr-4"> {{ connectedLearners }} </span>
                <!-- </div> -->
                <div>{{ $t('TeachingPlanDashboard.students_connected') }}</div>

                <!-- <div class="count pl-4">
                  {{ totalLearners>0?(totalLearners-connectedLearners):0 }}
                  <div>{{ $t('TeachingPlanDashboard.absent') }}</div>
                </div> -->
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-12 search">
          <div class="input-group mt-4 mb-2">
            <input
              v-model="searchKey"
              type="text"
              @input="searchTeachingPlan"
              class="form-control"
              aria-label="Search topic"
              aria-describedby="basic-addon1"
              :placeholder="$t('TeachingPlanDashboard.search')"
              :disabled="teachingPlanNotFound"
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
        <div
          class="col-12 loader-box"
          v-if="isLoading || errorText"
        >
          <span v-if="isLoading">
            <i class="mdi mdi-spin mdi-chart-donut" />
            {{ $t('TeachingPlanDashboard.please_wait') }}
          </span>
          <span v-if="errorText">{{ errorText }}</span>
          <br>
          <button
            v-if="isError && errorText"
            class="btn btn-blue"
            @click="fetchTeachingPlan"
          >
            {{ $t('TeachingPlanDashboard.try_again') }}
          </button>
        </div>
        <div
          class="col-12 empty-state"
          v-if="teachingPlanNotFound"
        >
          <div class="title ">
            {{ $t('TeachingPlanDashboard.no_teaching_plan_available') }}
          </div>
          <div class="sub-title">
            {{
              $t(
                'TeachingPlanDashboard.upload_teaching_plan_from_your_teacher_cloud_app'
              )
            }}
          </div>
        </div>
        <div
          class="col-12 mb-4"
          v-for="(rootNode, rootIndex) in teachingPlan"
          :key="'rootNode' + rootIndex"
        >
          <div class="row">
            <div class="col-12 mt-4">
              <div
                class="unit-title d-flex align-items-center justify-content-between"
                v-b-toggle="'collapse-' + rootIndex"
              >
                <div class="row">
                  <div class="col-auto">
                    <i class="mdi mdi-file-document" />
                  </div>
                  <div class="col">
                    {{ $t('TeachingPlanDashboard.unit') }} {{ rootIndex + 1 }}
                    <div class="sub-text">
                      {{ rootNode.unitName }}
                    </div>
                  </div>
                </div>
                <div>
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
            visible
            :id="'collapse-' + rootIndex"
          >
            <ul class="row align-items-center ul-list">
              <li
                class="col-12 li-list"
                v-for="(childNode, childIndex) in rootNode.topics"
                :key="childIndex"
              >
                <div class="row align-items-center">
                  <div class="col-auto">
                    <div class="form-group">
                      <div class="custom-control custom-checkbox">
                        <input
                          type="checkbox"
                          class="custom-control-input"
                          :id="'customCheck1' + childNode.topicId"
                          disabled
                          :checked="isCompleted(childNode.completionStatus)"
                        >
                        <label
                          class="custom-control-label"
                          :for="'customCheck1' + childNode.topicId"
                        />
                      </div>
                    </div>
                  </div>
                  <div class="col topic pl-0">
                    <div
                      class="card-default"
                      @click="viewPresentation(rootNode, childNode)"
                    >
                      <div class="mb-3">
                        <span
                          class="sub-text"
                        >{{
                          isCompleted(childNode.completionStatus)
                            ? $t('TeachingPlanDashboard.completed_on')
                            : $t('TeachingPlanDashboard.planned_on') + ' '
                        }}&nbsp;</span>
                        <span class="sub-text-alt">{{
                          isCompleted(childNode.completionStatus)
                            ? getParsedDate(childNode.completionDate)
                            : getParsedDate(childNode.plannedDate)
                        }}</span>
                      </div>
                      <div class="sub-text-alt">
                        {{ childNode.topicName }}
                      </div>
                      <div class="sub-text">
                        {{
                          childNode.activityDetails
                            ? childNode.activityDetails.length +
                              ' ' +
                              (childNode.activityDetails.length > 1
                                ? $t('TeachingPlanDashboard.presentations')
                                : $t('TeachingPlanDashboard.presentation'))
                            : $t('TeachingPlanDashboard.no_presentations')
                        }}
                      </div>
                      <div class="sub-text">
                        {{
                          childNode.summaryCount
                            ? childNode.summaryCount +
                              ' ' +
                              (childNode.summaryCount
                                ? $t('TeachingPlanDashboard.summaries')
                                : $t('TeachingPlanDashboard.summaries'))
                            : $t('TeachingPlanDashboard.no_summaries')
                        }}
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            </ul>
          </b-collapse>
        </div>
      </div>
      <!-- <div class="row">
        <div
          class="col-12"
          v-for="(rootNode,rootIndex) in teachingPlan"
          :key="'rootNode'+rootIndex"
        >
          <div class="row justify-content-end">
            <div class="col">
              <span class="title">{{ rootNode.unitName }}</span>
            </div>
            <div class="col change-unit">
              <router-link to="/SelectUnit">
                Change Unit
              </router-link>
            </div>
          </div>
          <div
            class="row align-items-center"
            v-for="(childNode,childIndex) in rootNode.topics"
            :key="childIndex"
          >
            <div class="col-12">
              <div class="row align-items-top">
                <div class="col-auto">
                  <div class="form-group">
                    <div class="custom-control custom-checkbox">
                      <input
                        type="checkbox"
                        class="custom-control-input"
                        :id="'customCheck1'+childNode.topicId"
                        :checked="isCompleted(childNode.completionStatus)"
                      >
                      <label
                        class="custom-control-label"
                        :for="'customCheck1'+childNode.topicId"
                      />
                    </div>
                  </div>
                </div>
                <div class="col topic">
                  <div>
                    {{ isCompleted(childNode.completionStatus)?'Completed':'Will complete' }} on
                    <strong>{{ getParsedDate(childNode.plannedDate) }}</strong>
                  </div>

                  <div
                    @click="viewPresentation(childNode)"
                    class="card-default"
                  >
                    <div class="sub-text">
                      {{ childNode.topicName }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>-->
      <!-- <button
        @click="viewAllUnits"
        class="btn btn-block btn-orange"
      >
        View all units
      </button>-->
    </div>
  </div>
</template>

<script>
import TopMenu from '@/components/common/TopMenu'
import MQL from '@/plugins/mql.js'
import * as Constants from '../utils/Constants'
export default {
  name: 'TeachingPlanDashboard',
  components: {
    TopMenu
    // BottomMenu
  },
  data () {
    return {
      isLoading: false,
      errorText: '',
      isError: false,
      nodeColors: ['pink', 'orange', 'teal', 'indigo', 'yellow', 'blue'],
      teachingPlan: [],
      mainTeachingPlan: [],
      listOfNodes: [],
      searchKey: '',
      isLoadingLearners: false,
      totalLearners: 0,
      connectedLearners: this.$store.getters.connectedLearners,
      teachingPlanNotFound: false
    }
  },
  mounted () {
    this.fetchTeachingPlan()
    this.fetchTotalLearners()
  },
  computed: {
    selectedClassroom () {
      return this.$store.getters.selectedClassroom
    },
    selectedSubject () {
      return this.$store.getters.selectedSubject
    }
  },
  methods: {
    fetchTotalLearners () {
      this.isLoadingLearners = true
      new MQL()
        .setActivity('r.[GetLearnersByInstituteSuperGroupAndPaper]')
        .setData({
          instituteId: this.$store.getters.teacherDetails.instituteId,
          superGroupId: this.$store.getters.selectedClassroom._id,
          paperId: this.$store.getters.selectedSubject.paperId
        })
        .fetch()
        .then((rs) => {
          this.isLoadingLearners = false
          if (rs.isValid('GetLearnersByInstituteSuperGroupAndPaper')) {
            let res = rs.getActivity(
              'GetLearnersByInstituteSuperGroupAndPaper',
              true
            )
            if (res.result == null) {
              return
            }
            this.totalLearners = res.result.length
            this.startTriggering(1000)
          } else {
            rs.showErrorToast('GetLearnersByInstituteSuperGroupAndPaper')
          }
        })
    },
    startTriggering (interval) {
      setTimeout(() => {
        // console.log("startTriggering", interval);
        if (this._isDestroyed) {
          return
        }
        if (this.isLoadingLearners) {
          this.startTriggering(interval + interval)
          return
        }
        this.fetchConnectedLearners().then(() => {
          this.startTriggering(interval + interval)
        })
      }, interval)
    },
    fetchConnectedLearners () {
      return new Promise((resolve, _) => {
        this.isLoadingLearners = true
        new MQL()
          .setActivity('r.[GetConnectedUsers]')
          .setData({ sessionManagerId: this.$store.getters.sessionManagerId })
          .fetch()
          .then((rs) => {
            resolve()
            this.isLoadingLearners = false
            if (rs.isValid('GetConnectedUsers')) {
              let res = rs.getActivity('GetConnectedUsers', false)
              if (res.result.sessionResult == null) {
                return
              }
              this.connectedLearners =
                res.result.sessionResult.listOfUsers.length
              this.$store.commit('connectedLearners', this.connectedLearners)
            } else {
              rs.showErrorToast('GetConnectedUsers')
            }
          })
      })
    },
    getParsedDate (seconds) {
      var t = new Date(seconds * 1000) // Epoch
      var Months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      return ('0' + t.getDate()).slice(-2) + ' ' + Months[t.getMonth()] + ',' + ' ' + t.getFullYear()
    },
    viewPresentation (unit, node) {
      // let currentView = {
      //   viewName: 'ViewPresentations',
      //   selectedTOCNode: node
      // }
      // this.$viewSync.updateCurrentView(currentView)
      this.$store.commit('selectedTOCNode', node)
      this.$store.commit('selectedUnit', unit)
      this.$router.push('TopicDetails')
      this.setCurrentSessionDetails(unit.unitId, node)
    },
    setCurrentSessionDetails (unitId, node) {
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
            teachingPlanId: this.mainTeachingPlan._id,
            unitId: unitId,
            topicId: node.topicId
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
    viewAllUnits () {
      let currentView = {
        viewName: 'TeachingPlanUnitWise'
        // selectedSubject: JSON.parse(JSON.stringify(subject))
      }
      this.$viewSync.updateCurrentView(currentView)
    },
    isCompleted (status) {
      return status === Constants.TEACHING_PLAN_STATUS.COMPLETED
    },
    fetchTeachingPlan () {
      this.isLoading = true
      this.errorText = ''
      new MQL()
        .setActivity('r.[GetTeachingPlanbyPaperId]')
        .setData({
          paperId: this.$store.getters.selectedSubject.paperId
        })
        .fetch()
        .then((rs) => {
          this.isLoading = false
          let res = rs.getActivity('GetTeachingPlanbyPaperId', true)
          if (rs.isValid('GetTeachingPlanbyPaperId')) {
            if (!res || !Array.isArray(res.result) || res.result.length === 0) {
              return
            }

            this.mainTeachingPlan = res.result[0]
            // this.teachingPlan = CommonUtils.generateTreeFromList(
            //   this.mainTeachingPlan.topicsData
            // );
            this.getTpResourceMappingByTpId(res.result[0]._id).then(resourceMapping => {
            // attach summary count
            this.$store.commit('resourceList', resourceMapping)
            let updatedTeachingPlan = this.mapResourceCountWithTeachingPlan(res.result[0], resourceMapping)
            this.mainTeachingPlan = updatedTeachingPlan
            if (
              this.mainTeachingPlan &&
              this.mainTeachingPlan.headerData &&
              this.mainTeachingPlan.headerData.teachingPlanDetails
            ) {
              this.teachingPlanNotFound = false

              this.teachingPlan = JSON.parse(
                JSON.stringify(
                  this.mainTeachingPlan.headerData.teachingPlanDetails
                )
              )
              // sorting topics
              for (let i = 0; i < this.teachingPlan.length; i++) {
                if (this.teachingPlan[i].topics && Array.isArray(this.teachingPlan[i].topics)) {
                  this.teachingPlan[i].topics = this.orderBy(this.teachingPlan[i].topics, 'topicOrdinality')
                }
              }
              // sorting units
              this.teachingPlan = this.orderBy(this.teachingPlan, 'unitOrdinality')
              this.$store.commit(
                'currentTeachingPlan',
                JSON.parse(JSON.stringify(this.mainTeachingPlan))
              )
              this.$store.commit('teachingPlanId', this.mainTeachingPlan._id)
              this.teachingPlan.forEach((units) => {
                units.topics.forEach((topic) => {
                  this.getSummariesCount(topic)
                })
              })
            } else {
              this.teachingPlanNotFound = true
            }
            })
          } else {
            rs.showErrorToast('GetTeachingPlanbyPaperId')
          }
        })
        .catch((err) => {
          console.error(err)
          this.isLoading = false
          this.isError = true
          this.errorText = this.$t(
            'TeachingPlanDashboard.unable_to_connect_server'
          )
        })
    },
    isCompletedNode (rootNode) {
      for (let index = 0; index < rootNode.childs.length; index++) {
        const childNode = rootNode.childs[index]

        if (
          childNode.completionStatus !== Constants.TEACHING_PLAN_STATUS.COMPLETED
        ) {
          rootNode.completionStatus =
            Constants.TEACHING_PLAN_STATUS.NOT_COMPLETE
          return false
        }
      }
      return true
    },
    checkNode (node) {
      node.completionStatus =
        node.completionStatus === Constants.TEACHING_PLAN_STATUS.COMPLETED
          ? Constants.TEACHING_PLAN_STATUS.NOT_COMPLETE
          : Constants.TEACHING_PLAN_STATUS.COMPLETED
    },
    searchTeachingPlan () {
      if (this.isError && this.errorText) {
        return
      }
      let filteredTeachingPlan = []
      let fullTeachingPlan = JSON.parse(
        JSON.stringify(this.mainTeachingPlan.headerData.teachingPlanDetails)
      )

      this.errorText = ''

      if (this.searchKey === '') {
        filteredTeachingPlan = fullTeachingPlan
        this.teachingPlan = filteredTeachingPlan
        return
      }

      if (this.searchKey.length >= 3) {
        // filter by unit
        filteredTeachingPlan = fullTeachingPlan.filter((unit) =>
          unit.unitName.toLowerCase().includes(this.searchKey.toLowerCase())
        )
        // filter by topic name
        fullTeachingPlan.forEach((unit) => {
          let filterTopics = unit.topics.filter((t) =>
            t.topicName.toLowerCase().includes(this.searchKey.toLowerCase())
          )
          // console.log('filterTopics', filterTopics)
          if (filterTopics.length !== 0) {
            let filteredUnit = JSON.parse(JSON.stringify(unit))
            filteredUnit.topics = filterTopics
            // check if filteredTeachingPlan contains unit already
            let isObjectPresent = filteredTeachingPlan.find(
              (unitObj) => unitObj.unitName === filteredUnit.unitName
            )

            if (isObjectPresent === undefined) {
              // add to filtered data
              filteredTeachingPlan.push(filteredUnit)
            }
          }
        })
        this.teachingPlan = filteredTeachingPlan

        if (this.teachingPlan.length === 0) {
          this.isError = false
          this.errorText = this.$t(
            'TeachingPlanDashboard.no_result_found_for_your_search'
          )
        }
      }
    },
    getSummariesCount (topic) {
      this.$set(topic, 'summaryCount', 0)
      let reqObj = {}
      reqObj['topicId'] = topic.topicId
      reqObj['teachingPlanId'] = this.$store.getters.teachingPlanId
      new MQL()
        .setActivity('r.[GetTopicSummaries]')
        .setData(reqObj)
        .fetch()
        .then((rs) => {
          let res = rs.getActivity('GetTopicSummaries', true)
          if (rs.isValid('GetTopicSummaries')) {
            if (res.result && res.result.summaries.length > 0) {
              this.$set(topic, 'summaryCount', res.result.summaries.length)
            }
          } else {
            rs.showErrorToast('GetTopicSummaries')
          }
        })
    },
    mapResourceCountWithTeachingPlan (teachingPlan, resources) {
      let updatedTeachingPlan = teachingPlan
      let topicIdResourceCntMap = {}
      let unitIdResourceCntMap = {}
      // console.log(JSON.stringify(resources))
      let resourcePlanCount = 0
      resources.forEach(resource => {
        if (resource.attachedTo === 'topic') {
          if (topicIdResourceCntMap[resource.attachedNodeId]) {
            topicIdResourceCntMap[resource.attachedNodeId]++
          } else {
            topicIdResourceCntMap[resource.attachedNodeId] = 1
          }
        } else if (resource.attachedTo === 'unit') {
          if (unitIdResourceCntMap[resource.attachedNodeId]) {
            unitIdResourceCntMap[resource.attachedNodeId]++
          } else {
            unitIdResourceCntMap[resource.attachedNodeId] = 1
          }
        } else if (resource.attachedTo === 'plan') {
          resourcePlanCount++
        }
      })
      for (let i = 0; i < teachingPlan.headerData.teachingPlanDetails.length; i++) {
        for (let j = 0; j < teachingPlan.headerData.teachingPlanDetails[i].topics.length; j++) {
          let topicId = teachingPlan.headerData.teachingPlanDetails[i].topics[j].topicId
          let unitId = teachingPlan.headerData.teachingPlanDetails[i].unitId
          updatedTeachingPlan.headerData.teachingPlanDetails[i].topics[j].resourceCount = 0
          if (topicIdResourceCntMap[topicId] || unitIdResourceCntMap[unitId] || resourcePlanCount !== 0) {
            if (topicIdResourceCntMap[topicId]) {
              updatedTeachingPlan.headerData.teachingPlanDetails[i].topics[j].resourceCount = updatedTeachingPlan.headerData.teachingPlanDetails[i].topics[j].resourceCount + topicIdResourceCntMap[topicId]
            }
            if (unitIdResourceCntMap[unitId]) {
              updatedTeachingPlan.headerData.teachingPlanDetails[i].topics[j].resourceCount = updatedTeachingPlan.headerData.teachingPlanDetails[i].topics[j].resourceCount + unitIdResourceCntMap[unitId]
            }
            updatedTeachingPlan.headerData.teachingPlanDetails[i].topics[j].resourceCount = updatedTeachingPlan.headerData.teachingPlanDetails[i].topics[j].resourceCount + resourcePlanCount
          } else {
            updatedTeachingPlan.headerData.teachingPlanDetails[i].topics[j].resourceCount = 0
          }
        }
      }
      return updatedTeachingPlan
    },
    getTpResourceMappingByTpId (teachingPlanId) {
      // GetTpResourceMappingByTpId
      return new Promise((resolve, reject) => {
        new MQL()
          .setActivity('r.[GetTpResourceMappingByTpId]')
          .setData({
            teachingPlanId: teachingPlanId
          })
          .fetch()
          .then((rs) => {
            if (rs.isValid('GetTpResourceMappingByTpId')) {
              let res = rs.getActivity('GetTpResourceMappingByTpId', true)
              resolve(res.result)
            } else {
              reject(rs.raw.GetTpResourceMappingByTpId.error)
            }
          }).catch(err => {
            reject(err)
          })
      })
    },
    orderBy (data, fieldToUse) {
      if (data && Array.isArray(data)) {
        data.sort(function (a, b) {
          return a[fieldToUse] - b[fieldToUse]
        })
      }
      return data
    }
  }
}
</script>
<style lang="scss">
.TeachingPlanDashboard {
  // background-position: center center;
  background-attachment: fixed;
  .unit.collapsed {
    .when-opened {
      display: none;
    }
  }
  // .collapsed > .when-opened,
  // :not(.collapsed) > .when-closed {
  //   display: none;
  // }
  // .when-opened,
  // .when-closed {
  //   margin-right: 10px;
  // }
  .search {
    margin-bottom: 10px;
  }
  .content {
    margin-top: 40px;
  }
  .topic {
    margin-top: 10px;
  }
  .card-default {
    margin-bottom: 0;
    padding: 25px 15px 20px 15px;
    // margin-top: 10px;
    // margin-bottom: 40px;
  }
  .change-unit {
    color: var(--orange-dark);
    text-align: right;
  }
  .card-blue {
    background: var(--blue);
    margin-top: 20px;
    // margin-bottom: 60px;
    color: var(--white);
    padding: 30px 30px 30px 30px;
    border-radius: 20px;
    // letter-spacing: 1px;
    font-weight: 300;
    .borderRight {
      border-right: 1px solid rgba(255, 255, 255, 0.15);
    }
    .students-count {
      display: flex;
      flex-direction: column;
      text-transform: capitalize;
      width: 100%;
      padding-left: 15px;
      padding-right: 15px;
      .count {
        flex: 1;
        font-size: 40px;
        line-height: 38px;
        margin-top: 10px;
      }
    }
    .icon {
      background: var(--blue-alt);
      padding: 12px 10px 8px 10px;
      margin-right: 10px;
      border-radius: 8px;
      .mdi {
        color: rgba(255, 255, 255, 0.7);
        font-size: 25px;
        vertical-align: middle;
      }
    }
    .sub-title {
      color: rgba(255, 255, 255, 0.7);
      font-size: 17px;
      width: 152px;
    }
  }
  .ul-list {
    padding: 0;
    list-style: none;
    position: relative;
    .li-list {
      position: relative;
      &:before {
        content: '';
        width: 1px;
        position: absolute;
        top: 70px;
        bottom: -60px;
        border-left: 2px dashed rgb(236, 237, 240);
        left: 30px;
        overflow: hidden;
      }
      &:last-of-type:before {
        bottom: 50%;
      }
    }
  }
  // .collapsed > .when-opened,
  // :not(.collapsed) > .when-closed {
  //   display: none;
  // }
  //  .when-opened,
  // .when-closed {
  //   margin-right: 10px;
  // }
  // .search {
  //   margin-bottom: 20px;
  // }
  .topic {
    margin-top: 8px;
  }
  .unit-title {
    &.card-default {
      margin-bottom: 20px;
      background: #fff;
    }
    .mdi {
      // color:lighten(#45529B, 30%);
      &.mdi-file-document {
        font-size: 28px;
        position: relative;
        // right:5px;
        // top:-5px;
      }
      // font-size:24px;
    }
  }
  // .card-default {
  //   margin-top: 5px;
  //   margin-bottom: 40px;
  // }
}

</style>
