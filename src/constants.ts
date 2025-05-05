export const ACTIONS = {
  ADD_ENVIRONMENT: 'add environment',
  ADD_FLAG: 'add flag',
  EDIT_FLAG: 'edit flag',
  REMOVE_ENVIRONMENT: 'delete environment',
  REMOVE_FLAG: 'delete flag',
};

// Choices when flags exist
export const FLAGS_EXIST_CHOICES = [
  { name: ACTIONS.ADD_FLAG, value: ACTIONS.ADD_FLAG },
  { name: ACTIONS.EDIT_FLAG, value: ACTIONS.EDIT_FLAG },
  { name: ACTIONS.REMOVE_FLAG, value: ACTIONS.REMOVE_FLAG },
  { name: ACTIONS.ADD_ENVIRONMENT, value: ACTIONS.ADD_ENVIRONMENT },
  { name: ACTIONS.REMOVE_ENVIRONMENT, value: ACTIONS.REMOVE_ENVIRONMENT },
];

// Choices when no flags exist
export const NO_FLAGS_CHOICES = [
  { name: ACTIONS.ADD_FLAG, value: ACTIONS.ADD_FLAG },
  { name: ACTIONS.ADD_ENVIRONMENT, value: ACTIONS.ADD_ENVIRONMENT },
  { name: ACTIONS.REMOVE_ENVIRONMENT, value: ACTIONS.REMOVE_ENVIRONMENT },
];

export const ACTIONS_REQUIRING_ENVIRONMENTS = [
  ACTIONS.ADD_FLAG,
  ACTIONS.EDIT_FLAG,
  ACTIONS.REMOVE_FLAG,
];
