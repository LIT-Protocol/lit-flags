import { select } from '@inquirer/prompts';

import type { Environments } from '../../types';

import { createPrompt } from '../utils';

export const selectEnvForDeletionPrompt = createPrompt<string, [Environments]>({
  getConfig: (environments) => {
    const environmentChoices = Object.entries(environments).map(([key, value]) => ({
      name: key,
      value,
    }));

    return {
      choices: environmentChoices,
      message: 'Select the environment you wish to modify',
    };
  },
  prompt: select,
});
