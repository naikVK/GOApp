<template>
  <div>
    <div class="row top-menu-login">
      <div class="col-12">
        <div class="cta-holder">
          <span>
            <i @click="$router.goBack()" class="mdi mdi-chevron-left" />
          </span>
        </div>
      </div>
    </div>

    <div
      class="OnlineLogin bg-alt"
      :class="[clickedOnSearchBar ? 'logoDisappears' : 'logoAppears']"
    >
      <section id="login">
        <div class="login-holder">
          <form @submit.prevent="authenticationCall">
            <div v-if="teacherDataAvailable">
              <!-- Teacher Profile Available Hence Just Confirmation To Connect Online Is Required -->
              <div class="profile-pic-letter">
                <!-- show first letter div if profile pic is not uploaded by user and hide img-holder div -->
                <div
                  class="first-letter"
                  v-if="$store.getters.profileImagePath == ''"
                >
                  <div class="letter">
                    {{
                      $store.getters.teacherDetails.basicInfo.fullName
                        .substr(0, 1)
                        .toUpperCase()
                    }}
                  </div>
                </div>
                <!-- first letter div ends -->

                <!-- show image holder div is profile pic is uploaded and hide the first letter div -->

                <div
                  class="img-holder"
                  v-if="$store.getters.profileImagePath != ''"
                >
                  <img :src="$store.getters.profileImagePath" />
                </div>
                <!-- img holder div ends -->
              </div>
              <h2 class="login-title mb-3">
                {{ $t("OnlineLogin.hello") }}
                <div
                  class="bolder underline l-50"
                  @click.prevent="enableTeacherSelection"
                >
                  {{ $store.getters.teacherDetails.basicInfo.fullName }}
                </div>
              </h2>
              <div
                class="institute mb-4"
                @click.prevent="enableInstituteSelection"
              >
                <i class="mdi mdi-city pr-2" />
                <span title="institute-name" class="underline">
                  {{ $store.getters.teacherDetails.institute.instituteName }}
                </span>
              </div>
              <button id="btn_con" class="btn btn-blue">
                <i class="mdi mdi-cloud-check pr-2" />
                {{ $t("button.connect") }}
              </button>
              <span class="error-text" v-if="errorText">{{ errorText }}</span>
            </div>
            <div v-show="!teacherDataAvailable">
              <div class="logoWelcomeDisplay">
                <div class="logo">
                  <svg
                    width="70"
                    height="70"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 786 578"
                  >
                    <defs />
                    <defs>
                      <clipPath id="a">
                        <path d="M0 0h841v636H0z" />
                      </clipPath>
                    </defs>
                    <g clip-path="url(#a)" data-name="Artboard – 1">
                      <path fill="#fff" d="M0 0h841v636H0z" />
                      <g stroke="#45529b">
                        <path
                          fill="none"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="42"
                          d="M210 370v54l160 167V275H210V170h422v108"
                          data-name="Path 1"
                        />
                        <path
                          fill="none"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="42"
                          d="M474 330v260l158-169v-51"
                          data-name="Path 2"
                        />
                        <path
                          fill="none"
                          stroke-linecap="square"
                          stroke-linejoin="round"
                          stroke-width="22"
                          d="M757 80v68"
                          data-name="Path 3"
                        />
                        <path
                          fill="none"
                          stroke-linecap="round"
                          stroke-width="42"
                          d="M758 168v84"
                          data-name="Path 4"
                        />
                        <path
                          fill="#45529b"
                          fill-rule="evenodd"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="21"
                          d="M748 246v45c11-8 18-20 21-34 1-6-1-10-3-12-1-3-7-3-18 1z"
                          data-name="Path 5"
                        />
                        <path
                          fill="none"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="42"
                          d="M51 59l744-3"
                          data-name="Path 6"
                        />
                      </g>
                    </g>
                  </svg>
                </div>
                <h1 class="login-title">
                  <strong>NGO App</strong>
                </h1>
              </div>
              <div class="helper" v-show="!this.enableCredentialView">
                <div class="mb-2 mt-5 helper-text">
                  {{ $t("OnlineLogin.selectInstitute") }}
                </div>
                <div class="row">
                  <div class="col-12 search">
                    <div class="input-group mb-2">
                      <input
                        type="text"
                        class="form-control"
                        aria-label="Search topic"
                        aria-describedby="search-institute"
                        placeholder="Search institute"
                        ref="tbSearchInstitute"
                        @input="searchInstitute"
                        v-model="enteredInstituteText"
                        @focus="SearchTrue"
                      />
                      <div class="input-group-prepend" @click="searchInstitute">
                        <span class="input-group-text" id="search-institute">
                          <i class="mdi mdi-magnify" />
                        </span>
                      </div>
                    </div>
                  </div>
                  <div class="col-12">
                    <ul class="search-list">
                      <li
                        v-for="institute in fetchedInstitutesData"
                        :key="institute._id"
                      >
                        <div
                          class="list-name"
                          :class="[institute.isActive ? 'inactive' : 'active']"
                          @click="navigatetoURL(institute)"
                        >
                          {{ institute.instituteNameWithLocality }}
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <!-- Post Institute Selection -->
              <div v-if="this.enableCredentialView">
                <div class="mb-5 mt-2 underline">
                  {{ this.selectedInstitute.instituteNameWithLocality }}
                </div>

                <float-label
                  :label="$t('OnlineLogin.username')"
                  :class="{ 'vfl-label-active': onlineLoginReq.username }"
                >
                  <input
                    type="text"
                    class="form-control custom-input"
                    id="Username"
                    v-model="onlineLoginReq.empCode"
                    required
                  />
                </float-label>
                <float-label
                  :label="$t('OnlineLogin.password')"
                  :class="{ 'vfl-label-active': onlineLoginReq.password }"
                >
                  <input
                    ref="txt_pass"
                    type="password"
                    class="form-control custom-input"
                    id="password"
                    v-model="onlineLoginReq.password"
                    required
                  />
                </float-label>
                <div class="forget-pass">Forget password</div>
                <div class="btn-holder">
                  <button id="btn_con" class="btn btn-blue btn-next ">
                    <i class="mdi mdi-arrow-right" />
                  </button>
                </div>

                <span class="error-text" v-if="errorText">{{ errorText }}</span>
              </div>
            </div>
          </form>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
