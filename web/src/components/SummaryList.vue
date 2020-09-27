<template>
  <div class="col-12">
    <div class="row">
      <div class="col-12 mt-4">
        <div
          class="unit-title d-flex align-items-center justify-content-between mb-0"
          :class="visible ? null : 'collapsed'"
          :aria-expanded="visible ? 'true' : 'false'"
          aria-controls="collapse-summary-4"
          @click="visible = !visible"
        >
          <div class="row align-items-center">
            <!-- <div class="col-auto">
                    <i class="mdi mdi-presentation-play" />
            </div>-->
            <div class="col">
              {{ $t('SummaryList.all_summaries') }}
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
      id="collapse-summary-4"
      v-model="visible"
      class="mt-2"
    >
      <div
        class="col-12 pl-0 light-text"
        v-if="isLoading||errorText"
      >
        <span v-if="isLoading">
          <i class="mdi mdi-spin mdi-chart-donut" />
          {{ $t('TeachingPlanDashboard.please_wait') }}
        </span>
        <span v-if="errorText">{{ errorText }}</span>
        <br>
        <button
          v-if="isError&&errorText"
          class="btn btn-blue"
          @click="fetchSummaryList"
        >
          {{ $t('TeachingPlanDashboard.try_again') }}
        </button>
      </div>
      <div class="presentation-holder">
        <div
          class="row"
          v-for="(cacheItem,index) in cacheList"
          :key="'cacheItem'+index"
        >
          <div
            class="col-12"
            @click="showSummary(cacheItem)"
          >
            <div class="card-default">
              <div class="row align-items-center">
                <div class="col-auto">
                  <i class="mdi mdi-playlist-play" />
                </div>

                <div class="col">
                  <div class="main-text">
                    {{ getTopicName(cacheItem.presentationId) }}
                  </div>
                  <div class="sub-text">
                    Conducted by {{ cacheItem.teacherName }}
                    <i>&nbsp;{{ convertDatetoGivenFormat(cacheItem.presentationStartTime*1000) }}</i>
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
</template>

