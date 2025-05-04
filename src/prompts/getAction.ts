import { rawlist } from '@inquirer/prompts';

import { ACTIONS } from '../constants';

export async function getAction(hasFlags: boolean): Promise<string> {
  const action = await rawlist<string>({
    choices: hasFlags
      ? [
          ACTIONS.ADD_FLAG,
          ACTIONS.EDIT_FLAG,
          ACTIONS.REMOVE_FLAG,
          ACTIONS.ADD_ENVIRONMENT,
          ACTIONS.REMOVE_ENVIRONMENT,
        ]
      : [ACTIONS.ADD_FLAG, ACTIONS.ADD_ENVIRONMENT, ACTIONS.REMOVE_ENVIRONMENT],
    message: 'What do you want to do?',
  });

  return action;
}
