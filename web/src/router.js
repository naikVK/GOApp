import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)

function loadView (view) {
  return () =>
    import(/* webpackChunkName: "view-[request]" */ `@/views/${view}.vue`)
}
export default new Router({
  routes: [
    {
      path: '/Login',
      name: 'Login',
      component: loadView('Login'),
      meta: {
        title: 'Login | Teacher App'
      }
    },
    {
      path: '/CreateVolunteer',
      name: 'CreateVolunteer',
      component: loadView('CreateVolunteer'),
      meta: {
        title: 'CreateVolunteer'
      }
    },
    {
      path: '/NGOregister',
      name: 'NGOregister',
      component: loadView('NGOregister'),
      meta: {
        title: 'NGOregister'
      }
    },
    {
      path: '/Settings-vol',
      name: 'Settings-vol',
      component: loadView('Settings-vol'),
      meta: {
        title: 'Settings-vol'
      }
    },
    {
      path: '/Settings-ngo',
      name: 'Settings-ngo',
      component: loadView('Settings-ngo'),
      meta: {
        title: 'Settings-ngo'
      }
    },
    {
      path: '/AddService',
      name: 'AddService',
      component: loadView('AddService'),
      meta: {
        title: 'AddService'
      }
    },
    {
      path: '/Services',
      name: 'Services',
      component: loadView('Services'),
      meta: {
        title: 'Services'
      }
    },
    {
      path: '/OnlineLogin',
      name: 'OnlineLogin',
      component: loadView('OnlineLogin'),
      meta: {
        title: 'Online Login | Teacher App'
      }
    },
    {
      path: '/SystemLogin',
      name: 'SystemLogin',
      component: loadView('SystemLogin'),
      meta: {
        title: 'System Login | Teacher App'
      }
    },
    {
      path: '/Activation',
      name: 'Activation',
      component: loadView('Activation'),
      meta: {
        title: 'Activation | Teacher App'
      }
    },
    {
      path: '/SaveActivation',
      name: 'SaveActivation',
      component: loadView('SaveActivation'),
      meta: {
        title: 'Save Activation | Teacher App'
      }
    },
    {
      path: '/Importer',
      name: 'Importer',
      component: loadView('Importer'),
      meta: {
        title: 'Importer | Teacher App'
      }
    },
    {
      path: '/ScanningIP',
      name: 'ScanningIP',
      component: loadView('ScanningIP'),
      meta: {
        title: 'Scanning IP | Teacher App'
      }
    },
    {
      path: '/AllQuestions',
      name: 'AllQuestions',
      component: loadView('Questions'),
      meta: {
        title: 'All Questions | Teacher App'
      }
    },
    {
      path: '/QRScanner',
      name: 'QRScanner',
      // component: Configs.getApplicationId() == APPLICATION_CONFIG.SUPERSCHOOL ? loadView('ScanningIP') : loadView('QRScanner'),
      component: loadView('QRScanner'),
      meta: {
        title: 'QR Scanner | Teacher App'
      }
    },
    {
      path: '/PersonalDetails',
      name: 'PersonalDetails',
      component: loadView('PersonalDetails'),
      meta: {
        title: 'Personal Details | Teacher App'
      }
    },
    {
      path: '/ConfirmClassDetails',
      name: 'ConfirmClassDetails',
      component: loadView('ConfirmClassDetails'),
      meta: {
        title: 'Confirm Class Details | Teacher App'
      }
    },
    {
      path: '/Students',
      name: 'Students',
      component: loadView('Students'),
      meta: {
        title: 'Students | Teacher App'
      }
    },
    
    {
      path: '/Presentations',
      name: 'Presentations',
      component: loadView('Presentations'),
      meta: {
        title: 'Presentations | Teacher App'
      }
    },
    {
      path: '/SlideSummary',
      name: 'SlideSummary',
      component: loadView('Slides'),
      meta: {
        title: 'Slide Summary | Teacher App'
      }
    },
    {
      path: '/Mcq',
      name: 'Mcq',
      component: loadView('Mcq'),
      meta: {
        title: 'Mcq | Teacher App'
      }
    },
    {
      path: '/McqImageText',
      name: 'McqImageText',
      component: loadView('McqImageText'),
      meta: {
        title: 'Mcq Image Text | Teacher App'
      }
    },
    {
      path: '/McqImageTextExpanded',
      name: 'McqImageTextExpanded',
      component: loadView('McqImageTextExpanded'),
      meta: {
        title: 'Mcq Image Text Expanded | Teacher App'
      }
    },
    {
      path: '/Draft',
      name: 'Draft',
      component: loadView('Draft'),
      meta: {
        title: 'Draft | Teacher App'
      }
    },
    {
      path: '/TeachingPlan',
      name: 'TeachingPlan',
      component: loadView('TeachingPlan'),
      meta: {
        title: 'Teaching Plan | Teacher App'
      }
    },
    {
      path: '/TeachingPlanUnitWise',
      name: 'TeachingPlanUnitWise',
      component: loadView('TeachingPlanUnitWise'),
      meta: {
        title: 'Teaching Plan Unit Wise | Teacher App'
      }
    },
    {
      path: '/SelectClass',
      name: 'SelectClass',
      component: loadView('SelectClass'),
      meta: {
        title: 'Select Class | Teacher App'
      }
    },
    {
      path: '/SelectSubject',
      name: 'SelectSubject',
      component: loadView('SelectSubject'),
      meta: {
        title: 'Select Subject | Teacher App'
      }
    },
    {
      path: '/TeachingPlanDashboard',
      name: 'TeachingPlanDashboard',
      component: loadView('TeachingPlanDashboard'),
      meta: {
        title: 'Teaching Plan Dashboard | Teacher App'
      }
    },
    {
      path: '/AllUnits',
      name: 'AllUnits',
      component: loadView('AllUnits'),
      meta: {
        title: 'All Units | Teacher App'
      }
    },
    {
      path: '/SelectUnit',
      name: 'SelectUnit',
      component: loadView('SelectUnit'),
      meta: {
        title: 'Select Unit | Teacher App'
      }
    },
    {
      path: '/TopicDetails',
      name: 'TopicDetails',
      component: loadView('TopicDetails'),
      meta: {
        title: 'Topic Details | Teacher App'
      }
    },
    {
      path: '/SlidePreview',
      name: 'SlidePreview',
      component: loadView('SlidePreview'),
      meta: {
        title: 'Slide Preview | Teacher App'
      }
    },
    {
      path: '/PresentationSlide',
      name: 'PresentationSlide',
      component: loadView('PresentationSlide'),
      meta: {
        title: 'Presentation Slide | Teacher App'
      }
    },
    {
      path: '/PresentationPreview',
      name: 'PresentationPreview',
      component: loadView('PresentationPreview'),
      meta: {
        title: 'Presentation Preview | Teacher App'
      }
    },
    {
      path: '/Reports',
      name: 'Reports',
      component: loadView('Reports'),
      meta: {
        title: 'Reports | Teacher App'
      }
    },
    {
      path: '/Profile',
      name: 'Profile',
      component: loadView('Profile'),
      meta: {
        title: 'Profile | Teacher App'
      }
    },
    {
      path: '/EditProfile',
      name: 'EditProfile',
      component: loadView('EditProfile'),
      meta: {
        title: 'Edit Profile | Teacher App'
      }
    },
    {
      path: '/TeachingPresentationMode',
      name: 'TeachingPresentationMode',
      component: loadView('TeachingPresentationMode'),
      meta: {
        title: 'Teaching Presentation Mode | Teacher App'
      }
    },
    {
      path: '/TeachingPresentationModeMCQ',
      name: 'TeachingPresentationModeMCQ',
      component: loadView('TeachingPresentationModeMCQ'),
      meta: {
        title: 'Teaching Presentation Mode MCQ | Teacher App'
      }
    },
    {
      path: '/Language',
      name: 'Language',
      component: loadView('Language'),
      meta: {
        title: 'Language | Teacher App'
      }
    },
    {
      path: '/',
      name: 'Welcome',
      component: loadView('Welcome'),
      meta: {
        title: 'Welcome | Teacher App'
      }
    },
    {
      path: '/ClassSummary',
      name: 'ClassSummary',
      component: loadView('ClassSummary'),
      meta: {
        title: 'Class Summary | Teacher App'
      }
    },
    {
      path: '/GameSummary',
      name: 'GameSummary',
      component: loadView('Games'),
      meta: {
        title: 'Game Summary | Teacher App'
      }
    },
    {
      path: '/SharePresentation',
      name: 'SharePresentation',
      component: loadView('BeginPresentation'),
      meta: {
        title: 'Share Presentation | Teacher App'
      }
    }
  ]
})
