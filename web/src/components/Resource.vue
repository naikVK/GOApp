<template>
  <div class="col-12">
    <div class="row">
      <div class="col-12 mt-4">
        <div
          class="unit-title mb-0 d-flex align-items-center justify-content-between"
          :class="visible ? null : 'collapsed'"
          :aria-expanded="visible ? 'true' : 'false'"
          aria-controls="collapse-resource"
          @click="visible = !visible"
        >
          <div class="row align-items-center">
            <!-- <div class="col-auto">
                    <i class="mdi mdi mdi-file-chart" />
            </div>-->
            <div class="col">
              {{ $t('Resource.resources') }}
              <!-- <div class="sub-text">
                      Unit 1
              </div>-->
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
      id="collapse-resource"
      v-model="visible"
      class="mt-2"
    >
      <div
        v-if="resourceList.length == 0"
        class="col-12 pl-0 light-text"
      >
        <span>{{ $t('Resource.no_resources_attached') }}</span>
      </div>
      <div
        v-if="resourceList"
        class="presentation-holder"
      >
        <div
          class="row"
          v-for="(resource, index) in resourceList"
          @click="openFile(resource)"
          :key="'resource'+index"
        >
          <div class="col-12">
            <div class="card-default">
              <div class="row align-items-center">
                <div class="col-2">
                  <i
                    v-if="resource.type === 'pdf' || resource.type === 'epub'"
                    class="mdi mdi-file-pdf-outline"
                  />
                  <i
                    v-if="imgExtensions.includes(resource.type)"
                    class="mdi mdi-file-image"
                  />
                  <i
                    v-if="videoExtensions.includes(resource.type)"
                    class="mdi mdi-file-video"
                  />
                  <i
                    v-if="audioExtensions.includes(resource.type)"
                    class="mdi mdi-file-music"
                  />
                  <i
                    v-if="resource.type === 'xls' || resource.type === 'xlsx'"
                    class="mdi mdi-file-excel"
                  />
                  <i
                    v-if="resource.type === 'txt'"
                    class="mdi mdi-file-document"
                  />
                  <i
                    v-if="resource.type === 'doc' || resource.type === 'docx'"
                    class="mdi mdi-file-word"
                  />
                </div>

                <div class="col">
                  <div class="main-text">
                    {{ resource.name }}
                  </div>
                  <div class="sub-text">
                    {{ resource.author.name }}
                  </div>
                  <div class="sub-text">
                    {{ resource.size }} MB
                  </div>
                </div>
                <div class="col-3">
                  <button
                    v-if="!isDownloaded(resource)&&!getDownloadProgress(resource)"
                    @click="download($event,resource)"
                    class="btn btn-download"
                    :disabled="getDownloadProgress(resource)"
                  >
                    <!-- <span
                      v-if="getDownloadProgress(resource)"
                      class="icon-download"
                    >{{ getDownloadProgress(resource).progress }}%</span>-->
                    <i class="mdi mdi-download icon-download" />
                  </button>
                  <div
                    v-if="getDownloadProgress(resource)"
                    class="chart"
                  >
                    <apexchart
                      type="radialBar"
                      :options="chartOptions"
                      :series="[getDownloadProgress(resource).progress]"
                      height="100"
                    />
                  </div>
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
import { ClassroomModes } from '../utils/Constants'
import Configs from '../utils/Configs'
import FileDownloader from '../utils/FileDownloader'
import TemplateDownload from '../utils/TemplateDownload'
import VueApexCharts from 'vue-apexcharts'
export default {
  name: 'Resource',
  data () {
    return {
      visible: true,
      colors: ['#ED4B82', '#e9a002', '#43baca'],
      imgExtensions: ['png', 'jpg', 'jpeg'],
      videoExtensions: ['webm', 'mp4'],
      audioExtensions: ['mp3'],
      resourceList: [],
      searchKey: '',
      downloadProgressList: [],
      chartOptions: {
        chart: {
          fontFamily: 'Avenir, Helvatica, sans-serif'
        },
        series: [67],
        colors: ['#45529b'],

        plotOptions: {
          radialBar: {
            hollow: {
              margin: 15,
              size: '40%',
              radius: 15
            },

            dataLabels: {
              showOn: 'always',
              name: {
                offsetY: -10,
                show: false,
                color: '#888',
                fontSize: '17px'
              },
              value: {
                color: '#45529b',
                fontSize: '12px',
                show: true,
                offsetY: 3,
                offsetX: 5
              }
            }
          }
        },

        stroke: {
          color: '#45529b',
          lineCap: 'round'
        },
        labels: ['Progress']
      }

    }
  },
  components: {
    apexchart: VueApexCharts
  },
  mounted () {
    // if (this.$store.getters.selectedTOCNode.resourceDetails) {
    //   this.resourceList = this.$store.getters.selectedTOCNode.resourceDetails
    // }
    if (
      this.$store.getters.resourceList &&
      this.$store.getters.resourceList.length > 0
    ) {
      this.resourceList = []
      let teachingPlanId = this.$store.getters.teachingPlanId
      let unitId = this.$store.getters.selectedUnit.unitId
      let topicId = this.$store.getters.selectedTOCNode.topicId
      for (let i = 0; i < this.$store.getters.resourceList.length; i++) {
        let attachedNodeId = this.$store.getters.resourceList[i].attachedNodeId
          if (attachedNodeId === teachingPlanId || attachedNodeId === unitId || attachedNodeId === topicId) {
            this.resourceList.push(this.$store.getters.resourceList[i])
          }
      }
      // this.topicResources = this.resourceList
    }
  },
  methods: {

    isDownloaded (resource) {
      return this.$store.getters.downloads && this.getDownloadedPath(resource) != null
    },
    getDownloadedPath (resource) {
      if (this.$store.getters.downloads) {
        return this.$store.getters.downloads.find((downloadedResource) => downloadedResource.src === resource.path)
      }
      return null
    },
    getMimeType (type) {
      if (this.imgExtensions.includes(type)) {
        return 'image/' + type
      }
      if (this.videoExtensions.includes(type)) {
        return 'video/' + type
      }
      if (this.audioExtensions.includes(type)) {
        return 'audio/' + type
      }
      return 'application/' + type
    },
    openFile (resource) {
      if (typeof cordova === 'undefined') {
        let resourceUrl = ''
        if (this.$store.getters.classroomMode === ClassroomModes.offline) {
          resourceUrl = Configs.getLocalUrl() + 'o/assetfdb/' + resource.path
        } else {
          resourceUrl = Configs.getOnlineClassroomURL() + 'o/assetfdb/' + resource.path
        }
        window.open(resourceUrl, '_blank')
        return
      }
      if (this.isDownloaded(resource)) {
        let downloadedFile = this.getDownloadedPath(resource)
        cordova.plugins.fileOpener2.showOpenWithDialog(
          downloadedFile.dst, // You can also use a Cordova-style file uri: cdvfile://localhost/persistent/Downloads/starwars.pdf
          this.getMimeType(resource.type),
          {
            error: (e) => {
              this.$toasted.error(this.$t('Resource.failed_to_open_file'))
            },
            success: () => {
              //
            }
          }
        )
      } else {
        this.$toasted.error(this.$t('Resource.file_not_downloaded_to_open'))
      }
    },
    download (event, resource) {
      event.stopPropagation()

      let resourceUrl = ''
      if (this.$store.getters.classroomMode === ClassroomModes.offline) {
        resourceUrl = Configs.getLocalUrl() + 'o/assetfdb/' + resource.path
      } else {
        resourceUrl = Configs.getOnlineClassroomURL() + 'o/assetfdb/' + resource.path
      }

      // for maintaining download progress
      this.setDownloadProgress(resource, 0)

      if (typeof cordova === 'undefined') {
        let progress = 0
        let downloadInteval = null
        downloadInteval = setInterval(() => {
          progress += 20
          // on progress changed
          this.setDownloadProgress(resource, parseInt(progress))

          if (progress === 100) {
            // on download complete
            this.removeDownloadProgress(resource)

            let downloadLink = document.createElement('a')
            downloadLink.setAttribute('href', resourceUrl)
            downloadLink.setAttribute('download', resource.name + '.' + resource.type)
            downloadLink.click()
            this.addToDownloadedList(resource.path, resourceUrl)
            this.$toasted.success(this.$t('Resource.download_completed'))
            // window.open(resourceUrl, "_blank");
            clearInterval(downloadInteval)
          }
        }, 1000)
        return
      }

      new TemplateDownload('').checkPermissions().then(() => {
        let fileSystemPath = device.platform.toLowerCase() === 'ios' ? cordova.file.dataDirectory : cordova.file.externalRootDirectory
        let downloadFolder = 'Download/' + BuildInfo.name
        Configs.createDirectoryRecursively(fileSystemPath, downloadFolder, () => {
          // on directory created

          let downloadLocation = fileSystemPath + '/' + downloadFolder + '/' + resource.name + '.' + resource.type
          let fileDownloader = new FileDownloader()
          fileDownloader.unzip = false

          fileDownloader.start(resourceUrl, downloadLocation, (progress) => {
            // on progress changed
            this.setDownloadProgress(resource, parseInt(progress))
          }, () => {
            // on download complete
            this.removeDownloadProgress(resource)

            this.addToDownloadedList(resource.path, downloadLocation)
            this.$toasted.success(this.$t('Resource.download_completed'))
          }, (err) => {
            // on download error
            this.removeDownloadProgress(resource)
            this.$toasted.error(err)
          })
        }, (err) => {
          // on directory creation err
          this.removeDownloadProgress(resource)
          this.$toasted.error(err)
        })
      }).catch(err => {
        // on permission err
        this.removeDownloadProgress(resource)
        this.$toasted.error(err)
      })
    },
    setDownloadProgress (resource, progress) {
      let progressItem = this.downloadProgressList.find((item) => item.path == resource.path)
      if (progressItem) {
        progressItem.progress = progress
      } else {
        this.downloadProgressList.push({ path: resource.path, progress: progress })
      }
    },
    removeDownloadProgress (resource) {
      let progressItemIndex = this.downloadProgressList.findIndex((item) => item.path == resource.path)
      if (progressItemIndex >= 0) {
        this.downloadProgressList.splice(progressItemIndex, 1)
      }
    },
    getDownloadProgress (resource) {
      return this.downloadProgressList.find((item) => item.path == resource.path)
    },
    addToDownloadedList (src, dst) {
      let downloads = this.$store.getters.downloads ? this.$store.getters.downloads : []
      downloads.push({
        src: src,
        dst: dst
      })
      this.$store.commit('downloads', downloads)
    }
  }
}
</script>
