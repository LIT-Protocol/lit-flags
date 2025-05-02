const inquirer = require('inquirer');

module.exports = async function newFlagName(existingFlagNames) {
  const { flagName } = await inquirer.prompt({
    message: 'Enter the name of the new flag',
    name: 'flagName',
    type: 'input',
    validate: (value) => {
      if (existingFlagNames.includes(value)) {
        throw new Error(`${value} already exists!`);
      }
      return true;
    },
  });

  return flagName;
};
