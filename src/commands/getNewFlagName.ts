import { getNewFlagNamePrompt, runPrompt } from '../prompts';

export async function getNewFlagName(
  existingFlagNames: string[],
  {
    collectNewFlagName = getNewFlagNamePrompt,
  }: { collectNewFlagName?: typeof getNewFlagNamePrompt } = {}
): Promise<string> {
  return runPrompt(collectNewFlagName, existingFlagNames);
}
