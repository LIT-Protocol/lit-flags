import { enterNewFlagName } from './enterNewFlagName';
import { getAction } from './getAction';
import { getEnabledEnvironments } from './getEnabledEnvironments';
import { selectEnvironmentForDeletion } from './selectEnvironmentForDeletion';
import { selectExistingFlag } from './selectExistingFlag';
import { setupNewEnvironment } from './setupNewEnvironment';

// Export all the prompt functions
export {
  getAction,
  enterNewFlagName,
  getEnabledEnvironments,
  selectEnvironmentForDeletion,
  selectExistingFlag,
  setupNewEnvironment,
};

// Create and export a type definition based on this module's exports
export type Prompts = {
  enterNewFlagName: typeof enterNewFlagName;
  getAction: typeof getAction;
  getEnabledEnvironments: typeof getEnabledEnvironments;
  selectEnvironmentForDeletion: typeof selectEnvironmentForDeletion;
  selectExistingFlag: typeof selectExistingFlag;
  setupNewEnvironment: typeof setupNewEnvironment;
};
