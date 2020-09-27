import MQL from '@/plugins/mql.js'

export const state = {
  sessionManagerId: '',
  serverIP: '',
  serverIpList: [],
  profileImagePath: '',
  selectedInstitute: null,
  selectedClassroom: null,
  selectedSubject: null,
  selectedTeachingPlan: null,
  viewName: '',
  modifiedOn: 0,
  teacherDetails: null,
  keepSyncing: false,
  selectedTOCNode: null,
  selectedPresentationId: '',
  selectedSlideIndex: -1,
  currentTeachingPlan: null,
  presentationDetails: null,
  lastUpdateCheckedOn: null,
  templateList: null,
  selectedUnit: null,
  classroomSubjectSessionId: null,
  presentationCacheId: null,
  teachingPlanId: null,
  isTeacherMappingOn: false,
  connectedLearners: 0,
  instituteList: null,
  isLoading: false,
  isOfflineActivation: false,
  machineDetails: null,
  activationResult: null,
  appName: 'SuperSchool',
  sessionDateTime: 0,
  loginDetails: null,
  teacherRecentActivities: null,
  downloads: null,
  classroomMode: '',
  currentClassroomPin: '',
  currentSelectedPresentation: {},
  studentResponseSyncStatus: 'readyToSync',
  runningPresentationId: null,
  resourceList: []
}

// mutations are operations that actually mutates the state.
// each mutation handler gets the entire state tree as the
// first argument, followed by additional payload arguments.
// mutations must be synchronous and can be recorded by plugins
// for debugging purposes.
export const mutations = {
  serverIP (state, serverIP) {
    state.serverIP = serverIP
  },
  serverIpList (state, serverIpList) {
    state.serverIpList = serverIpList
  },
  profileImagePath (state, profileImagePath) {
    state.profileImagePath = profileImagePath
  },
  selectedInstitute (state, institute) {
    state.selectedInstitute = institute
  },
  selectedClassroom (state, classroom) {
    state.selectedClassroom = classroom
  },
  selectedSubject (state, subject) {
    state.selectedSubject = subject
  },
  viewName: (state, viewName) => {
    state.viewName = viewName
  },
  modifiedOn: (state, modifiedOn) => {
    state.modifiedOn = modifiedOn
  },
  teacherDetails: (state, teacherDetails) => {
    state.teacherDetails = teacherDetails
  },
  keepSyncing: (state, keepSyncing) => {
    state.keepSyncing = keepSyncing
  },
  selectedTOCNode: (state, selectedTOCNode) => {
    state.selectedTOCNode = selectedTOCNode
  },
  selectedPresentationId: (state, val) => {
    state.selectedPresentationId = val
  },
  selectedSlideIndex: (state, val) => {
    state.selectedSlideIndex = val
  },
  currentTeachingPlan: (state, val) => {
    state.currentTeachingPlan = val
  },
  presentationDetails: (state, val) => {
    state.presentationDetails = val
  },
  lastUpdateCheckedOn: (state, val) => {
    state.lastUpdateCheckedOn = val
  },
  templateList: (state, val) => {
    state.templateList = val
  },
  selectedUnit: (state, val) => {
    state.selectedUnit = val
  },
  classroomSubjectSessionId: (state, val) => {
    state.classroomSubjectSessionId = val
  },
  presentationCacheId: (state, val) => {
    state.presentationCacheId = val
  },
  teachingPlanId: (state, val) => {
    state.teachingPlanId = val
  },
  isTeacherMappingOn: (state, val) => {
    state.isTeacherMappingOn = val
  },
  connectedLearners: (state, val) => {
    state.connectedLearners = val
  },
  instituteList: (state, val) => {
    state.instituteList = val
  },
  isLoading: (state, val) => {
    state.isLoading = val
  },
  isOfflineActivation: (state, val) => {
    state.isOfflineActivation = val
  },
  machineDetails: (state, val) => {
    state.machineDetails = val
  },
  activationResult: (state, val) => {
    state.activationResult = val
  },
  appName: (state, val) => {
    state.appName = val
  },
  sessionDateTime: (state, val) => {
    state.sessionDateTime = val
  },
  loginDetails: (state, val) => {
    state.loginDetails = val
  },
  teacherRecentActivities: (state, val) => {
    state.teacherRecentActivities = val
  },
  downloads: (state, val) => {
    state.downloads = val
  },
  setSessionManagerId: (state, val) => {
    state.sessionManagerId = val
  },
  classroomMode: (state, val) => {
    state.classroomMode = val
  },
  setCurrentClassroomPin: (state, classroomPin) => {
    state.currentClassroomPin = classroomPin
  },
  setCurrentSelectedPresentation: (state, presentation) => {
    state.currentSelectedPresentation = presentation
  },
  studentResponseSyncStatus: (state, val) => {
    state.studentResponseSyncStatus = val
  },
  runningPresentationId (state, runningPresentationId) {
    state.runningPresentationId = runningPresentationId
  },
  resourceList: (state, val) => {
    state.resourceList = val
  }
}

