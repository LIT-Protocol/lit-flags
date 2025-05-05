import { selectEnabledEnvsPrompt, runPrompt } from '../prompts';

import type { Environments, FlagEntry } from '../types';

export async function getEnabledEnvs(
  {
    environments,
    flagEntry,
  }: {
    environments: Environments;
    flagEntry?: FlagEntry;
  },
  {
    selectEnabledEnv = selectEnabledEnvsPrompt,
  }: { selectEnabledEnv?: typeof selectEnabledEnvsPrompt } = {}
): Promise<string[]> {
  return runPrompt(selectEnabledEnv, { environments, flagEntry });
}
