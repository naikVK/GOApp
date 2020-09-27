<template>
  <div class="importer">
    <div class="row top-menu-activation">
      <div class="col-12">
        <div class="cta-holder">
          <span>
            <i
              v-if="!$store.getters.isOfflineActivation"
              @click="$router.goBack()"
              class="mdi mdi-chevron-left"
            />
          </span>

          <a
            v-if="$store.getters.isOfflineActivation"
            @click="$router.goBack()"
            class="cta-skip"
          >{{ $t('Importer.skip_to_login') }}</a>
        </div>
      </div>
    </div>
    <div
      class
      id="login"
    >
      <h1 class="login-title">
        {{ $t('Importer.welcome_to') }}
        <strong>{{ $store.getters.appName }}</strong>
      </h1>
      <div class="helper">
        {{ $t('Importer.drop_the_downloaded_pack_from_cloud_teacher_app_in_the_below_dropzone') }}
      </div>
      <!-- <button class="btn btn-teal btn-floater" @click="gotoLogin">Go to login</button> -->

      <form @submit.prevent>
        <!-- <float-label label="Institute name" :class="{ 'vfl-label-active': isInstitute }">
          <v-select
            label="instituteName"
            v-model="isInstitute"
            :options="$store.getters.instituteList"
            @input="onInstituteSelection"
          />
        </float-label>-->
        <!-- <float-label label="Institute Id" :class="{ 'vfl-label-active': instituteId }">
        <input
          type="text"
          class="form-control custom-input"
          id="instituteId"
          v-model.trim="instituteId"
          required
        />
        </float-label>-->
        <div class="upload-center">
          <vue-dropzone
            ref="myVueDropzone"
            id="dropzone"
            class="dropzone"
            :options="dropzoneOptions"
            @vdropzone-file-added="fileAdded"
          />
          <p id="btnDropzone" />
          <div class="upload-action text-center">
            <button
              @click="checkPermissionAndProceed"
              class="btn btn-blue cta-submit"
            >
              {{ $t('Importer.import') }}
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>
  <!-- <div class="p-3">
      <b-progress :value="100" :max="100" animated></b-progress>
  </div>-->
</template>

<script>
import axios from 'axios'
import vue2Dropzone from 'vue2-dropzone'
import 'vue2-dropzone/dist/vue2Dropzone.min.css'
import MQL from '@/plugins/mql.js'
import Configs from '../utils/Configs'
import TemplateDownload from '../utils/TemplateDownload'

