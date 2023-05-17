import { createApp, reactive, getCurrentInstance } from 'vue';
import type { ComponentPublicInstance } from 'vue';
import Popup from './index.vue';

// types
type ComponentInstance = ComponentPublicInstance<{}, any>;

let instance: ComponentInstance;

function initInstance() {
  const RootComponent = {
    name: 'AppClientInfoPopupWrapper',
    setup() {
      const state = reactive({
        show: false,
      });

      const toggle = (show: boolean) => {
        state.show = show;
      };

      const open = () => {
        toggle(true);
      };

      const close = () => {
        toggle(false);
      };

      const exposeApis = { open, close, toggle }; // 对外提供实例公开方法
      const instance = getCurrentInstance();
      if (instance) {
        Object.assign(instance.proxy as object, exposeApis);
      }

      return () => <Popup {...state} onUpdate:show={toggle} />;
    },
  };

  const app = createApp(RootComponent);
  const rootContainer = document.createElement('div'); // 指定挂载的DOM节点

  document.body.appendChild(rootContainer);
  instance = app.mount(rootContainer);

  // return {
  //   instance: app.mount(root),
  //   unmount() {
  //     app.unmount();
  //     document.body.removeChild(root);
  //   },
  // };
}

export const closeClientInfoPopup = () => {
  if (instance) {
    instance.toggle(false);
  }
};

export function showClientInfoPopup() {
  if (!instance) {
    initInstance();
  }

  instance.open();

  return instance;
}
