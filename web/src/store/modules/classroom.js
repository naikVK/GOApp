export const state = {
  resourcePool: {}
  // selectedClassroom: null,
  // selectedSubject:null
}

export const getters = {
  resourcePool: state => state.resourcePool
  // selectedClassroom: state => state.selectedClassroom,
  // selectedSubject: state => state.selectedSubject
}

export const mutations = {
  resourcePool: (state, resourcePool) => {
    state.resourcePool[resourcePool.url] = resourcePool.status
  },
  resetResourcePool: (state) => {
    state.resourcePool = {}
  }
  // selectedClassroom: (state, selectedClassroom) => {
  //   state.selectedClassroom = selectedClassroom
  // },
  // selectedSubject: (state, selectedSubject) => {
  //   state.selectedSubject = selectedSubject
  // }
}

export const actions = {

//   AUTH_LOGOUT: () => {
//     return new Promise((resolve) => {
//       localStorage.removeItem('user-token')
//       // remove the axios default header
//       // delete axios.defaults.headers.common['Authorization']
//       router.push({
//         name: 'login'
//       })
//       resolve()
//     })
//   }
}

/* export default {
  state,
  getters,
  mutati
ons,
  actions
} */
