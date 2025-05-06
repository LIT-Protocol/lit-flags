import { confirmInitFeatureStatePrompt, runPrompt } from '../prompts';
import { FeatureState } from '../types';

/**
 * Asks the user if they want to initialize feature state in a directory and returns the initial
 * state
 *
 * @param configDir The directory path where feature state would be initialized
 * @returns A promise resolving to the feature state or null if the user cancels
 */
export async function initFeatureState(
  configDir: string,
  {
    confirmInit = confirmInitFeatureStatePrompt,
  }: { confirmInit?: typeof confirmInitFeatureStatePrompt } = {}
): Promise<FeatureState | null> {
  const shouldInitialize = await runPrompt(confirmInit, configDir);

  if (!shouldInitialize) {
    return null;
  }

  // Initialize with empty environments and features
  return {
    environments: {},
    features: {},
  };
}
