const inquirer = require('inquirer');

module.exports = async function setupNewEnvironment(existingEnvironments) {
  const { environmentName } = await inquirer.prompt({
    message: 'Enter the name of the new environment',
    name: 'environmentName',
    type: 'input',
    validate: (value) => {
      if (existingEnvironments.includes(value)) {
        throw new Error(`${value} already exists!`);
      }
      return true;
    },
  });

  const { sourceEnvironment } = await inquirer.prompt({
    choices: existingEnvironments,
    message: 'Select the environment from which to copy existing states',
    name: 'sourceEnvironment',
    type: 'list',
  });

  return { environmentName, sourceEnvironment };
};
