import { input } from '@inquirer/prompts';

export async function enterNewFlagName(existingFlagNames: string[]): Promise<string> {
  const flagName = await input({
    message: 'Enter the name of the new flag',
    validate: (value: string) => {
      if (existingFlagNames.includes(value)) {
        return `${value} already exists!`;
      }
      return true;
    },
  });

  return flagName;
}
