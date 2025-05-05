// selectSourceEnv.test.ts
import { render } from '@inquirer/testing';
import { select } from '@inquirer/prompts';
import { selectSourceEnvPrompt } from '../../src/prompts';
import { pressEnter, navigateToOption } from './utils';

describe('selectSourceEnvPrompt', () => {
  const existingEnvironments = ['DEV', 'STAGING', 'PROD'];

  it('should display all existing environments for selection', async () => {
    // Get the config for the prompt
    const config = selectSourceEnvPrompt.getConfig(existingEnvironments);

    // Render the prompt
    const { answer, events, getScreen } = await render(select, config);

    // Check initial prompt
    expect(getScreen()).toContain('Select environment to use as a source:');

    // Verify all environments are displayed
    for (const env of existingEnvironments) {
      expect(getScreen()).toContain(env);
    }

    // Select the first environment
    const firstEnvIndex = 0;
    await navigateToOption(events, firstEnvIndex);
    await pressEnter(events);

    // Verify the answer
    await expect(answer).resolves.toBe(existingEnvironments[firstEnvIndex]);
  });

  it('should allow selecting any environment from the list', async () => {
    // Test selecting each environment in the list
    for (let i = 0; i < existingEnvironments.length; i++) {
      const config = selectSourceEnvPrompt.getConfig(existingEnvironments);
      const { answer, events, getScreen } = await render(select, config);

      // Navigate to the environment at index i
      await navigateToOption(events, i);
      await pressEnter(events);

      // Verify the selected environment
      await expect(answer).resolves.toBe(existingEnvironments[i]);
    }
  });

  it('should handle an empty list of environments gracefully', async () => {
    // In the real application, this code path shouldn't be reached
    // because we check for empty environments before showing this prompt.
    // This test just verifies the prompt configuration doesn't throw errors
    const emptyEnvironments: string[] = [];

    // Just verify getConfig doesn't throw an error
    expect(() => {
      selectSourceEnvPrompt.getConfig(emptyEnvironments);
    }).not.toThrow();

    // Note: We're not rendering the prompt because Inquirer's select prompt can't handle
    // an empty choices array properly. The application logic prevents
    // this situation from occurring.
  });
});
