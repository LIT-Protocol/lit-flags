import yargs from 'yargs';

import { createEditorInstance } from '../createEditorInstance';
const { jsCompat } = yargs(process.argv.slice(2))
  .options({
    jsCompat: {
      default: false,
      description: 'Enable JavaScript compatibility mode',
      type: 'boolean',
    },
  })
  .version()
  .help()
  .parseSync();

if (!jsCompat) {
  console.log('Running in Typescript-enabled mode. Feature types will be emitted as a .ts file');
} else {
  console.log('Running in vanilla Havascript mode. Feature types will be emitted as a .d.ts file');
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
createEditorInstance(!jsCompat);
