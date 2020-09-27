<template>
  <div class="row presentationSlide">
    <div
      v-if="!showPresentation"
      class="col-md-12 full-width"
    >
      <center style="padding:30px">
        <h4>{{ message }}</h4>
        <button
          v-if="isError"
          class="btn btn-blue"
          @click="checkAndDownloadTemplates"
        >
          {{ $t('PresentationSlide.try_again') }}
        </button>
        <br>
        <span
          style="text-decoration: underline;margin:20px;"
          class="btn"
          v-if="isError"
          @click="$router.goBack"
        >{{ $t('PresentationSlide.go_back') }}</span>
      </center>
      <div
        v-if="progress.count!=0&&!isError"
        style="margin:15px"
      >
        <div class="progress">
          <div
            class="progress-bar progress-bar-striped progress-bar-animated"
            role="progressbar"
            :aria-valuenow="progress.percent"
            aria-valuemin="0"
            aria-valuemax="100"
            :style="'width: '+progress.percent+'%'"
          />
          <!-- <div class="progress-holder">
            <b-progress :value="progress.percent" height="24px" class="bg-teal" />
          </div>-->
        </div>
        <div>
          <span>{{ (progress.index +1)+'/'+progress.count }}</span>
          <span style="float:right">{{ progress.percent+'%' }}</span>
        </div>
      </div>
    </div>
    <TeacherPresentationMode
      v-if="showPresentation"
      class="col-md-12 full-width"
    />
  </div>
</template>

<script>
import TeacherPresentationMode from './TeacherPresentationMode'
// import TemplateDownload from '../utils/TemplateDownload'
export default {
  name: 'PresentationSlide',
  components: { TeacherPresentationMode },
  data () {
    return {
      isError: false,
      showPresentation: false,
      message: this.$t('PresentationSlide.please_wait'),
      progress: {
        index: 0,
        count: 0,
        percent: 0
      }
    }
  },
  mounted () {
    if (typeof cordova === 'undefined') {
      this.checkAndDownloadTemplates()
      return
    }
    // required for Cordova
    document.addEventListener('deviceready', this.onDeviceReady, false)
  },
  beforeDestroy () {
    this.releaseWakeLock()
  },
  methods: {
    onDeviceReady () {
      this.checkAndDownloadTemplates()
      this.aquireWakeLock()
    },
    checkAndDownloadTemplates () {
      this.isError = false
      // let templateDownload = new TemplateDownload('Teacher')
      // templateDownload.onProgressUpdate((index, count, percent) => {
      //   console.log(
      //     'onProgressUpdate',
      //     index,
      //     count,
      //     Math.round(percent * 100)
      //   )
      //   this.progress.index = index
      //   this.progress.count = count
      //   this.progress.percent = Math.round(percent * 100)
      // })
      // templateDownload
      //   .start()
      //   .then(() => {
      //     this.showPresentation = true
      //     // this.isError = true;
      //     if (typeof cordova === 'undefined') {
      //       return
      //     }
      //     this.$store.dispatch(
      //       'setTemplateFolderPath',
      //       templateDownload.getTemplatesRootPath()
      //     )
      //   })
      //   .catch(err => {
      //     this.showPresentation = false
      //     this.isError = true
      //     if (err && err == 'NETWORK_ERROR') {
      //       this.message = this.$t('PresentationSlide.unable_to_connect_server')
      //     } else {
      //       this.message =
      //         this.$t('PresentationSlide.failed_to_download_to_presentation_templates_please_retry_once_again')
      //     }
      //   })

      // TemplateDownload.commonDownload('Teacher', (index, count, percent) => {
      //   console.log(
      //     'onProgressUpdate',
      //     index,
      //     count,
      //     Math.round(percent * 100)
      //   )
      //   this.progress.index = index
      //   this.progress.count = count
      //   this.progress.percent = Math.round(percent * 100)
      // })
      //   .then((templatesRootPath) => {
      //     this.showPresentation = true
      //     // this.isError = true;
      //     if (typeof cordova === 'undefined') {
      //       return
      //     }
      //     this.$store.dispatch(
      //       'setTemplateFolderPath',
      //       templatesRootPath
      //     )
      //   })
      //   .catch(err => {
      //     this.showPresentation = false
      //     this.isError = true
      //     if (err && err == 'NETWORK_ERROR') {
      //       this.message = this.$t('PresentationSlide.unable_to_connect_server')
      //     } else {
      //       this.message =
      //         this.$t('PresentationSlide.failed_to_download_to_presentation_templates_please_retry_once_again')
      //     }
      //   })
        this.showPresentation = true
    },
    aquireWakeLock () {
      window.powerManagement.dim(
        function () {
          console.debug('Wakelock acquired')
        },
        function () {
          console.debug('Failed to acquire wakelock')
        }
      )
    },
    releaseWakeLock () {
      if (typeof cordova === 'undefined') {
        return
      }
      window.powerManagement.release(
        function () {
          console.debug('Wakelock released')
        },
        function () {
          console.debug('Failed to release wakelock')
        }
      )
    }
  }
}
</script>

<style lang="scss">
</style>
