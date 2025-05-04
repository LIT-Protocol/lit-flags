import { input } from '@inquirer/prompts';

import { isValidScreamingSnakeCase } from '../isValidScreamingSnakeCase';

export async function enterNewFlagName(existingFlagNames: string[]): Promise<string> {
  const flagName = await input({
    message: 'Enter the name of the new flag',
    validate: (value: string) => {
      if (existingFlagNames.includes(value)) {
        return `${value} already exists!`;
      }

      const { errorMessage, isValid } = isValidScreamingSnakeCase(value);

      if (!isValid) {
        return errorMessage;
      }

      return true;
    },
  });

  return flagName;
}
