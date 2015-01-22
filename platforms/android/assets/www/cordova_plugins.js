cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
    {
        "file": "plugins/com.ionic.keyboard/www/keyboard.js",
        "id": "com.ionic.keyboard.keyboard",
        "clobbers": [
            "cordova.plugins.Keyboard"
        ]
    },
    {
        "file": "plugins/org.apache.cordova.device/www/device.js",
        "id": "org.apache.cordova.device.device",
        "clobbers": [
            "device"
        ]
    },
    {
        "file": "plugins/jp.wizcorp.phonegap.plugin.wizSpinnerPlugin/www/phonegap/plugin/wizSpinner/wizSpinner.js",
        "id": "jp.wizcorp.phonegap.plugin.wizSpinnerPlugin.wizSpinnerPlugin",
        "clobbers": [
            "window.wizSpinner"
        ]
    },
    {
        "file": "plugins/org.apache.cordova.statusbar/www/statusbar.js",
        "id": "org.apache.cordova.statusbar.statusbar",
        "clobbers": [
            "window.StatusBar"
        ]
    }
];
module.exports.metadata = 
// TOP OF METADATA
{
    "com.ionic.keyboard": "0.0.1",
    "org.apache.cordova.console": "0.2.9",
    "org.apache.cordova.device": "0.2.10",
    "jp.wizcorp.phonegap.plugin.wizSpinnerPlugin": "1.1.0",
    "org.apache.cordova.statusbar": "0.1.6"
}
// BOTTOM OF METADATA
});