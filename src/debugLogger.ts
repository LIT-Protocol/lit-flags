let ENABLE_DEBUG_LOGGING = false;

export const setDebugLogging = (enabled: boolean) => {
  ENABLE_DEBUG_LOGGING = enabled;
};

/** Logs debug information if debugging is enabled */
export function log(...args: unknown[]): void {
  if (ENABLE_DEBUG_LOGGING) {
    console.log(...args);
  }
}
