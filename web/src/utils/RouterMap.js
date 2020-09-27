import * as Constants from './Constants'
var RouteMapList = {
    // eg.
    // "<path/location/name>":"<path to navigate when back button pressed>",
    '/': 'for this app exits',
    '/SelectClass': {
        defaultPath: '/'
    },
    '/SelectSubject': {
        defaultPath: '/SelectClass'
    },
    '/TeachingPlanDashboard': {
        defaultPath: '/SelectSubject'
    },
    '/TeachingPlanUnitWise': {
        defaultPath: '/TeachingPlanDashboard'
    },
    '/TopicDetails': {
        defaultPath: '/TeachingPlanDashboard',
        checkHistory: true
    },
    '/PresentationPreview': {
        defaultPath: '/ViewPresentations'
    },
    '/SlidePreview': {
        defaultPath: '/PresentationPreview'
    },
    '/PresentationSlide': {
        defaultPath: '/ClassSummary'
    },
    '/SystemLogin': {
        // defaultPath: "/ScanningIP"
        defaultPath: '/'
    },
    // "/Importer": {
    //     defaultPath: "/SystemLogin"
    // },
    '/ScanningIP': {
        defaultPath: '/'
    },
    '/ClassSummary': {
        defaultPath: '/TopicDetails'
    },
    '/OnlineLogin': {
        defaultPath: '/'
    }
}

var routerIncerceptorRegistered = false
var previousPath = ''
var isGoingBack = false
var customBackListener = null

export default class RouterMap {
    constructor() { }

    static registerBackEvent () {
        document.addEventListener('deviceready', RouterMap.onDeviceReady, false)
    }

    static intercept (to, from) {
        routerIncerceptorRegistered = true
        previousPath = from.path
    }

    static setCustomBackListener (listener) {
        customBackListener = listener
    }

    static goBack () {
        // check back button blocked or not
        if (customBackListener != null) {
            // calling registered custom back button listener
            customBackListener()
            return
        }

        isGoingBack = true
        // RouterMap.popStackEntry()
        let stackEntry = RouterMap.popStackEntry()

        let currentPath = window.app.$route.path
        let backPath = RouteMapList[currentPath]

        if (backPath == undefined) {
            // page is not registered
            console.error('Please register your route path in RouterMap.js')
            window.app.$router.go(-1)
            return
        }
        // let checkHistory = false
        // if (backPath.checkHistory != undefined) {
        //     checkHistory = backPath.checkHistory
        // }

        // if (checkHistory) {
        //     if (!routerIncerceptorRegistered) {
        //         // router interceptor is not registered in router.afterEach
        //         console.error("RouterMap interceptor is not registered in router.afterEach")
        //     } else {
        //         if (previousPath == "/") {
        //             // handling abnormal case
        //         } else {
        //             // custom back
        //             window.app.$router.replace(stackEntry)
        //             return
        //         }
        //     }
        // }

        if (currentPath == '/') {
            if (typeof (cordova) === 'undefined') {
                return
            }
            // exit mobile app
            navigator.app.exitApp()
        } else {
            window.app.$router.replace(backPath.defaultPath)
        }
    }

    static onDeviceReady () {
        // Register the event listener
        document.addEventListener('backbutton', RouterMap.onBackKeyDown, false)
    }

    static onBackKeyDown () {
        RouterMap.goBack()
        // RouterMap.clearBackEvent();
    }

    static clearBackEvent () {
        document.removeEventListener('backbutton', RouterMap.onBackKeyDown)
    }

    static saveAndRestoreAppState (to, from, router) {
        let lastPage = localStorage.getItem(Constants.LAST_APP_STATE)
        if (lastPage && to.path == from.path) {
            // restoring last state where app is closed
            RouterMap.clearAppState()
            // router.push(lastPage);
        } else {
            // save current state
            localStorage.setItem(Constants.LAST_APP_STATE, to.path)
            RouterMap.addNewStackEntry(from.path)
        }
    }

    static clearAppState () {
        // clear app state
        localStorage.removeItem(Constants.LAST_APP_STATE)
        localStorage.removeItem('stackEntries')
    }

    static getStackEntries () {
        let stackEntriesData = localStorage.getItem('stackEntries')
        let stackEntries = []
        if (stackEntriesData != null) {
            stackEntries = JSON.parse(stackEntriesData)
        }
        return stackEntries
    }

    static popStackEntry () {
        let stackEntries = RouterMap.getStackEntries()
        let lastEntry = stackEntries.pop()
        localStorage.setItem('stackEntries', JSON.stringify(stackEntries))
        return lastEntry
    }

    static addNewStackEntry (entry) {
        if (isGoingBack) {
            isGoingBack = false
            return
        }
        let stackEntries = RouterMap.getStackEntries()
        if (stackEntries[stackEntries.length - 1] == entry || (entry == '/' && stackEntries.length > 0)) {
            return
        }
        stackEntries.push(entry)
        localStorage.setItem('stackEntries', JSON.stringify(stackEntries))
    }
}
