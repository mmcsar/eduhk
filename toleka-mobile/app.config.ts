import type { ExpoConfig } from "expo/config";

function apiBaseUrlFor(profile: string) {
  // Allow explicit override
  const explicit = process.env.EXPO_PUBLIC_API_BASE_URL?.trim();
  if (explicit) return explicit;

  // Defaults (edit to match your domains)
  switch (profile) {
    case "production":
      return "https://api.toleka.cd";
    case "preview":
      return "https://api-preview.toleka.cd";
    case "development":
    default:
      return "http://localhost:3000";
  }
}

export default (): ExpoConfig => {
  const profile = process.env.EAS_BUILD_PROFILE || process.env.APP_ENV || "development";
  const apiBaseUrl = apiBaseUrlFor(profile);

  return {
    name: "Toleka",
    slug: "toleka",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    newArchEnabled: true,
    scheme: "toleka",
    splash: {
      image: "./assets/splash-icon.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff",
    },
    ios: {
      supportsTablet: true,
      bundleIdentifier: "cd.mmc.toleka",
    },
    android: {
      package: "cd.mmc.toleka",
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#ffffff",
      },
      edgeToEdgeEnabled: true,
      predictiveBackGestureEnabled: false,
    },
    web: {
      favicon: "./assets/favicon.png",
    },
    updates: {
      fallbackToCacheTimeout: 0,
    },
    runtimeVersion: {
      policy: "appVersion",
    },
    extra: {
      apiBaseUrl,
      appEnv: profile,
    },
  };
};

