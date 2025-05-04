declare module 'parse-git-config' {
  interface ParseGitConfigOptions {
    cwd?: string;
    path?: string;
    type?: string;
    include?: boolean;
    expandKeys?: boolean;
  }

  interface ParseGitConfig {
    /**
     * Asynchronously parse a .git/config file
     *
     * @param options Options with cwd or path, or the callback function
     * @param callback Callback function if the first argument is options
     */
    (options?: ParseGitConfigOptions | Function, callback?: Function): any;

    /**
     * Promise-based version of parse
     *
     * @param options Options with cwd or path
     */
    promise(options?: ParseGitConfigOptions): Promise<any>;

    /**
     * Synchronously parse a .git/config file
     *
     * @param options Options with cwd or path, or the cwd to use
     */
    sync(options?: ParseGitConfigOptions | string): any;

    /**
     * Resolve the git config path
     *
     * @param options Options with cwd or path, or the type string
     */
    resolveConfigPath(options?: ParseGitConfigOptions | string): string | null;

    /** Deprecated: use .resolveConfigPath instead */
    resolve(options?: ParseGitConfigOptions | string): string | null;

    /**
     * Returns an object with only the properties that had ini-style keys converted to objects
     *
     * @param config The parsed git config object
     */
    expandKeys(config: any): any;
  }

  const parse: ParseGitConfig;
  export = parse;
}
