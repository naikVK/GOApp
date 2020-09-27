import sampleSlides from '../../../public/assets/tempFile/sampleSlides'
import MQL from '@/plugins/mql'
import MQLCdn from '@/plugins/mqlCdn'

export const state = {
  templateFolderPath: '/templateFilesTeacher/',
  // templateFolderPath: './assets/templates/',
  slides: [],
  currentSlideIndex: 0,
  currentSlide: {},
  nextSlide: {},
  currentSlideChartData: [],
  // templates: templates,
  tempComp: 'Comp1.vue',
  presentationId: '',
  currentPresentation: {},
  cdnServerURL: '/CDNserver/',
  currentSummary: {},
  sharedData: {},
  runningSlideLastModifiedOn: 0
}

export const getters = {
  getCurrentSlideMetadata: (state) => {
    return state.slides[state.currentSlideIndex]
  },
  getCurrentSlideActiveIndex: (state) => {
    return state.slides[state.currentSlideIndex].activeIndex
  },
  getSlideCount: (state) => {
    return state.slides.length
  },
  getMediaFilePrefix: (state) => (index) => {
    // let mediaFileName = `${state.slides[data.index].slideType}_${data.index}_${state.slides[data.index].name}`

    return `${state.slides[index].slideType}_${index}_${state.slides[index].name}`
  },
  getTemplateFolderPath: (state) => {
    return state.templateFolderPath
  },
  getCDNServerURL: (state) => {
    return state.cdnServerURL
  },
  getCurrentPresentation: (state) => {
    return state.currentPresentation
  },
  getPresentationId: (state) => {
    return state.currentPresentation.presentationId
  },
  getTemplates: (state) => {
    return state.templates
  },
  getTempComp: (state) => {
    return state.tempComp
  },
  getSlides: (state) => {
    // console.log('from superpoint')
    return state.slides
  },
  getCurrentSlideChartData: (state) => {
    return state.currentSlideChartData.find(obj => obj.slideId === state.slides[state.currentSlideIndex].slideName)
  },
  getActiveSlides: (state) => {
    let data = state.slides.filter(slide => {
      return slide.isActive === true
    })
    return data
  },
  getCurrentSlideIndex: (state) => {
    return state.currentSlideIndex
  },
  getSlide: (state) => (slidePosition) => {
    let slide
    switch (slidePosition) {
      case 'next':
        slide = state.nextSlide
        break
      default:
        slide = state.currentSlide
        break
    }
    return slide
  },
  getCurrentSlide: (state) => {
    return state.currentSlide
  },
  getSlidePluginProperties: (state) => (slidePosition) => {
    let properties
    switch (slidePosition) {
      case 'next':
        properties = state.nextSlide.pluginProperties
        break
      default:
        properties = state.currentSlide.pluginProperties
        break
    }
    return properties
  },
  getCurrentPluginProperties: (state) => {
    return state.currentSlide.pluginProperties
  },
  getNextSlideDetails: (state) => {
    return state.nextSlide
  },
  getSlideQuestionProperties: (state) => (slidePosition) => {
    let properties
    switch (slidePosition) {
      case 'next':
        properties = state.nextSlide.questionProperties
        break
      default:
        properties = state.currentSlide.questionProperties
        break
    }
    return properties
  },
  getCurrentQuestionProperties: (state) => {
    return state.currentSlide.questionProperties
  },
  getSlideDataByIndex: (state) => (index) => {
    // console.log('state.slides[index] ? state.slides[index].data : {}', state.slides[index] ? state.slides[index].data : {})
    return state.slides[index].data ? state.slides[index].data : {}
  },
  getMetadataOfSlide: (state) => {
    if (state.slides.length !== 0 && state.slides[state.currentSlideIndex] !== undefined) {
      return state.slides[state.currentSlideIndex].properties
    }
  },
  getCurrentSummary: (state) => {
    return state.currentSummary
  },
  getSharedData: (state) => {
    return state.sharedData
  },
  getSummary: (state) => {
    return state.Summary
  },
  getRunningSlideLastModifiedOn: (state) => {
    return state.runningSlideLastModifiedOn
  }
}

