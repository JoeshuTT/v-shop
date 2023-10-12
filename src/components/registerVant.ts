import Vant, { Lazyload } from 'vant';
import 'vant/lib/index.css';
// types
import type { App } from 'vue';

export function setupVant(app: App) {
  app.use(Vant);
  app.use(Lazyload);
}
