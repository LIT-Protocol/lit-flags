import { checkbox } from '@inquirer/prompts';

import { createPrompt } from './utils';

import type { Environments, FlagEntry } from '../types';

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
    const choices = Object.values(environments).map((name) => ({
      name,
      checked: !!(flagEntry?.[name] as any)?.enabled || false,
      value: name,
    }));

    return {
      choices,
      message: 'Select the environments you want this flag enabled in',
    };
  },
  prompt: checkbox,
});
