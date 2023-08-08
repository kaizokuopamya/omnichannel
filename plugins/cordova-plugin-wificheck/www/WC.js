var exec = require('cordova/exec');
module.exports = {
    checkPermission: function(paramObj, successCallback, errorCallback) {
        exec(successCallback, errorCallback, 'WCAndroidPlugin', 'checkPermission', [paramObj]);
    },
    scanWifi: function(successCallback, errorCallback) {
        exec(successCallback, errorCallback, 'WCAndroidPlugin', 'scanWifi', []);
    }
};