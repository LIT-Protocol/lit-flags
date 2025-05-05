import type { Environments, FlagEntry } from '../types';

import { runPrompt, selectEnabledEnvsPrompt } from '../prompts';

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