// All imports
import MQL from "@/plugins/mql.js";
import Configs from "../utils/Configs";
import CommonUtils from "../utils/CommonUtils";
import SystemDialog from "../utils/SystemDialog";

export default {
  data() {
    return {
      // Default data values
      fetchedInstitutesData: [],
      selectedInstitute: {},
      minSearchCharacterLength: 3,
      enteredInstituteText: "",
      onlineLoginReq: {},
      togglePassword: false,
      enableCredentialView: false,
      teacherDataAvailable: false,
      teacherProfile: {},
      onlineClassroomURL: "",
      errorText: "",
      clickedOnSearchBar: false,
      isActive: true,
      scrollPosition: null,
    };
  },
  // All methods
  methods: {
    toggle(data) {
      data.isActive = !data.isActive;
    },
    SearchTrue() {
      setTimeout(() => {
        window.scrollTo(0, 0);
      }, 100);
      this.clickedOnSearchBar = true;
    },
    navigatetoURL(data) {
      this.toggle(data);
      this.selectedInstitute = data;
      this.onInstituteSelection(data);

      // Enable the controls to input Emp Code and Password and Connect To Cloud Button
      setTimeout(() => {
        this.enableCredentialView = true;
      }, 500);
      setTimeout(() => {
        this.clickedOnSearchBar = false;
      }, 500);
    },
    searchInstitute() {
      this.clickedOnSearchBar = true;
      var l = this.enteredInstituteText.length;
      if (l < 2) {
        this.fetchedInstitutesData = [];
        return;
      }
      self.enteredInstituteText = this.enteredInstituteText;

      new MQL()
        .setCustomURL(Configs.getGatewayUrl())
        .setActivity("o.[GetServerDetails]")
        .setData({
          instituteName: self.enteredInstituteText,
        })
        .fetch()
        .then((rs) => {
          if (rs && rs.isValid("GetServerDetails")) {
            let res = rs.getActivity("GetServerDetails", false);
            if (res.result && res.result.length > 0) {
              this.fetchedInstitutesData = JSON.parse(
                JSON.stringify(res.result)
              );
            }
          }
        });
    },
    // On selection of institute, setting the required values
    onInstituteSelection(data) {
      // Set Classroom URL, for subsequent online calls
      this.setBaseURL();

      // Set InstituteId
      this.onlineLoginReq.instituteId = this.selectedInstitute.instituteId;
    },

    // Set base URL for online classroom calls
    setBaseURL() {
      if (typeof cordova === "undefined") {
        // Testing mobile app using normal vue mode
        // Set URL to go through proxy
        this.onlineClassroomURL = Configs.getOnlineClassroomURL();
      } else {
        // Real mobile app scenario
        // Set URL which was received from Server
        var url = new URL(Configs.getGatewayUrl());
        // this.onlineClassroomURL = url.protocol + '//' + url.host + '/' + this.selectedInstitute.services.onlineClassroomServerConfig.internalURL
        this.onlineClassroomURL =
          url.protocol +
          "//" +
          this.selectedInstitute.defaultURL +
          "/" +
          this.selectedInstitute.services.onlineClassroomServerConfig
            .internalURL;
      }
      this.$store.commit("selectedInstitute", this.selectedInstitute);
      localStorage.setItem("baseURL", this.onlineClassroomURL);
      Configs.changeBaseUrl(this.onlineClassroomURL);
    },

    // Call from vue to validate teacher login
    authenticationCall() {
      // Check internet connectivity
      if (CommonUtils.checkInternet()) {
        // Prepare data for authentication call
        if (!this.teacherDataAvailable) {
          // For first login - where teacher provide details
          this.onlineLoginReq.username =
            this.onlineLoginReq.instituteId + "_" + this.onlineLoginReq.empCode;
        } else {
          // For other login - where teacher data is fetched from store
          this.onlineLoginReq.username = this.$store.getters.teacherDetails.username;
          this.onlineLoginReq.password = this.$store.getters.teacherDetails.password;
        }
        // Check base URL available in local storage or not
        if (localStorage.getItem("baseURL") === null) {
          this.getServerConfig();
        } else {
          // MQL Call For Authentication Of Teacher
          this.authenticateTeacher();
        }
      } else {
        this.errorText = this.$t("OnlineLogin.no_internet");
      }
    },

    // To listen to keyup event, so that the search can be fired for institute on Gateway
    addSearchListener() {
      let el = document.getElementById("searchBoxId");
      if (el) {
        document
          .getElementById("searchBoxId")
          .addEventListener("keyup", this.keyupFunc);
      }
    },

    // To remove listener, once the use is done.
    removeSearchListener() {
      let el = document.getElementById("searchBoxId");
      if (el) {
        document
          .getElementById("searchBoxId")
          .removeEventListener("keyup", this.keyupFunc);
      }
    },

    // Get institute list from API
    keyupFunc(event) {
      // making API call only if entered character lenght is same or greater than defined one
      if (event.target.value.length === 0) {
        this.fetchedInstitutesData = [];
        this.selectedInstitute = {};
        this.enteredInstituteText = "";
      } else if (
        event.target.value &&
        event.target.value.length >= this.minSearchCharacterLength
      ) {
        this.enteredInstituteText = event.target.value;
        new MQL()
          .setCustomURL(Configs.getGatewayUrl())
          .setActivity("o.[GetServerDetails]")
          .setData({
            instituteName: event.target.value,
          })
          .fetch()
          .then((rs) => {
            let res = rs.getActivity("GetServerDetails", false);
            if (rs && rs.isValid("GetServerDetails")) {
              if (res.result && res.result.length > 0) {
                this.fetchedInstitutesData = JSON.parse(
                  JSON.stringify(res.result)
                );
              }
            }
          });
      }
    },

    // To get online classroom server URL for institute
    // And authenticate teacher from that URL
    getServerConfig() {
      let institueData = {
        instituteId: this.$store.getters.teacherDetails.instituteId,
      };

      new MQL()
        .setCustomURL(Configs.getGatewayUrl())
        .setActivity("o.[GetServerConfigByInstId]")
        .setData(institueData)
        .fetch()
        .then((rs) => {
          let res = rs.getActivity("GetServerConfigByInstId", false);
          if (rs.isValid("GetServerConfigByInstId")) {
            this.selectedInstitute = res.result;
            this.setBaseURL();
            // MQL Call For Authentication Of Teacher
            this.authenticateTeacher();
          } else {
            rs.showErrorToast("GetServerConfigByInstId");
          }
        });
    },

    // To enable institue selection, in case user cleans the stored data
    enableInstituteSelection() {
      if (localStorage.getItem("teacherDetails")) {
        // remove it from localstorage and session
        localStorage.removeItem("user-token");
        localStorage.removeItem("teacherDetails");
        localStorage.removeItem("baseURL");
        sessionStorage.removeItem("user-token");
        this.$store.commit("teacherDetails", "");
        this.teacherDataAvailable = false;
      }
      // Reset data
      this.enableCredentialView = false;
      this.enteredInstituteText = "";
      this.selectedInstitute = "";
      this.clickedOnSearchBar = false;
    },

    // To enable teacher selection, in case user cleans the user data
    enableTeacherSelection() {
      if (localStorage.getItem("teacherDetails")) {
        // set institute name first
        this.selectedInstitute.instituteNameWithLocality = this.$store.getters.teacherDetails.institute.instituteName;
        this.onlineLoginReq.instituteId = this.$store.getters.teacherDetails.institute.instituteId;
        // remove it from localstorage and session
        localStorage.removeItem("user-token");
        localStorage.removeItem("teacherDetails");
        this.$store.commit("teacherDetails", "");
        this.teacherDataAvailable = false;
      }
      // Reset data
      this.enableCredentialView = true;
      this.clickedOnSearchBar = false;
    },

    setUserSession(res) {
      localStorage.setItem("user-token", res.result.token);
      sessionStorage.setItem("user-token", res.result.token);
      this.$store.commit("teacherDetails", res.result.teacherDetails);
      // set sessionmanagerId in store
      this.$store.commit("setSessionManagerId", res.result.teacherDetails._id);
      this.$store.dispatch("initiateBackup");
      this.buildTeacherProfile(res.result.teacherDetails);
      this.$store.commit("studentResponseSyncStatus", "readyToSync");
      // Navigation to classroom selection page / dahsboard
      this.$router.push("SelectClass");
    },
    // To authenticate teacher
    authenticateTeacher() {
      new MQL()
        .setActivity("o.[ValidateTeacherCredentials]")
        .setData(this.onlineLoginReq)
        .fetch("btn_con")
        .then((rs) => {
          if (rs.isValid("ValidateTeacherCredentials")) {
            let res = rs.getActivity("ValidateTeacherCredentials", false);
            let requestData = {};
            requestData.teacherId = res.result.teacherDetails._id;
            localStorage.setItem("user-token", res.result.token);
            sessionStorage.setItem("user-token", res.result.token);
            this.$store
              .dispatch("checkPresentationSessionIsAvailable", requestData)
              .then((availablityResult) => {
                if (availablityResult) {
                  if (availablityResult.isCurrentPresentationAvailable) {
                    SystemDialog.confirm(
                      this.$t(
                        "OnlineLogin.presentationSessionAlreadyExistHeader"
                      ),
                      this.$t("OnlineLogin.presentationSessionAlreadyExistMsg"),
                      this.$t("OnlineLogin.proceed"),
                      this.$t("OnlineLogin.cancel"),
                      (isConfirmed) => {
                        if (isConfirmed) {
                          this.$store
                            .dispatch("killPresentationSession", requestData)
                            .then((killPresentationResult) => {
                              if (killPresentationResult) {
                                setTimeout(this.setUserSession(res), 2000);
                              }
                            });
                        }
                      }
                    );
                  } else {
                    this.setUserSession(res);
                  }
                }
              });
          } else {
            rs.showErrorToast("ValidateTeacherCredentials");
          }
        });
    },

    // To build teacher profile
    // apiData - data received from API
    buildTeacherProfile(apiData) {
      if (apiData) {
        this.teacherProfile = JSON.parse(JSON.stringify(apiData));
        this.teacherProfile.username = this.onlineLoginReq.username;
        this.teacherProfile.password = this.onlineLoginReq.password;
        // Handling Success
        // Saving Teacher Profile to local storage (if already not saved) as well as store (if already not set)
        if (!localStorage.getItem("teacherDetails")) {
          localStorage.setItem(
            "teacherDetails",
            JSON.stringify(this.teacherProfile)
          );
        }
        this.$store.commit("teacherDetails", this.teacherProfile);
      }
    },

    // Onload check teacher profile available in local storage
    checkTeacherProfileAvailable() {
      if (localStorage.getItem("teacherDetails")) {
        this.$store.commit(
          "teacherDetails",
          JSON.parse(localStorage.getItem("teacherDetails"))
        );
        Configs.changeBaseUrl(localStorage.getItem("baseURL"));
        this.teacherDataAvailable = true;
      }
    },
  },
  beforeDestroy() {
    this.removeSearchListener();
  },

  // mounted
  mounted() {
    this.addSearchListener();
    this.checkTeacherProfileAvailable();
  },
};
</script>

