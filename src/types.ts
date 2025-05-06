// Options for adding a new environment
export interface AddEnvironmentOptions {
  environmentName: string;
  sourceEnvironment: null | string;
  userEditing: null | string;
}

export type Config = {
  CONFIG_PATH: string;
  ENABLE_DEBUG_LOGGING: boolean;
  JS_COMPATIBILITY: boolean;
};

// Entry for a specific environment
export interface EnvironmentEntry {
  enabled: boolean;
  lastEditedAt: string;
  lastEditedBy: string;
}

// Map of environment keys to environment names
export type Environments = Record<string, string>;

export interface FeatureState {
  environments: Environments;
  features: FlagsState;
}

// Entry for a feature flag with its state across environments
export interface FlagEntry {
  [environmentName: string]: EnvironmentEntry | string;
  createdAt: string;
  createdBy: string;
}

// Options for creating or updating a flag entry
export interface FlagEntryOptions {
  environmentsEnabledIn: string[];
  flagEntry?: FlagEntry;
  userEditing: null | string;
}

// Map of flag names to their entries
export interface FlagsState {
  [flagName: string]: FlagEntry;
}
