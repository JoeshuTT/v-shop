<template>
  <AppProvider>
    <PageStackRouterView v-if="showPageStack" />
    <RouterView v-else />
  </AppProvider>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';

const name = 'App';
const showPageStack = import.meta.env.VITE_APP_PAGE_STACK === 'true';

onMounted(() => {
  console.log(`${name} onMounted`);
});
</script>
