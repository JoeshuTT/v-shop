import type { UserConfig, ConfigEnv } from 'vite';
import { resolve } from 'path';
import { loadEnv } from 'vite';
import pkg from './package.json';
import dayjs from 'dayjs';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import Components from 'unplugin-vue-components/vite';
import { createHtmlPlugin } from 'vite-plugin-html';

// 当前执行node命令时文件夹的地址（工作目录）
const root: string = process.cwd();

// 打包后静态资源的存放路径
const assetsDir = 'assets';

// __APP_INFO__
const { dependencies, devDependencies, name, version } = pkg;
const appVersion = dayjs().format('YYYYMMDDHHmm');
const lastBuildTime = dayjs().format('YYYY-MM-DD HH:mm:ss');
const __APP_INFO__ = {
  pkg: { dependencies, devDependencies, name, version },
  version: appVersion,
  lastBuildTime,
};

export default ({ command, mode }: ConfigEnv): UserConfig => {
  const env = loadEnv(mode, root);
  console.log(`========== ${pkg.name} ${command} S ==========`);
  console.log(`[lastBuildTime ${__APP_INFO__.lastBuildTime}]`);
  console.log(`========== ${pkg.name} ${command} E ==========`);

  return {
    base: './',
    plugins: [
      vue(),
      vueJsx(),
      Components({
        extensions: ['vue', 'tsx'],
        dts: 'src/components.d.ts',
      }),
      createHtmlPlugin({
        inject: {
          data: {
            title: env.VITE_APP_TITLE,
          },
        },
        minify: false,
      }),
    ],
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
      assetsDir: assetsDir,
      sourcemap: false,
      chunkSizeWarningLimit: 1500,
      rollupOptions: {
        output: {
          entryFileNames: `${assetsDir}/[name].${appVersion}.js`,
          chunkFileNames: `${assetsDir}/[name].${appVersion}.js`,
          assetFileNames: `${assetsDir}/static/[name].${appVersion}.[ext]`,
        },
      },
    },
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
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
  };
};
