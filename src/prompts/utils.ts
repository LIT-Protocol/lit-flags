import { Prompt } from './types';

export function createPrompt<T, ConfigArgs extends any[] = any[]>(promptObj: {
  getConfig: (...args: ConfigArgs) => any;
  prompt: (config: ReturnType<typeof promptObj.getConfig>) => Promise<T>;
}): Prompt<T, ConfigArgs> {
  return promptObj;
}

export function runPrompt<T, Args extends any[]>(
  prompt: Prompt<T, Args>,
  ...args: Args
): Promise<T> {
  return prompt.prompt(prompt.getConfig(...args));
}
