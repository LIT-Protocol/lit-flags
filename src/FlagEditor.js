const path = require('path');

const fsx = require('fs-extra');

const { ACTIONS } = require('./constants');
const getGitUsername = require('./gitTools/git-user-name');

const CONFIG_DIRECTORY = 'features';
const FLAGS_FILENAME = 'flags.json';
const FEATURES_TYPEDEF_FILENAME = 'features.d.ts';
const ENVIRONMENTS_FILENAME = 'environments.json';
const ENABLE_DEBUG_LOGGING = process.env.LIT_FLAG_DEBUG === 'true' || false;

class FlagEditor {
  constructor({ prompts }) {
    this.prompts = prompts;
    this._configPath = null;
    this._environments = null;
    this._environmentsFilepath = null;
    this._flagsFilepath = null;
    this._flagsState = null;
  }

  log(...args) {
    if (ENABLE_DEBUG_LOGGING) {
      console.log(...args);
    }
  }

  async init() {
    const userEditing = await getGitUsername();
    this.log({ userEditing });

    await this.loadContext();
    await this.loadEnvironments();
    await this.loadFlags();

    const flagNames = Object.keys(this._flagsState);

    const action = await this.prompts.action(flagNames.length !== 0);
    this.log({ action });

    switch (action) {
      case ACTIONS.ADD_FLAG: {
        const flagName = await this.prompts.enterNewFlagName(flagNames);
        await this.setFlagState(flagName, userEditing);
        break;
      }
      case ACTIONS.EDIT_FLAG: {
        const flagName = await this.prompts.selectExistingFlag(flagNames);
        await this.setFlagState(flagName, userEditing);
        break;
      }
      case ACTIONS.REMOVE_FLAG: {
        const flagName = await this.prompts.selectExistingFlag(flagNames);
        delete this._flagsState[flagName];
        break;
      }
      case ACTIONS.ADD_ENVIRONMENT: {
        const { environmentName, sourceEnvironment } = await this.prompts.setupNewEnvironment(
          Object.values(this._environments)
        );
        await this.addEnvironment({ environmentName, sourceEnvironment, userEditing });
        break;
      }
      case ACTIONS.REMOVE_ENVIRONMENT: {
        const environmentName = await this.prompts.selectEnvironmentForDeletion(
          Object.values(this._environments)
        );
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

  async setFlagState(flagName, userEditing) {
    const flagEntry = this._flagsState[flagName];
    const environmentsEnabledIn = await this.prompts.getEnvironmentStates({
      flagEntry,
      environments: this._environments,
    });

    this._flagsState = {
      ...this._flagsState,
      [flagName]: this.flagEntry({ environmentsEnabledIn, flagEntry, userEditing }),
    };
  }

  flagEntry({ environmentsEnabledIn, flagEntry, userEditing }) {
    this.log({ userEditing });

    const perEnvEntries = {};
    Object.values(this._environments).forEach((name) => {
      const perEnvEntry = (flagEntry && flagEntry[name]) || {};

      const enabled = environmentsEnabledIn.includes(name);
      const isEditing = enabled !== perEnvEntry.enabled;

      perEnvEntries[name] = {
        ...perEnvEntry,
        enabled,
        lastEditedAt: !isEditing ? perEnvEntry.lastEditedAt : new Date().toISOString(),
        lastEditedBy: !isEditing ? perEnvEntry.lastEditedBy : userEditing,
      };
    });

    return {
      createdAt: flagEntry ? flagEntry.createdAt : new Date().toISOString(),
      createdBy: flagEntry ? flagEntry.createdBy : userEditing,
      ...perEnvEntries,
    };
  }

  async addEnvironment({ environmentName, sourceEnvironment, userEditing }) {
    this._environments = {
      ...this._environments,
      [environmentName.toUpperCase()]: environmentName,
    };

    Object.entries(this._flagsState).forEach(([flagName, flagState]) => {
      this._flagsState[flagName][environmentName] = {
        ...flagState[sourceEnvironment],
        lastEditedAt: new Date().toISOString(),
        lastEditedBy: userEditing,
      };
    });
  }

  async removeEnvironment(environmentName) {
    delete this._environments[environmentName.toUpperCase()];

    Object.keys(this._flagsState).forEach((flagName) => {
      delete this._flagsState[flagName][environmentName];
    });
  }

  async resolveConfigPath() {
    if (this._configPath) {
      return this._configPath;
    }

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

    this._configPath = path.join(currPath, CONFIG_DIRECTORY);
    return this._configPath;
  }

  async loadContext() {
    const configPath = await this.resolveConfigPath();
    this._environmentsFilepath = path.join(configPath, ENVIRONMENTS_FILENAME);
    this._flagsFilepath = path.join(configPath, FLAGS_FILENAME);
  }

  async loadEnvironments() {
    try {
      this._environments = await fsx.readJson(this._environmentsFilepath);
    } catch (e) {
      console.log(e);
      throw new Error(
        `Failed to load JSON from ${this._environmentsFilepath}. Probably not valid JSON!`
      );
    }
  }

  async loadFlags() {
    try {
      this._flagsState = await fsx.readJson(this._flagsFilepath);
    } catch (e) {
      console.log(e);
      throw new Error(`Failed to load JSON from ${this._flagsFilepath}. Probably not valid JSON!`);
    }
  }

  async saveEnvironments() {
    this.log('writing file', { filepath: this._environmentsFilepath, state: this._environments });
    return fsx.writeJson(this._environmentsFilepath, this._environments, { spaces: 2 });
  }

  async saveFlags() {
    this.log('writing file', { filepath: this._flagsFilepath, state: this._flagsState });

    const flagOutput = Object.keys(this._flagsState)
      .sort()
      .reduce((flagsState, flagName) => {
        flagsState[flagName] = this._flagsState[flagName]; // eslint-disable-line no-param-reassign
        return flagsState;
      }, {});

    return fsx.writeJson(this._flagsFilepath, flagOutput, { spaces: 2 });
  }

  async writeTypeDefinitions() {
    const typeDefPath = this._flagsFilepath.replace(FLAGS_FILENAME, FEATURES_TYPEDEF_FILENAME);

    const alphabetizedTypeDefs = Object.keys(this._flagsState)
      .sort()
      .map((flag) => `${flag}: boolean;`)
      .join('\n\t');

    const fileContent = `
/* This file is generated by the flag editor util. Changes will be lost! */

export type Features = {
    ${alphabetizedTypeDefs}
};
`;

    this.log('writing typedef file', { filepath: this._flagsFilepath, state: this._flagsState });
    return fsx.writeFile(typeDefPath, fileContent);
  }
}

module.exports = FlagEditor;
