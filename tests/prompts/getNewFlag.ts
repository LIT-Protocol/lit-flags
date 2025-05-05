// getNewFlag.test.ts
import { render } from '@inquirer/testing';
import { input } from '@inquirer/prompts';
import { getNewFlagNamePrompt } from '../../src/prompts';
import { pressEnter, clearInput } from './utils';

describe('getNewFlagNamePrompt', () => {
  const existingFlagNames = ['EXISTING_FLAG', 'ANOTHER_FLAG'];

  it('should validate that flag name is unique', async () => {
    // Get the config for the prompt
    const config = getNewFlagNamePrompt.getConfig(existingFlagNames);

    // Render the prompt
    const { answer, events, getScreen } = await render(input, config);

    // Check initial prompt
    expect(getScreen()).toContain('Enter the name of the new flag');

    // Try an existing flag name
    const existingFlag = 'EXISTING_FLAG';
    events.type(existingFlag);
    expect(getScreen()).toContain('Enter the name of the new flag');
    expect(getScreen()).toContain(existingFlag);

    await pressEnter(events);

    expect(getScreen()).toContain(`${existingFlag} already exists!`);

    // Clear and try a valid flag name
    await clearInput(events, existingFlag);

    // Verify input is cleared
    const screenAfterClearing = getScreen();
    expect(screenAfterClearing).toContain('Enter the name of the new flag');
    expect(screenAfterClearing).not.toContain(existingFlag);

    const validFlag = 'NEW_FLAG_NAME';
    events.type(validFlag);
    expect(getScreen()).toContain(validFlag);

    await pressEnter(events);

    // Verify the answer
    await expect(answer).resolves.toBe(validFlag);
    expect(getScreen()).toContain(validFlag);
  });

  it('should validate that flag name follows screaming snake case', async () => {
    // Get the config for the prompt
    const config = getNewFlagNamePrompt.getConfig(existingFlagNames);

    // Render the prompt
    const { answer, events, getScreen } = await render(input, config);

    // Try an invalid format (lowercase)
    const invalidLowercaseFlag = 'invalid_flag_name';
    events.type(invalidLowercaseFlag);
    await pressEnter(events);

    expect(getScreen()).toContain(invalidLowercaseFlag);
    expect(getScreen()).toContain('Value must be in SCREAMING_SNAKE_CASE format');

    // Clear and try another invalid format (with spaces)
    await clearInput(events, invalidLowercaseFlag);

    const invalidSpacesFlag = 'INVALID FLAG NAME';
    events.type(invalidSpacesFlag);
    await pressEnter(events);

    expect(getScreen()).toContain(invalidSpacesFlag);
    expect(getScreen()).toContain('Value must be in SCREAMING_SNAKE_CASE format');

    // Clear and try a valid flag name
    await clearInput(events, invalidSpacesFlag);

    const validFlag = 'VALID_FLAG_NAME';
    events.type(validFlag);
    await pressEnter(events);

    // Verify the answer
    await expect(answer).resolves.toBe(validFlag);
    expect(getScreen()).toContain(validFlag);
  });
});
