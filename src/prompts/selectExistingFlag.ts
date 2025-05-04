import { rawlist } from '@inquirer/prompts';

export async function selectExistingFlag(flagNames: string[]): Promise<string> {
  const flagName = await rawlist<string>({
    choices: flagNames,
    message: 'Select the flag you wish to modify',
  });

  return flagName;
}
