// getNewEnvName.test.ts
import { render } from '@inquirer/testing';
import { input } from '@inquirer/prompts';
import { getNewEnvNamePrompt } from '../../src/prompts';
import { pressEnter, clearInput } from './utils';

describe('getNewEnvNamePrompt', () => {
  const existingEnvironments = ['DEV', 'STAGING', 'PROD'];

  it('should validate that environment name is unique', async () => {
    // Get the config for the prompt
    const config = getNewEnvNamePrompt.getConfig(existingEnvironments);

    // Render the prompt
    const { answer, events, getScreen } = await render(input, config);

    // Check initial prompt
    expect(getScreen()).toContain('Enter the name of the new environment');

    // Try an existing environment name
    const existingEnv = 'DEV';
    events.type(existingEnv);
    expect(getScreen()).toContain('Enter the name of the new environment');
    expect(getScreen()).toContain(existingEnv);

    await pressEnter(events);

    expect(getScreen()).toContain(`${existingEnv} already exists!`);

    // Clear and try a valid environment name
    await clearInput(events, existingEnv);

    // Verify input is cleared
    const screenAfterClearing = getScreen();
    expect(screenAfterClearing).toContain('Enter the name of the new environment');
    expect(screenAfterClearing).not.toContain(existingEnv);

    const validEnv = 'NEW_ENV';
    events.type(validEnv);
    expect(getScreen()).toContain(validEnv);

    await pressEnter(events);

    // Verify the answer
    await expect(answer).resolves.toBe(validEnv);
    expect(getScreen()).toContain(validEnv);
  });

  it('should validate that environment name follows screaming snake case', async () => {
    // Get the config for the prompt
    const config = getNewEnvNamePrompt.getConfig(existingEnvironments);

    // Render the prompt
    const { answer, events, getScreen } = await render(input, config);

    // Try an invalid format (lowercase)
    const invalidLowercaseEnv = 'invalid_env_name';
    events.type(invalidLowercaseEnv);
    await pressEnter(events);

    expect(getScreen()).toContain(invalidLowercaseEnv);
    expect(getScreen()).toContain('Value must be in SCREAMING_SNAKE_CASE format');

    // Clear and try another invalid format (with spaces)
    await clearInput(events, invalidLowercaseEnv);

    const invalidSpacesEnv = 'INVALID ENV NAME';
    events.type(invalidSpacesEnv);
    await pressEnter(events);

    expect(getScreen()).toContain(invalidSpacesEnv);
    expect(getScreen()).toContain('Value must be in SCREAMING_SNAKE_CASE format');

    // Clear and try a valid environment name
    await clearInput(events, invalidSpacesEnv);

    const validEnv = 'VALID_ENV_NAME';
    events.type(validEnv);
    await pressEnter(events);

    // Verify the answer
    await expect(answer).resolves.toBe(validEnv);
    expect(getScreen()).toContain(validEnv);
  });

  it('should allow an empty list of existing environments', async () => {
    // Get the config for the prompt with empty array
    const config = getNewEnvNamePrompt.getConfig([]);

    // Render the prompt
    const { answer, events, getScreen } = await render(input, config);

    // Check initial prompt
    expect(getScreen()).toContain('Enter the name of the new environment');

    // Type a valid environment name
    const validEnv = 'FIRST_ENV';
    events.type(validEnv);
    await pressEnter(events);

    // Verify the answer
    await expect(answer).resolves.toBe(validEnv);
    expect(getScreen()).toContain(validEnv);
  });
});
