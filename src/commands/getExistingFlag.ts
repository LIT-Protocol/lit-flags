import { runPrompt, selectExistingFlagPrompt } from '../prompts';

export async function getExistingFlag(
  flagNames: string[],
  {
    selectExistingFlag = selectExistingFlagPrompt,
  }: { selectExistingFlag?: typeof selectExistingFlagPrompt } = {}
): Promise<string> {
  return runPrompt(selectExistingFlag, flagNames);
}
