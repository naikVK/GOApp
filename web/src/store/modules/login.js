import * as types from '../types'
import router from '../../router'
import RouterMap from '../../utils/RouterMap'
import ViewSyncing from '../../utils/ViewSyncing'
import MQL from '@/plugins/mql.js'
import SystemDialog from '../../utils/SystemDialog'
import {
  LOGOUT_PROCESS_STATUS
} from '../../utils/Constants'
import NetworkUtils from '../../utils/NetworkUtils'
export const state = {
  token: localStorage.getItem('user-token') || '',
  status: ''
  // teacherDetails: null
}

export const getters = {
  isAuthenticated: state => !!state.token,
  authStatus: state => state.status
  // teacherDetails: state => state.teacherDetails
}

export const mutations = {

  [types.MUTATE_AUTH_REQUEST]: (state) => {
    state.status = 'loading'
  },

  [types.MUTATE_AUTH_SUCCESS]: (state, token) => {
    state.status = 'success'
    state.token = token
  },

  [types.MUTATE_AUTH_ERROR]: (state) => {
    state.status = 'error'
  }
  // teacherDetails: (state, teacherDetails) => {
  //   state.teacherDetails = teacherDetails
  // }
}

export const actions = {
  AUTH_REQUEST: ({
    commit
  }, payload) => {
    return new Promise((resolve) => {
      commit(types.MUTATE_AUTH_REQUEST, payload)
      localStorage.setItem('user-token', 'token')
      // axios.defaults.headers.common['Authorization'] = 'token'
      new MQL()
        .setLoginActivity()
        .setData(payload)
        // .showConfirmDialog(true)
        .fetch('loginBtn').then(response => {
          response.hideElement('loginFormId')
          if (response.isValid('MQLLogin')) {
            let token = response.getHeaders().authorization
            localStorage.setItem('user-token', token)
            commit(types.MUTATE_AUTH_SUCCESS, response)
            resolve(response)
          } else {
            commit(types.MUTATE_AUTH_ERROR, response)
            localStorage.removeItem('user-token')
            resolve(response)
          }
        })
    })
  },

  AUTH_LOGOUT: () => {
    return new Promise((resolve) => {
      localStorage.removeItem('user-token')
      // remove the axios default header
      // delete axios.defaults.headers.common['Authorization']
      router.push({
        name: 'login'
      })
      resolve()
    })
  },
  whoami () {
    return new Promise((resolve, reject) => {
      new MQL()
        .setActivity('o.[WhoamI]')
        .setData({ 'clientName': 'local' })
        .fetch()
        .then(rs => {
          if (rs.isValid('WhoamI')) {
            let res = rs.getActivity('WhoamI', true)
            resolve(res.result)
          } else {
            reject(new Error(rs.WhoamI.error))
          }
        }).catch((err) => {
          reject(err)
        })
    })
  },
  'login': ({
    commit
  }, sessionId) => {
    // localStorage.setItem('user-token', connectedTeacher.token)
    // commit(types.MUTATE_AUTH_SUCCESS, connectedTeacher.token)
    // commit("teacherDetails", connectedTeacher)
    // router.push("SelectClass");

    new MQL()
      .setActivity('o.[LocalLogin]')
      .setData({
        'sessionId': sessionId,
        'mobileNumber': '9689416033',
        'imeiNumber': '116841358311381'
      })
      .fetch()
      .then(rs => {
        let res = rs.getActivity('LocalLogin', true)
        if (rs.isValid('LocalLogin')) {
          console.debug(res)
          let token = rs.getHeaders().authorization
          localStorage.setItem('user-token', token)
          commit(types.MUTATE_AUTH_SUCCESS, token)
        } else {
          rs.showErrorToast('LocalLogin')
        }
      })
  },
  'clearConnectedUsers': (context) => {
    new MQL()
      .setActivity('r.[ClearConnectedUsers]')
      .setData({ 'sessionManagerId': context.getters.sessionManagerId })
      .fetch()
      .then(rs => {
        if (rs.isValid('ClearConnectedUsers')) {
          let res = rs.getActivity('ClearConnectedUsers', true)
        } else {
          rs.showErrorToast('ClearConnectedUsers')
        }
      })
  },
  'clearActiveUsers': (context) => {
    new MQL()
      .setActivity('r.[ClearActiveUsers]')
      .setData({ 'sessionManagerId': context.getters.sessionManagerId })
      .fetch()
      .then(rs => {
        if (rs.isValid('ClearActiveUsers')) {
          let res = rs.getActivity('ClearActiveUsers', true)
        } else {
          rs.showErrorToast('ClearActiveUsers')
        }
      })
  },
  'teacherLogout': () => {
    return new Promise((resolve, reject) => {
      // close presentation
      if (window.app.$store.getters.getPresentationId) {
        window.app.$store.dispatch('closePresentation', {
          presentationId: window.app.$store.getters.getPresentationId,
          sessionManagerId: window.app.$store.getters.sessionManagerId
        })
      }

      new MQL()
        .setActivity('r.[TeacherLogout]')
        .setData({
          sessionId: localStorage.getItem('sessionId')
        })
        .fetch()
        .then(rs => {
          if (rs.isValid('TeacherLogout')) {
            let res = rs.getActivity('TeacherLogout', true)
            resolve()
          } else {
            rs.showErrorToast('TeacherLogout')
            reject()
          }
        })
    })
  },
  clearTeacherConnectedDevices: (context) => {
    new MQL()
      .setActivity('o.[SetTeacherDevices]')
      .setData({ teacherDevices: null, 'sessionManagerId': context.getters.sessionManagerId })
      .fetch()
      .then(rs => { })
  },
  isImportExportIsInProgress (context) {
    return new Promise((resolve) => {
      new MQL()
        .setActivity('o.[GetPendriveImportExportIsInProgress]')
        .setData({ sessionManagerId: context.getters.sessionManagerId })
        .fetch()
        .then(rs => {
          if (rs.isValid('GetPendriveImportExportIsInProgress')) {
            let res = rs.getActivity(
              'GetPendriveImportExportIsInProgress',
              true
            )

            let isInProgress = res.result.sessionResult
            resolve(isInProgress)
          } else {
            rs.showErrorToast('GetPendriveImportExportIsInProgress')
          }
        })
    })
  },
  'logout': ({
    commit,
    dispatch
  }, options) => {
    return new Promise((resolve, reject) => {
      if (localStorage.getItem('user-token') == null) {
        resolve(LOGOUT_PROCESS_STATUS.DONE)
        return
      }
      resolve(LOGOUT_PROCESS_STATUS.CONFIRMING)
      let title = window.app.$t('login.close_session')
      let message = window.app.$t('login.are_you_sure_you_want_to_close_session')
      if (options && options.clearData) {
        title = window.app.$t('login.logout')
        message = window.app.$t('login.are_you_sure_you_want_to_logout')
      } else if (options && options.apiName) {
        switch (options.apiName) {
          case NetworkUtils.RpiApis.restartSCLocalServer:
            title = window.app.$t('login.restart_0', { '0': window.app.$store.getters.appName })
            message = window.app.$t('login.are_you_sure_you_want_to_restart_0', { '0': window.app.$store.getters.appName })
            break
          case NetworkUtils.RpiApis.rebootDevice:
            title = window.app.$t('login.restart_superbox')
            message = window.app.$t('login.are_you_sure_you_want_to_restart_superbox')
            break
          case NetworkUtils.RpiApis.shutdownDevice:
            title = window.app.$t('login.shutdown_superbox')
            message = window.app.$t('login.are_you_sure_you_want_to_shutdown_superbox_note_it_will_take_2030_seconds_to_take_effect')
        }
      }
      SystemDialog.confirm(title, message, window.app.$t('login.yes'), window.app.$t('login.no'), isOk => {
        if (isOk) {
          // confirmed
          resolve(LOGOUT_PROCESS_STATUS.PROCESSING)
          dispatch('clearTeacherConnectedDevices')
          dispatch('clearConnectedUsers')
          dispatch('clearActiveUsers')
          new MQL()
            .setActivity('r.[RemoveCurrentSessionDetails]')
            .setData({ 'sessionManagerId': window.app.$store.getters.sessionManagerId })
            .fetch()
            .then(rs => {
              if (rs.isValid('RemoveCurrentSessionDetails')) {
                // let res = rs.getActivity("RemoveCurrentSessionDetails", true);

                dispatch('teacherLogout').then(() => {
                  // after removing current session details
                  ViewSyncing.getInstance().removeViewSyncData().then(isLoggedOut => {
                    if (isLoggedOut) {
                      if (options && options.clearData) {
                        commit('loginDetails', null)
                      }
                      if (options && options.apiName) {
                        NetworkUtils.callRpiApi(window.app.$store.getters.serverIP, options.apiName)
                      }
                      // window.app.$toasted.success("Logout Success.", {
                      //   theme: "bubble",
                      //   duration: 2000
                      // });
                      RouterMap.clearAppState()
                    }
                    resolve(LOGOUT_PROCESS_STATUS.DONE)
                  })
                }).catch(err => {
                  resolve(LOGOUT_PROCESS_STATUS.DONE)
                })
              } else {
                rs.showErrorToast('RemoveCurrentSessionDetails')
              }
            })
        } else {
          resolve(LOGOUT_PROCESS_STATUS.CANCELLED)
        }
      })
    })
  },
  validateActivation: ({ }, customURL) => {
    return new Promise((resolve, reject) => {
      // new MQL()
      //   .setCustomURL(customURL)
      //   .setActivity('o.[GetActivationData]')
      //   .setData()
      //   .fetch()
      //   .then(rs => {
      //     if (rs.isValid('GetActivationData')) {
      //       let res = rs.getActivity('GetActivationData', true)
      //       if (res && Array.isArray(res.result) && res.result.length > 0) {
      //         resolve(res.result)
      //       } else {
      //         reject(new Error('please activate local application'))
      //       }
      //     } else {
      //       // console.log(rs.raw.ValidateActivation.error)
      //       reject(new Error(rs.raw.ValidateActivation.error))
      //     }
      //   })
      //   .catch(() => {
      //     reject(new Error('NETWORK_ERROR'))
      //   })
      new MQL()
        .setActivity('o.[GetActivationData]')
        .setData()
        .fetch()
        .then(rs => {
          if (rs.isValid('GetActivationData')) {
            let res = rs.getActivity('GetActivationData', true)
            if (res.result && res.result.instituteList.length === 0) {
              reject(new Error('please activate local application'))
              return
            }
            // commit('instituteList', res.result.instituteList)
            resolve(res.result.instituteList)
          } else {
            // console.log(rs.raw.GetActivationData.error)
            reject(new Error(rs.raw.GetActivationData.error))
          }
        })
        .catch((err) => {
          console.error(err)
          reject(new Error('server not running'))
        })
    })
  },
  initiateBackup () {
    // ExportUserActivityData
    new MQL()
      .setActivity('r.[ExportUserActivityData]')
      .setData({})
      .fetch()
      .then(rs => {
        // if (rs.isValid('ExportUserActivityData')) {
        //   let res = rs.getActivity('ExportUserActivityData', true)
        // } else {
        //   rs.showErrorToast('ExportUserActivityData')
        // }
      })
  }
}

/* export default {
  state,
  getters,
  mutations,
  actions
} */
