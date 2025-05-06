# @lit-protocol/flags

## 2.0.0

### Major Changes

- [#12](https://github.com/LIT-Protocol/lit-flags/pull/12)
  [`3ffcc43`](https://github.com/LIT-Protocol/lit-flags/commit/3ffcc43ba8403ab924434efceb557f1fd6bb7648)
  Thanks [@MaximusHaximus](https://github.com/MaximusHaximus)! - Simplify state management

  - Removed 'magic' discovery of features location based on a magic string directory name This has
    been replaced with an explicit command-line argument: --configPath=
  - Combined flags.json and environments.json into a single json file for simplicity. Now there is
    only a featureState.json and, and an associated `features.ts` or `features.d.ts` in jsCompat
    mode.
  - Added prompt to initialize the target directory if there is no `featureState.json` located
    there. If you choose to initialize the state, you will immediately be prompted to create your
    first environment or flag.

## 1.0.5

### Patch Changes

- [#8](https://github.com/LIT-Protocol/lit-flags/pull/8)
  [`a58dc53`](https://github.com/LIT-Protocol/lit-flags/commit/a58dc53e68c80f43e74913c0e3a0944e195ff397)
  Thanks [@MaximusHaximus](https://github.com/MaximusHaximus)! - ci: Test publishing

## 1.0.4

### Patch Changes

- [#2](https://github.com/LIT-Protocol/lit-flags/pull/2)
  [`677055d`](https://github.com/LIT-Protocol/lit-flags/commit/677055d0c7196b8a3112e74956f5fa64d3d847ce)
  Thanks [@MaximusHaximus](https://github.com/MaximusHaximus)! - Add tests for flag entry mutations
