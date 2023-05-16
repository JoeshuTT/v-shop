import { defineComponent } from 'vue';
import dayjs from 'dayjs';

// styles
import styles from './index.module.less';

export default defineComponent({
  name: 'Copyright',
  setup() {
    return () => {
      const nowYear = dayjs().format('YYYY');
      return (
        <div class={styles.copyright}>
          <div class={styles.copyrightP}>
            <a href="https://github.com/JoeshuTT/v-shop" target="_blank">
              Copyright © 2019-{nowYear} {__APP_INFO__.pkg.name} | v{__APP_INFO__.pkg.version}
            </a>
          </div>
          <div class={styles.copyrightP}>
            <a href="https://github.com/JoeshuTT/v-shop" target="_blank">
              最后编译时间： {__APP_INFO__.lastBuildTime}
            </a>
          </div>
        </div>
      );
    };
  },
});
