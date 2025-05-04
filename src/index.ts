import { Environments, FlagsState, FlagEntry, EnvironmentEntry } from './types';

/** Options for initializing feature flags */
interface InitFeatureFlagsOptions {
  /** Environment variable name to read for current environment */
  envVarName: string;
  /** Map of environment keys to environment names */
  environments: Environments;
  /** The feature flag state object */
  flagState: FlagsState;
}

/**
 * Initialize feature flags based on the current environment.
 *
 * @param options Configuration options
 * @returns A proxy that provides boolean values for each flag based on the current environment
 * @throws Error if the environment or flagState is invalid
 */
function initFeatureFlags({
  environments,
  envVarName,
  flagState,
}: InitFeatureFlagsOptions): Record<string, boolean> {
  const currentEnvironment = process.env[envVarName];

  if (typeof flagState !== 'object') {
    throw Error('invalid flags');
  }

  if (!Object.values(environments).includes(currentEnvironment as string)) {
    throw Error(
      `invalid environment "${currentEnvironment}", ${envVarName} must be set to one of:
      ${Object.values(environments).join(', ')}`
    );
  }

  // Use type assertion to tell TypeScript this Proxy returns boolean values for any string key
  return new Proxy(flagState, {
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

export { initFeatureFlags };
