import { fileURLToPath, URL } from 'node:url';
import type { UserConfig, ConfigEnv } from 'vite';
import { defineConfig, loadEnv } from 'vite';
import dayjs from 'dayjs';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import legacy from '@vitejs/plugin-legacy';
import AutoComponents from 'unplugin-vue-components/vite';
import { createHtmlPlugin } from 'vite-plugin-html';
import pkg from './package.json';

/** 工作目录 */
const root: string = process.cwd();

/** 静态资源目录 */
const assetsDir = 'assets';

/** 项目信息 */
const { name, version, engines, dependencies, devDependencies } = pkg;
const appVersion = dayjs().format('YYYYMMDDHHmm');
const lastBuildTime = dayjs().format('YYYY-MM-DD HH:mm:ss');
const __APP_INFO__ = {
  pkg: { name, version, engines, dependencies, devDependencies },
  version: appVersion,
  lastBuildTime,
};

/**
 * Configuring Vite
 *
 * @see https://vitejs.dev/config/
 */
export default defineConfig(({ mode }: ConfigEnv): UserConfig => {
  const env = loadEnv(mode, root);

  return {
    base: './',
    plugins: [
      vue(),
      vueJsx(),
      AutoComponents({
        dirs: ['./src/components'],
        extensions: ['vue', 'jsx', 'tsx'],
        dts: './src/auto-components.d.ts',
      }),
      createHtmlPlugin({
        inject: {
          data: {
            title: env.VITE_APP_TITLE,
          },
        },
        minify: true,
      }),
      env.VITE_LEGACY === 'true' ? legacy() : null,
    ],
    server: {
      host: true,
      port: Number(env.VITE_PORT),
      proxy: {
        '/dev-api': {
          target: `https://${env.VITE_APP_API_HOST}/${env.VITE_APP_SUB_DOMAIN}`, // https://api.it120.cc/xiaochengxu
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
          manualChunks: (id) => {
            if (id.includes('node_modules')) return 'vendor';
          },
          entryFileNames: `${assetsDir}/js/[name].[hash].js`,
          chunkFileNames: `${assetsDir}/js/[name].[hash].js`,
          assetFileNames: `${assetsDir}/[ext]/[name].[hash].[ext]`,
        },
      },
    },
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
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
            hack: `true; @import './src/styles/variable.less';`,
          },
          javascriptEnabled: true,
        },
      },
    },
  };
});
