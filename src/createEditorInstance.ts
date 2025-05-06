import { pathExists } from 'fs-extra';

import * as commands from './commands';
import { FlagEditor } from './FlagEditor';
import * as flagStorage from './flagStorage';
import { checkTypedefs } from './flagStorage';
import getGitUsername from './gitTools/git-user-name';
import { Config } from './types';

/**
 * Creates and runs a flag editor instance, handling all data loading and saving. Errors are allowed
 * to bubble up to the caller for proper handling.
 *
 * @returns A promise that resolves when the editing process is complete
 */
export async function createEditorInstance(isTypescript: boolean, config: Config): Promise<void> {
  // Get user editing information
  const userEditing = await getGitUsername();

  // Resolve paths and load data
  const configPath = await flagStorage.resolveConfigPath(config);
  const { featureStateFilepath, typeDefPathJavascript, typeDefPathTypescript } =
    flagStorage.getFilePaths(configPath);

  let featureState;
  try {
    featureState = await flagStorage.loadFeatureState(featureStateFilepath);
  } catch (error) {
    if (await pathExists(configPath)) {
      // Directory exists but featureState.json doesn't. Ask to initialize.
      const initialState = await commands.initFeatureState(configPath);

      if (initialState) {
        console.log(`Initialized empty feature state in "${configPath}"`);
        featureState = initialState;
        await flagStorage.saveFeatureState(featureStateFilepath, featureState);
      } else {
        console.log('Feature state initialization cancelled.');
        return;
      }
    } else {
      // Rethrow the error if it's not just about a missing file
      throw error;
    }
  }

  const { jsExists, tsExists } = await checkTypedefs({
    typeDefPathJavascript,
    typeDefPathTypescript,
  });

  if (isTypescript && jsExists) {
    console.error(
      'There must not be a .d.ts type definition file unless you are using jsCompat mode'
    );
    throw new Error('.d.ts type definition files are not allowed in typescript mode');
  }

  if (!isTypescript && tsExists) {
    console.error('There must not be a .ts type definition file when you are using jsCompat mode');
    throw new Error('.ts type definition files are not allowed in jsCompat mode');
  }

  const { environments: existingEnvironments, features: existingFeatures } =
    await flagStorage.loadFeatureState(featureStateFilepath);

  // Create editor instance directly with constructor
  const editor = new FlagEditor({
    commands,
    environments: existingEnvironments,
    flagsState: existingFeatures,
    userEditing,
  });

  // Run the editor and get the updated state
  const { environments, flagsState } = await editor.run();

  // Save the results using storage module
  await flagStorage.saveFeatureState(featureStateFilepath, { environments, features: flagsState });
  await flagStorage.writeTypeDefinitions(
    isTypescript ? typeDefPathTypescript : typeDefPathJavascript,
    flagsState
  );
}