// actions are functions that cause side effects and can involve
// asynchronous operations.
export const actions = {
  pushNotification: (_, data) => {
    return new Promise((resolve, reject) => {
      let messagePayload = {
        'to': '/topics/' + data.classroomId,
        'name': 'classroom_notification_' + data.classroomId,
        'notification': {
          'body': data.notification.body,
          'title': data.notification.title
        },
        'apns': {
          'payload': {
            'aps': {
              'badge': 1,
              'sound': 'default',
              'content_available': 1
            }
          }
        },
        'data': {
          'notification_foreground': data.notifyAll, // if true then notifies all users even if they are in foreground
          'payload': data
        }
      }
      new MQL()
        .setActivity('r.[SendNotificationToClassroomUsers]')
        .setData(messagePayload)
        .fetch()
        .then(rs => {
          if (rs.isValid('SendNotificationToClassroomUsers')) {
            let res = rs.getActivity('SendNotificationToClassroomUsers', true)
            resolve(res.result)
          } else {
            reject(new Error(rs.SendNotificationToClassroomUsers.error))
          }
        }).catch((err) => {
          reject(err)
        })
    })
  },
  // This is polling activity untill it found institute sync status as: 'readyToSync' and not: 'inProgress'
  getSyncStatusByInstId: ({ state, dispatch, commit }) => {
    new MQL()
      .setActivity('o.[GetInstituteSyncStatusByInstId]')
      .setData({ instituteId: state.teacherDetails.institute.instituteId })
      .fetch()
      .then(rs => {
        let res = rs.getActivity(
          'GetInstituteSyncStatusByInstId',
          true
        )
        if (rs.isValid('GetInstituteSyncStatusByInstId')) {
          if (res.result.instResSyncStatus === 'inProgress') {
            setTimeout(() => {
              dispatch('getSyncStatusByInstId')
            }, 5000)
          } else if (res.result.instResSyncStatus === 'readyToSync') {
            commit('studentResponseSyncStatus', 'synced')
          }
        } else {
          console.error(new Error(rs.raw.GetInstituteSyncStatusByInstId.error))
        }
      })
      .catch(() => {
        console.error(new Error('server not running'))
      })
  }
}

// getters are functions
export const getters = {
  sessionManagerId: state => state.sessionManagerId,
  serverIP: state => state.serverIP,
  serverIpList: state => state.serverIpList,
  profileImagePath: state => state.profileImagePath,
  getViewSyncData: state => state.viewSyncData,
  selectedInstitute: state => state.selectedInstitute,
  selectedClassroom: state => state.selectedClassroom,
  selectedSubject: state => state.selectedSubject,
  viewName: state => state.viewName,
  modifiedOn: state => state.modifiedOn,
  teacherDetails: state => state.teacherDetails,
  keepSyncing: state => state.keepSyncing,
  selectedTOCNode: state => state.selectedTOCNode,
  selectedPresentationId: state => state.selectedPresentationId,
  selectedSlideIndex: state => state.selectedSlideIndex,
  currentTeachingPlan: state => state.currentTeachingPlan,
  presentationDetails: state => state.presentationDetails,
  lastUpdateCheckedOn: state => state.lastUpdateCheckedOn,
  templateList: state => state.templateList,
  selectedUnit: state => state.selectedUnit,
  classroomSubjectSessionId: state => state.classroomSubjectSessionId,
  presentationCacheId: state => state.presentationCacheId,
  teachingPlanId: state => state.teachingPlanId,
  isTeacherMappingOn: state => state.isTeacherMappingOn,
  connectedLearners: state => state.connectedLearners,
  instituteList: state => state.instituteList,
  isLoading: state => state.isLoading,
  isOfflineActivation: state => state.isOfflineActivation,
  machineDetails: state => state.machineDetails,
  activationResult: state => state.activationResult,
  appName: state => state.appName,
  sessionDateTime: state => state.sessionDateTime,
  loginDetails: state => state.loginDetails,
  teacherRecentActivities: state => state.teacherRecentActivities,
  downloads: state => state.downloads,
  classroomMode: state => state.classroomMode,
  getCurrentClassroomPin: state => state.currentClassroomPin,
  getCurrentSelectedPresentation: state => state.currentSelectedPresentation,
  studentResponseSyncStatus: state => state.studentResponseSyncStatus,
  runningPresentationId: state => state.runningPresentationId,
  resourceList: state => state.resourceList
}

// A Vuex instance is created by combining the state, mutations, actions,
// and getters.
// export default {
//   state,
//   getters,
//   actions,
//   mutations
// }
