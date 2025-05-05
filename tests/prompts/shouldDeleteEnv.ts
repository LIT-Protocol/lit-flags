// shouldDeleteEnv.test.ts
import { render } from '@inquirer/testing';
import { confirm } from '@inquirer/prompts';
import { shouldDeleteEnvPrompt } from '../../src/prompts';
import { pressEnter } from './utils';

describe('shouldDeleteEnvPrompt', () => {
  it('should default to No when pressing Enter and show a warning message', async () => {
    // Get the config for the prompt
    const config = shouldDeleteEnvPrompt.getConfig();

    // Render the prompt
    const { answer, events, getScreen } = await render(confirm, config);

    // Check initial prompt
    expect(getScreen()).toContain(
      'Removing existing environments WILL break any production environments'
    );

    // Just press Enter (default to No)
    await pressEnter(events);

    // Verify the answer
    await expect(answer).resolves.toBe(false);
  });
});
