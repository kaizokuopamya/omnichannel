var exec = require('cordova/exec');
module.exports = {
    initiateSBSDK: function(paramObj, successCallback, errorCallback) {
        exec(successCallback, errorCallback, 'SBAndroidPlugin', 'initiateSBSDK', [paramObj]);
    },
    getCurrentStatus: function(successCallback, errorCallback) {
        exec(successCallback, errorCallback, 'SBAndroidPlugin', 'getCurrentStatus', []);
    },
    getRisks: function(successCallback, errorCallback) {
        exec(successCallback, errorCallback, 'SBAndroidPlugin', 'getRisks', []);
    },
};