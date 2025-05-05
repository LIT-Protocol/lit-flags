import * as commands from './commands';
import { FlagEditor } from './FlagEditor';
import * as flagStorage from './flagStorage';
import getGitUsername from './gitTools/git-user-name';

/**
 * Creates and runs a flag editor instance, handling all data loading and saving. Errors are allowed
 * to bubble up to the caller for proper handling.
 *
 * @returns A promise that resolves when the editing process is complete
 */
export async function createEditorInstance(): Promise<void> {
  // Get user editing information
  const userEditing = await getGitUsername();

  // Resolve paths and load data
  const configPath = await flagStorage.resolveConfigPath();
  const { environmentsFilepath, flagsFilepath, typeDefPath } = flagStorage.getFilePaths(configPath);

  const environments = await flagStorage.loadEnvironments(environmentsFilepath);
  const flagsState = await flagStorage.loadFlags(flagsFilepath);

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
  await flagStorage.writeTypeDefinitions(typeDefPath, result.flagsState);
}
