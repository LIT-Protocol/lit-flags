import { select } from '@inquirer/prompts';

import { FLAGS_EXIST_CHOICES, NO_FLAGS_CHOICES } from '../constants';
import { createPrompt } from './utils';

export const selectActionPrompt = createPrompt<string, [boolean]>({
  getConfig: (hasFlags: boolean) => ({
    choices: hasFlags ? FLAGS_EXIST_CHOICES : NO_FLAGS_CHOICES,
    message: 'What do you want to do?',
  }),
  prompt: select,
});
