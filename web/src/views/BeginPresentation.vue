<template>
  <div>
    <div>
      <TopMenu />
    </div>
    <div class="BeginPresentation wrap-alt wrap-alt-less-padding bg-alt">
      <div class="row">
        <div class="col-12">
          <div
            class="page-title"
          >
            {{ currentPresentation.name }}
          </div>
          <div
            class="page-subtitle"
          >
            {{ currentPresentation.topicName }}
          </div>
          <div class="card-blue">
            <div class="row">
              <div class="col-12 mb-3 d-flex align-items-center">
                <span class="icon">
                  <i class="mdi mdi-presentation-play" />
                </span>
                <span class="sub-title">
                  <div class="class-pin"> {{ $store.getters.getCurrentClassroomPin }}</div>
                  <div>
                    {{ $t('BeginPresentation.classroom_pin') }}
                  </div>
                </span>
              </div>
              <div class="students-count">
                <div class="count pr-4">
                  <span>{{ connectedLearners.length || 0 }}</span>
                </div>
                <div>{{ $t('BeginPresentation.students_connected') }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-12 dwnld-holder">
          <span class="icon">
            <div class="mdi mdi-cloud-download" />
            <div class="size">
              {{ getDownloadedSize }}
            </div>
          </span>
          <span class="sub-title">
            <div class="slides"> {{ $t('BeginPresentation.downloaded') }} <span style="width:22px;"> {{ getDownloadedResources }}</span> {{ $t('BeginPresentation.out_of') }} <span style="width:22px;">{{ getTotalResources }} </span>{{ $t('BeginPresentation.slides') }}</div>
            <div class="students">
              {{ $t('BeginPresentation.downloaded_by') }} <span style="width:22px;">{{ resourcesDownloadedLearners.length }} </span> {{ $t('BeginPresentation.students') }}
            </div>
            <div class="progress">
              <div
                class="progress-bar"
                role="progressbar"
                :aria-valuenow="Math.floor((getDownloadedResources/getTotalResources)*100)"
                aria-valuemin="0"
                aria-valuemax="100"
                :style="'width:'+Math.floor((getDownloadedResources/getTotalResources)*100)+'%'"
              />
            </div>
          </span>
        </div>
        <div
          class="col-12"
          style="margin-top:30px"
        >
          <div class="descp">
            {{ $t('BeginPresentation.description') }}
          </div>
          <div class="des-content">
            {{ currentPresentation.description }}
          </div>
        </div>
        <div class="col-12 creator">
          <span class="sub-title-creator">
            <div class="slides"> {{ $t('BeginPresentation.presentation_created_by') }}</div>
            <div class="students">
              {{ currentPresentation.author }}
            </div>
            <div class="students">
              <!-- {{ instituteName }} -->
            </div>
          </span>
          <!-- <span class="icon">
            <img
              src="../../public/assets/images/avatars/team14.jpg"
              width="80px"
              height="75px"
              style="border-radius:5px; object-fit:cover"
            >

          </span> -->

          <span class="icon">
            <div class="profile-pic-letter-alt1">
              <div
                class="first-letter"
              >
                <div
                  class="letter"
                >{{ currentPresentation.author ? currentPresentation.author.substr(0,1).toUpperCase() : '' }}</div>
              </div>
              <!-- <img

              src="../../public/assets/images/avatars/team14.jpg"
              width="80px"
              height="75px"
              style="border-radius:5px; object-fit:cover"
              >-->
              <!-- The image shall be of the author and not the presenter -->
              <!-- Hence commenting the below profile image preview -->
              <!-- <div
                class="img-holder"
                v-if="$store.getters.profileImagePath!=''"
              >
                <img
                  :src="$store.getters.profileImagePath"
                  width="80px"
                  height="75px"
                >
              </div> -->
            </div>
          </span>
        </div>
        <div
          class="col-12 strt-pres"
        >
          <button
            @click="startPresentation"
            class="btn btn-block btn-teal btn-effect-teal "
            ref="startPresentationBtn"
          >
            <i class="mdi mdi-play-circle mr-1" /> {{ $t('BeginPresentation.start_presentation') }}
          </button>
        </div>
        <!-- <div
          class="col-12 empty-state"
          v-if="teachingPlanNotFound"
        >
          <div class="title ">
            {{ $t('TeachingPlanDashboard.no_teaching_plan_available') }}
          </div>
          <div class="sub-title">
            {{ $t('TeachingPlanDashboard.upload_teaching_plan_from_your_teacher_cloud_app') }}
          </div>
        </div> -->
      </div>
    </div>
  </div>
</template>

<script>
import TopMenu from '@/components/common/TopMenu'
import MQL from '@/plugins/mql.js'
// import CommonUtils from '../utils/CommonUtils'
// import * as Constants from '../utils/Constants'
import idb from '../plugins/idb'
// import Configs from '../utils/Configs'
export default {
  name: 'BeginPresentation',
  components: {
    TopMenu
  },
  data () {
    return {
      currentPresentation: {},
      totalResources: 0,
      downloadedResources: 0,
      studentResourcesCompleted: 0,
      downloadedSize: 0,
      slideAssets: 0,
      downloadedAssets: 0,
      instituteName: '',
      connectedLearners: [],
      resourcesDownloadedLearners: [],
      pendingSlides: []
    }
  },
  computed: {
    getTotalResources () {
      return this.totalResources
    },
    getDownloadedResources () {
      return this.downloadedResources
    },
    getStudentResourcesCompleted () {
      return this.studentResourcesCompleted
    },
    getDownloadedSize () {
      let kbdata = Math.floor(this.downloadedSize / 1024)
      return kbdata > 1024 ? (kbdata / 1024).toFixed(1) + ' mb' : kbdata + ' kb'
    }
  },
  mounted () {
    this.currentPresentation = this.$store.getters.getCurrentSelectedPresentation
    // console.log('getConnectedPresentation', this.currentPresentation.presentationId, this.$store.getters.runningPresentationId)
    if (this.currentPresentation.presentationId !== this.$store.getters.runningPresentationId) {
      // clear
      idb.clear().then(() => {
        // console.log('clear')
        this.downLoadSlideDetaToIDB()
      })
      return
    }

    this.downLoadSlideDetaToIDB()
  },
  methods: {
    downLoadSlideDetaToIDB () {
      this.getResourcesCount(this.currentPresentation)
      let self = this
      idb.getItem('totalSize').then(data => {
        if (data) {
          self.downloadedSize = data
        }
      })
      this.prepareData(this.currentPresentation)
      this.startTriggering(5000)
      this.startDownloadStatusTrigger(3000)
      this.$store.commit('runningPresentationId', this.currentPresentation.presentationId)
    },
    startTriggering (interval) {
      setTimeout(() => {
        // console.log("startTriggering", interval);
        if (this._isDestroyed) {
          return
        }
        this.fetchConnectedLearners().then(() => {
          this.startTriggering(interval)
        })
      }, interval)
    },
    startDownloadStatusTrigger (interval) {
      setTimeout(() => {
        if (this._isDestroyed) {
          return
        }
        this.getResourceDownloadStatus().then(stopTimeout => {
          if (stopTimeout) {
            return
          }
          this.startDownloadStatusTrigger(interval)
        })
      }, interval)
    },
    getResourceDownloadStatus () {
      return new Promise((resolve, _) => {
        let resourcePool = this.$store.getters.resourcePool
        this.pendingSlides = []
        let index
        for (const key in resourcePool) {
          if (resourcePool.hasOwnProperty(key)) {
            // if (resourcePool[key].downloadingStatus !== "Completed" ) {
            if (!resourcePool[key].downloadingPercentage || (resourcePool[key].downloadingPercentage && resourcePool[key].downloadingPercentage !== 100)) {
              index = this.pendingSlides.findIndex(elem => elem === resourcePool[key].slideId)
              if (index == -1 && resourcePool[key].slideId) {
                this.pendingSlides.push(resourcePool[key].slideId)
              }
            }
          }
        }
        this.downloadedResources = this.totalResources - this.pendingSlides.length

        resolve(this.downloadedResources == this.totalResources)
      })
    },
    fetchConnectedLearners () {
      return new Promise((resolve, _) => {
        new MQL()
          .setActivity('r.[GetConnectedUsers, getCurrentPresentationDownloadStatus]')
          .setData({ 'sessionManagerId': this.$store.getters.sessionManagerId })
          .fetch()
          .then(rs => {
            resolve()
            if (rs.isValid('GetConnectedUsers')) {
              let res = rs.getActivity('GetConnectedUsers', true)
              if (res.result.sessionResult) {
                this.connectedLearners =
                res.result.sessionResult.listOfUsers
              }
            } else {
              rs.showErrorToast('GetConnectedUsers')
            }
            if (rs.isValid('getCurrentPresentationDownloadStatus')) {
              let res = rs.getActivity('getCurrentPresentationDownloadStatus', true)
              if (res.result.sessionResult) {
                this.resourcesDownloadedLearners =
                res.result.sessionResult
              }
            } else {
              rs.showErrorToast('getCurrentPresentationDownloadStatus')
            }
          })
      })
    },
    startPresentation () {
      this.$refs.startPresentationBtn.disabled = true
      let selectedPresentation = this.$store.getters.getCurrentSelectedPresentation
      this.setCurrentSlide(selectedPresentation.presentationId, selectedPresentation.slidesMetadata[0].slideId)
        .then(() => {
          this.$refs.startPresentationBtn.disabled = false
          this.$store.commit('setCurrentSelectedPresentation', {})
          this.$router.push({ name: 'PresentationSlide' })
        }).catch(() => {
          this.$refs.startPresentationBtn.disabled = false
        })
    },
    setCurrentSlide (presentationId, slideId) {
      return new Promise((resolve, reject) => {
        let self = this
        if (presentationId.length === 0) {
          reject(
            new Error(
              this.$t('presentations.please_provide_valid_presentation_id')
            )
          )
        }
        new MQL()
          .setActivity('r.[SetCurrentSlide]')
          .setData({
            presentationId: presentationId,
            slideId: slideId,
            isShowWelcome: true,
            sessionManagerId: this.$store.getters.getSessionManagerId
          })
          .fetch()
          .then(rs => {
            if (rs.isValid('SetCurrentSlide')) {
              let res = rs.getActivity('SetCurrentSlide', true)
              if (res && res.result.currentSlide != null) {
                resolve(slideId)
              } else {
                reject(new Error(self.$t('BeginPresentation.failed')))
              }
            } else {
              reject(new Error(self.$t('BeginPresentation.failed')))
            }
          })
          .catch(err => {
            reject(err)
          })
      })
    },
    getResourcesCount (presentationData) {
      presentationData.slidesMetadata.forEach(slide => {
        if (slide.isActive) {
          this.totalResources += 1
        }
      })
    },
    prepareData (presentationData) {
      this.downloadedResources = 0
      this.$store.commit('resetResourcePool')
      if (presentationData.assetPath) {
        presentationData.slidesMetadata.forEach(slide => {
          if (presentationData.assetPath[slide.slideId] && slide.isActive) {
            for (const key in presentationData.assetPath[slide.slideId].embeddedAssets) {
              // let slideAssets = 1
              if (presentationData.assetPath[slide.slideId].embeddedAssets.hasOwnProperty(key)) {
                // let downloadedAssets = 0
                // check if key is already present in IDB
                idb.getItem(key).then(data => {
                  // slideAssets += 1
                  if (!data) {
                    if (!presentationData.assetPath[slide.slideId].embeddedAssets[key].includes('undefined')) {
                      // key is not present in IDB then get it and save it in idb
                      this.setDataToIDB(presentationData.assetPath[slide.slideId].embeddedAssets[key], slide.slideId).then(() => {
                        console.debug('Resource has been downloaded')
                        // downloadedAssets += 1
                      })
                    }
                  } else {
                    // downloadedAssets += 1
                    // downloadedAssets += 1
                  }
                  // console.log('slideAssets', slideAssets)
                  // console.log('downloadedAssets', downloadedAssets)
                  // if (slideAssets === downloadedAssets) {
                  // this.downloadedResources = slideCounter
                  // }
                })
              }
            }
          }
        })
      }
    },
    setDataToIDB (url, slideId) {
      // eslint-disable-next-line promise/param-names
      return new Promise((resolve, _) => {
        // if (url.indexOf('CollegeDB') === 0) {
        //   if (this.$store.getters.classroomMode === Constants.ClassroomModes.online) {
        //     url = Configs.getOnlineClassroomURL() + '/o/assetfdb/' + url
        //   } else {
        //     url = Configs.getLocalUrl() + '/o/assetfdb/' + url
        //   }
        // }

        this.toDataURL(url, slideId).then(res => {
          // url = 'CollegeDB' + url.split('CollegeDB')[1]
          idb.setItem(url, res) // res is the base64 data of the image
          resolve(res)
        }).catch(err => {
          console.error(err)
        })
      })
    },
    toDataURL (url, slideId) {
      return new Promise((resolve, reject) => {
        var xhr = new XMLHttpRequest()
        let self = this
        let resourcePool = {}
        resourcePool.url = url
        resourcePool.status = {
          downloadingStatus: event.loaded === event.total ? 'Completed' : 'Started',
          downloadingPercentage: Math.floor(event.loaded / event.total) * 100,
          slideId: slideId
        }
        self.$store.commit('resourcePool', resourcePool)
        // alert('Hey')
        xhr.onprogress = function (event) {
          let resourcePool = {}
          resourcePool.url = url
          resourcePool.status = {
            downloadingStatus: event.loaded === event.total ? 'Completed' : 'Started',
            downloadingPercentage: Math.floor(event.loaded / event.total) * 100,
            slideId: slideId
          }
          self.$store.commit('resourcePool', resourcePool)
        }
        xhr.onerror = function () {
          resourcePool.url = url
          resourcePool.status = {
            downloadingStatus: 'Failed',
            downloadingPercentage: 0,
            slideId: slideId
          }
          self.$store.commit('resourcePool', resourcePool)
          reject(new Error(self.$t('BeginPresentation.download_failed')))
        }
        xhr.onload = function () {
          var reader = new FileReader()
          reader.onloadend = function () {
            idb.getItem('totalSize').then(data => {
              if (!data) {
                data = xhr.response.size
                idb.setItem('totalSize', data)
              } else {
                data = xhr.response.size + data
                idb.setItem('totalSize', data)
              }
              self.downloadedSize = data
            })
            resolve(reader.result)
          }
          reader.readAsDataURL(xhr.response)
        }
        xhr.open('GET', url)
        xhr.responseType = 'blob'
        xhr.send()
      })
    }
  }

}
</script>
<style lang="scss">

</style>
