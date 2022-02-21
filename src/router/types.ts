import type { RouteLocationNormalized } from 'vue-router';

export interface toRouteType extends RouteLocationNormalized {
  meta: {
    title?: string;
    keepAlive?: boolean;
  };
}
