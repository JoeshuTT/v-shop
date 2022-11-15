interface ImportMetaEnv extends Readonly<Record<string, string>> {
  readonly VITE_APP_TITLE: string;
  readonly VITE_PORT: number;
  readonly VITE_APP_ENV: 'dev' | 'test' | 'pre' | 'prd';
  readonly VITE_APP_API_HOST: string;
  // 更多环境变量...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// __APP_INFO__
const __APP_INFO__: {
  pkg: {
    name: string;
    version: string;
    dependencies: Recordable<string>;
    devDependencies: Recordable<string>;
  };
  version: string;
  lastBuildTime: string;
};
