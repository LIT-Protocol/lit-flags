import environments from '../features/environments.json';
import flags from '../features/flags.json';
import { FlagEditor } from '../src/FlagEditor';
import * as prompts from '../src/prompts';

describe('flag editor works', () => {
  it('should initialize with existing flags', () => {
    const flagEditor = new FlagEditor({
      environments,
      prompts,
      flagsState: flags,
      userEditing: 'Test Harness',
    });

    expect(flagEditor).toBeTruthy();
  });
});
