<template>
  <AppProvider>
    <router-view />
  </AppProvider>
</template>

<script>
import AppProvider from '@/components/AppProvider';

export default {
  components: { AppProvider },
};
</script>
