// selectActionPrompt.test.ts
import { render } from '@inquirer/testing';
import { select } from '@inquirer/prompts';
import { selectActionPrompt } from '../../src/prompts';
import { pressEnter, navigateToOption } from './utils';
import { FLAGS_EXIST_CHOICES, NO_FLAGS_CHOICES } from '../../src/constants';

describe('selectActionPrompt', () => {
  it('should display choices for when flags exist', async () => {
    // Get the config for the prompt with flags
    const hasFlags = true;
    const config = selectActionPrompt.getConfig(hasFlags);

    // Render the prompt
    const { answer, events, getScreen } = await render(select, config);

    // Check initial prompt
    expect(getScreen()).toContain('What do you want to do?');

    // Verify all flag choices are displayed
    for (const choice of FLAGS_EXIST_CHOICES) {
      expect(getScreen()).toContain(choice.name);
    }

    // Select the first choice
    const firstChoiceIndex = 0;
    await navigateToOption(events, firstChoiceIndex);
    await pressEnter(events);

    // Verify the answer
    await expect(answer).resolves.toBe(FLAGS_EXIST_CHOICES[firstChoiceIndex].value);
  });

  it('should display choices for when no flags exist', async () => {
    // Get the config for the prompt with no flags
    const hasFlags = false;
    const config = selectActionPrompt.getConfig(hasFlags);

    // Render the prompt
    const { answer, events, getScreen } = await render(select, config);

    // Check initial prompt
    expect(getScreen()).toContain('What do you want to do?');

    // Verify all no-flags choices are displayed
    for (const choice of NO_FLAGS_CHOICES) {
      expect(getScreen()).toContain(choice.name);
    }

    // Select the first choice
    const firstChoiceIndex = 0;
    await navigateToOption(events, firstChoiceIndex);
    await pressEnter(events);

    // Verify the answer
    await expect(answer).resolves.toBe(NO_FLAGS_CHOICES[firstChoiceIndex].value);
  });

  it('should allow selecting any option when flags exist', async () => {
    const hasFlags = true;

    // Test selecting each option in the list
    for (let i = 0; i < FLAGS_EXIST_CHOICES.length; i++) {
      const config = selectActionPrompt.getConfig(hasFlags);
      const { answer, events, getScreen } = await render(select, config);

      // Navigate to the option at index i
      await navigateToOption(events, i);
      await pressEnter(events);

      // Verify the selected option
      await expect(answer).resolves.toBe(FLAGS_EXIST_CHOICES[i].value);
    }
  });

  it('should allow selecting any option when no flags exist', async () => {
    const hasFlags = false;

    // Test selecting each option in the list
    for (let i = 0; i < NO_FLAGS_CHOICES.length; i++) {
      const config = selectActionPrompt.getConfig(hasFlags);
      const { answer, events, getScreen } = await render(select, config);

      // Navigate to the option at index i
      await navigateToOption(events, i);
      await pressEnter(events);

      // Verify the selected option
      await expect(answer).resolves.toBe(NO_FLAGS_CHOICES[i].value);
    }
  });
});
