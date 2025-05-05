import { checkbox } from '@inquirer/prompts';

import type { Environments, FlagEntry } from '../types';

import { createPrompt } from './utils';

export const selectEnabledEnvsPrompt = createPrompt<
  string[],
  [{ environments: Environments; flagEntry?: FlagEntry }]
>({
  getConfig: ({
    environments,
    flagEntry,
  }: {
    environments: Environments;
    flagEntry?: FlagEntry;
  }) => {
    const choices = Object.values(environments).map((name) => {
      let checked = false;
      if (typeof flagEntry?.[name] !== 'string' && flagEntry?.[name].enabled) {
        checked = true;
      }

      return {
        checked,
        name,
        value: name,
      };
    });

    return {
      choices,
      message: 'Select the environments you want this flag enabled in',
    };
  },
  prompt: checkbox,
});
