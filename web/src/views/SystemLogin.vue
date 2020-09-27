<template>
  <div>
    <div class="row top-menu-login">
      <div class="col-12">
        <div class="cta-holder">
          <span>
            <i
              @click="$router.goBack()"
              class="mdi mdi-chevron-left"
            />
          </span>
        </div>
      </div>
    </div>
    <div class="SystemLogin wrap bg-alt">
      <div class="login-screen">
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
              <img :src="$store.getters.profileImagePath">
            </div>
            <!-- img holder div ends -->
          </div>
          <h1 class="login-title mb-3">
            {{ $t('SystemLogin.hello') }}
            <div
              class="bolder underline l-50"
              @click.prevent="enableTeacherSelection"
            >
              {{ $store.getters.teacherDetails.basicInfo.fullName }}
              <!-- <span><a
                    href="test"
                  ><i class="mdi mdi-pencil ml-2" /></a></span> -->
            </div>
          </h1>
          <div
            class="institute mb-4"
            @click="enableInstituteSelection()"
          >
            <i class="mdi mdi-city pr-2" />
            <span title="institute-name">{{
              $store.getters.teacherDetails.institute.instituteName
            }}</span>
            <!-- <span><a
                  href="test"><i class="mdi mdi-pencil ml-2" /></a></span> -->
          </div>
          <button
            @click="proceedNext()"
            id="btn_con"
            class="btn btn-blue"
          >
            <i class="mdi mdi-package-variant-closed pr-2" />
            {{
              !isLoading
                ? $t('button.connectDevice')
                : $t('SystemLogin.logging_in')
            }}
          </button>
          <button
            @click="goForImporter()"
            class="btn btn-orange cta-submit"
          >
            <i class="mdi mdi-arrow-down-bold-hexagon-outline pr-2" />
            {{ $t('SystemLogin.import') }}
          </button>

          <!-- <span
            class="error-text"
            v-if="errorText"
          >{{ errorText }}</span> -->
        </div>
        <div v-else>
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
              <g
                clip-path="url(#a)"
                data-name="Artboard – 1"
              >
                <path
                  fill="#fff"
                  d="M0 0h841v636H0z"
                />
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
            {{ $t('SystemLogin.welcome_to') }}
            <strong>{{ $store.getters.appName }}</strong>
          </h1>
          <float-label
            :label="$t('SystemLogin.username')"
            :class="{ 'vfl-label-active': loginDetails.username }"
          >
            <input
              id="username"
              class="form-control"
              v-model="loginDetails.empCode"
              type="text"
              @keyup="$event.keyCode == 13 ? $refs.txt_pass.focus() : true"
            >
          </float-label>
          <span
            v-if="errors.username"
            style="color:red"
          >
            {{ errors.username }}
            <br>
          </span>

          <div class="position-relative">
            <div class="w-100">
              <float-label
                :label="$t('SystemLogin.password')"
                :class="{ 'vfl-label-active': loginDetails.password }"
              >
                <input
                  id="password"
                  ref="txt_pass"
                  class="form-control"
                  v-model="loginDetails.password"
                  type="password"
                >
                <i
                  class="mdi icon-view-password"
                  @click="showPassword"
                  :class="togglePassword ? 'mdi-eye' : 'mdi-eye-off'"
                />
              </float-label>
              <span
                v-if="errors.password"
                style="color:red"
              >
                {{ errors.password }}
                <br>
              </span>
            </div>
          </div>
          <span
            v-if="errors.message"
            style="color:red"
          >
            {{ errors.message }}
            <br>
          </span>
          <button
            @click="proceedNext"
            id="btn_con"
            class="btn btn-blue"
          >
            <i class="mdi mdi-package-variant-closed pr-2" />
            {{
              !isLoading
                ? $t('button.connectDevice')
                : $t('SystemLogin.logging_in')
            }}
          </button>
          <button
            @click="goForImporter"
            class="btn btn-orange cta-submit"
          >
            <i class="mdi mdi-arrow-down-bold-hexagon-outline pr-2" />
            {{ $t('SystemLogin.import') }}
          </button>
        </div>

        <!-- <div class="BottomMenuOptions align-items-center">
          <div>
            <button
              @click="goForImporter"
              class="btn btn-orange cta-submit"
            >
              {{ $t('SystemLogin.import') }}
            </button>
          </div>
          <div>
            <button
              @click="proceedNext"
              class="btn btn-block btn-blue login-btn"
              :disabled="isLoading"
            >
              {{ !isLoading?$t('SystemLogin.login'):$t('SystemLogin.logging_in') }}
            </button>
          </div>
        </div> -->
      </div>
    </div>
  </div>
</template>