<style lang="scss">
.OnlineLogin {
  background-attachment: fixed;
  // min-height: 75vh;
  text-align: center;
  transition: all 500ms ease-in-out;
  flex-direction: column;
  justify-content: center;
  display: flex;
  align-items: center;
  #login {
    padding-top: 0px;
    // display: flex;
    // align-items: center;
    // justify-content: center;
    width: 100%;
    padding: 0 30px;
    min-height: 70vh;
    .login-holder form {
      margin-top: 0;
    }
    transition: 0.5;
  }
  &.logoDisappears {
    // min-height: 15vh;
    flex-direction: column;
    justify-content: flex-start;
    display: block;
    align-items: flex-start;
    #login {
      min-height: 15vh;
      // min-height:10vh;
      justify-content: flex-start;
      align-items: flex-start;
    }
    .logoWelcomeDisplay {
      display: none;
    }
    .helper-text {
      display: none;
    }
  }
  &.logoAppears {
    min-height: 75vh;
    flex-direction: column;
    justify-content: flex-start;
    display: block;
    align-items: flex-start;

    .logoWelcomeDisplay {
      margin-top: 10%;
      background: transparent;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
    }
    .helper-text {
      display: block;
    }
  }
  .input-group > .form-control,
  .input-group > .input-group-prepend:not(:first-child) > .input-group-text {
    font-size: 17px;
    background: #f4f5f9;
    ::placeholder {
      font-size: 17px;
    }
  }
  .input-group > .form-control {
    &::-webkit-input-placeholder {
      /* WebKit browsers */
      font-size: 17px;
    }
    &:-moz-placeholder {
      font-size: 17px;
    }
    &::-moz-placeholder {
      font-size: 17px;
    }
    &:-ms-input-placeholder {
      font-size: 17px;
    }
  }
  // .v-select{
  //   .vs__dropdown-toggle{
  //     .vs__actions{
  //       .vs__clear{
  //         display: inline !important;
  //         fill:#fff;
  //       }
  //     }
  //   }
  // }
  h5 {
    font-size: 20px;
    margin-bottom: 10px;
  }
  h1 {
    // margin-left:0px;
    line-height: 40px;
  }
  span.connect-msg {
    margin-top: 10px;
    svg {
      display: inline-block;
      vertical-align: -0.1875em;
    }
  }
  .lottie-animate {
    &.div {
      margin: 0;
      display: inline-block;
    }
  }
  .error-text {
    color: var(--orange-dark);
    margin-top: 15px;
  }
  .btn {
    margin-top: 10px;
    min-width: 80%;
  }
  .btn-blue {
    // border-radius: 50px;
    font-size: 18px;
    padding: 10px 20px 10px 20px;
    position: relative;
    transition: all 0.25s ease-in-out;
    overflow: hidden;
    &::after {
      content: "";
      position: absolute;
      border-radius: 50%;
      background-color: rgba(#394066, 0.5);
      top: 0%;
      left: 40%;
      width: 50px;
      height: 50px;
      animation: ripple 1s;
      display: none;
      opacity: 0;
    }
    &:focus:not(:active)::after {
      display: block;
    }
  }
  .btn-success {
    border-radius: 50px;
    font-size: 18px;
    padding: 10px 20px 10px 20px;
    position: relative;
    transition: all 0.25s ease-in-out;
    overflow: hidden;
    &::after {
      content: "";
      position: absolute;
      border-radius: 50%;
      background-color: rgba(#394066, 0.5);
      top: 0%;
      left: 40%;
      width: 50px;
      height: 50px;
      animation: ripple 1s;
      display: none;
      opacity: 0;
    }
    &:focus:not(:active)::after {
      display: block;
    }
  }
  .logo {
    margin-bottom: 10px;
    margin-top: -60px;
    margin-left: -15px;
  }
  li {
    width: 100%;
  }
  .search-list {
    list-style: none;
    padding-left: 0px;
    transition: all 6s ease;
    display: block;
    // display: flex;
    // justify-content: flex-start;
    // flex-direction: column;
    // align-items: flex-start;
    width: 100%;

    .list-name {
      //   display: flex;
      // justify-content: flex-start;
      // flex-direction: column;
      // align-items: flex-start;
      text-align: left;
      background: transparent;
      //  margin-bottom:10px;
      padding: 20px;
      border-bottom: 1px solid var(--bg-text);
      transition: 0.5s;
      position: relative;
      overflow: hidden;
      &:before {
        content: "";
        display: block;
        position: absolute;
        background: rgba(255, 255, 255, 0.5);
        width: 60px;
        height: 100%;
        left: 0;
        top: 0;
        opacity: 0.5;
        filter: blur(30px);
        transform: translateX(-150px) skewX(-15deg);
      }
      &:after {
        content: "";
        display: block;
        position: absolute;
        background: rgba(255, 255, 255, 0.2);
        width: 30px;
        height: 100%;
        left: 30px;
        top: 0;
        opacity: 0;
        filter: blur(5px);
        transform: translateX(-100px) skewX(-15deg);
      }
    }
    .inactive {
      background: transparent;
    }
    .active {
      border-radius: 5px;
      color: #fff;
      background: var(--blue);
      cursor: pointer;
      &:before {
        transform: translateX(1200%) skewX(-15deg);
        opacity: 0.6;
        transition: 0.5s;
      }
      &:after {
        transform: translateX(1200%) skewX(-15deg);
        opacity: 1;
        transition: 0.5s;
      }
    }
  }
}
</style>
