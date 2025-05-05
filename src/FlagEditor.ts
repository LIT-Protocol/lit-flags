// FlagEditor.ts
import * as commandFuncs from './commands';
import { ACTIONS, ACTIONS_REQUIRING_ENVIRONMENTS } from './constants';
import * as flagStorage from './flagStorage';
import {
  AddEnvironmentOptions,
  EnvironmentEntry,
  Environments,
  FlagEntry,
  FlagEntryOptions,
  FlagsState,
} from './types';

export interface FlagEditorConstructorOptions {
  commands: typeof commandFuncs;
  environments: Environments;
  flagsState: FlagsState;
  userEditing: string | null;
}

export class FlagEditor {
  private readonly commands: typeof commandFuncs;

  private readonly userEditing: string | null;

  private environments: Environments;

  private flagsState: FlagsState;

  constructor({ commands, environments, flagsState, userEditing }: FlagEditorConstructorOptions) {
    this.commands = commands;
    this.userEditing = userEditing;
    this.environments = environments;
    this.flagsState = flagsState;
  }

  /** Runs the main editor flow */
  async run(): Promise<{
    environments: Environments;
    flagsState: FlagsState;
  }> {
    flagStorage.log({ userEditing: this.userEditing });

    const flagNames = Object.keys(this.flagsState);
    const hasEnvironments = Object.keys(this.environments).length > 0;

    const action = await this.commands.getAction(flagNames.length !== 0);
    flagStorage.log({ action });

    if (action.includes(ACTIONS.REMOVE_ENVIRONMENT) && !hasEnvironments) {
      console.log(`There are no environments to delete. You need to add an environment first.`);
      return {
        environments: this.environments,
        flagsState: this.flagsState,
      };
    }

    if (ACTIONS_REQUIRING_ENVIRONMENTS.includes(action) && !hasEnvironments) {
      console.log(`Cannot ${action} without environments. You need to add an environment first.`);

      // Someone's trying to define their first flag, but hasn't configured any environments yet
      // Let's help em out.
      const { environmentName, sourceEnvironment } = await this.commands.createNewEnv([]);
      await this.addEnvironment({
        environmentName,
        sourceEnvironment,
        userEditing: this.userEditing,
      });
    }

    switch (action) {
      case ACTIONS.ADD_FLAG: {
        const flagName = await this.commands.getNewFlagName(flagNames);
        await this.setFlagState(flagName, this.userEditing);
        break;
      }
      case ACTIONS.EDIT_FLAG: {
        const flagName = await this.commands.getExistingFlag(flagNames);
        await this.setFlagState(flagName, this.userEditing);
        break;
      }
      case ACTIONS.REMOVE_FLAG: {
        const flagName = await this.commands.getExistingFlag(flagNames);
        delete this.flagsState[flagName];
        break;
      }
      case ACTIONS.ADD_ENVIRONMENT: {
        const { environmentName, sourceEnvironment } = await this.commands.createNewEnv(
          Object.values(this.environments)
        );
        await this.addEnvironment({
          environmentName,
          sourceEnvironment,
          userEditing: this.userEditing,
        });
        break;
      }
      case ACTIONS.REMOVE_ENVIRONMENT: {
        const environmentName = await this.commands.getEnvForDeletion(this.environments);
        if (!environmentName) {
          return { environments: this.environments, flagsState: this.flagsState };
        }

        await this.removeEnvironment(environmentName);
        break;
      }
      default:
        return { environments: this.environments, flagsState: this.flagsState };
    }

    return {
      environments: this.environments,
      flagsState: this.flagsState,
    };
  }

  async setFlagState(flagName: string, userEditing: string | null): Promise<void> {
    const flagEntry = this.flagsState[flagName];
    const environmentsEnabledIn = await this.commands.getEnabledEnvs({
      flagEntry,
      environments: this.environments,
    });

    this.flagsState = {
      ...this.flagsState,
      [flagName]: this.flagEntry({ environmentsEnabledIn, flagEntry, userEditing }),
    };
  }

  flagEntry({ environmentsEnabledIn, flagEntry, userEditing }: FlagEntryOptions): FlagEntry {
    flagStorage.log({ userEditing });

    const perEnvEntries: Record<string, EnvironmentEntry> = {};
    Object.values(this.environments).forEach((name) => {
      // Create a properly typed default environment entry
      const defaultEntry: EnvironmentEntry = {
        enabled: false,
        lastEditedAt: new Date().toISOString(),
        lastEditedBy: userEditing || 'unknown',
      };

      // Use the existing entry if available, otherwise use the default
      const perEnvEntry: EnvironmentEntry =
        flagEntry && (flagEntry[name] as EnvironmentEntry)?.enabled !== undefined
          ? (flagEntry[name] as EnvironmentEntry)
          : defaultEntry;

      const enabled = environmentsEnabledIn.includes(name);
      const isEditing = enabled !== perEnvEntry.enabled;

      perEnvEntries[name] = {
        ...perEnvEntry,
        enabled,
        lastEditedAt: !isEditing ? perEnvEntry.lastEditedAt : new Date().toISOString(),
        lastEditedBy: !isEditing ? perEnvEntry.lastEditedBy : userEditing || 'unknown',
      };
    });

    return {
      createdAt: flagEntry ? flagEntry.createdAt : new Date().toISOString(),
      createdBy: flagEntry ? flagEntry.createdBy : userEditing || 'unknown',
      ...perEnvEntries,
    };
  }

  async addEnvironment({
    environmentName,
    sourceEnvironment,
    userEditing,
  }: AddEnvironmentOptions): Promise<void> {
    this.environments = {
      ...this.environments,
      [environmentName.toUpperCase()]: environmentName,
    };

    // If there are no flags yet, we don't need to initialize any environment entries
    if (Object.keys(this.flagsState).length === 0) {
      return;
    }

    // If sourceEnvironment is provided (and exists), copy its settings
    // Otherwise, create default entries for all flags
    Object.entries(this.flagsState).forEach(([flagName, flagState]) => {
      const defaultEntry: EnvironmentEntry = {
        enabled: false,
        lastEditedAt: new Date().toISOString(),
        lastEditedBy: userEditing || 'unknown',
      };

      // Use the source environment's entry if it exists, otherwise use default
      const sourceEntry = sourceEnvironment && (flagState[sourceEnvironment] as EnvironmentEntry);

      this.flagsState[flagName][environmentName] = sourceEntry
        ? {
            ...sourceEntry,
            lastEditedAt: new Date().toISOString(),
            lastEditedBy: userEditing || 'unknown',
          }
        : defaultEntry;
    });
  }

  async removeEnvironment(environmentName: string): Promise<void> {
    delete this.environments[environmentName.toUpperCase()];

    if (Object.keys(this.environments).length === 0) {
      this.flagsState = {};
      return;
    }

    Object.keys(this.flagsState).forEach((flagName) => {
      delete this.flagsState[flagName][environmentName];
    });
  }
}
