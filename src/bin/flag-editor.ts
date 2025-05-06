import yargs from 'yargs';

import { createEditorInstance } from '../createEditorInstance';
import { setDebugLogging } from '../debugLogger';
import { Config } from '../types';

// Parse command line arguments with yargs
const argv = yargs(process.argv.slice(2))
  .options({
    configPath: {
      description: 'Path to the config directory where you want to store your feature flags',
      required: true,
      type: 'string',
    },
    enableDebugLogging: {
      default: false,
      description: 'Enable debug logging',
      type: 'boolean',
    },
    jsCompat: {
      default: false,
      description: 'Enable JavaScript compatibility mode',
      type: 'boolean',
    },
  })
  .version()
  .help()
  .parseSync();

const userConfig: Config = {
  CONFIG_PATH: argv.configPath,
  ENABLE_DEBUG_LOGGING: argv.enableDebugLogging,
  JS_COMPATIBILITY: argv.jsCompat,
};

setDebugLogging(userConfig.ENABLE_DEBUG_LOGGING);

if (!argv.jsCompat) {
  console.log('Running in Typescript-enabled mode. Feature types will be emitted as a .ts file');
} else {
  console.log('Running in vanilla Havascript mode. Feature types will be emitted as a .d.ts file');
}

// Pass the configuration to the editor instance
// eslint-disable-next-line @typescript-eslint/no-floating-promises
createEditorInstance(!argv.jsCompat, userConfig);
