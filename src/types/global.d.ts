export {};
declare global {
  declare type Nullable<T> = T | null;

  declare type NonNullable<T> = T extends null | undefined ? never : T;

  declare type Recordable<T = any> = Record<string, T>;
  declare interface ReadonlyRecordable<T = any> {
    readonly [key: string]: T;
  }
  declare interface Indexable<T = any> {
    [key: string]: T;
  }

  declare type DeepPartial<T> = {
    [P in keyof T]?: DeepPartial<T[P]>;
  };

  declare type TimeoutHandle = ReturnType<typeof setTimeout>;

  declare type IntervalHandle = ReturnType<typeof setInterval>;

  declare interface ChangeEvent extends Event {
    target: HTMLInputElement;
  }

  declare interface WheelEvent {
    path?: EventTarget[];
  }

  // vite
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

  declare interface ImportMetaEnv {
    readonly VITE_APP_TITLE: string;
    readonly VITE_PORT: number;
    readonly VITE_APP_ENV: 'dev' | 'test' | 'pre' | 'prd';
    readonly VITE_APP_API_HOST: string;
  }
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
