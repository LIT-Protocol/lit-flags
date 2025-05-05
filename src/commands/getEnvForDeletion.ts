import { selectEnvForDeletionPrompt, shouldDeleteEnvPrompt, runPrompt } from '../prompts';

import type { Environments } from '../types';

export async function getEnvForDeletion(
  environments: Environments,
  {
    selectEnvForDeletion = selectEnvForDeletionPrompt,
    shouldDeleteEnv = shouldDeleteEnvPrompt,
  }: {
    selectEnvForDeletion?: typeof selectEnvForDeletionPrompt;
    shouldDeleteEnv?: typeof shouldDeleteEnvPrompt;
  } = {}
): Promise<string | null> {
  const proceed = await runPrompt(shouldDeleteEnv);

  if (!proceed) {
    return null;
  }

  return runPrompt(selectEnvForDeletion, environments);
}
