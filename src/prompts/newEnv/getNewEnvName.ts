import { input } from '@inquirer/prompts';

import { isValidScreamingSnakeCase } from '../../isValidScreamingSnakeCase';
import { createPrompt } from '../utils';

export const getNewEnvNamePrompt = createPrompt<string, [string[]]>({
  getConfig: (existingEnvironments: string[]) => ({
    message: 'Enter the name of the new environment',
    validate: (value: string) => {
      if (existingEnvironments.includes(value)) {
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