export const mutations = {
  applyPropertyToAllSlides (state, data) {
    for (let i = 0; i < state.slides.length; i++) {
      // state.slides[i].slideProperties[data.propertyName] = data.propertyValue
      state.slides[i][data.propertyName] = data.propertyValue
    }
  },
  applyPropertyToCurrentSlide (state, data) {
    // state.slides[state.currentSlideIndex].slideProperties[data.propertyName] = data.propertyValue
    state.slides[state.currentSlideIndex][data.propertyName] = data.propertyValue
  },
  setCDNServerURL (state, data) {
    state.cdnServerURL = data
  },
  setTemplateFolderPath (state, data) {
    state.templateFolderPath = data
  },
  setPresentationId (state, data) {
    state.currentPresentation.presentationId = data
  },
  setTemplates (state, data) {
    state.templates.push(data)
  },
  setCurrentPresentation (state, data) {
    // console.log('data',data)
    state.currentPresentation = data
  },
  resetSlideState (state) {
    state.currentSlide = {}
    state.nextSlide = {}
    state.currentSlideIndex = 0
    state.slides = []
    // state.currentPresentation = {}
    state.currentSlideChartData = []
  },

  /* expected Data for setDataByIndex mutation
 {
   index: 0,
   data:{}
 }
  */
  setDataByIndex (state, data) {
    let tempData = data.data
    // for (let key in tempData) {
    //   if (tempData.hasOwnProperty(key)) {
    //     state.slides[data.index].data[key] = tempData[key]
    //   }
    // }
    let temp = state.slides[data.index]
    temp.data = tempData
    temp.randomKey = window.performance.now()
    state.slides.splice(data.index, 1, temp)
  },
  setCurrentSlideData (state, data) {
    let temp = state.slides[state.currentSlideIndex]
    temp.data = data
    temp.randomKey = window.performance.now()
    state.slides.splice(state.currentSlideIndex, 1, temp)
  },

  updateSlideByIndex (state, data) {
    let tempData = data.data
    for (let key in tempData) {
      if (tempData.hasOwnProperty(key)) {
        state.slides[data.index][key] = tempData[key]
      }
    }
    let temp = state.slides[data.index]
    state.slides.splice(data.index, 1, temp)
  },

  setChangedOrdinality (state) {
    for (let i in state.slides) {
      state.slides[i].slideOrdinality = i
    }
  },
  setCurrentSlideChartData (state, data) {
    let index = state.currentSlideChartData.findIndex(elem => elem.slideId === state.slides[state.currentSlideIndex].slideName)
    if (index === -1) {
      state.currentSlideChartData.push(data)
    } else {
      state.currentSlideChartData.splice(index, 1, data)
    }
  },
  setSlides (state, data) {
    state.slides = data
  },
  setNewSlide (state, data) {
    state.slides.push(data)
    state.currentSlideIndex = state.slides.length - 1
  },
  setCurrentSlideIndex (state, data) {
    state.currentSlideIndex = data
  },
  setCurrentSlide (state, data) {
    for (let i in state.slides) {
      if (state.slides[i].slideId === data.slideId) {
        // state.currentSlideIndex = state.slides[i].slideOrdinality
        state.currentSlideIndex = i
        break
      }
    }
    state.currentSlide = data
  },
  setNextSlideDetails (state, data) {
    state.nextSlide = data
  },
  setMetaDataofSlide (state, data) {
    let temp = state.slides[state.currentSlideIndex]
    temp.properties = data
    state.slides.splice(state.currentSlideIndex, 1, temp)
  },
  deleteSlide (state) {
    state.slides.splice(state.currentSlideIndex, 1)
  },
  deleteSlideByIndex (state, index) {
    if (index >= state.slides.length - 1 && index !== 0) {
      state.currentSlideIndex = index - 1
    }
    state.slides.splice(index, 1)
  },
  createSearchText (state) {
    function generateSearchText (obj) {
      let text = ''
      for (var key in obj) {
        if (typeof obj[key] === 'object') {
          text = `${text}${generateSearchText(obj[key])}`
        } else {
          text = `${text} ${obj[key]}`
        }
      }
      return text
    }
    let activeIndex = 0
    for (let index = 0; index < state.slides.length; index++) {
      // state.slides[index].searchText = generateSearchText(state.slides[index].data)
      if (state.slides[index].isActive) {
        state.slides[index].activeIndex = activeIndex++
      } else {
        delete state.slides[index].activeIndex
      }
    }
  },
  addActiveIndex (state) {
    let activeIndex = 0
    for (let index = 0; index < state.slides.length; index++) {
      if (state.slides[index].isActive) {
        state.slides[index].activeIndex = activeIndex++
      } else {
        delete state.slides[index].activeIndex
      }
    }
  },
  setSummary (state, data) {
    // console.log('In mutation:', data)
    state.Summary = data
  },
  setCurrentSummary (state, data) {
    // console.log('In mutation:', data)
    state.currentSummary = data
  },
  setSharedData (state, data) {
    state.sharedData = data
  },
  setCurrentSlideSharedData (state, data) {
    state.sharedData = data
  },
  setRunningSlideLastModifiedOn: (state, data) => {
    state.runningSlideLastModifiedOn = data
  },
  updateSlideType: (state, data) => {
    for (let i in state.slides) {
      if (state.slides[i].slideId === data.slideId) {
        state.slides[i].slideType = data.slideType
      }
    }
  }
}

