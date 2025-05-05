import * as commands from './commands';
import { FlagEditor } from './FlagEditor';
import * as flagStorage from './flagStorage';
import { checkTypedefs } from './flagStorage';
import getGitUsername from './gitTools/git-user-name';

/**
 * Creates and runs a flag editor instance, handling all data loading and saving. Errors are allowed
 * to bubble up to the caller for proper handling.
 *
 * @returns A promise that resolves when the editing process is complete
 */
export async function createEditorInstance(isTypescript: boolean): Promise<void> {
  // Get user editing information
  const userEditing = await getGitUsername();

  // Resolve paths and load data
  const configPath = await flagStorage.resolveConfigPath();
  const { environmentsFilepath, flagsFilepath, typeDefPathJavascript, typeDefPathTypescript } =
    flagStorage.getFilePaths(configPath);

  const environments = await flagStorage.loadEnvironments(environmentsFilepath);
  const flagsState = await flagStorage.loadFlags(flagsFilepath);

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

  // Create editor instance directly with constructor
  const editor = new FlagEditor({
    commands,
    environments,
    flagsState,
    userEditing,
  });

  // Run the editor and get the updated state
  const result = await editor.run();

  // Save the results using storage module
  await flagStorage.saveEnvironments(environmentsFilepath, result.environments);
  await flagStorage.saveFlags(flagsFilepath, result.flagsState);
  await flagStorage.writeTypeDefinitions(
    isTypescript ? typeDefPathTypescript : typeDefPathJavascript,
    result.flagsState
  );
}
