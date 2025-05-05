import { select } from '@inquirer/prompts';

import { createPrompt } from '../utils';

export const selectSourceEnvPrompt = createPrompt<string, [string[]]>({
  getConfig: (existingEnvironments: string[]) => ({
    choices: existingEnvironments.map((env) => ({ name: env, value: env })),
    message: 'Select environment to use as a source:',
  }),
  prompt: select,
});
