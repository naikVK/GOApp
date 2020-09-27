import Configs from './Configs'
import SystemDialog from './SystemDialog'
export default class Notification {
    constructor() { }

    static gotoNotificationSettings () {
        let osVersion = parseInt(device.version.split('.')[0])
        if (device.platform == 'Android' && osVersion >= 8) {
            // check settings as Notification Permission Asked or Not
            Configs.fetchNotificationPermissionCheck(isAsked => {
                if (!isAsked) {
                    SystemDialog.confirm('Permission Required!', 'Please enable all notification permissions.', 'Okay', 'Cancel', isOk => {
                        if (isOk) {
                            // save settings as Notification Permission Asked
                            Configs.setNotificationPermissionChecked()

                            let applicationId = BuildInfo.packageName

                            intentActionPlugin.startIntentAction(
                                'android.settings.CHANNEL_NOTIFICATION_SETTINGS', {
                                extras: {
                                    'android.provider.extra.APP_PACKAGE': applicationId,
                                    'android.provider.extra.CHANNEL_ID': 'default-channel-id'
                                }
                            }
                            )
                        }
                    })
                }
            })
        }
    }

    static requestNotificationPermission (title, message) {
        cordova.plugins.notification.local.requestPermission(granted => {
            if (!granted) {
                // Permission denied
                Notification.toastShort('Permission Denied')
                return
            }
            Notification.notifySimple(title, message)
        })
    }

    static notifySimple (title, message, showInForeground) {
        if (typeof cordova === 'undefined') {
            return
        }
        if (showInForeground == undefined) {
            // dont show notification in foreground
            showInForeground = false
        }
        if (!Configs.getAppIsInBackground() && !showInForeground) {
            // app is in foreground
            return
        }
        cordova.plugins.notification.local.hasPermission(granted => {
            if (!granted) {
                Notification.requestNotificationPermission()
                return
            }

            cordova.plugins.notification.local.schedule({
                title: title,
                text: message,
                lockscreen: true,
                foreground: true,
                sound: true,
                vibrate: true,
                priority: 1
            })
        })
    }

    static toastShort (message) {
        if (typeof cordova === 'undefined') {
            alert(message)
            return
        }
        window.plugins.toast.showWithOptions({
            message: message,
            duration: 'short', // which is 2000 ms. "long" is 4000. Or specify the nr of ms yourself.
            position: 'bottom',
            addPixelsY: -40 // added a negative value to move it up a bit (default 0)
        })
    }
}
