const inquirer = require('inquirer');

module.exports = async function selectExistingEnvironment(environments) {
  const { proceed } = await inquirer.prompt({
    message: `
💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥
Removing existing environments WILL break any production environments using this configuration.
Only proceed if the target environment is no longer active.

Continue?
💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥
`,
    name: 'proceed',
    type: 'confirm',
  });

  if (!proceed) {
    return null;
  }

  const { environmentName } = await inquirer.prompt({
    choices: environments,
    message: 'Select the environment you wish to modify',
    name: 'environmentName',
    type: 'list',
  });

  return environmentName;
};