export const actions = {
  setTemplateFolderPath (context, data) {
    return new Promise((resolve) => {
      context.commit('setTemplateFolderPath', data)
      resolve(true)
    })
  },
  setTemplates (context, data) {
    return new Promise((resolve) => {
      context.commit('setTemplates', data)
      resolve(true)
    })
  },
  setPresentationId (context, data) {
    return new Promise((resolve) => {
      context.commit('setPresentationId', data)
      resolve(true)
    })
  },
  updateSlideByIndex (context, data) {
    return new Promise((resolve) => {
      context.commit('updateSlideByIndex', data)
      resolve(true)
    })
  },
  setChangedOrdinality (context) {
    return new Promise((resolve) => {
      context.commit('setChangedOrdinality')
      resolve(true)
    })
  },
  setNewSlide (context, data) {
    // return new Promise((resolve) => {
    //   context.commit('setNewSlide', data)
    //   resolve(true)
    // })
    context.commit('setNewSlide', data)
  },
  setCurrentPresentation (context, data) {
    return new Promise((resolve) => {
      // console.log('setCurrentPresentation',data)
      context.commit('setCurrentPresentation', data)
      resolve(true)
    })
  },
  setCurrentSlideIndex (context, data) {
    return new Promise((resolve) => {
      context.commit('setCurrentSlideIndex', data)
      resolve(true)
    })
  },
  setCurrentSlide (context, data) {
    return new Promise((resolve) => {
      // TODO: mql request to set current slide
      /*
        let data ={
          "classroomId":"",
          "subjectId":"",
          "tempFileId":"",
          "slideId":""
        }
      */
      data['presentationId'] = context.getters.getCurrentPresentation ? context.getters.getCurrentPresentation.presentationId : ''
      data['isShowWelcome'] = false
      data['sessionManagerId'] = context.getters.sessionManagerId
      new MQL()
        .setActivity('r.[SetCurrentSlide]')
        .setData(data)
        .fetch()
        .then(rs => {
          if (rs.isValid('SetCurrentSlide')) {
            let res = rs.getActivity('SetCurrentSlide', true)
            if (Array.isArray(res.result)) {
              res.result = res.result[0]
            }
            // console.log('res', res.result)
            if (res.result.currentSlide) {
              context.commit('setCurrentSlide', res.result.currentSlide)
              context.commit('setNextSlideDetails', res.result.nextSlide)
              resolve(res.result.currentSlide)
            }
            resolve(false)
          } else {
            rs.showErrorToast('SetCurrentSlide')
            resolve(false)
          }
        })
    })
  },
  setMetaDataofSlide (context, data) {
    return new Promise((resolve) => {
      context.commit('setMetaDataofSlide', data)
      resolve(true)
    })
  },
  deleteSlide (context) {
    return new Promise((resolve) => {
      context.commit('deleteSlide')
      resolve(true)
    })
  },
  deleteSlideByIndex (context, index) {
    return new Promise((resolve) => {
      context.commit('deleteSlideByIndex', index)
      resolve(true)
    })
  },
  setSlides (context, data) {
    return new Promise((resolve) => {
      context.commit('setSlides', data)
      resolve(true)
    })
  },
  setCurrentSlideChartData (context, data) {
    return new Promise((resolve) => {
      context.commit('setCurrentSlideChartData', data)
      resolve(true)
    })
  },
  setDataByIndex (context, data) {
    return new Promise((resolve) => {
      context.commit('setDataByIndex', data)
      resolve(true)
    })
  },
  setCurrentSlideData (context, data) {
    return new Promise((resolve) => {
      context.commit('setDataByIndex', data)
      resolve(true)
    })
  },
  resetSlideState (context) {
    return new Promise((resolve) => {
      context.commit('resetSlideState')
      resolve(true)
    })
  },
  createSearchText (context) {
    return new Promise((resolve) => {
      context.commit('createSearchText')
      resolve(true)
    })
  },
  addActiveIndex (context) {
    return new Promise((resolve) => {
      context.commit('addActiveIndex')
      resolve(true)
    })
  },
  getCurrentStatsBySlideId (context, data) {
    return new Promise((resolve) => {
      new MQL()
        .setActivity('o.[GetCurrentStatsBySlideId]')
        .setData(data)
        .fetch()
        .then(rs => {
          if (rs.isValid('GetCurrentStatsBySlideId')) {
            let res = rs.getActivity('GetCurrentStatsBySlideId', true)
            resolve(res.result)
          } else {
            resolve(false)
            // rs.showErrorToast("GetCurrentStatsBySlideId")
          }
        })
    })
  },
  setWelcomeStatus (context, data) {
    return new Promise((resolve) => {
      new MQL()
        .setActivity('o.[SetIsShowWelcome]')
        .setData(data)
        .fetch()
        .then(rs => {
          if (rs.isValid('SetIsShowWelcome')) {
            let res = rs.getActivity('SetIsShowWelcome', true)
            resolve(res.result)
          } else {
            resolve(false)
            rs.showErrorToast('SetIsShowWelcome')
          }
        })
    })
  },
  setStatsStatus (context, data) {
    return new Promise((resolve) => {
      let requestData = {
        slideId: data.slideId,
        isShowCurrentSlideStats: data.showStats,
        sessionManagerId: data.sessionManagerId
      }
      new MQL()
        .setActivity('r.[SetIsShowCurrentSlideStatsFlag]')
        .setData(requestData)
        .fetch()
        .then(rs => {
          if (rs.isValid('SetIsShowCurrentSlideStatsFlag')) {
            let res = rs.getActivity('SetIsShowCurrentSlideStatsFlag', true)
            resolve(res.result)
          } else {
            resolve(false)
            rs.showErrorToast('SetIsShowCurrentSlideStatsFlag')
          }
        })
    })
  },

  /* expected Data for submitResponse mutation
 {
   index: 0,
   data:{}
 }
  */
  submitResponse (context, responseData) {
    // console.log('submitResponse',responseData)
    // let api = responseData.api ? responseData.api : 'GetSlideData'
    // return new Promise((resolve, reject) => {
    //     new MQL()
    //     .setActivity(`o.[${api}]`)
    //     .setData(responseData.data)
    //     .fetch()
    //      .then(rs => {
    //        if (rs.isValid(api)) {
    //         let res = rs.getActivity(api,true)
    //         console.log('api res',api, res)
    //         resolve(res)
    //     } else
    //      {
    //       reject(false)
    //       rs.showErrorToast(api)
    //     }
    //     })
    // })
  },
  getGuid (context) {
    return new Promise((resolve, reject) => {
      new MQL()
        .setActivity('o.[GetGUID]')
        // .setData(data)
        .setCustomURL(window.location.origin + '/CollegeTeacherApplicationServer/')
        .fetch()
        .then(rs => {
          if (rs.isValid('GetGUID')) {
            let res = rs.getActivity('GetGUID', true)
            resolve(res.result)
          } else {
            resolve(false)
            rs.showErrorToast('GetGUID')
          }
        })
    })
  },
  getPresentation (context, data) {
    return new Promise((resolve, reject) => {
      if (!data.presentationId) {
        console.error('presentationId not found')
        resolve(false)
      }
      new MQL()
        .setActivity('o.[query_1NV73u7bk9cMz6EkQnQjWLYD2Un]')
        .setData(data)
        .fetch()
        .then(rs => {
          if (rs.isValid('query_1NV73u7bk9cMz6EkQnQjWLYD2Un')) {
            let res = rs.getActivity('query_1NV73u7bk9cMz6EkQnQjWLYD2Un', true)
            resolve(res)
          } else {
            resolve(false)
            rs.showErrorToast('query_1NV73u7bk9cMz6EkQnQjWLYD2Un')
          }
        })
    })
  },
  setCurrentPresentationDetails (context, data) {
    return new Promise((resolve, reject) => {
      new MQL()
        .setActivity('o.[setCurrentPresentationDetails]')
        .setData(data)
        .fetch()
        .then(rs => {
          if (rs.isValid('setCurrentPresentationDetails')) {
            let res = rs.getActivity('setCurrentPresentationDetails', true)
            resolve(res.result)
          } else {
            rs.showErrorToast('setCurrentPresentationDetails')
            resolve(false)
          }
        })
    })
  },
  getCurrentPresentationDetails (context, data) {
    return new Promise((resolve, reject) => {
      // console.log('context', context)
      data['sessionManagerId'] = context.getters.sessionManagerId
      // TODO: apis for get currentpresentationdetails and currentSlide
      new MQL()
        .setActivity('r.[GetCurrentPresentation]')
        .setData(data)
        .fetch()
        .then(rs => {
          if (rs.isValid('GetCurrentPresentation')) {
            let res = rs.getActivity('GetCurrentPresentation', true)
            console.log('data', res)
            if (Array.isArray(res.result)) {
              res.result = res.result[0]
            }
            if (res.result.status === 'SUCCESS') {
              resolve(res.result.sessionResult)
            } else {
              resolve(false)
            }
          } else {
            rs.showErrorToast('GetCurrentPresentation')
            resolve(false)
          }
        })
    })
  },
  setCurrentSlideNumber (context, data) {
    return new Promise((resolve, reject) => {
      new MQL()
        .setActivity('r.[SetCurrentSlideNumber]')
        .setData(data)
        .fetch()
        .then(rs => {
          if (rs.isValid('SetCurrentSlideNumber')) {
            let res = rs.getActivity('SetCurrentSlideNumber', true)
            resolve(res.result)
          } else {
            rs.showErrorToast('SetCurrentSlideNumber')
            resolve(false)
          }
        })
    })
  },
  closePresentation (context, data) {
    // remove classroom from live classroom list
    context.dispatch('removeLiveClassroomDetails')
    
    return new Promise((resolve) => {
      new MQL()
        .setActivity('r.[ClosePresentation]')
        .setData(data)
        .fetch()
        .then(rs => {
          if (rs.isValid('ClosePresentation')) {
            let res = rs.getActivity('ClosePresentation', true)
            resolve(res.result)
          } else {
            resolve(false)
            // rs.showErrorToast("ClosePresentation")
          }
        })
    })
  },
  removeLiveClassroomDetails (context) {
    return new Promise((resolve, reject) => {
      new MQL()
        .setActivity('r.[RemovetLiveClassroomDetails]')
        .setData({
          "instituteId": context.getters.teacherDetails.instituteId,
          "paperId": context.getters.selectedSubject.paperId,
          "teacherId": context.getters.teacherDetails._id,
        })
        .fetch()
        .then((rs) => {
          if (rs.isValid('RemovetLiveClassroomDetails')) {
            let res = rs.getActivity('RemovetLiveClassroomDetails', false)
            resolve(true)
          } else {
            rs.showErrorToast('RemovetLiveClassroomDetails')
            reject(false)
          }
        })
    })
  },
  setCurrentPresentationStatus (context, data) {
    // return new Promise((resolve,reject)=>{
    //   new MQL()
    //   .setActivity("o.[SetCurrentPresentationStatus]")
    //   .setData(data)
    //   .fetch()
    //    .then(rs => {
    //     if (rs.isValid("SetCurrentPresentationStatus")) {
    //       let res = rs.getActivity("SetCurrentPresentationStatus",true)
    //       resolve(res.result)
    //     } else {
    //       rs.showErrorToast("SetCurrentPresentationStatus")
    //       resolve(false)
    //     }
    //   })
    // })
  },
  getCurrentSlide (context, data) {
    let requestData = {
      'presentationId': context.getters.getCurrentPresentation ? context.getters.getCurrentPresentation.presentationId : '',
      'slideId': data.slideId,
      'sessionManagerId': context.getters.sessionManagerId
    }
    return new Promise((resolve, reject) => {
      new MQL()
        .setActivity('r.[GetCurrentSlide]')
        .setData(requestData)
        .fetch()
        .then(rs => {
          if (rs.isValid('GetCurrentSlide')) {
            let res = rs.getActivity('GetCurrentSlide', true)
            // console.log('res', res.result)
            resolve(res.result)
          } else {
            rs.showErrorToast('GetCurrentSlide')
            resolve(false)
          }
        })
    })
  },
  getSlideDetails (context, data) {
    let requestData = {
      'presentationId': context.getters.getCurrentPresentation ? context.getters.getCurrentPresentation.presentationId : '',
      'slideId': data.slideId
    }
    return new Promise((resolve, reject) => {
      new MQL()
        .setActivity('o.[GetSlideDetails]')
        .setData(requestData)
        .fetch()
        .then(rs => {
          if (rs.isValid('GetSlideDetails')) {
            let res = rs.getActivity('GetSlideDetails', true)
            // console.log('res', res.result)
            resolve(res.result)
          } else {
            rs.showErrorToast('GetSlideDetails')
            resolve(false)
          }
        })
    })
  },
  checkPresentationSessionIsAvailable (context, data) {
    return new Promise((resolve, reject) => {
      new MQL()
        .setActivity('r.[CheckPresentationSessionIsAvailable]')
        .setData(data)
        .fetch()
        .then(rs => {
          if (rs.isValid('CheckPresentationSessionIsAvailable')) {
            let res = rs.getActivity('CheckPresentationSessionIsAvailable', true)
            console.debug('CheckPresentationSessionIsAvailable', res.result)
            resolve(res.result)
          } else {
            rs.showErrorToast('CheckPresentationSessionIsAvailable')
            resolve(false)
          }
        })
    })
  },
  killPresentationSession (context, data) {
    return new Promise((resolve, reject) => {
      new MQL()
        .setActivity('r.[killPresentationSession]')
        .setData(data)
        .fetch()
        .then(rs => {
          if (rs.isValid('killPresentationSession')) {
            let res = rs.getActivity('killPresentationSession', true)
            // console.log('killPresentationSession', res.result)
            resolve(res.result)
          } else {
            rs.showErrorToast('killPresentationSession')
            resolve(false)
          }
        })
    })
  },
  getNextSlide (context, data) {
    let requestData = {
      'presentationId': context.getters.getCurrentPresentation ? context.getters.getCurrentPresentation.presentationId : '',
      'slideId': data.slideId,
      sessionManagerId: context.getters.sessionManagerId
    }
    return new Promise((resolve, reject) => {
      new MQL()
        .setActivity('r.[GetNextSlide]')
        .setData(requestData)
        .fetch()
        .then(rs => {
          if (rs.isValid('GetNextSlide')) {
            let res = rs.getActivity('GetNextSlide', true)
            // console.log('res', res.result)
            resolve(res.result)
          } else {
            rs.showErrorToast('GetNextSlide')
            resolve(false)
          }
        })
    })
  },
  SetCurrentPresentationRunningTillDate (context, data) {
    return new Promise((resolve, reject) => {
      let requestData = {
        'sessionManagerId': context.getters.sessionManagerId
      }

      if (typeof requestData.sessionManagerId === 'undefined') {
        resolve(false)
        return
      }
      new MQL()
        .setActivity('r.[SetCurrentPresentationRunningTillDate]')
        .setData(requestData)
        .fetch()
        .then(rs => {
          if (rs.isValid('SetCurrentPresentationRunningTillDate')) {
            let res = rs.getActivity('SetCurrentPresentationRunningTillDate', true)
            if (res.result) {
              resolve(true)
            }
          } else {
            resolve(false)
          }
        })
    })
  },
  getCurrentPresentationStatus (context, data) {
    return new Promise((resolve, reject) => {
      // TODO: api for get current presentation status with current slide data
      // let currentslide = sampleSlides.getCurrentSlide(data)
      // console.log('currentslide',currentslide)
      // resolve(currentslide)
      let requestData = {
        'presentationId': context.getters.getCurrentPresentation ? context.getters.getCurrentPresentation.presentationId : '',
        'slideId': context.getters.getCurrentSlide ? context.getters.getCurrentSlide.slideId : '',
        'isCurrentSlideRequired': true,
        'isSlideStatsRequired': true,
        'isNextSlideRequired': true,
        'sessionManagerId': context.getters.sessionManagerId,
        'runningSlideLastModifiedOn': context.getters.getRunningSlideLastModifiedOn
      }
      if (typeof requestData.slideId === 'undefined') {
        resolve(false)
        return
      }
      new MQL()
        .setActivity('r.[getCurrentSlideAndStats]')
        .setData(requestData)
        .fetch()
        .then(rs => {
          if (rs.isValid('getCurrentSlideAndStats')) {
            let res = rs.getActivity('getCurrentSlideAndStats', true)
            // console.log('getCurrentSlideAndStats', res)
            let data = {}
            if (res.result) {
              data.sharedData = res.result.sharedData ? res.result.sharedData : {}
              // console.log(data)
              context.commit('setSharedData', data)
              resolve(res.result)
            } else {
              data.sharedData = res.result.sharedData
              context.commit('setSharedData', data)
              rs.showErrorToast('getCurrentSlideAndStats')
              resolve(false)
            }
          }
        }).catch(err => {
          reject(err)
        })
    })
  },
  /* expected Data for uploadFile
   {
     file: '',
     inputFileName: '',
     elementId:''
   }
    */
  uploadFile (context, data) {
    return new Promise((resolve, reject) => {
      let formData = new FormData()
      formData.append('file', data.file)
      new MQLCdn()
        .enablePageLoader(true)
        .setFormData(formData)
        .setFileName(data.inputFileName)
        .setBucketKey('MEP_Cloud_CDN')
        .uploadFile(data.elementId ? data.elementId : '').then(res => {
          if (res.isValid()) {
            // console.log('res',res)
            // console.log('res.uploadedFileURL()',res.uploadedFileURL())
            resolve(res.uploadedFileURL())
          } else {
            res.showErrorToast()
            resolve(false)
          }
        })
    })
  },
  /* expected Data for downloadFile
 {
   fileURL: '',
   elementId:''
 }
  */
  downloadFile (context, data) {
    return new Promise((resolve, reject) => {
      new MQLCdn()
        .setCDNPath(data.fileURL)
        .enablePageLoader(true)
        .downloadFile(data.elementId ? data.elementId : '').then(res => {
          // console.log('response', res)
          resolve(res)
        })
    })
  },
  getLastPresentationSummaryData (context, data) {
    return new Promise((resolve, _) => {
      new MQL()
        .setActivity('r.[GetCurrentClassroomSummary]')
        .setData({ sessionManagerId: context.getters.sessionManagerId })
        .fetch()
        .then(rs => {
          if (rs.isValid('GetCurrentClassroomSummary')) {
            let res = rs.getActivity('GetCurrentClassroomSummary', true)
            resolve(res.result.sessionResult)
          } else {
            resolve(null)
          }
        }).catch((err) => {
          console.error(err)
          resolve(null)
        })
    })
  },
  setLastPresentationSummaryData (context, data) {
    return new Promise((resolve, _) => {
      new MQL()
        .setActivity('o.[SetCurrentClassroomSummary]')
        .setData({
          CurrentClassroomSummary: data,
          sessionManagerId: context.getters.sessionManagerId
        })
        .fetch()
        .then(rs => {
          resolve()
        }).catch((err) => {
          console.error(err)
          resolve()
        })
    })
  },
  setCurrentSummaryData (context, data) {
    return new Promise((resolve, reject) => {
      new MQL()
        .setActivity('o.[GetSummaryByPresentationId]')
        .setData({
          presentationId: data
        })
        .fetch()
        .then(rs => {
          if (rs.isValid('GetSummaryByPresentationId')) {
            let res = rs.getActivity('GetSummaryByPresentationId', true)
            let temp = res.result.reverse()[0]
            temp.sessionManagerId = context.getters.sessionManagerId
            context.dispatch('setLastPresentationSummaryData', temp).then(() => {
              resolve()
            })
          } else {
            reject(new Error(this.$t('presentations.presentation_not_found')))
          }
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  setCurrentSlideSharedData (context, data) {
    return new Promise((resolve, reject) => {
      data['sessionManagerId'] = context.getters.sessionManagerId
      new MQL()
        .setActivity('r.[SetSharedData]')
        .setData({
          sharedData: data
        })
        .fetch()
        .then(rs => {
          if (rs.isValid('SetSharedData')) {
            let res = rs.getActivity('SetSharedData', true)
            resolve()
            // context.dispatch('setLastPresentationSummaryData', res.result.reverse()[0]).then(() => {
            //   resolve()
            // })
          } else {
            reject(new Error('Shared data not found'))
          }
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  getLearnerList (context, data) {
    return new Promise((resolve, _) => {
      new MQL()
        .setActivity('o.[FetchRelatedLearnerList]')
        .setData({ sessionManagerId: context.getters.sessionManagerId, 'slideId': context.getters.getCurrentSlide.slideId, 'responseType': data })
        .fetch()
        .then(rs => {
          if (rs.isValid('FetchRelatedLearnerList')) {
            let res = rs.getActivity('FetchRelatedLearnerList', true)
            if (res && res.result && res.result.learners) {
              // console.log('#####', JSON.stringify(res.result.learners))
              resolve(res.result.learners)
            } else {
              resolve(null)
            }
          } else {
            resolve(null)
          }
        })
        .catch(err => {
          console.error(err)
          resolve(null)
        })
    })
  },
  resetConnectedUsers (context) {
    return new Promise((resolve, reject) => {
      new MQL()
        .setActivity('o.[ResetConnectedUsers]')
        .setData({
          sessionManagerId: context.getters.getSessionManagerId
        })
        .fetch()
        .then(rs => {
          if (rs.isValid('ResetConnectedUsers')) {
            resolve()
          } else {
            reject(new Error('Error for ResetConnectedUsers'))
          }
        })
        .catch(err => {
          reject(err)
        })
    })
  }
}
