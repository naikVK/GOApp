
const mutations = {
  'app/MUTATE_PAGE_BLOCKER': (state, show) => {
    state.pageBlocker = show
  },
  setSessionManagerId: (state, sessionManagerId) => {
    state.sessionManagerId = sessionManagerId
  }
}

export default mutations
