<script lang="ts" setup>
import { computed, getCurrentInstance, watchEffect } from 'vue';

import { usePreferences } from '@vben/preferences';

import Aura from '@primevue/themes/aura';
import PrimeVue from 'primevue/config';
import ToastService from 'primevue/toastservice';

defineOptions({ name: 'App' });

const { isDark } = usePreferences();

// Get the current app instance
const app = getCurrentInstance()?.appContext.app;

// Configure PrimeVue
if (app && !app.config.globalProperties.$primevue) {
  app.use(PrimeVue, {
    theme: {
      preset: Aura,
      options: {
        darkModeSelector: '.dark',
      },
    },
  });
  app.use(ToastService);
}

// Apply dark mode class to document
const applyTheme = computed(() => {
  document.documentElement.classList.toggle('dark', isDark.value);
  return isDark.value;
});

// Watch and apply theme changes
watchEffect(() => {
  return applyTheme.value;
});
</script>

<template>
  <RouterView />
</template>
