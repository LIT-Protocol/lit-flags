import { confirm } from '@inquirer/prompts';

import { createPrompt } from './utils';

export const confirmInitFeatureStatePrompt = createPrompt<boolean, [string]>({
  getConfig: (configDir: string) => ({
    default: true,
    message: `No feature state found in "${configDir}". Would you like to initialize feature flag state there? (recommended for empty directories)`,
  }),
  prompt: confirm,
});
