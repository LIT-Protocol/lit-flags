---
'@lit-protocol/flags': major
---

Simplify state management

- Removed 'magic' discovery of features location based on a magic string directory name This has
  been replaced with an explicit command-line argument: --configPath=

- Combined flags.json and environments.json into a single json file for simplicity. Now there is
  only a featureState.json and, and an associated `features.ts` or `features.d.ts` in jsCompat mode.

- Added prompt to initialize the target directory if there is no `featureState.json` located there.
  If you choose to initialize the state, you will immediately be prompted to create your first
  environment or flag.
