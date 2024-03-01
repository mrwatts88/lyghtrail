export const STAGES = {
  development: {
    VITE_CLERK_PUBLISHABLE_KEY:
      "pk_test_ZW5nYWdpbmctbWFja2VyZWwtODAuY2xlcmsuYWNjb3VudHMuZGV2JA",
    apiBaseUrl: "http://localhost:3001",
  },
  staging: {
    VITE_CLERK_PUBLISHABLE_KEY:
      "pk_test_ZW5nYWdpbmctbWFja2VyZWwtODAuY2xlcmsuYWNjb3VudHMuZGV2JA",
    apiBaseUrl: "https://www.staging.lyghtrail.com",
  },
  production: {
    VITE_CLERK_PUBLISHABLE_KEY: "pk_live_Y2xlcmsubHlnaHRyYWlsLmNvbSQ",
    apiBaseUrl: "https://www.lyghtrail.com",
  },
};

export const getStageEnv = () => {
  if (__DEV__) {
    return STAGES.development;
  }

  const stage = process.env.EXPO_PUBLIC_STAGE || "staging";

  return STAGES[stage as keyof typeof STAGES];
};  
