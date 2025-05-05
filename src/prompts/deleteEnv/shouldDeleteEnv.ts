import { confirm } from '@inquirer/prompts';

import { createPrompt } from '../utils';

export const shouldDeleteEnvPrompt = createPrompt<boolean, []>({
  getConfig: () => ({
    default: false,
    message: `
💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥
Removing existing environments WILL break any production environments using this configuration.
Only proceed if the target environment is no longer active.

Continue?
💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥
`,
  }),
  prompt: confirm,
});
