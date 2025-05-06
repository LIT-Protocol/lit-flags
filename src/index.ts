import { EnvironmentEntry, FeatureState, FlagEntry } from './types';

/** Options for initializing feature flags */
interface GetFeatureFlagsOptions {
  /** Environment variable name to use to identify the current environment */
  envVarName: string;
  /** The feature flag state object */
  featureState: FeatureState;
}

/**
 * Initialize feature flags based on the current environment.
 *
 * @param options Configuration options
 * @returns A proxy that provides boolean values for each flag based on the current environment
 * @throws Error if the environment or flagState is invalid
 */
function getFeatureFlags({
  envVarName,
  featureState,
}: GetFeatureFlagsOptions): Record<string, boolean> {
  const currentEnvironment = process.env[envVarName];

  if (typeof featureState !== 'object') {
    throw Error('invalid flags');
  }

  const { environments, features } = featureState;

  if (!Object.values(environments).includes(currentEnvironment as string)) {
    throw Error(
      `invalid environment "${currentEnvironment}", ${envVarName} must be set to one of:
      ${Object.values(environments).join(', ')}`
    );
  }

  // Use type assertion to tell TypeScript this Proxy returns boolean values for any string key
  return new Proxy(features, {
    get(flags, flag) {
      if (flag === '__esModule') {
        return { value: true };
      }

      const flagName = String(flag);
      const feature: FlagEntry = flags[flagName];
      if (!feature) {
        throw Error(`invalid feature: "${flagName}"`);
      }

      const envEntry = feature[currentEnvironment as string] as EnvironmentEntry;
      if (!envEntry) {
        throw Error(`${flagName} missing definition for environment: "${currentEnvironment}"`);
      }

      return envEntry.enabled;
    },
  }) as unknown as Record<string, boolean>;
}

export { getFeatureFlags };
