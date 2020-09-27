<template>
  <div>
    <TopMenu title="Slides" />
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

    <div
      v-if="filteredSlides.length > 0 && !isLoading"
      class="ViewPresentation wrap-alt"
    >
      <div
        class="presentation-list"
        v-for="(slide, slideIndex) in filteredSlides"
        :key="'slide' + slideIndex"
      >
        <img
          v-if="slide.previewImgURL"
          :src="slide.previewImgURL"
          width="100%"
          alt="Slide image"
          class="slide-img"
        >
        <img
          v-else
          alt="Slide image"
          class="slide-img"
          width="100%"
          src="../../public/assets/images/presentation/5.png"
        >

        <div class=" slide-details">
          <div class="main-text">
            {{ slide.slideName }}
          </div>
          <div class="sub-text">
            {{ $t('Slides.total_time') }}
            {{ secondsToHms(slide.slideEndTime - slide.slideStartTime) }}
          </div>
        </div>
      </div>
    </div>
    <div
      class=" col-12 empty-state "
      v-else-if="!isLoading"
    >
      <div class="title ">
        {{ $t('Slides.no_slides_found') }}
      </div>
      <div class="sub-title">
        {{ $t('Slides.presentation_had_no_slides') }}
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
</template>

<script>
import TopMenu from '../components/common/TopMenu'
// import BottomMenu from '@/components/common/BottomMenu'
import MQL from '@/plugins/mql.js'
import dayjs from 'dayjs'
import LocalizedFormat from 'dayjs/plugin/localizedFormat'
import { ClassroomModes } from '../utils/Constants'
import Configs from '../utils/Configs'
dayjs.extend(LocalizedFormat)
export default {
  name: 'StartPresentation',
  components: {
    TopMenu
    // BottomMenu
  },
  data () {
    return {
      slidesList: [],
      filteredSlides: [],
      searchKey: '',
      runnableStats: {},
      runnableData: [],
      isLoading: true,
       presentationData: this.$store.getters.getSummary

      // showslides: false
    }
  },
  filters: {
    calendar (date) {
      return dayjs(date).format('LTS')
    }
  },
  methods: {
    fetchSlides () {
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
                    let res = rs.getActivity('FetchRunnableDataByCacheId', false)
                    // console.log(res.result[0])
                    this.runnableData = res.result[0]
                    this.prepareSlideData().then((res) => {
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

                        resolve(this.slidesList)
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
    searchSlide () {
      if (this.searchKey.length >= 3) {
        this.filteredSlides = this.slidesList.filter((slide) =>
          slide.slideName.toLowerCase().includes(this.searchKey.toLowerCase())
        )
      }
      if (this.searchKey === '') {
        this.filteredSlides = this.slidesList
      }
    },
    setCurrentSlide (slide) {
      // console.log('CurrentLearner: ', slide)
      this.$store.commit('setCurrentSlide', slide)
    },
    getImageURL (path) {
      if (this.$store.getters.classroomMode === ClassroomModes.offline) {
        return Configs.getLocalUrl() + '/o/assetfdb/' + path
      } else {
        return Configs.getOnlineClassroomURL() + '/o/assetfdb/' + path
      }
      // return Configs.prepareBaseUrl(this.$store.getters.serverIP) + '/o/assetfdb/' + path
      // return presentation.assetPath.embeddedAssets[presentation.slidesMetadata[0].previewImgURL]
    },
    prepareSlideData () {
      return new Promise((resolve) => {
        let index = 1
        this.runnableStats.slideIds.forEach((slide) => {
          let curSlide = this.runnableData.slidesMetadata.filter(
            (meta) => meta.slideId === slide
          )
          let newSlide = this.runnableStats[slide]
          newSlide['slideName'] = 'Slide ' + index
          index++
          if (curSlide[0].previewImgURL) {
            newSlide['previewImgURL'] = this.getImageURL(
              curSlide[0].previewImgURL
            )
          } else {
            // curSlide
            // newSlide['previewImgURL'] =
          }
          this.slidesList.push(newSlide)
        })
        resolve(true)
      })
    },
    CalcTime (start, end) {
      let startTime = dayjs(start * 1000)
      let endTime = dayjs(end * 1000)
      let millis = endTime.diff(startTime)
      var minutes = Math.floor(millis / 60000)
      var seconds = ((millis % 60000) / 1000).toFixed(0)
      return (
        'Duration: ' +
        (minutes > 0 ? minutes + ' mins and ' : '') +
        (seconds < 10 ? '0' : '') +
        seconds +
        ' secs'
      )
    },
     secondsToHms (d) {
      d = Number(d)
      var h = Math.floor(d / 3600)
      var m = Math.floor((d % 3600) / 60)
      var s = Math.floor((d % 3600) % 60)

      var hDisplay = h > 0 ? h + (h === 1 ? ' hr, ' : ' hrs, ') : ''
      var mDisplay = m > 0 ? m + (m === 1 ? ' min, ' : ' mins, ') : ''
      var sDisplay = s > 0 ? s + (s === 1 ? ' sec' : ' secs') : ''

      if (mDisplay && !sDisplay) {
        mDisplay = mDisplay + '0 sec'
      }

      if (hDisplay && !mDisplay) {
        hDisplay = hDisplay + '0 min'
      }

      return hDisplay + mDisplay + sDisplay
    }
  },
  mounted () {
    // this.slidesList
    this.fetchSlides().then((res) => {
      this.filteredSlides = res
      // this.filteredSlides = []
      this.isLoading = false
    })
  }
}
</script>
