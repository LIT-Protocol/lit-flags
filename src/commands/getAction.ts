import { selectActionPrompt, runPrompt } from '../prompts';

export async function getAction(
  hasFlags: boolean,
  { selectAction = selectActionPrompt }: { selectAction?: typeof selectActionPrompt } = {}
): Promise<string> {
  return runPrompt(selectAction, hasFlags);
}
