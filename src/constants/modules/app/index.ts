import type { IPalette, ITheme } from './types';

/**
 * app
 */
export const app = {
  name: 'v-shop',
  link: 'https://github.com/JoeshuTT/v-shop/',
};

/**
 * 主题
 */
export const theme: ITheme = {
  version: '2',
  mode: 'light',
  assetsUrl: '',
  /**
   * 主题基础颜色变量
   */
  colors: {
    black: '#000',
    white: '#fff',
    primary: '#1ba784',
    vice: '#d9f6ef',

    red: '#ee0a24',
    blue: '#1989fa',
    orange: '#ff976a',
    'orange-dark': '#ed6a0c',
    'orange-light': '#fffbe8',
    green: '#07c160',
  },
  /**
   *  覆盖Vant 的基础变量
   */
  vanThemeOverrides: {
    black: 'black',
    white: 'white',
    'gray-1': '#f7f8fa',
    'gray-2': '#f2f3f5',
    blue: 'primary',
  },
};

/**
 * 深色主题
 */
export const darkTheme: ITheme = {
  mode: 'dark',
  /**
   * 主题基础颜色变量
   */
  colors: {
    black: '#000',
    white: '#fff',
    primary: '#1ba784',
    vice: '#d9f6ef',
  },
  /**
   *  覆盖Vant 的基础变量
   */
  vanThemeOverrides: {
    'text-color': 'rgba(255, 255, 255, 0.9)',
    'text-color-2': 'rgba(255, 255, 255, 0.7)',
    'text-color-3': 'rgba(255, 255, 255, 0.5)',
    'border-color': '#3a3a3c',
    'active-color': '#3a3a3c',
    background: '#17171a',
    'background-2': '#232324',
    'background-3': '#2a2a2b',
  },
};

/**
 * 底部导航栏
 */
export const tabBar = {
  color: '#c0c0c0',
  selectedColor: '#1ba784',
  list: [
    {
      text: '首页',
      pagePath: '/home',
      icon: 'home-o',
      activeIcon: 'home-o',
    },
    {
      text: '分类',
      pagePath: '/category',
      icon: 'apps-o',
      activeIcon: 'apps-o',
    },
    {
      text: '购物车',
      pagePath: '/cart',
      icon: 'shopping-cart-o',
      activeIcon: 'shopping-cart',
    },
    {
      text: '个人中心',
      pagePath: '/mine',
      icon: 'contact',
      activeIcon: 'contact',
    },
  ],
};

/**
 * 调色板
 */
export const palettes: IPalette[] = [
  {
    value: '#ff5179',
    label: '粉色系列',
    colors: {
      primary: '#ff5179',
      vice: '#ffe6e8',
    },
  },
  {
    value: '#ffaa00',
    label: '黄色系列',
    colors: {
      primary: '#ffaa00',
      vice: '#1d262e',
    },
  },
  {
    value: '#c3a769',
    label: '棕色系列',
    colors: {
      primary: '#c3a769',
      vice: '#ebecf2',
    },
  },
  {
    value: '#2f2f34',
    label: '黑色系列',
    colors: {
      primary: '#2f2f34',
      vice: '#ebecf2',
    },
  },
  {
    value: '#0080ff',
    label: '蓝色系列',
    colors: {
      primary: '#0080ff',
      vice: '#d6e9fc',
    },
  },
  {
    value: '#884cff',
    label: '紫色系列',
    colors: {
      primary: '#884cff',
      vice: '#efe6ff',
    },
  },
  {
    value: '#ee0a24',
    label: '红色系列（Vant 默认主色）',
    colors: {
      primary: '#ee0a24',
      vice: '#ffd01e',
    },
  },
  {
    value: '#1ba784',
    label: '绿色系列（v-shop 默认色系列）',
    link: 'http://zhongguose.com/', // 取自中国色 竹绿
    colors: {
      primary: '#1ba784',
      vice: '#d9f6ef',
    },
  },
];
