import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from '@/store'
import './registerServiceWorker'
import axios from 'axios'
import VueLogger from 'vuejs-logger'
import mqlOptions from './plugins/mqlOptions.js'
import VueLocalStorage from 'vue-localstorage'
import {
  loadLanguageAsync,
  i18n
} from './setup/i18n-setup.js'
import VueFloatLabel from '../public/assets/plugins/vue-float-label/vue-float-label.js'
import syncPlugin from '@/plugins/viewSyncPlugin.js'
// import vueImageGallery from 'vue-image-gallery.js'
// import VueImg from 'v-img'
import VuejsDialog from 'vuejs-dialog'
import Viewer from 'v-viewer'
import 'vuejs-dialog/dist/vuejs-dialog.min.css'
// import Chart from 'vue2-frappe'
// import vSelect from 'vue-select'
import 'viewerjs/dist/viewer.css'
import vSelect from 'vue-select'
import 'vue-select/dist/vue-select.css'
import '../public/assets/plugins/materialdesignicons/css/materialdesignicons.min.css'
import BootstrapVue from 'bootstrap-vue'
import '../public/assets/plugins/bootstrap-4.3.1-dist/css/bootstrap.css'
import Toasted from 'vue-toasted'
import RouterMap from './utils/RouterMap'
import ViewSyncing from './utils/ViewSyncing'
import Configs from './utils/Configs'
// import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import { GOOGLE_ANALYTICS_TRACKINGID } from '@/utils/Constants'
import VueAnalytics from 'vue-analytics'
import VueLocalforage from 'v-localforage'
// import '../public/superPointPluginAssets/Game/scss/template.scss'
// import '../public/superPointPluginAssets/Question/scss/template.scss'
import '../public/assets/styles/template.scss'
import VueYoutube from 'vue-youtube'

Vue.use(VueYoutube)
Vue.use(VueLocalforage, {

  instances: [
    {
      storeName: 'resources'
    }
  ]
})

Vue.config.productionTip = false
const isProduction = process.env.NODE_ENV === 'production'

const options = {
  isEnabled: true,
  logLevel: isProduction ? 'error' : 'debug',
  stringifyArguments: false,
  showLogLevel: true,
  showMethodName: true,
  separator: '|',
  showConsoleColors: true
}

Vue.use(VueLogger, options)
Vue.use(VuejsDialog)
Vue.use(Toasted, { duration: 2000 })
Vue.use(BootstrapVue)
// Vue.use(Chart)
Vue.use(VueFloatLabel)
Vue.component('v-select', vSelect)
Vue.use(Viewer)
Vue.use(syncPlugin, {
  interval: 1000,
  router: router,
  store: store,
  loginPage: 'Dashboard',
  viewsToSync: [
    // "SelectClass",
    // "SelectSubject",
    // "TeachingPlanDashboard",
    // "TeachingPlanUnitWise",
    // "ViewPresentations",
    // "PresentationPreview",
    // "SlidePreview"
  ]
})
// Vue.use(VueImg)

// Vue.use(vueImageGallery)

// Vue.component('v-select', vSelect)

// Configuration VueAnalytics - To SuperSchool Teacher App
if (typeof cordova !== 'undefined') {
  document.addEventListener('deviceready', onDeviceReady, false)
} else {
  Vue.use(VueAnalytics, {
    id: GOOGLE_ANALYTICS_TRACKINGID,
    router
  })
}

// Function to set tracking and enable route tracking
function onDeviceReady () {
  window.ga.startTrackerWithId(GOOGLE_ANALYTICS_TRACKINGID)
  router.afterEach((to, from) => {
    // console.log("Route: ", to.meta.title)
    // TODO: As there is some issue related to plugin, hence instead of trackView we are using trackEvent
    // window.ga.trackView(to.meta.title)
    window.ga.trackEvent(to.meta.title, 'Navigation')
  })
}

var baseURL = Configs.getLocalUrl()
var cdnBaseURL = window.location.origin + '/cdnserver'

if (isProduction || typeof cordova !== 'undefined') {
  baseURL = Configs.getLocalUrl()
  cdnBaseURL = 'http://localhost:3032/'
}

Vue.use(mqlOptions, {
  baseURL: baseURL,
  cdnBaseURL: cdnBaseURL,
  cdnConfig: [{
    'bucketName': 'client1',
    'clientId': 'client1',
    'isPrivateBucket': true
  },
  {
    'bucketName': 'client2',
    'clientId': 'client2',
    'isPrivateBucket': false
  }
  ]
})
axios.defaults.baseURL = baseURL
// TODO: set axios header on login  to session storage
// axios.defaults.headers.common['Authorization'] = 'Bearer ' + token

