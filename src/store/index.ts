import { createPinia } from 'pinia';
// types
import type { App } from 'vue';

export const store = createPinia();

/**
 * 配置状态管理
 */
export function setupStore(app: App) {
  app.use(store);
}
