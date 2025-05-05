import { input } from '@inquirer/prompts';

import { isValidScreamingSnakeCase } from '../isValidScreamingSnakeCase';
import { createPrompt } from './utils';

export const getNewFlagNamePrompt = createPrompt<string, [string[]]>({
  getConfig: (existingFlagNames: string[]) => ({
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
  }),
  prompt: input,
});
