import { select } from '@inquirer/prompts';

import { createPrompt } from './utils';
import { FLAGS_EXIST_CHOICES, NO_FLAGS_CHOICES } from '../constants';

export const selectActionPrompt = createPrompt<string, [boolean]>({
  getConfig: (hasFlags: boolean) => ({
    choices: hasFlags ? FLAGS_EXIST_CHOICES : NO_FLAGS_CHOICES,
    message: 'What do you want to do?',
  }),
  prompt: select,
});
