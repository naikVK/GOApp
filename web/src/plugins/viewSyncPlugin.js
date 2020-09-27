import MQL from '@/plugins/mql.js'

var options = {
  router: null,
  interval: 1000,
  store: null,
  viewsToSync: [],
  loginPage: ''
}

let getViewInterval = ''

function install (vue, option) {
  if (!option.router) {
    console.error('viewSync: please provide router option')
    return
  }
  vue.prototype.$viewSync = viewSync
  options.interval = option.interval
  options.router = option.router
  options.store = option.store
  options.viewsToSync = option.viewsToSync
  options.loginPage = option.loginPage

  setKeepSyncing(false)

  options.router.beforeEach((to, from, next) => {
    // alert("beforeEach" + options.viewsToSync)
    if (options.viewsToSync && (options.viewsToSync.indexOf(to.name)) !== -1) {
      // console.log("matched")
      // console.log("syncing" + options.store.getters.keepSyncing)
      pauseSyncing()
      startSyncing()
      // if (!options.store.getters.keepSyncing) {

      // }
      if (options.router.currentRoute.name !== to.name) {
        updateCurrentView({
          viewName: to.name
        })
      }
    } else {
      // console.log("router")
      pauseSyncing()
    }
    next()
  })
  // in case dont need to call update view just update your vuex state and automatically calls update view

  // options.store.subscribe((mutation, state) => {
  //   console.log("mutation")
  //   console.log(mutation.payload)
  // })
}

function startSyncing () {
  // setKeepSyncing(true)
  // console.log("syncing started")
  // let msg = new Date().getTime()
  // getViewInterval = setInterval(() => {
  //   getCurrentView(msg)
  // }, options.interval)
}

function pauseSyncing () {
  // console.log('syncing paused')
  setKeepSyncing(false)
  window.clearInterval(getViewInterval)
}

function setKeepSyncing (keepSyncing) {
  options.store.commit('keepSyncing', keepSyncing)
}

function stopSyncing () {
  // console.log('syncing stopped')
  // updateCurrentView({ keepSyncing: false, isTeacherLoggedIn: false })
  pauseSyncing()
  // console.log('stop syncing')

  return new Promise((resolve, reject) => {
    new MQL()
      .setActivity('o.[RemoveCurrentView]')
      .setData({
        sessionId: localStorage.getItem('sessionId')
      })
      .fetch()
      .then(rs => {
        let res = rs.getActivity('RemoveCurrentView', true)
        if (rs.isValid('RemoveCurrentView')) {
          // console.log('RemoveCurrentView' + JSON.stringify(res))
          resolve()
        } else {
          rs.showErrorToast('RemoveCurrentView')
          // options.store.commit("modifiedOn", previousModifiedDate)
          reject()
        }
      })
  }).catch(err => {
    reject(err)
  })
}

function updateCurrentView (currentView) {
  let previousModifiedDate = options.store.getters.modifiedOn
  let currentTime = new Date().getTime()
  // alert(currentView.keepSyncing)
  // console.debug("currentTime" + currentTime)
  options.store.commit('modifiedOn', currentTime)
  // alert(JSON.stringify(currentView))
  return new Promise((resolve, reject) => {
    let updatedCurrentView = currentView
    updatedCurrentView.modifiedOn = currentTime
    console.debug('updatedCurrentView' + JSON.stringify(updatedCurrentView))
    // alert(JSON.stringify(updatedCurrentView))
    new MQL()
      .setActivity('o.[SetCurrentView]')
      .setData({
        sessionId: localStorage.getItem('sessionId'),
        'currentView': updatedCurrentView
      })
      .fetch()
      .then(rs => {
        let res = rs.getActivity('SetCurrentView', true)
        if (rs.isValid('SetCurrentView')) {
          // console.log("SetCurrentView" + JSON.stringify(res))
          updateCurrentViewData(res.result.sessionResult)
          if (updatedCurrentView.viewName) {
            options.router.push({
              name: updatedCurrentView.viewName
            })
          }
          resolve()
        } else {
          rs.showErrorToast('SetCurrentView')
          options.store.commit('modifiedOn', previousModifiedDate)
          reject()
        }
      }).catch((err) => {
        console.debug(err)
        options.store.commit('modifiedOn', previousModifiedDate)
        reject()
      })
  })
}

function getCurrentView (msg) {
  // console.log('i am running ' + msg)
  new MQL()
    .setActivity('o.[GetCurrentView]')
    .setData({
      sessionId: localStorage.getItem('sessionId')
    })
    .fetch()
    .then(rs => {
      let res = rs.getActivity('GetCurrentView', true)
      if (rs.isValid('GetCurrentView')) {
        // if (res === null) {
        //   options.router.push({ path: "/" })
        //   reject()
        // }

        if (!res || res.result.status === 'SESSION_NOT_FOUND' || res.result.sessionResult === null) {
          options.router.push({
            name: options.loginPage
          })
          console.error('GetCurrentView session not found')
          // pauseSyncing()
          return
        }
        // localStorage.setItem("storeData", res.result.sessionResult)
        // console.log("modified" + res.result.sessionResult.modifiedOn > currentViewData.modifiedOn)
        // console.log(res.result.sessionResult.modifiedOn >= options.store.getters.modifiedOn)
        if (res.result.sessionResult.modifiedOn >= options.store.getters.modifiedOn) {
          updateCurrentViewData(res.result.sessionResult)
          if ((options.router.currentRoute.name !== res.result.sessionResult.viewName) && options.router.getMatchedComponents({
              name: res.result.sessionResult.viewName
            }).length > 0) {
            options.router.push({
              name: res.result.sessionResult.viewName
            })
          }
        }
      } else {
        rs.showErrorToast('GetCurrentView')
      }
    })
}

function updateCurrentViewData (data) {
  let newData = Object.assign({}, data)
  Object.keys(newData).forEach(key => {
    options.store.commit(key, newData[key])
  })
}

function isKeepSyncingOn () {
  return options.store.getters.keepSyncing
}

var viewSync = {
  install: install,
  startSyncing: startSyncing,
  stopSyncing: stopSyncing,
  updateCurrentView: updateCurrentView,
  isKeepSyncingOn: isKeepSyncingOn,
  pauseSyncing: pauseSyncing
}
export default viewSync
