// Source - https://stackoverflow.com/a
// Posted by Mohammad Momtaz
// Retrieved 2025-11-08, License - CC BY-SA 4.0

const { withAndroidManifest } = require("@expo/config-plugins");
module.exports = function androiManifestPlugin(config) {
  return withAndroidManifest(config, async (config) => {
    let androidManifest = config.modResults.manifest;
    androidManifest.$ = {
      ...androidManifest.$,
      "xmlns:tools": "http://schemas.android.com/tools",
    };
    androidManifest["uses-permission"] = androidManifest["uses-permission"].map(
      (perm) => {
        if (
          perm.$["android:name"] === "android.permission.SYSTEM_ALERT_WINDOW"
        ) {
          perm.$["tools:node"] = "remove";
        }
        return perm;
      }
    );
    return config;
  });
};
