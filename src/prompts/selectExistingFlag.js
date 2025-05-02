const inquirer = require('inquirer');

module.exports = async function selectExistingFlag(flagNames) {
  const { flagName } = await inquirer.prompt({
    choices: flagNames,
    message: 'Select the flag you wish to modify',
    name: 'flagName',
    type: 'list',
  });

  return flagName;
};
