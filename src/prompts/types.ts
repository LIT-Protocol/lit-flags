export interface Prompt<T, ConfigArgs extends any[] = any[]> {
  getConfig: (...args: ConfigArgs) => any;
  prompt: (config: ReturnType<Prompt<T, ConfigArgs>['getConfig']>) => Promise<T>;
}
