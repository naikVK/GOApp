import MQL from '@/plugins/mql.js'

/**
 * Syncing pages with other apps and exchanging data between them.
 */
class ViewSyncing {
  /**
     * Syncing pages with other apps and exchanging data between them.
     * @param {({interval?:number,navigateAfterLogout?:string})} [options] Custom options
     * - [navigateAfterLogout] - Page to route when session is expired.
     * - [interval] - Interval to fetch sync state.
     */
  constructor(options) {
    // assign current object to static instance
    instance = this

    this.interval = options && options.interval ? options.interval : 1000
    this.navigateAfterLogout = options && options.navigateAfterLogout ? options.navigateAfterLogout : null

    this.appIsInBackground = false
    this.isViewSyncing = false
    this.isRouteSetFromSyncService = false
    this.listOfPagesToSync = []

    this.registerAppVisibilityStateListener()
  }

  /**
     * Get current running instance of ViewSyncing class
     */
  static getInstance () {
    return instance
  }

  /**
     * For accessing app visibility state.
     */
  registerAppVisibilityStateListener () {
    window.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        // app is in background
        this.appIsInBackground = true
      } else {
        // app is in focused
        this.appIsInBackground = false
      }
    })

    // add system event listener for pause and resume
    document.addEventListener('deviceready', () => {
      document.addEventListener('pause', () => {
        // app is in background
        this.appIsInBackground = true
      }, false)
      document.addEventListener('resume', () => {
        // app is in focused
        this.appIsInBackground = false
      }, false)
    }, false)
  }

  /**
     * Sets list of pages are need to be synced.
     * @param {[{name: string, setDataOnly?: boolean,getData?: ()=>Object}]} pageList Page list for syncing.
     */
  setListOfPagesToSync (pageList) {
    this.listOfPagesToSync = pageList
  }

  /**
     * Checking whether user is logged in or not.
     */
  isUserLoggedIn () {
    // if (typeof cordova == 'undefined') {
    //     return sessionStorage.getItem('user-token') != null
    // }
    return localStorage.getItem('user-token') != null
  }

  /**
     * Triggers after every interval time to get current sync state.
     * @param {number} pollingBlockId Block identifier to detect dead block state.
     */
  pollingBlock (pollingBlockId) {
    if (pollingBlockId === -1) {
      // syncing / polling block stoped
      this.stopSyncing()
      return
    }
    setTimeout(() => {
      this.getViewSyncData(pollingBlockId).then(this.pollingBlock.bind(this))
    }, this.interval)
  }

  /**
     * Starts syncing.
     */
  startSyncing () {
    if (this.isViewSyncing) {
      // syncing is already started
      return
    }
    this.isViewSyncing = true
    let pollingBlockId = new Date().getTime()
    this.pollingBlockId = pollingBlockId
    this.getViewSyncData(pollingBlockId).then(this.pollingBlock.bind(this))
  }

  /**
     * Stops syncing.
     */
  stopSyncing () {
    this.pollingBlockId = -1
    this.isViewSyncing = false
  }

  /**
     * Update store data with servers sync data and navigates to new view.
     * @param {Object} viewSyncData Data to be updated to store.
     */
  updateStoreDataAndRoute (viewSyncData) {
    // update data to store
    Object.keys(viewSyncData).forEach(key => {
      const value = viewSyncData[key]
      if (key !== 'currentView') {
        window.app.$store.commit(key, value)
      }
    })

    // route to updated page
    this.isRouteSetFromSyncService = true
    window.app.$router.push(viewSyncData.currentView, () => {
      // on route complete
    })
  }

  /**
     * Redirects to login page.
     */
  logout () {
    if (this.navigateAfterLogout !== undefined) {
      window.app.$router.push(this.navigateAfterLogout)
      if (typeof cordova === 'undefined') {
        return sessionStorage.removeItem('user-token')
      }
      return localStorage.removeItem('user-token')
    }
  }

  /**
     * Fetches current sync state from server.
     * @param {number} pollingBlockId Block identifier to detect dead block state.
     */
  getViewSyncData (pollingBlockId) {
    return new Promise((resolve, reject) => {
      if (this.pollingBlockId !== pollingBlockId) {
        // this is stopped/invalid polling block
        return
      }

      if (!this.isUserLoggedIn()) {
        // No login session found and navigate to login page
        this.logout()
        resolve(-1)
        return
      }

      if (!this.isViewSyncing) {
        // syncing stopped manually
        resolve(-1)
        return
      }

      if (this.appIsInBackground) {
        // app is in background, no need of newtwork hit
        resolve(pollingBlockId)
        return
      }

      new MQL()
        .setActivity('r.[GetViewSyncData]')
        .setData({ 'sessionManagerId': window.app.$store.getters.sessionManagerId })
        .fetch()
        .then(rs => {
          if (rs.isValid('GetViewSyncData')) {
            let res = rs.getActivity('GetViewSyncData', true)
            let viewSyncData = res.result.sessionResult
            if (viewSyncData == null) {
              // session is expired or cleared
              this.logout()
              resolve(-1)
              return
            }
            if (window.app.$route.name === viewSyncData.currentView) {
              // no page changed
              resolve(pollingBlockId)
              return
            }

            if (this.pollingBlockId !== pollingBlockId) {
              // this is stopped/invalid polling block
              return
            }

            // page changed
            this.updateStoreDataAndRoute(viewSyncData)
            resolve(pollingBlockId)
          } else {
            rs.showErrorToast('GetViewSyncData')
            resolve(pollingBlockId)
          }
        })
    })
  }

  /**
     * Updates changed sync state with server.
     * @param {Object} data Updated data to be synced with server.
     */
  setViewSyncData (data) {
    return new Promise((resolve, reject) => {
      if (!this.isUserLoggedIn()) {
        // No login session found and navigate to login page
        this.logout()
        return
      }

      new MQL()
        .setActivity('r.[SetViewSyncData]')
        .setData({
          viewSyncData: data,
          'sessionManagerId': window.app.$store.getters.sessionManagerId
        })
        .fetch()
        .then(rs => {
          if (rs.isValid('SetViewSyncData')) {
            // let res = rs.getActivity("SetViewSyncData", true)
            resolve()
          } else {
            rs.showErrorToast('SetViewSyncData')
            reject()
          }
        })
    })
  }

  /**
     * Clears servers view sync data and logouts
     */
  removeViewSyncData () {
    return new Promise((resolve, _) => {
      new MQL()
        .setActivity('r.[RemoveViewSyncData]')
        .setData({ 'sessionManagerId': window.app.$store.getters.sessionManagerId })
        .fetch()
        .then(rs => {
          if (rs.isValid('RemoveViewSyncData')) {
            // let res = rs.getActivity("RemoveViewSyncData", true)
            this.logout()
            resolve(true)
          } else {
            rs.showErrorToast('RemoveViewSyncData')
            resolve(false)
          }
        })
    })
  }

  /**
     * Observes each route and checks that page is in syncing list. If it is in sync list then it updates state with server.
     * @param {import("vue-router").Route} to Page where routed.
     * @param {Route} [_] Page from routed.
     */
  interceptRouter (to, _) {
    // find page is in syncing list
    let currentPage = this.listOfPagesToSync.find(it => {
      return it.name === to.name
    })

    if (this.isRouteSetFromSyncService) {
      // this route is set by sync service, so no need to update again
      this.isRouteSetFromSyncService = false
      if (currentPage.setDataOnly !== undefined && currentPage.setDataOnly) {
        // for this page only for data set, no need of syncing
        this.stopSyncing()
      }
      return
    }

    if (currentPage == null) {
      // this page is set for syncing
      this.stopSyncing()
      return
    }

    let finalDataToSync = {
      'currentView': currentPage.name
    }

    if (currentPage.getData !== undefined) {
      // get custom data to set
      finalDataToSync = currentPage.getData()
      finalDataToSync['currentView'] = currentPage.name
    }

    // page changed, so update view data with server
    this.stopSyncing()
    this.setViewSyncData(finalDataToSync).then(() => {
      if (currentPage.setDataOnly !== undefined && currentPage.setDataOnly) {
        // for this page only for data set, no need of syncing
        return
      }
      this.startSyncing()
    })
  }
}

var instance = new ViewSyncing()
export default ViewSyncing
