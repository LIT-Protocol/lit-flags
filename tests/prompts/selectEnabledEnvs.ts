// selectEnabledEnvs.test.ts
import { render } from '@inquirer/testing';
import { checkbox } from '@inquirer/prompts';
import { selectEnabledEnvsPrompt } from '../../src/prompts';
import { pressEnter, navigateToOption } from './utils';

describe('selectEnabledEnvsPrompt', () => {
  const environments = {
    DEV: 'development',
    STAGING: 'staging',
    PROD: 'production',
  };

  // Create a properly formatted flag entry with all required properties
  const createFlagEntry = (envConfig: Record<string, { enabled: boolean }>) => {
    return {
      ...envConfig,
      createdAt: new Date().toISOString(),
      createdBy: 'test-user',
    };
  };

  it('should display all environments as options', async () => {
    // Get the config for the prompt without a flag entry (no pre-checked options)
    const config = selectEnabledEnvsPrompt.getConfig({ environments });

    // Render the prompt
    const { answer, events, getScreen } = await render(checkbox, config);

    // Check initial prompt
    expect(getScreen()).toContain('Select the environments you want this flag enabled in');

    // Verify all environments are displayed
    for (const env of Object.values(environments)) {
      expect(getScreen()).toContain(env);
    }

    // Select the first environment
    events.keypress('space');
    await Promise.resolve();

    // Navigate to the second environment
    events.keypress('down');
    await Promise.resolve();

    // Select the second environment
    events.keypress('space');
    await Promise.resolve();

    // Submit the selections
    await pressEnter(events);

    // Verify the answer includes the selected environments
    await expect(answer).resolves.toEqual([environments.DEV, environments.STAGING]);
  });

  it('should pre-check environments that are already enabled', async () => {
    // Create a flag entry with some environments enabled
    const flagEntry = createFlagEntry({
      [environments.DEV]: { enabled: true },
      [environments.STAGING]: { enabled: false },
      [environments.PROD]: { enabled: true },
    });

    // Get the config for the prompt with the flag entry
    const config = selectEnabledEnvsPrompt.getConfig({
      environments,
      flagEntry,
    });

    // Render the prompt
    const { answer, events, getScreen } = await render(checkbox, config);

    // Submit without changing any selections
    await pressEnter(events);

    // Verify the answer includes only the pre-enabled environments
    await expect(answer).resolves.toEqual([environments.DEV, environments.PROD]);
  });

  it('should allow toggling the enabled state of environments', async () => {
    // Create a flag entry with some environments enabled
    const flagEntry = createFlagEntry({
      [environments.DEV]: { enabled: true },
      [environments.STAGING]: { enabled: false },
      [environments.PROD]: { enabled: true },
    });

    // Get the config for the prompt with the flag entry
    const config = selectEnabledEnvsPrompt.getConfig({
      environments,
      flagEntry,
    });

    // Render the prompt
    const { answer, events, getScreen } = await render(checkbox, config);

    // Toggle the first environment (DEV) off
    events.keypress('space');
    await Promise.resolve();

    // Navigate to the second environment (STAGING)
    events.keypress('down');
    await Promise.resolve();

    // Toggle the second environment (STAGING) on
    events.keypress('space');
    await Promise.resolve();

    // Submit the selections
    await pressEnter(events);

    // Verify the answer reflects our changes
    await expect(answer).resolves.toEqual([environments.STAGING, environments.PROD]);
  });

  it('should handle an empty environments object gracefully', async () => {
    // In the real application, this code path shouldn't be reached
    // because we check for empty environments before showing this prompt.
    // This test just verifies the prompt configuration doesn't throw errors
    const emptyEnvironments = {};

    // Just verify getConfig doesn't throw an error
    expect(() => {
      selectEnabledEnvsPrompt.getConfig({ environments: emptyEnvironments });
    }).not.toThrow();

    // Note: We're not rendering the prompt because Inquirer can't handle
    // an empty choices array properly. The application logic prevents
    // this situation from occurring.
  });
});
