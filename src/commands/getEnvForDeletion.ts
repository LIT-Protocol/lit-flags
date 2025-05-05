import type { Environments } from '../types';

import { runPrompt, selectEnvForDeletionPrompt, shouldDeleteEnvPrompt } from '../prompts';

export async function getEnvForDeletion(
  environments: Environments,
  {
    selectEnvForDeletion = selectEnvForDeletionPrompt,
    shouldDeleteEnv = shouldDeleteEnvPrompt,
  }: {
    selectEnvForDeletion?: typeof selectEnvForDeletionPrompt;
    shouldDeleteEnv?: typeof shouldDeleteEnvPrompt;
  } = {}
): Promise<null | string> {
  const proceed = await runPrompt(shouldDeleteEnv);

  if (!proceed) {
    return null;
  }

  return runPrompt(selectEnvForDeletion, environments);
}
