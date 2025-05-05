import { select } from '@inquirer/prompts';

import { createPrompt } from './utils';

export const selectExistingFlagPrompt = createPrompt<string, [string[]]>({
  getConfig: (flagNames: string[]) => ({
    choices: flagNames,
    message: 'Select the flag you wish to modify',
  }),
  prompt: select,
});
