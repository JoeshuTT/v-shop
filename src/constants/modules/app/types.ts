export type IThemeMode = 'light' | 'dark';

export interface ITheme {
  mode: IThemeMode;
  colors: Record<string, string>;
  [key: string]: any;
}

export interface IPalette {
  label: string;
  value: string;
  colors: ITheme['colors'];
  [key: string]: any;
}
