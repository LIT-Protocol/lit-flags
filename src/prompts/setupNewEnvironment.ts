import { input, rawlist } from '@inquirer/prompts';

import { isValidScreamingSnakeCase } from '../isValidScreamingSnakeCase';

interface NewEnvironmentSetup {
  environmentName: string;
  sourceEnvironment: string;
}

export async function setupNewEnvironment(
  existingEnvironments: string[]
): Promise<NewEnvironmentSetup> {
  const environmentName = await input({
    message: 'Enter the name of the new environment',
    validate: (value) => {
      if (existingEnvironments.includes(value)) {
        return `${value} already exists!`;
      }

      const { errorMessage, isValid } = isValidScreamingSnakeCase(value);

      if (!isValid) {
        return errorMessage;
      }

      return true;
    },
  });

  const sourceEnvironment = await rawlist<string>({
    choices: existingEnvironments,
    message: 'Select the environment from which to copy existing states',
  });

  return { environmentName, sourceEnvironment };
}
