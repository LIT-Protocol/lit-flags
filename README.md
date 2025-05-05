# LIT Feature Flags

This is a fork of [NEAR Wallet Feature Flags](@near-wallet/feature-flags) with modernization and
other enhancements (no more global binary binstall)!

Feature flags serve as code guards around functionality being implemented, enabling developers to
iterate on more complex features while still being able to deploy small changes. Feature flags are
enabled per environment, allowing finer granularity on how the functionality is rolled out.

# Getting started

Modifying feature flags is done by running `lit-flags using your package manager

```zsh
pnpm add @lit-protocol/flags
pnpm lit-flags
```

Running the flag tool prompts the user for the intended action, currently one of:

- Creating a new feature flag and setting the environments in which it should be enabled.
- Modifying an existing feature flag to be enabled or disabled in the desired environments.
- Deleting an existing feature flag.

Running the `@lit-protocol/flags` tool requires a `features/` directory along the current path, the
closest of which will be used by the binary.

## NOTE: `lit-flags` is responsible for both generating and modifying files in this directory, so it is crucial that no changes are made to this directory's contents outside the `@lit-protocol/flags` tool once configured.

# Using Feature Flags

In order to use this package, a `features/` directory must be created at the appropriate level (e.g.
the project root) with the following files:

- `environments.json`: The valid environments for the application, in the form of
  `"ENV_NAME": "env_value"`.
- `flags.json`: The set of flags enabled per environment. During initial configuration this should
  be an empty JSON file.
- `features.ts`: Module responsible for initializing and exporting the feature flags for use in the
  target project.

The `features.ts` module is responsible for initializing the proxy object via the `getFeatureFlags`
method exported from this package. This method requires three parameters:

- `currentEnvironment`: The environment against which flags should be validated. The provided value
  must be a valid value in `environments.json` or an exception will be thrown.
- `environments`: The set of valid environments, specified in `environments.json`.
- `flagState`: The set of defined feature flags, specified in `flags.json`.

Once configured, the proxy object returned from `getFeatureFlags` is used to check the state of a
feature by referring to the flag name, e.g. `const isFeatureXEnabled = Features.FEATURE_X`. The
proxy object will throw an exception if the flag does not exist.

## Typescript vs. JS Projects

The default configuration for this tool assumes you are using a Typescript project. It emits a
`features.ts` file every time you work with feature flags, which ensures you have type-safe access
to your feature.

If you are working in a plain Javascript project, you can still get type-safe references to your
flags! Just pass `--jsCompat` to the `lit-flags` editor tool, which will cause it to emit a
`features.d.ts` file instead.

# Examples

The following outlines initial example templates for the required files mentioned above. This code
is required to correctly set up the `Features` proxy object for use in a project. Note that
depending on your project, you may need a different `features.js` file.

#### features/environments.json

```json
{
  "LOCALDEV": "development",
  "PREVIEW": "testnet",
  "PRODUCTION": "mainnet"
}
```

#### features/flags.json

```json
{}
```

#### features/features.js

```ts
import { getFeatureFlags } from '@lit-protocol/flags';

import Environments from './environments.json';
import Flags from './flags.json';
import type { Features } from './features';

const envVarName = 'LIT_FEATURE_ENV';

const Features = getFeatureFlags({
  envVarName,
  environments: Environments,
  flagState: Flags,
}) as Features;

export { Features };
```
