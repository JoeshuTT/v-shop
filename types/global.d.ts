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
}
