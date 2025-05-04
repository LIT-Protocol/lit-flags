declare namespace gitUserName {
  interface Options {
    [key: string]: any;
    cwd?: string;
    gitconfig?: {
      [key: string]: any;
      type?: 'global' | string;
    };
    path?: string;
  }
}

/**
 * Get the git user's name from git config
 *
 * @param options Configuration options
 * @returns The git user's name, or null if not found
 */
declare function gitUserName(options?: gitUserName.Options): string | null;

export = gitUserName;
