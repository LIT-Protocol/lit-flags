// selectEnvForDeletion.test.ts
import { render } from '@inquirer/testing';
import { select } from '@inquirer/prompts';
import { selectEnvForDeletionPrompt } from '../../src/prompts';
import { pressEnter, navigateToOption } from './utils';

describe('selectEnvForDeletionPrompt', () => {
  const environments = {
    DEV: 'development',
    STAGING: 'staging',
    PROD: 'production',
  };

  it('should display all available environments for selection', async () => {
    // Get the config for the prompt
    const config = selectEnvForDeletionPrompt.getConfig(environments);

    // Render the prompt
    const { answer, events, getScreen } = await render(select, config);

    // Check initial prompt
    expect(getScreen()).toContain('Select the environment you wish to modify');

    // Verify all environment names are displayed
    for (const [key, value] of Object.entries(environments)) {
      expect(getScreen()).toContain(key);
    }

    // Select the first environment (DEV)
    const firstEnvIndex = 0;
    await navigateToOption(events, firstEnvIndex);
    await pressEnter(events);

    // Verify the answer
    await expect(answer).resolves.toBe(environments.DEV);
  });

  it('should allow selecting any environment from the list', async () => {
    // Get the config for the prompt
    const config = selectEnvForDeletionPrompt.getConfig(environments);

    // Render the prompt
    const { answer, events, getScreen } = await render(select, config);

    // Check initial prompt
    expect(getScreen()).toContain('Select the environment you wish to modify');

    // Select the last environment (PROD)
    const lastEnvIndex = Object.keys(environments).length - 1;
    await navigateToOption(events, lastEnvIndex);
    await pressEnter(events);

    // Verify the answer
    await expect(answer).resolves.toBe(environments.PROD);
  });

  it('should handle an empty environments object gracefully', async () => {
    // In the real application, this code path shouldn't be reached
    // because we check for empty environments before showing this prompt.
    // This test just verifies the prompt configuration doesn't throw errors
    const emptyEnvironments = {};

    // Just verify getConfig doesn't throw an error
    expect(() => {
      selectEnvForDeletionPrompt.getConfig(emptyEnvironments);
    }).not.toThrow();

    // Note: We're not rendering the prompt because Inquirer can't handle
    // an empty choices array properly. The application logic prevents
    // this situation from occurring.
  });
});
