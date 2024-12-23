import { nextTick } from 'vue';
import { useRouter } from 'vue-router';

import { useTabbarStore } from '@vben/stores';

export function useRefresh() {
  const router = useRouter();
  const tabbarStore = useTabbarStore();

  async function refresh(clearCache: boolean = false) {
    if (clearCache) {
      tabbarStore.clearCacheTabs();
      await nextTick();
    }
    await tabbarStore.refresh(router);
    if (clearCache) {
      await nextTick();
      tabbarStore.updateCacheTabs();
    }
  }

  return {
    refresh,
  };
}
