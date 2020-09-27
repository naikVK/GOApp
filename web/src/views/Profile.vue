<template>
  <div>
    <div class="TopMenu">
      <div class="row justify-content-between align-items-center">
        <div class="col mr-auto page-title">
          <i
            @click="$router.goBack()"
            class="mdi mdi-chevron-left cursor-pointer"
          />
          {{ $t('Profile.profile') }}
        </div>
      </div>
    </div>
    <div class="Profile wrap-alt bg-main">
      <div class="row text-center justify-content-center ">
        <div class="col-12 profile-card">
          <div class="profile-pic">
            <!-- <img
              v-if="$store.getters.profileImagePath!=''"
              :src="$store.getters.profileImagePath"
            >
            <img
              v-if="$store.getters.profileImagePath==''"
              src="../../public/assets/images/user.jpg"
            > -->
            <div
              class="profile-pic-letter"
            >
              <!-- show first letter div if profile pic is not uploaded by user and hide img-holder div -->
              <div
                class="first-letter"
                v-if="$store.getters.profileImagePath==''"
              >
                <div class="letter">
                  {{ $store.getters.teacherDetails.basicInfo.fullName.substr(0,1).toUpperCase() }}
                </div>
              </div>
              <!-- first letter div ends -->

              <!-- show image holder div is profile pic is uploaded and hide the first letter div -->

              <div
                class="img-holder"
                v-if="$store.getters.profileImagePath!=''"
              >
                <img
                  :src="$store.getters.profileImagePath"
                >
              </div>
              <!-- img holder div ends -->
            </div>
            <div class="default-pic" />
            <div class="profile-name">
              {{ $store.getters.teacherDetails.basicInfo.fullName }}
            </div>
            <div class="institute">
              <i class="mdi mdi-account" />
              <span title="employee-code"> {{ $store.getters.teacherDetails.employeeCode }},</span>

              <div
                class="institute ml-2"
                v-if="$store.getters.teacherDetails.extended.contactInfo.mobileNumber"
              >
                <i class="mdi mdi-phone mb-1" />
                <span title="mobile-number"> {{ $store.getters.teacherDetails.extended.contactInfo.mobileNumber }}</span>
              </div>
            </div>
            <div class="institute">
              <i class="mdi mdi-city" />
              <span title="institute-name"> {{ $store.getters.teacherDetails.institute.instituteName }}</span>
            </div>
          </div>
          <!-- <div class="profile-btn"> -->
          <!-- <router-link to="EditProfile">
            <button class="btn btn-blue-alt">
              <i class="mdi mdi-pencil" />
              Edit
            </button>
          </router-link> -->

          <!-- </div> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Profile',
  components: {
    // TopMenu
  },
  data () {
    return {}
  }
}
</script>
<style lang="scss">
.Profile {

  background-position: center center;
}
</style>
