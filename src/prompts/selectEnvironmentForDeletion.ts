import { confirm, rawlist } from '@inquirer/prompts';

import type { Environments } from '../types';

export async function selectEnvironmentForDeletion(
  environments: Environments
): Promise<string | null> {
  const proceed = await confirm({
    message: `
💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥
Removing existing environments WILL break any production environments using this configuration.
Only proceed if the target environment is no longer active.

Continue?
💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥
`,
  });

  if (!proceed) {
    return null;
  }

  const environmentChoices = Object.entries(environments).map(([key, value]) => ({
    value,
    name: key,
  }));

  const environmentName = await rawlist({
    choices: environmentChoices,
    message: 'Select the environment you wish to modify',
  });

  return environmentName;
}
