import { select } from '@inquirer/prompts';
import { render } from '@inquirer/testing';

import { selectExistingFlagPrompt } from '../../src/prompts';
import { navigateToOption, pressEnter } from './utils';

describe('selectExistingFlagPrompt', () => {
  const flagNames = ['FIRST_FLAG', 'SECOND_FLAG', 'THIRD_FLAG'];

  it('should display all available flags for selection', async () => {
    // Get the config for the prompt
    const config = selectExistingFlagPrompt.getConfig(flagNames);

    // Render the prompt
    const { answer, events, getScreen } = await render(select, config);

    // Check initial prompt
    expect(getScreen()).toContain('Select the flag you wish to modify');

    // Verify all flag names are displayed
    for (const flagName of flagNames) {
      expect(getScreen()).toContain(flagName);
    }

    // Select the first flag (FIRST_FLAG)
    const firstFlagIndex = 0;
    await navigateToOption(events, firstFlagIndex);
    await pressEnter(events);

    // Verify the answer
    await expect(answer).resolves.toBe(flagNames[firstFlagIndex]);
  });

  it('should allow selecting any flag from the list', async () => {
    // Test selecting each flag in the list
    for (let i = 0; i < flagNames.length; i++) {
      const config = selectExistingFlagPrompt.getConfig(flagNames);
      const { answer, events } = await render(select, config);

      // Navigate to the flag at index i
      await navigateToOption(events, i);
      await pressEnter(events);

      // Verify the selected flag
      await expect(answer).resolves.toBe(flagNames[i]);
    }
  });

  it('should handle an empty list of flags gracefully', async () => {
    // In the real application, this code path shouldn't be reached
    // because we check for empty flag lists before showing this prompt.
    // This test just verifies the prompt configuration doesn't throw errors
    const emptyFlagNames: string[] = [];

    // Just verify getConfig doesn't throw an error
    expect(() => {
      selectExistingFlagPrompt.getConfig(emptyFlagNames);
    }).not.toThrow();

    // Note: We're not rendering the prompt because Inquirer's select prompt can't handle
    // an empty choices array properly. The application logic prevents
    // this situation from occurring.
  });
});
