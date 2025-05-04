import path from 'path';

import fsx from 'fs-extra';

import { ACTIONS } from './constants';
import getGitUsername from './gitTools/git-user-name';
import { Prompts } from './prompts';
import {
  AddEnvironmentOptions,
  EnvironmentEntry,
  Environments,
  FlagEntry,
  FlagEntryOptions,
  FlagEditorOptions,
  FlagsState,
  FlagEditorConfig,
} from './types';

const CONFIG_DIRECTORY = 'features';
const FLAGS_FILENAME = 'flags.json';
const FEATURES_TYPEDEF_FILENAME = 'features.d.ts';
const ENVIRONMENTS_FILENAME = 'environments.json';
const ENABLE_DEBUG_LOGGING = process.env.LIT_FLAG_DEBUG === 'true' || false;

class FlagEditor {
  private readonly prompts: Prompts;

  private readonly configPath: string;

  private readonly environmentsFilepath: string;

  private readonly flagsFilepath: string;

  private readonly userEditing: string | null;

  private environments: Environments;

  private flagsState: FlagsState;

  /**
   * Creates a new FlagEditor instance with all dependencies fully initialized.
   *
   * @param options FlagEditorOptions
   * @returns A promise that resolves to an initialized FlagEditor
   */
  static async create(options: FlagEditorOptions): Promise<FlagEditor> {
    const userEditing = await getGitUsername();

    // Load all required configuration using static methods
    const configPath = await FlagEditor.resolveConfigPath();
    const environmentsFilepath = path.join(configPath, ENVIRONMENTS_FILENAME);
    const flagsFilepath = path.join(configPath, FLAGS_FILENAME);

    const environments = await FlagEditor.loadEnvironments(environmentsFilepath);
    const flagsState = await FlagEditor.loadFlags(flagsFilepath);

    // Create a fully initialized instance
    return new FlagEditor({
      configPath,
      environments,
      environmentsFilepath,
      flagsFilepath,
      flagsState,
      userEditing,
      prompts: options.prompts,
    });
  }

  /**
   * Private constructor that requires all configuration to be provided. Use the static create()
   * method instead of instantiating directly.
   */
  private constructor(config: FlagEditorConfig) {
    this.prompts = config.prompts;
    this.userEditing = config.userEditing;
    this.configPath = config.configPath;
    this.environmentsFilepath = config.environmentsFilepath;
    this.flagsFilepath = config.flagsFilepath;
    this.environments = config.environments;
    this.flagsState = config.flagsState;
  }

  /** Runs the main editor flow */
  async run(): Promise<void> {
    this.log({ userEditing: this.userEditing });

    const flagNames = Object.keys(this.flagsState);

    const action = await this.prompts.getAction(flagNames.length !== 0);
    this.log({ action });

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
          return;
        }

        await this.removeEnvironment(environmentName);
        break;
      }
      default:
        return;
    }

    await this.saveEnvironments();
    await this.saveFlags();
    await this.writeTypeDefinitions();
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
    this.log({ userEditing });

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

  /** Resolves the configuration path by walking up directories until a flags.json file is found. */
  static async resolveConfigPath(): Promise<string> {
    const { base, dir, root } = path.parse(process.cwd());
    let fileFound = false;
    let currPath = path.join(dir, base);

    while (!fileFound && currPath && currPath !== root) {
      // eslint-disable-next-line no-await-in-loop
      fileFound = await fsx.exists(path.join(currPath, CONFIG_DIRECTORY, FLAGS_FILENAME));

      if (!fileFound) {
        currPath = currPath.split(path.sep).slice(0, -1).join(path.sep);
      }
    }

    if (!fileFound) {
      throw new Error(
        `Could not find a ${FLAGS_FILENAME} in CWD or any parent dir. See README.md for more info.`
      );
    }

    return path.join(currPath, CONFIG_DIRECTORY);
  }

  /** Loads environments configuration from the given file path. */
  static async loadEnvironments(environmentsFilepath: string): Promise<Environments> {
    try {
      return await fsx.readJson(environmentsFilepath);
    } catch (e) {
      console.log(e);
      throw new Error(`Failed to load JSON from ${environmentsFilepath}. Probably not valid JSON!`);
    }
  }

  /** Loads flags state from the given file path. */
  static async loadFlags(flagsFilepath: string): Promise<FlagsState> {
    try {
      return await fsx.readJson(flagsFilepath);
    } catch (e) {
      console.log(e);
      throw new Error(`Failed to load JSON from ${flagsFilepath}. Probably not valid JSON!`);
    }
  }

  /** Static utility method for logging debug information */
  static log(...args: any[]): void {
    if (ENABLE_DEBUG_LOGGING) {
      console.log(...args);
    }
  }

  /** Instance method that delegates to the static log method */
  log(...args: any[]): void {
    FlagEditor.log(...args);
  }

  async saveEnvironments(): Promise<void> {
    this.log('writing file', { filepath: this.environmentsFilepath, state: this.environments });
    return fsx.writeJson(this.environmentsFilepath, this.environments, { spaces: 2 });
  }

  async saveFlags(): Promise<void> {
    this.log('writing file', { filepath: this.flagsFilepath, state: this.flagsState });

    const flagOutput = Object.keys(this.flagsState)
      .sort()
      .reduce<FlagsState>((flagsState, flagName) => {
        flagsState[flagName] = this.flagsState[flagName]; // eslint-disable-line no-param-reassign
        return flagsState;
      }, {});

    return fsx.writeJson(this.flagsFilepath, flagOutput, { spaces: 2 });
  }

  async writeTypeDefinitions(): Promise<void> {
    const typeDefPath = this.flagsFilepath.replace(FLAGS_FILENAME, FEATURES_TYPEDEF_FILENAME);

    const alphabetizedTypeDefs = Object.keys(this.flagsState)
      .sort()
      .map((flag) => `${flag}: boolean;`)
      .join('\n\t');

    const fileContent = `
  /* This file is generated by the flag editor util. Changes will be lost! */
  
  export type Features = {
${alphabetizedTypeDefs}
  };
  `;

    this.log('writing typedef file', { filepath: this.flagsFilepath, state: this.flagsState });
    return fsx.writeFile(typeDefPath, fileContent);
  }
}

export { FlagEditor };
