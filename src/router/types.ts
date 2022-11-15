import type { RouteMeta } from 'vue-router';
export interface AppRouteMeta extends RouteMeta {
  meta: {
    title?: string;
    needLogin?: boolean;
    keepAlive?: boolean;
  };
}
