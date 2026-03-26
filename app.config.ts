import "dotenv/config";
import { ExpoConfig, ConfigContext } from "expo/config";

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: "ThyraScan",
  slug: "thyrascan",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/icon.png",
  userInterfaceStyle: "light",
  splash: {
    image: "./assets/splash-icon.png",
    resizeMode: "contain",
    backgroundColor: "#FDFBF7",
  },
  ios: {
    supportsTablet: false,
    bundleIdentifier: "com.thyrascan.app",
    deploymentTarget: "13.4",
    buildNumber: config.ios?.buildNumber,
    usesAppleSignIn: true,
    infoPlist: {
      NSCameraUsageDescription:
        "ThyraScan uses your camera to scan food barcodes in real time. No photos are captured or stored.",
      ITSAppUsesNonExemptEncryption: false,
    },
    privacyManifests: {
      NSPrivacyAccessedAPITypes: [
        {
          NSPrivacyAccessedAPIType:
            "NSPrivacyAccessedAPICategoryUserDefaults",
          NSPrivacyAccessedAPITypeReasons: ["CA92.1"],
        },
        {
          NSPrivacyAccessedAPIType:
            "NSPrivacyAccessedAPICategoryFileTimestamp",
          NSPrivacyAccessedAPITypeReasons: ["C617.1"],
        },
        {
          NSPrivacyAccessedAPIType:
            "NSPrivacyAccessedAPICategoryDiskSpace",
          NSPrivacyAccessedAPITypeReasons: ["E174.1"],
        },
      ],
    },
  },
  android: {
    adaptiveIcon: {
      foregroundImage: "./assets/android-icon-foreground.png",
      backgroundImage: "./assets/android-icon-background.png",
      monochromeImage: "./assets/android-icon-monochrome.png",
      backgroundColor: "#14b8a6",
    },
    package: "com.thyrascan.app",
  },
  web: {
    favicon: "./assets/favicon.png",
  },
  plugins: [
    [
      "expo-camera",
      {
        cameraPermission:
          "ThyraScan uses your camera to scan food barcodes in real time. No photos are captured or stored.",
      },
    ],
    "expo-apple-authentication",
  ],
  extra: {
    revenueCatApiKeyIos: process.env.REVENUECAT_API_KEY_IOS ?? "",
    revenueCatApiKeyAndroid: process.env.REVENUECAT_API_KEY_ANDROID ?? "",
    eas: {
      projectId: process.env.EAS_PROJECT_ID ?? "985ccef5-ab60-49f4-a727-1c0a2dec4466",
    },
  },
});
