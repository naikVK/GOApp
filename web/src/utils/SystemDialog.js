export default class SystemDialog {
    constructor() { }

    static get SYSTEM_BUTTON_INDEXES() {
        return {
            OK: device.platform.toLowerCase() == "ios" ? 2 : 3,
            CANCEL: 1,
            ALT: device.platform.toLowerCase() == "ios" ? 3 : 2
        }
    }

    /**
     * 
     * @param {string} title Shows title on dialog box.
     * @param {string} message Show message on dialog box.
     * @param {string} okButtonText Show text for 'OK' button on dialog box.
     * @param {()=>{}} callback Calls given function on dialog close or pressing 'OK' button.
     */
    static show(title, message, okButtonText, callback) {
        if (typeof cordova == "undefined") {
            callback(alert(message))
            return
        }
        navigator.notification.alert(message, callback, title, okButtonText)
    }

    /**
     * 
     * @param {string} title Shows title on dialog box.
     * @param {string} message Show message on dialog box.
     * @param {string} okButtonText Show text for 'OK' button on dialog box.
     * @param {string} cancelButtonText Show text for 'Cancel' button on dialog box.
     * @param {(bool)=>{}} callback Calls given function and returns true on pressing 'OK' button and returns false on dialog close or pressing 'Cancel' button.
     */
    static confirm(title, message, okButtonText, cancelButtonText, callback) {
        if (typeof cordova == "undefined") {
            callback(confirm(message))
            return
        }
        let buttonLabels = [cancelButtonText, "", okButtonText]
        let yesButtonIndex = 3
        if (device.platform.toLowerCase() == "ios") {
            buttonLabels = [cancelButtonText, okButtonText]
            yesButtonIndex = 2
        }
        navigator.notification.confirm(message, (btnIndex) => {
            callback(btnIndex == yesButtonIndex)
        }, title, buttonLabels)
    }

    /**
     * 
     * @param {string} title Shows title on dialog box.
     * @param {string} message Show message on dialog box.
     * @param {string} okButtonText Show text for 'OK' button on dialog box.
     * @param {string} cancelButtonText Show text for 'Cancel' button on dialog box.
     * @param {string} altButtonText Show text for 'Alt' button on dialog box.
     * @param {(bool)=>{}} callback Calls given function and returns true on pressing 'OK' button and returns false on dialog close or pressing 'Cancel' button.
     */
    static confirmWithAlt(title, message, okButtonText, cancelButtonText, altButtonText, callback) {
        if (typeof cordova == "undefined") {
            callback(SystemDialog.SYSTEM_BUTTON_INDEXES.OK)
            return
        }
        let buttonLabels = [cancelButtonText, altButtonText, okButtonText]
        if (device.platform.toLowerCase() == "ios") {
            buttonLabels = [cancelButtonText, okButtonText, altButtonText]
        }
        navigator.notification.confirm(message, (btnIndex) => {
            callback(btnIndex)
        }, title, buttonLabels)
    }

    static showNoWifiDialog() {
        return new Promise((resolve, _) => {
            SystemDialog.show(
                window.app.$t('SystemDialog.no_wifi_detected'),
                window.app.$t('SystemDialog.you_have_not_connected_to_any_wifi_and_make_sure_that_you_have_signed_in_to_your_wifi_if_signin_required'),
                window.app.$t('SystemDialog.got_it'),
                () => {
                    resolve()
                }
            );
        })
    }
}