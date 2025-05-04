// FlagEditor.ts
import { ACTIONS } from './constants';
import * as flagStorage from './flagStorage';
import { Prompts } from './prompts';
import {
  AddEnvironmentOptions,
  EnvironmentEntry,
  Environments,
  FlagEntry,
  FlagEntryOptions,
  FlagsState,
} from './types';

export interface FlagEditorConstructorOptions {
  environments: Environments;
  flagsState: FlagsState;
  prompts: Prompts;
  userEditing: string | null;
}

export class FlagEditor {
  private readonly prompts: Prompts;

  private readonly userEditing: string | null;

  private environments: Environments;

  private flagsState: FlagsState;

  constructor({ environments, flagsState, prompts, userEditing }: FlagEditorConstructorOptions) {
    this.prompts = prompts;
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

    const action = await this.prompts.getAction(flagNames.length !== 0);
    flagStorage.log({ action });

    switch (action) {
      case ACTIONS.ADD_FLAG: {
        const flagName = await this.prompts.enterNewFlagName(flagNames);
        await this.setFlagState(flagName, this.userEditing);
        break;
      }
      case ACTIONS.EDIT_FLAG: {
        const flagName = await this.prompts.selectExistingFlag(flagNames);
        await this.setFlagState(flagName, this.userEditing);
        break;
      }
      case ACTIONS.REMOVE_FLAG: {
        const flagName = await this.prompts.selectExistingFlag(flagNames);
        delete this.flagsState[flagName];
        break;
      }
      case ACTIONS.ADD_ENVIRONMENT: {
        const { environmentName, sourceEnvironment } = await this.prompts.setupNewEnvironment(
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
        const environmentName = await this.prompts.selectEnvironmentForDeletion(this.environments);
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
    const environmentsEnabledIn = await this.prompts.getEnabledEnvironments({
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

    Object.entries(this.flagsState).forEach(([flagName, flagState]) => {
      this.flagsState[flagName][environmentName] = {
        ...(flagState[sourceEnvironment] as EnvironmentEntry),
        lastEditedAt: new Date().toISOString(),
        lastEditedBy: userEditing || 'unknown',
      };
    });
  }

  async removeEnvironment(environmentName: string): Promise<void> {
    delete this.environments[environmentName.toUpperCase()];

    Object.keys(this.flagsState).forEach((flagName) => {
      delete this.flagsState[flagName][environmentName];
    });
  }
}
