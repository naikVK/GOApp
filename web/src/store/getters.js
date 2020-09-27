const getters = {
  isPageBlocked: state => !!state.pageBlocker,
  getSessionManagerId: state => state.sessionManagerId
}

export default getters
