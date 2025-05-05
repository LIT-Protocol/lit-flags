import { select } from '@inquirer/prompts';

import { createPrompt } from '../utils';

import type { Environments } from '../../types';

export const selectEnvForDeletionPrompt = createPrompt({
  getConfig: (environments: Environments) => {
    const environmentChoices = Object.entries(environments).map(([key, value]) => ({
      value,
      name: key,
    }));

    return {
      choices: environmentChoices,
      message: 'Select the environment you wish to modify',
    };
  },
  prompt: select,
});