<script>
import MQL from '@/plugins/mql.js'
import relativeTime from 'dayjs/plugin/relativeTime'
import dayjs from 'dayjs'
dayjs.extend(relativeTime)
export default {
  props: ['presentationList'],
  watch: {
    presentationList (newVal, oldVal) {
      if (newVal === oldVal) {
        return
      }
      this.presentationList = newVal
    }
  },
  data () {
    return {
      isError: false,
      isLoading: false,
      errorText: '',
      visible: true,
      cacheList: []
    }
  },
  mounted () {
    this.fetchSummaryList()
  },
  methods: {
    fetchSummaryList () {
      let selectedNode = this.$store.getters.selectedTOCNode
      let presentationIds = []
      if (selectedNode.activityDetails) {
        selectedNode.activityDetails.forEach(element => {
          if (element.type === 'classroomSuperpoint') {
            presentationIds.push({ presentationId: element.activityId })
          }
        })
      }
      this.isLoading = true
      this.isError = false
      this.errorText = ''
      let reqObj = {}
        reqObj['topicId'] = this.$store.getters.selectedTOCNode.topicId
        reqObj['teachingPlanId'] = this.$store.getters.teachingPlanId
        new MQL()
          .setActivity('r.[GetTopicSummaries]')
          .setData(reqObj)
          .fetch()
          .then((rs) => {
            let res = rs.getActivity('GetTopicSummaries', true)
            if (rs.isValid('GetTopicSummaries')) {
              if (res.result && res.result.summaries.length > 0) {
                // console.log(res.result.summaries)
                presentationIds.forEach(PIDs => {
                  let summaries = res.result.summaries.filter(summary => summary.presentationId === PIDs.presentationId)
                  this.cacheList.push(...summaries.reverse())
                this.isLoading = false
                  // resolve(summaries)
                })
                // this.$set(topic, 'summaryCount', res.result.summaries.length)
              }
            } else {
              this.errorText = this.$t('SummaryList.no_summary_found')
              // rs.showErrorToast('GetTopicSummaries')
            }
          }).catch(() => {
          // reject(err)
          this.isLoading = false
          this.isError = true
          this.errorText = this.$t('SummaryList.failed_to_fetch_summary')
        })
      // new MQL()
      //   .setActivity('o.[FetchFrequentlyAccessedPresentation]')
      //   .setData({ presentationIds: presentationIds })
      //   .fetch()
      //   .then(rs => {
      //     this.isLoading = false
      //     if (rs.isValid('FetchFrequentlyAccessedPresentation')) {
      //       let res = rs.getActivity('FetchFrequentlyAccessedPresentation', true)

      //       if (res && Array.isArray(res.result) && res.result.length > 0) {
      //         let closedPresentations = res.result.filter(presentation => presentation.summary !== null)
      //         this.cacheList = closedPresentations
      //       } else {
      //         this.errorText = this.$t('SummaryList.no_summary_found')
      //       }
      //       // let presentationList = [];
      //       // res.result.forEach(list => {
      //       //   if (Array.isArray(list) && list.length > 0) {
      //       //     presentationList.push(...list);
      //       //   }
      //       // });
      //       // } else {
      //       //   // reject(new Error('presentation not found'))
      //       // }
      //     }
      //   })
      //   .catch(err => {
      //     // reject(err)
      //     this.isLoading = false
      //     this.isError = true
      //     this.errorText = this.$t('SummaryList.failed_to_fetch_summary')
      //   })
    },

    convertDatetoGivenFormat (date) {
      // var dt = new Date(date)
      // var hours = dt.getHours() // gives the value in 24 hours format
      // var AmOrPm = hours >= 12 ? 'PM' : 'AM'
      // hours = (hours % 12) || 12
      // var minutes = dt.getMinutes()
      // var finalTime = '' + hours + ':' + minutes + ' ' + AmOrPm

      return dayjs().to(dayjs(date))
    },
    showSummary (summary) {
      let presentationData = this.presentationList.find(presentation => presentation.presentationId === summary.presentationId)

      this.$store.commit('setSummary', presentationData)
      let data = {
        presentationCacheId: summary.presentationCacheId
      }
      new MQL()
      .setActivity('r.[FetchRunnableStatsDataByPresentationCacheId]')
      .setData(data)
      .fetch()
       .then(rs => {
      let res = rs.getActivity('FetchRunnableStatsDataByPresentationCacheId', true)
      if (rs.isValid('FetchRunnableStatsDataByPresentationCacheId')) {
         this.$store.commit('setCurrentSummary', res.result[0])
         this.$router.push({ name: 'ClassSummary' })
      } else {
      rs.showErrorToast('FetchRunnableStatsDataByPresentationCacheId')
      }
      })
    },
    searchPresentations () {
      if (this.searchKey.length >= 3) {
        let tempArray = this.presentationList.filter(
          presentation =>
            presentation.name
              .toLowerCase()
              .includes(this.searchKey.toLowerCase())
        )

        this.filteredPresentations = this.cacheList.filter(presentation => presentation.presentationId === tempArray[0].presentationId)
      }
      if (this.searchKey === '') {
        this.filteredPresentations = this.cacheList
      }
    },
    // setCurrentPresentation (presentationId) {
    //   let data = {
    //     instituteId: this.$store.getters.selectedInstitute.instituteId,
    //     superGroupId: this.$store.getters.selectedClassroom._id,
    //     paperId: this.$store.getters.selectedSubject.paperId,
    //     presentationId: presentationId,
    //     superGroupName: this.$store.getters.selectedClassroom.name,
    //     teacherName: this.$store.getters.teacherDetails.basicInfo.fullName,
    //     classroomSubjectSessionId: this.$store.getters
    //       .classroomSubjectSessionId,
    //     presentationCacheId: this.$store.getters.presentationCacheId,
    //     sessionDateTime: this.$store.getters.sessionDateTime,
    //     teacherId: this.$store.getters.teacherDetails._id
    //   }
    //   return new Promise((resolve, reject) => {
    //     if (presentationId.length === 0) {
    //       reject(new Error(this.$t('presentations.please_provide_valid_presentation_id')))
    //     }
    //     new MQL()
    //       .setActivity('r.[SetCurrentPresentationRunnable]')
    //       .setData(data)
    //       .fetch()
    //       .then(rs => {
    //         if (rs.isValid('SetCurrentPresentationRunnable')) {
    //           let res = rs.getActivity('SetCurrentPresentationRunnable', true)

    //           if (res && res.result === 'SUCCESS') {

    //             resolve(presentationId)
    //           } else {
    //             reject(new Error('failed'))
    //           }
    //         } else {
    //           reject(new Error('failed'))
    //         }
    //       })
    //       .catch(err => {
    //         reject(err)
    //       })
    //   })
    // },
    // setCurrentSlide (presentationId, slideId) {
    //   return new Promise((resolve, reject) => {
    //     if (presentationId.length === 0) {
    //       reject(new Error(this.$t('presentations.please_provide_valid_presentation_id')))
    //     }
    //     new MQL()
    //       .setActivity('r.[SetCurrentSlide]')
    //       .setData({ presentationId: presentationId, slideId: slideId, isShowWelcome: true })
    //       .fetch()
    //       .then(rs => {
    //         if (rs.isValid('SetCurrentSlide')) {
    //           let res = rs.getActivity('SetCurrentSlide', true)

    //           if (res && res.result.currentSlide != null) {

    //             resolve(slideId)
    //           } else {
    //             reject(new Error('failed'))
    //           }
    //         } else {
    //           reject(new Error('failed'))
    //         }
    //       })
    //       .catch(err => {
    //         reject(err)
    //       })
    //   })
    // },
    getTopicName (id) {
      let topic = this.presentationList.find(ppt => ppt.presentationId === id)
      // topic.summary.name = topic.name

      if (topic) {
        return topic.name
      } else {
        return 'Presentation'
      }
    },
    getPresentationDescription (id) {
      let presentation = this.presentationList.find(ppt => ppt.presentationId === id)
      if (presentation) {
        // presentation.summary.description = presentation.description
        return presentation.description
      } else {
        return 'Presentation Description'
      }
    },
    getImageURL (presentationId) {
      let presentation = this.presentationList.find(ppt => ppt.presentationId === presentationId)
      return 'http://' + this.$store.getters.config.ipAddress + ':' + this.$store.getters.config.appPort + '/o/assetfdb/' + presentation.slidesMetadata[0].previewImgURL
      // return presentation.assetPath.embeddedAssets[presentation.slidesMetadata[0].previewImgURL]
    }
  }
}
</script>