<script>
import MQL from '@/plugins/mql.js'
import Configs from '../utils/Configs'
import SystemDialog from '../utils/SystemDialog'
export default {
  name: 'SystemLogin',
  components: {},
  data () {
    return {
      isLoading: false,
      selectedInstituteIndex: 0,
      loginDetails: {
        username: '',
        password: '',
        empCode: ''
      },
      errors: {
        username: '',
        password: '',
        message: ''
      },
      togglePassword: false,
      teacherDataAvailable: false
    }
  },
  mounted () {
    this.$store.commit('isOfflineActivation', false)
    this.calculateChecksum().catch(() => {})

    this.$store
      .dispatch('validateActivation', Configs.getLocalUrl())
      .then((instituteList) => {
        // set instituteList
        this.$store.commit('instituteList', instituteList)
      })
      .catch((err) => {
        this.isConnectingToServer = false
        if (err.message === 'NETWORK_ERROR') {
          this.errors.message = this.$t('SystemLogin.unable_to_connect_server')
        } else if (err.message === 'your system clock is incorrect') {
          this.errors.message = this.$t(
            'SystemLogin.your_system_clock_is_incorrect_please_set_your_clock_to_the_current_date_and_time'
          )
        } else {
          SystemDialog.confirm(
            this.$t('SystemLogin.system_not_activated'),
            this.$t(
              'SystemLogin.your_system_is_not_activated_do_you_want_to_activate_this_system'
            ),
            this.$t('SystemLogin.proceed'),
            this.$t('SystemLogin.cancel'),
            (isConfirmed) => {
              if (isConfirmed) {
                // this.$router.push('Activation')
                this.$router.push('Importer')
              }
            }
          )
        }
      })
    this.checkTeacherProfileAvailable()
  },
  methods: {
    showPassword () {
      this.togglePassword = !this.togglePassword
      if (this.togglePassword) {
        this.$refs.txt_pass.type = 'text'
      } else {
        this.$refs.txt_pass.type = 'password'
      }
    },
    calculateChecksum () {
      return new Promise((resolve, reject) => {
        let self = this
        new MQL()
          .setActivity('o.[CalculateHashOfDownloadedTemplates]')
          .fetch()
          .then((rs) => {
            if (rs.isValid('CalculateHashOfDownloadedTemplates')) {
              let res = rs.getActivity(
                'CalculateHashOfDownloadedTemplates',
                true
              )
              if (res && res.result) {
                let res = rs.getActivity(
                  'CalculateHashOfDownloadedTemplates',
                  true
                )
                resolve(res.result)
              } else {
                reject(rs.raw.CalculateHashOfDownloadedTemplates.error)
              }
            } else {
              reject(new Error(self.$t('SystemLogin.can_not_calculate_hash_of_templates')))
              // rs.showErrorToast("CalculateHashOfDownloadedTemplates");
            }
          })
          .catch(() => {
            reject(new Error(self.$t('SystemLogin.can_not_calculate_hash_of_templates')))
          })
      })
    },
    validateInputs () {
      let isValid = true
      if (this.loginDetails.empCode.trim() === '') {
        isValid = false
        this.errors.username = this.$t('SystemLogin.please_enter_username')
      } else {
        this.errors.username = ''
      }
      if (this.loginDetails.password.trim() === '') {
        isValid = false
        this.errors.password = this.$t('SystemLogin.please_enter_password')
      } else {
        this.errors.password = ''
      }
      return isValid
    },
    proceedNext () {
      if (this.validateInputs()) {
        this.isLoading = true
        this.errors.message = ''

        this.$store
          .dispatch('isImportExportIsInProgress')
          .then((isInProgress) => {
            if (isInProgress) {
              this.$toasted.info(
                this.$t('SystemLogin.data_import_and_export_is_in_progress'), {
            theme: 'bubble',
            duration: 4000
          }
              )
              this.isLoading = false
              return
            }
            this.goForSystemLogin()
          })
          .catch((err) => {
            console.error(err)
            this.isLoading = false
            this.errors.message = this.$t(
              'SystemLogin.unable_to_connect_server'
            )
          })
      }
    },
    goForImporter () {
      this.$store
        .dispatch('isImportExportIsInProgress')
        .then((isInProgress) => {
          if (isInProgress) {
            this.$toasted.info(
              this.$t('SystemLogin.data_import_and_export_is_in_progress'), {
            theme: 'bubble',
            duration: 4000
          }
            )
            return
          }
          this.$router.push('Importer')
        })
        .catch((err) => {
          console.error(err)
          this.isLoading = false
          this.errors.message = this.$t('SystemLogin.unable_to_connect_server')
        })
    },
    goForSystemLogin () {
      // this.login()
      //   .then(res => {
      //     localStorage.setItem("user-token", res.token);
      //     this.getTeacherDetails(res.teacherId)
      //       .then(details => {
      //         this.isLoading = false;
      //         this.$store.commit("teacherDetails", details);
      //         this.$router.push("SelectClass");
      //       })
      //       .catch(err => {
      //         this.isLoading = false;
      //         this.errors.message = "Unable to login.";
      //       });
      //   })
      //   .catch(err => {
      //     this.isLoading = false;
      //     this.errors.message = "Unable to login.";
      //   });
      if (!this.teacherDataAvailable) {
        // For first login - where teacher provide details
        this.loginDetails.username =
          this.$store.getters.instituteList[this.selectedInstituteIndex]
            .instituteId +
          '_' +
          this.loginDetails.empCode
      } else {
        // For other login - where teacher data is fetched from store
        this.loginDetails.username = this.$store.getters.teacherDetails.username
        this.loginDetails.password = this.$store.getters.teacherDetails.password
      }

      // let user = Object.assign({}, this.loginDetails)
      // user.username =
      //   this.$store.getters.instituteList[this.selectedInstituteIndex].instituteId + '_' + user.username
      new MQL()
        .setActivity('o.[ValidateTeacherCredentials]')
        .setData(this.loginDetails)
        .fetch()
        .then((rs) => {
          this.isLoading = false
          if (rs.isValid('ValidateTeacherCredentials')) {
            let res = rs.getActivity('ValidateTeacherCredentials', true)
            if (res.result) {
              let requestData = {}
              requestData.teacherId = res.result.teacherDetails._id
              this.$store.dispatch('checkPresentationSessionIsAvailable', requestData).then((availablityResult) => {
                if (availablityResult) {
                  if (availablityResult.isCurrentPresentationAvailable) {
                    SystemDialog.confirm(
                      this.$t('SystemLogin.presentationSessionAlreadyExistHeader'),
                      this.$t(
                        'SystemLogin.presentationSessionAlreadyExistMsg'
                      ),
                      this.$t('SystemLogin.proceed'),
                      this.$t('SystemLogin.cancel'),
                      (isConfirmed) => {
                        if (isConfirmed) {
                          this.$store.dispatch('killPresentationSession', requestData).then((killPresentationResult) => {
                            if (killPresentationResult) {
                              setTimeout(
                                this.setUserSession(res),
                                2000
                              )
                            }
                          })
                        }
                      }
                    )
                  } else {
                    this.setUserSession(res)
                  }
                }
              })
              // this.showModal()
              // // alert('This is alpha version')
              // // this.selectInstitute(res.result.teacherDetails.intstitute);
              // // this.$router.push({ name: 'SelectClass' })
            }
          } else {
            let error = rs.getRaw().ValidateTeacherCredentials.error
            if (
              error === 'Invalid credentials' ||
              error.toLowerCase() === 'invalid password'
            ) {
              this.errors.message = this.$t(
                'SystemLogin.please_enter_a_valid_username_and_password'
              )
            } else {
              rs.showErrorToast('ValidateTeacherCredentials')
            }
          }
        })
        .catch((err) => {
          console.error(err)
          this.isLoading = false
          this.errors.message = this.$t('SystemLogin.unable_to_login')
        })
    },
    setUserSession (res) {
      this.checkIsValidDevice()
      .then((isValid, deviceData) => {
         if (isValid) {
            this.setTeacherDevice(deviceData)
            localStorage.setItem('user-token', res.result.token)
            sessionStorage.setItem('user-token', res.result.token)
            // this.$store.commit('teacherDetails', res.result.teacherDetails)
            // set sessionmanagerId in store
            this.$store.commit(
              'setSessionManagerId',
              res.result.teacherDetails._id
            )
            // this.$store.commit('loginDetails', user)
            this.$store.dispatch('initiateBackup')
            this.buildTeacherProfile(res.result.teacherDetails)
            // Avoide sync student reponse data req. (as it's not an online mode)
            this.$store.commit('studentResponseSyncStatus', 'notToSync')
            this.$router.push('SelectClass')
          } else {
            SystemDialog.show(
              this.$t('QRScanner.already_logged_in'),
              this.$t(
                 'QRScanner.no_second_device_is_allowed_to_login_from_mobile_app'
              ),
              this.$t('QRScanner.okay'),
              () => {}
            )
          }
       })
       .catch((err) => {
         console.error(err)
      })
    },
    buildTeacherProfile (apiData) {
      if (apiData) {
        this.teacherProfile = JSON.parse(JSON.stringify(apiData))
        this.teacherProfile.username = this.loginDetails.username
        this.teacherProfile.password = this.loginDetails.password
        // Handling Success
        // Saving Teacher Profile to local storage (if already not saved) as well as store (if already not set)
        if (!localStorage.getItem('teacherDetails')) {
          localStorage.setItem(
            'teacherDetails',
            JSON.stringify(this.teacherProfile)
          )
        }
        this.$store.commit('teacherDetails', this.teacherProfile)
      }
    },
    // To enable teacher selection, in case user cleans the user data
    enableTeacherSelection () {
      if (localStorage.getItem('teacherDetails')) {
        // remove teacher details from localstorage and session
        localStorage.removeItem('user-token')
        localStorage.removeItem('teacherDetails')
        this.loginDetails.username = ''
        this.loginDetails.password = ''
        this.$store.commit('teacherDetails', '')
      }
      // Reset data
      this.teacherDataAvailable = false
    },
    setTeacherDevice (data) {
      if (data == null) {
        data = {}
      }
      let deviceID = '12345678'
      if (typeof cordova !== 'undefined') {
        deviceID = device.uuid
      }
      data.mobile = deviceID
      new MQL()
        .setActivity('o.[SetTeacherDevices]')
        .setData({ teacherDevices: data })
        .fetch()
        .then((rs) => {})
    },
    checkIsValidDevice () {
      return new Promise((resolve, reject) => {
        new MQL()
          .setActivity('o.[GetTeacherDevices]')
          .setData({})
          .fetch()
          .then((rs) => {
            if (rs.isValid('GetTeacherDevices')) {
              let res = rs.getActivity('GetTeacherDevices', true)
              let deviceID = '12345678'
              if (typeof cordova !== 'undefined') {
                deviceID = device.uuid
              }
              if (
                res.result.sessionResult &&
                res.result.sessionResult.mobile &&
                res.result.sessionResult.mobile != deviceID
              ) {
                resolve(false)
              } else {
                resolve(true, res.result.sessionResult)
              }
            } else {
              // rs.showErrorToast('GetTeacherDevices')
              reject('NETWORK_ERROR')
            }
          })
          .catch((err) => {
            console.error(err)
            reject('NETWORK_ERROR')
          })
      })
    },
    login () {
      let self = this
      return new Promise((resolve, reject) => {
        new MQL()
          .setActivity('o.[LocalLogin]')
          .setData(this.loginDetails)
          .fetch()
          .then((rs) => {
            let res = rs.getActivity('LocalLogin', true)
            if (rs.isValid('LocalLogin') && res !== null) {
              resolve(res.result)
            } else {
              rs.showErrorToast('LocalLogin')
              reject()
            }
          })
      })
    },
    getTeacherDetails (teacherId) {
      return new Promise((resolve, reject) => {
        new MQL()
          .setActivity('o.[GetTeacherDetailsByEmpId]')
          .setData({
            _id: teacherId
          })
          .fetch()
          .then((rs) => {
            let res = rs.getActivity('GetTeacherDetailsByEmpId', true)
            if (rs.isValid('GetTeacherDetailsByEmpId') && res !== null) {
              resolve(res.result[0])
            } else {
              rs.showErrorToast('GetTeacherDetailsByEmpId')
              reject()
            }
          })
      })
    },
    // Onload check teacher profile available in local storage
    checkTeacherProfileAvailable () {
      if (localStorage.getItem('teacherDetails')) {
        this.$store.commit(
          'teacherDetails',
          JSON.parse(localStorage.getItem('teacherDetails'))
        )
        // Configs.changeBaseUrl(localStorage.getItem('baseURL'))
        this.loginDetails.username = this.$store.getters.teacherDetails.username
        this.loginDetails.password = this.$store.getters.teacherDetails.password
        this.loginDetails.empCode = this.$store.getters.teacherDetails.employeeCode
        this.teacherDataAvailable = true
      }
    }
  }
}
</script>
<style lang="scss">

.SystemLogin {
  #login {
    padding-top: 0px;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    .login-holder form {
      margin-top: 0;
    }
  }

  background-attachment: fixed;
  &.wrap {
    // height: calc(100vh - 60px);
    min-height: 50vh;
  }
  .page-title {
    text-align: center;
    font-size: 40px;
    font-weight: 300;
    padding-bottom: 70px;
    background: transparent;
    strong {
      font-weight: 600;
    }
  }

  .spinner {
    position: absolute;
    right: 0;
  }
  min-height: 89vh;
  height: calc(100vh - 60px);
  align-items: flex-start;
  display: flex;
  text-align: center;
  transition: all 500ms ease-in-out;
  flex-direction: column;
  justify-content: center;
  display: flex;
  // align-items: center;

  .v-select {
    .vs__dropdown-toggle {
      .vs__actions {
        .vs__clear {
          display: inline !important;
          fill: #fff;
        }
      }
    }
  }
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
      content: '';
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
      content: '';
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
}
</style>
