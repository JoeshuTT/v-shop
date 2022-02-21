import type { UserConfig, ConfigEnv } from 'vite';
import { loadEnv } from 'vite';
import pkg from './package.json';
import dayjs from 'dayjs';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import html from 'vite-plugin-html';
const { dependencies, devDependencies, name, version } = pkg;
// 生成版本号
const appVersion = dayjs().format('YYYYMMDDHHmm');
const lastBuildTime = dayjs().format('YYYY-MM-DD HH:mm:ss');
const __APP_INFO__ = {
  pkg: { dependencies, devDependencies, name, version },
  version: appVersion,
  lastBuildTime,
};

// https://vitejs.dev/config/
export default ({ command, mode }: ConfigEnv): UserConfig => {
  console.log(`--- 执行 ${command} ${lastBuildTime} ---`);
  const root = process.cwd();
  const env = loadEnv(mode, root);

  return {
    base: './',
    resolve: {
      alias: [
        {
          find: '@',
          replacement: '/src',
        },
      ],
    },
    server: {
      host: true,
      port: Number(env.VITE_PORT),
      proxy: {
        '/dev-api': {
          target: 'https://api.it120.cc/xiaochengxu',
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/dev-api/, ''),
        },
      },
    },
    build: {
      sourcemap: false,
      chunkSizeWarningLimit: 1500,
      rollupOptions: {
        output: {
          entryFileNames: `assets/[name].${appVersion}.js`,
          chunkFileNames: `assets/[name].${appVersion}.js`,
          assetFileNames: `assets/[name].${appVersion}.[ext]`,
        },
      },
    },
    define: {
      __APP_INFO__: JSON.stringify(__APP_INFO__),
    },
    css: {
      modules: {
        localsConvention: 'camelCaseOnly',
      },
      preprocessorOptions: {
        less: {
          modifyVars: {
            hack: `true; @import '/src/styles/variable.less';`,
          },
          javascriptEnabled: true,
        },
      },
    },
    plugins: [
      vue(),
      vueJsx(),
      // vite-plugin-html
      html({
        minify: true, // 这个参数正反都会压缩 ?。?
        inject: {
          data: {
            title: env.VITE_APP_TITLE,
          },
        },
      }),
    ],
  };
};
