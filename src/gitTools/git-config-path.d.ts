declare module 'git-config-path' {
  interface GitConfigPathOptions {
    type?: 'global' | string;
    cwd?: string;
  }

  /**
   * Returns the path to a git config file
   *
   * @param type Optional type of config ('global' or other)
   * @param options Additional options
   * @returns Path to the git config file, or null if it doesn't exist
   */
  function gitConfigPath(
    type?: string | GitConfigPathOptions,
    options?: GitConfigPathOptions
  ): string | null;

  export = gitConfigPath;
}