// TODO: delete axios header on logout and clear session storage
// delete axios.defaults.headers.common['Authorization']
// localStorage.setItem('user-token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.qCJ-hcgSTLgkaT7kfI6--xRm4IEpPFQmMj3UZ94gNo4')
Vue.use(VueLocalStorage)

router.beforeEach((to, from, next) => {
  loadLanguageAsync(to.meta.lang).then(() => next())

  const nearestWithTitle = to.matched.slice().reverse().find(r => r.meta && r.meta.title)
  const nearestWithMeta = to.matched.slice().reverse().find(r => r.meta && r.meta.metaTags)

  if (nearestWithTitle) document.title = nearestWithTitle.meta.title

  Array.from(document.querySelectorAll('[data-vue-router-controlled]')).map(el => el.parentNode.removeChild(el))

  if (!nearestWithMeta) return next()
  nearestWithMeta.meta.metaTags.map(tagDef => {
    const tag = document.createElement('meta')
    Object.keys(tagDef).forEach(key => {
      tag.setAttribute(key, tagDef[key])
    })
    tag.setAttribute('data-vue-router-controlled', '')
    return tag
  })
    .forEach(tag => document.head.appendChild(tag))
  next()
})

router.afterEach((to, from) => {
  // for app state saving and restoring
  RouterMap.saveAndRestoreAppState(to, from, router)

  // Register RouterMap interceptor for back event
  RouterMap.intercept(to, from)
})

axios.interceptors.request.use(function (config) {
  // if (config.url.indexOf('/r/') !== -1) {  // Check for restricted request
  if (config.headers.common['Authorization']) {
    console.debug('autorize!')
  } else {
    console.debug('not authorize')
  }
  // }
  return config
}, function (error) {
  return Promise.reject(error)
})

// registering back event interceptor for mobile
RouterMap.registerBackEvent()
// attaching custom back function to router
router.goBack = RouterMap.goBack
router.setCustomBackListener = RouterMap.setCustomBackListener

// ==========================View Syncing Start======================================
var viewSyncing = new ViewSyncing({
  navigateAfterLogout: '/',
  interval: 2000
})
// Set list of pages to sync
viewSyncing.setListOfPagesToSync([{
  name: 'SelectClass'
}, {
  name: 'SelectSubject',
  getData: () => {
    return {
      selectedClassroom: store.getters.selectedClassroom
    }
  }
}, {
  name: 'TeachingPlanDashboard',
  getData: () => {
    return {
      selectedSubject: store.getters.selectedSubject,
      classroomSubjectSessionId: store.getters.classroomSubjectSessionId
    }
  }
}, {
  name: 'TopicDetails',
  getData: () => {
    return {
      selectedUnit: store.getters.selectedUnit,
      selectedTOCNode: store.getters.selectedTOCNode
    }
  }
}, {
  name: 'PresentationSlide',
  setDataOnly: true,
  getData: () => {
    return {
      presentationDetails: store.getters.presentationDetails,
      presentationCacheId: store.getters.presentationCacheId
    }
  }
}, {
  name: 'SharePresentation', // BeginPresentation.vue
  getData: () => {
    return {
      setCurrentClassroomPin: store.getters.getCurrentClassroomPin,
      setCurrentSelectedPresentation: store.getters.getCurrentSelectedPresentation
    }
  }
}, {
  name: 'ClassSummary',
  getData: () => {
    return {
      setSummary: store.getters.getSummary,
      setCurrentSummary: store.getters.getCurrentSummary
    }
  }
},
{
  name: 'AllQuestions'
},
{
  name: 'Students'
},
{
  name: 'GameSummary'
},
{
  name: 'SlideSummary'
}
])
router.afterEach(viewSyncing.interceptRouter.bind(viewSyncing))
// ==========================View Syncing End======================================

Vue.mixin({
  methods: {
    showMainLoaderLoader () {
      store.commit('isLoading', true)
    },
    hideMainLoaderLoader () {
      store.commit('isLoading', false)
    },
    isMainLoaderLoading () {
      return store.getters.isLoading
    }
  }

})

// setting last baseurl
Configs.changeBaseUrl(Configs.prepareBaseUrl(store.getters.serverIP))
export const eventBus = new Vue()

var vm = new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount('#app')

window.app = vm
