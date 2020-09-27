import * as Constants from './Constants'
import Vue from 'vue'
import SystemDialog from './SystemDialog'
export default class Configs {
  constructor () { }

  static changeBaseUrl (url) {
    Vue.setBaseURL(url)
  }

  static prepareBaseUrl (ipAddress) {
    if (typeof cordova === 'undefined') {
      return Configs.getLocalUrl()
    }
    return 'http://' + ipAddress + ':' + Constants.SERVER_PORT + '/'
  }

  static getRaspberryPiServerIP () {
    if (typeof cordova === 'undefined') {
      return ''
    }
    return Constants.RASPBERRY_PI_SERVER_IP
  }

  static getApplicationId () {
    if (typeof cordova === 'undefined') {
      return Constants.APPLICATION_CONFIG.SUPERSCHOOL
    }
    return BuildInfo.packageName
    // return Constants.APPLICATION_CONFIG.SUPERCOLLEGE
  }

  static getApplicationClientName () {
    if (Configs.getApplicationId() == Constants.APPLICATION_CONFIG.SUPERSCHOOL) {
      return 'SuperSchool'
    }
    return 'SuperCampus'
  }

  static getIMEINumber () {
    if (typeof cordova === 'undefined') {
      return '1234567890'
    }
    return device.uuid
  }

  static getGatewayUrl () {
    // TODO: Need to update code here
    if (typeof cordova === 'undefined') {
      return window.location.origin + '/GatewayServer/'
    }
    return Constants.VUE_APP_GATEWAY_SERVER_URL

    // For app creation with superschoolstg pointing
    // return 'https://mepcs.mkcl.org/1XI3l1W9pW7a2gUGtKppUTXUKXd/'

    // For app creation with ssstg pointing
    // return 'https://ssstg.mkcl.org/GatewayServer'
  }

  // Specific for Local Environment Testing
  static getOnlineClassroomURL () {
    if (typeof cordova === 'undefined') {
      return window.location.origin + '/onlineClassroomServer'
    }
    return localStorage.getItem('baseURL')
  }
  static getCloudUrl () {
    if (typeof cordova === 'undefined') {
      return window.location.origin + '/cloudServer'
    }
    return 'https://mepcs.mkcl.org/1LUEiFHwJdv61A3kxMfl9G2ZKMT/'
  }

  static getLocalUrl () {
    if (typeof cordova === 'undefined') {
      // console.log('URL:: ', window.location.origin + '/localserver')
      return window.location.origin + '/localserver'
    }
    // return "https://mepcs.mkcl.org/1LUEW7fJDMkpbkkdeyP9xlAjKmu/"
    if (window.app.$store) {
      return Configs.prepareBaseUrl(window.app.$store.getters.serverIP)
    }
    return '/localserver'
  }

  static getTodayDate () {
    let date = new Date()
    return date.getDate() + '-' + date.getMonth() + '-' + date.getFullYear()
  }

  static saveProfileImagePath (path) {
    window.app.$store.commit('profileImagePath', path)
  }

  static saveTemplateList (templateList) {
    window.app.$store.commit('templateList', templateList)
  }

  static createDirectoryRecursively (fileSystem, folderPathToCreate, onSuccess, onError) {
    if (typeof cordova === 'undefined') {
      return '/'
    }
    let folderLookUp = folderPathToCreate.split('/')
    if (folderLookUp.length === 0) {
      folderLookUp.push(folderPathToCreate)
    }
    window.resolveLocalFileSystemURL(fileSystem, function (fileEntry) {
      Configs.createDirectory(fileEntry, folderLookUp, onSuccess, onError)
    }, onError)
  }

  static createDirectory (fileEntry, folderLookUp, onSuccess, onError) {
    if (folderLookUp.length === 0) {
      onSuccess()
      return
    }
    let directoryToCreate = folderLookUp[0].replace('/', '')
    fileEntry.getDirectory(directoryToCreate, {
      create: true
    }, function (dirEntry) {
      folderLookUp.splice(0, 1)
      Configs.createDirectory(dirEntry, folderLookUp, onSuccess, onError)
    }, onError)
  }

  static checkAppVersion(clientName) {
    return new Promise((resolve, reject) => {
      if (typeof cordova === 'undefined') {
        resolve(true)
      }

      window.app.$store.dispatch('whoami').then(config => {
        // "s_iosMinVer": 5,
        // "s_iosBaseVer": 10,
        // "s_apkMinVer": 5,
        // "s_apkBaseVer": 10,
        // "t_iosMinVer": 5,
        // "t_iosBaseVer": 10,
        // "t_apkMinVer": 5,
        // "t_apkBaseVer": 10
        let minVersionKey = device.platform.toLowerCase() == 'ios' ? 'iosMinVer' : 'apkMinVer'
        let baseVersionKey = device.platform.toLowerCase() == 'ios' ? 'iosBaseVer' : 'apkBaseVer'
        let minVersionCode = config[clientName + '_' + minVersionKey]
        let baseVersionCode = config[clientName + '_' + baseVersionKey]
        let appVersionCode = parseInt(BuildInfo.versionCode)

        let openAPPStoreUrl = () => {
          let packageName = BuildInfo.basePackageName
          if (device.platform.toLowerCase() == "ios") {
            cordova.plugins.market.open("id" + Constants.APP_STORE_ID);
          } else {
            cordova.plugins.market.open(packageName);
          }
        }

        if (appVersionCode >= minVersionCode) {
          // this is valid version

          if (appVersionCode < baseVersionCode) {
            // update available
            SystemDialog.confirm(window.app.$t('Configs.new_update_available'), window.app.$t('Configs.please_update_your_mobile_app_otherwise_you_might_miss_new_features'), 'Continue', 'Update Now', (res) => {
              if (!res) {
                openAPPStoreUrl()
                resolve(false)
                return
              }
              resolve(true)
            })
            return
          }

          // this is latest version
          resolve(true)
          return
        }

        // invalid app version
        SystemDialog.confirm(window.app.$t('Configs.new_update_available'), window.app.$t('Configs.please_update_your_mobile_app_to_continue'), 'Update Now', 'Exit', (res) => {
          if (res) {
            openAPPStoreUrl()
          }
          resolve(false)
        })
      }).catch((err) => {
        reject(err)
      })
    })
  }
}
