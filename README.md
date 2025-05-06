# LIT Feature Flags

This is a fork of
[NEAR Wallet Feature Flags](https://www.npmjs.com/package/@near-wallet/feature-flags/v/0.1.0?activeTab=readme)
with modernization and other enhancements.

Primary differences from the @near-wallet/feature-flags are:

- Re-written in Typescript; both `cjs` and `mjs` exports
- CLI is bundled, which makes the package a zero dependency package! The imported interface is under
  1kb uncompressed and unminified. :)
- No longer requires `binstall` command
  - You can run it directly using `pnpx @lit-protocol/flags` or after installing the package
    `pnpm lit-flags`
- Bugfixes around handling adding first environments and removing the last
- Typescript-first emit support!
  - Previously, a `.d.ts` file was emitted to type the JSON features file keys - now the default
    behaviour is to emit a .ts file
  - You can still use this with plain js codebases by running the editor with `--jsCompat` arg
- Added `list` functionality that shows flags and their status per-env in a table
- Explicit command-line argument for target directory (no 'magic' discovery of target directory)
- Simplified data model -- flag and environment state is stored in a single file
- Quality of life improvements in the prompting model, and a new initialization prompt that helps
  you get started without manually creating target json files.

Feature flags serve as code guards around functionality being implemented, enabling developers to
iterate on more complex features while still being able to deploy small changes. Feature flags are
enabled per environment, allowing finer granularity on how the functionality is rolled out.

# Getting started

Modifying feature flags is done by running `lit-flags using your package manager

```zsh
pnpm add @lit-protocol/flags
pnpm lit-flags --configPath=<path_to_feature_state_dir>
```

It is strongly recommended that you create an empty directory to target the tool at. When run for
the first time, you will be prompted to initialize the featureState.json file in the target
directory and define your first environment.

On subsequent runs, you can...

- Create a new feature flag and set the environments in which it should be enabled.
- Modify the environments that an existing feature flag is enabled in
- Define a new environment. You will be prompted for the environment to copy flag states from.
- Deleting an existing feature flag.
- Deleting an existing environment.
- Displaying a list of all feature flags and their enabled status per environment in a table.

## NOTE: `lit-flags` writes additional helpful metadata to the featuresState.json file, and synchronizes a type file with the flags that you define. You should never edit the json state file or typedefs manually.

# Using Feature Flags

This tool will manage a featureState.json file, and create a types file that is designed to be used
with the output from the `getFeatureFlags()` function of this package.

You will need to create a small shim file in your codebase that:

1. Loads the flag state from the json file and passes it into the getFeatureFlags() function
2. Identifies what environment your code is running from. This is typically done by loading it from
   process.env variable. See below under 'Example Configuration'.

## Typescript vs. JS Projects

The default configuration for this tool assumes you are using a Typescript project. It emits a
`features.ts` file for the proxy features object, which ensures you have type-safe access to your
feature state.

If you are working in a plain Javascript project, you can still get type-safe references to your
flags! Just pass `--jsCompat` to the `lit-flags` editor tool, which will cause it to emit a
`features.d.ts` file instead.

# Example Configuration

The following outlines initial example templates for the required files mentioned above. This code
is required to correctly set up the `Features` proxy object for use in a project. Note that the
exact content of this file will vary depending on your project configuration and tooling (e.g.
loading json files may be done differently for you!).

## features/features.js

#### Typescript

```ts
import { getFeatureFlags } from '@lit-protocol/flags';

import Flags from './featureState.json';
import type { Features } from './features';

const envVarName = 'LIT_FEATURE_ENV';

const Features = getFeatureFlags({
  envVarName,
  featureState: Flags,
}) as Features;

export { Features };
```

#### Javascript (use --jsCompat argument to get a .d.ts file for your types)

```ts
// This file _must_ be `features.js` so that the `.d.ts` file we generate in compat mode maps to this file's export!
const { initFeatureFlags } = require('@lit-protocol/flags');

import Flags from './featureState.json';

const envVarName = 'LIT_FEATURE_ENV';

const Features = getFeatureFlags({
  envVarName,
  featureState: Flags,
});

module.exports = {
  Features,
};
```