export default {
  components: {
    vueDropzone: vue2Dropzone
  },
  data: function () {
    return {
      file: null,
      value: 45,
      max: 100,
      dropzoneOptions: {
        autoProcessQueue: false,
        url: 'thisisdummyurl',
        dictDefaultMessage:
          "<i class='mdi mdi-cloud-outline'></i><strong>Drop files or click here</strong><span> to upload</span>",
        maxFilesize: 2, // MB
        maxFiles: 4,
        chunking: false,
        chunkSize: 500, // Bytes
        thumbnailWidth: 150, // px
        thumbnailHeight: 150,
        addRemoveLinks: true,
        title: this.$t('Importer.upload_pack_file'),
        uploadedFilePath: ''
      },
      instituteId: '',
      selectedInstitute: '',
      isInstitute: ''
    }
  },
  mounted () {
    this.hideMainLoaderLoader()

    // taking storage permission
    if (typeof cordova !== 'undefined') {
      new TemplateDownload('').checkPermissions().then(() => {
        // this.checkActivation()
      }).catch(err => {
        this.$toasted.error(err)
        this.$router.goBack()
      })
    } else {
      // this.checkActivation()
    }
  },
  beforeDestroy () {
    this.hideMainLoaderLoader()
  },
  methods: {
    checkActivation () {
      this.$store
        .dispatch('validateActivation')
        .then(instituteList => {
          this.$store.commit('instituteList', instituteList)
        })
        .catch(err => {
          if (err.message === 'your system clock is incorrect') {
          this.$toasted.error(this.$t('Importer.your_system_clock_is_incorrect_please_set_your_clock_to_the_current_date_and_time'), {
            theme: 'bubble',
            duration: 4000
          })
          } else {
            // this.$toasted.error(err.message)
            this.goToActivation()
          }
        })
    },
    goToActivation () {
      // this.$router.push({ name: 'Activation' })
      this.$router.push('Activation')
    },
    onInstituteSelection (data) {
      if (data) {
        this.selectedInstitute = data
      } else {
        this.selectedInstitute = ''
      }
    },
    fileAdded (file) {
      this.file = file
      let instituteId = file.name.split('_')[1]
      if (instituteId) {
        this.selectedInstitute = {
          instituteId: instituteId
        }
      }
    },
    // extractSuperpack(packName) {
    //   return new Promise((resolve, reject) => {
    //     new MQL()
    //       .setActivity('o.[ExtractSuperpackUsingSecurityKey]')
    //       .setData({ superpackFileName: packName, instituteId: this.selectedInstitute.instituteId })
    //       .fetch()
    //       .then(rs => {
    //         if (rs.isValid('ExtractSuperpackUsingSecurityKey')) {
    //           let res = rs.getActivity('ExtractSuperpackUsingSecurityKey', true)
    //           if (res && res.result === 'SUCCESS') {
    //             resolve(res.result)
    //           } else {
    //             reject(new Error('Super pack cannot be imported as the file is in incorrect format'))
    //           }
    //         } else {
    //           reject(new Error(rs.raw.ExtractSuperpackUsingSecurityKey.error))
    //         }
    //       })
    //       .catch(err => {
    //         reject(err.message)
    //       })
    //   })
    // },
    extractSuperpack (superpackPath) {
      return new Promise((resolve, reject) => {
        let self = this
        new MQL()
          .setActivity('o.[ImportSuperpackFile]')
          .setData({ instituteId: this.selectedInstitute.instituteId, superpackPath: superpackPath })
          .fetch()
          .then(rs => {
            if (rs.isValid('ImportSuperpackFile')) {
              let res = rs.getActivity('ImportSuperpackFile', true)
              if (res && res.result === 'SUCCESS') {
                resolve(res.result)
              } else {
                reject(new Error(self.$t('Importer.super_pack_cannot_be_imported_as_the_file_is_in_incorrect_format')))
              }
            } else {
              reject(new Error(rs.raw.ImportSuperpackFile.error))
            }
          })
          .catch(err => {
            console.error('err:', err)
            reject(err.message)
          })
      })
    },
    checkPermissionAndProceed () {
      if (typeof cordova !== 'undefined') {
        new TemplateDownload('').checkPermissions().then(() => {
          this.uploadAndExtractPack()
        }).catch(err => {
          this.$toasted.error(err)
        })
      } else {
        this.uploadAndExtractPack()
      }
    },
    uploadAndExtractPack () {
      // if (this.instituteId.length === 0) {
      //   this.$toasted.error('please provide institute Id')
      //   return
      // }
      if (!this.selectedInstitute) {
        this.$toasted.error(this.$t('Importer.please_attach_valid_file'), {
            theme: 'bubble',
            duration: 4000
          })
        return
      }
      if (!this.file) {
        this.$toasted.error(this.$t('Importer.please_attach_pack_file'), {
            theme: 'bubble',
            duration: 4000
          })
        return
      }

      this.$store.dispatch('isImportExportIsInProgress').then((isInProgress) => {
        if (isInProgress) {
          this.$toasted.info(this.$t('Importer.data_import_and_export_is_in_progress'), {
            theme: 'bubble',
            duration: 4000
          })
          return
        }
        this.goForUploading()
      }).catch(err => {
        this.$toasted.error(this.$t('Importer.unable_to_connect_server'), {
            theme: 'bubble',
            duration: 4000
          })
      })
    },
    goForUploading () {
      var fileName = this.file.name
      var formData = new FormData()
      let url = Configs.getLocalUrl() + 'o/uploadfile'
      let uploadPath = 'updates/' + fileName
      let superpackPath = 'data/cdnData/updates/' + fileName
      this.showMainLoaderLoader()
      formData.append('file', this.file)
      axios
        .post(url, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            cdnpath: uploadPath
          }
        })
        .then(res => {
          if (res.status === 200) {
            this.extractSuperpack(superpackPath)
              .then(res => {
                this.$toasted.success(
                  this.$t('Importer.data_is_imported_successfully')
                  , {
            theme: 'bubble',
            duration: 4000
          }
                )
                this.$refs.myVueDropzone.removeFile(this.file)
                this.file = null
                this.gotoLogin()
              })
              .catch((err) => {
                this.$toasted.error(err.message)
              })
              .finally(res => {
                this.hideMainLoaderLoader()
              })
          } else {
            this.hideMainLoaderLoader()
            this.$toasted.error(this.$t('Importer.super_pack_cannot_be_imported_as_the_file_has_incorrect_format'), {
            theme: 'bubble',
            duration: 4000
          })
          }
        })
        .catch(err => {
          this.hideMainLoaderLoader()
          this.$toasted.error(err.message)
        })
    },
    gotoLogin () {
      // if (this.$store.getters.isOfflineActivation) {
      //   this.$router.push("/")
      //   return
      // }
      // this.$router.push({ name: 'SystemLogin' })
      this.$router.goBack()
    }
  }
}
</script>

<style lang="scss">
</style>
