import { getNewEnvNamePrompt, runPrompt, selectSourceEnvPrompt } from '../prompts';

interface NewEnvironmentSetup {
  environmentName: string;
  sourceEnvironment: null | string;
}

export async function createNewEnv(
  existingEnvironments: string[],
  {
    getEnvName = getNewEnvNamePrompt,
    getSourceEnvironment = selectSourceEnvPrompt,
  }: {
    getEnvName?: typeof getNewEnvNamePrompt;
    getSourceEnvironment?: typeof selectSourceEnvPrompt;
  } = {}
): Promise<NewEnvironmentSetup> {
  // Use the prompt objects directly without destructuring
  const environmentName = await runPrompt(getEnvName, existingEnvironments);

  // Only prompt for source environment if there are existing environments
  const sourceEnvironment =
    existingEnvironments.length > 0
      ? await runPrompt(getSourceEnvironment, existingEnvironments)
      : null;

  return { environmentName, sourceEnvironment };
}
