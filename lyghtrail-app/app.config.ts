import { ExpoConfig, ConfigContext } from "@expo/config";

export default ({ config }: ConfigContext): Partial<ExpoConfig> => {
  const environment = process.env.EXPO_PUBLIC_STAGE || "staging";

  if (environment === "staging") {
    const projectId = "d55d5d95-55a9-49d9-b5ad-2ec2ebb51054";
    config.ios!.bundleIdentifier = `${config.ios!.bundleIdentifier}.staging`;
    config.android!.package = `${config.android!.package}.staging`;
    config.extra!.eas.projectId = projectId;
    config.updates!.url = `https://u.expo.dev/${projectId}`;
    config.name = `${config.name}-staging`;
    config.slug = `${config.slug}-staging`;
    config.scheme = `${config.slug}-staging`;
  }

  return config;
};
