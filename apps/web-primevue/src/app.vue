<script lang="ts" setup>
import { computed } from 'vue';

import { usePreferences } from '@vben/preferences';

import Aura from '@primevue/themes/aura';
import PrimeVue from 'primevue/config';
import ToastService from 'primevue/toastservice';
import { getCurrentInstance } from 'vue';

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
  if (isDark.value) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
  return isDark.value;
});

// Trigger the computed
applyTheme.value;
</script>

<template>
  <RouterView />
</template>
