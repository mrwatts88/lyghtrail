import { STAGES } from "./stage-env";

export const getStageEnv = () => {
  if (__DEV__) {
    return STAGES.development;
  }

  let stage = 'staging';

  if (window.location.hostname.includes('lyghtrail.com') && !window.location.hostname.includes('staging')) {
    stage = 'production';
  }

  return STAGES[stage as keyof typeof STAGES];
};  
