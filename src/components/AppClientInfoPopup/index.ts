import { createApp } from 'vue';
import PopupComponent from './Popup.vue';

let instance;

// export function mountComponent(RootComponent: Component) {
//   return {
//     instance: app.mount(root),
//     unmount() {
//       app.unmount();
//       document.body.removeChild(root);
//     },
//   };
// }

// TODO:

export function showClientInfoPopup() {
  return new Promise((resolve, reject) => {
    console.log(instance);
    if (!instance) {
      const root = document.createElement('div');
      const app = createApp(PopupComponent, {
        show: true,
      });

      document.body.appendChild(root);
      console.log(PopupComponent);
      instance = app;
      app.mount(root);
    }

    resolve('ss');
  });
}

export function closeClientInfoPopup() {
  if (instance) {
    instance.close();
  }
}

// closeClientInfoPopup
