import { STAGES } from "./stage-env";

export const getStageEnv = () => {
  if (__DEV__) {
    return STAGES.development;
  }

  const stage = process.env.EXPO_PUBLIC_STAGE || "staging";

  return STAGES[stage as keyof typeof STAGES];
};  
