import {} from '@lit-protocol/flags';

import Environments from './environments.json';
import Flags from './flags.json';

const envVarName = 'LIT_FEATURE_ENV';

const Features = {
  envVarName,
  environments: Environments,
  flagState: Flags,
};

module.exports = {
  Features,
};
