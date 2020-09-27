<template>
  <div>
    <!-- <TopMenu /> -->
    <div class="TopMenu">
      <div class="row justify-content-between align-items-center">
        <div class="col mr-auto page-title">
          <i
            @click="$router.goBack()"
            class="mdi mdi-chevron-left cursor-pointer"
          />
          <!-- <i class="mdi mdi-account" /> -->
          {{ $t('EditProfile.edit') }}
        </div>
      </div>
    </div>

    <div class="EditProfile wrap-alt bg-main">
      <div class="row text-center justify-content-center">
        <div
          v-show="profileImage!=''"
          class="col-12"
          @click="captureImage"
        >
          <div
            v-if="profileImage!=''"
            class="profile-pic"
          >
            <img
              :src="profileImage"
              class="profile-img"
            >
          </div>
          <div class="profile-name">
            {{ $store.getters.teacherDetails.basicInfo.fullName }}
          </div>
          <div class="institute">
            <i class="mdi mdi-account" />
            <span title="employee-code"> {{ $store.getters.teacherDetails.employeeCode }}</span>
          </div>
          <div
            class="institute"
            v-if="$store.getters.teacherDetails.extended.contactInfo.mobileNumber"
          >
            <i class="mdi mdi-phone" />
            <span title="mobile-number"> {{ $store.getters.teacherDetails.extended.contactInfo.mobileNumber }}</span>
          </div>
          <div class="institute">
            <i class="mdi mdi-city" />
            <span title="institute-name"> {{ $store.getters.teacherDetails.institute.instituteName }}</span>
          </div>
        </div>
        <div
          v-show="profileImage==''"
          class="col-12"
        >
          <div class="profile-pic-align">
            <div
              class="profile-img"
              @click="captureImage"
            >
              <span class="add-pic">
                {{ $t('EditProfile.click_to_add') }}
                <br>{{ $t('EditProfile.profile_pic') }}
              </span>
            </div>
          </div>
          <div class="profile-name">
            {{ $store.getters.teacherDetails.basicInfo.fullName }}
          </div>
          <div class="institute">
            <i class="mdi mdi-account" />
            <span title="employee-code"> {{ $store.getters.teacherDetails.employeeCode }},</span>
            <div class="institute ml-2">
              <i class="mdi mdi-phone mb-1" />
              <span title="mobile-number"> {{ $store.getters.teacherDetails.extended.contactInfo.mobileNumber }}</span>
            </div>
          </div>
          <div class="institute">
            <i class="mdi mdi-city" />
            <span title="institute-name"> {{ $store.getters.teacherDetails.institute.instituteName }}</span>
          </div>
        </div>
        <div class="col-12">
          <button
            @click="saveAndProceed"
            class="btn btn-teal-alt"
          >
            <i class="mdi mdi-content-save" />
            {{ $t('EditProfile.save') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Configs from '../utils/Configs'
export default {
  name: 'EditProfile',
  components: {

  },
  data () {
    return {
      profileImage: this.$store.getters.profileImagePath
    }
  },
  mounted () {
    // requesting cordova features
    document.addEventListener('deviceready', this.onDeviceReady, false)
  },
  methods: {
    onDeviceReady () {
      // this.fetchProfileImagePath();
    },
    captureImage () {
      if (typeof cordova === 'undefined') {
        return
      }
      navigator.camera.getPicture(
        imageData => {
          this.profileImage = imageData
        },
        () => {
          console.error(err)
        },
        {
          encodingType: Camera.EncodingType.JPEG,
          correctOrientation: true,
          targetWidth: 512,
          targetHeight: 512
        }
      )
    },
    fileDeleteOldProfileImage () {
      window.resolveLocalFileSystemURL(
        this.$store.getters.profileImagePath,
        function (fileEntry) {
          fileEntry.remove(
            file => {
              console.debug('OldProfileImage removed!')
            },
            error => {
              console.debug('error occurred: ' + error.code)
            }
          )
        }
      )
    },
    copyCapturedImageApp (filePath) {
      // create profile directory if not exist
      window.resolveLocalFileSystemURL(
        cordova.file.dataDirectory,
        rootFileEntry => {
          // lookup data directory
          rootFileEntry.getDirectory(
            'profile',
            { create: true, exclusive: false },
            profileRootEntry => {
              window.resolveLocalFileSystemURL(filePath, fileEntry => {
                // profile directory is created or already exists
                fileEntry.copyTo(
                  profileRootEntry,
                  fileEntry.name,
                  newProfileEntry => {
                    // got new image path from app context
                    this.profileImage =
                      cordova.file.dataDirectory + newProfileEntry.fullPath

                    // delete previous profile image
                    this.fileDeleteOldProfileImage()

                    // save new profile image path to settings
                    Configs.saveProfileImagePath(this.profileImage)
                  },
                  err => {
                    console.error(err)
                  }
                )
              })
            },
            err => {
              console.error(err)
            }
          )
        }
      )
    },
    saveAndProceed () {
      this.copyCapturedImageApp(this.profileImage)
      this.$router.goBack()
    }
  }
}
</script>
<style lang="scss">
.EditProfile {
  background-position: center center;
}
</style>
