import { checkbox } from '@inquirer/prompts';

import type { Environments, FlagEntry } from '../types';

export async function getEnabledEnvironments({
  environments,
  flagEntry,
}: {
  environments: Environments;
  flagEntry?: FlagEntry;
}): Promise<string[]> {
  const choices = Object.values(environments).map((name) => ({
    name,
    checked: !!(flagEntry?.[name] as any)?.enabled || false,
    value: name,
  }));

  const flagStateByEnvironment = await checkbox({
    choices,
    message: 'Select the environments you want this flag enabled in',
  });

  return flagStateByEnvironment;
}
