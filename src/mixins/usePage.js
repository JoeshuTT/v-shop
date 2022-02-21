import { mapGetters } from 'vuex';

export default {
  computed: {
    ...mapGetters({
      token: 'user/token',
      hasLogin: 'user/hasLogin',
      theme: 'app/theme',
    }),
  },
};
