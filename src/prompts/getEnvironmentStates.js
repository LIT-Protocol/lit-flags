const inquirer = require('inquirer');

module.exports = async function getEnvironmentStates({ environments, flagEntry }) {
  const choices = [];

  Object.values(environments).forEach((name) => {
    choices.push({
      name,
      checked: (flagEntry && flagEntry[name] && !!flagEntry[name].enabled) || false,
    });
  });

  const { flagStateByEnvironment } = await inquirer.prompt({
    choices,
    message: 'Select the environments you want this flag enabled in',
    name: 'flagStateByEnvironment',
    type: 'checkbox',
  });

  return flagStateByEnvironment;
};
