<script lang="ts" setup>
import type { SizeType } from 'ant-design-vue/es/config-provider';

import { computed, onBeforeMount, ref, useAttrs } from 'vue';

import { Image, Input } from 'ant-design-vue';

import { getVerifyImg } from '#/api';

defineOptions({ name: 'ImgCodeInput' });
const imageSrc = ref('');
const attrs = useAttrs();
const inputAttrs = computed(() => {
  return {
    size: 'large' as SizeType,
    class: 'flex-1',
    ...attrs,
  };
});
function refresh() {
  getVerifyImg().then((res) => {
    const reader = new FileReader();
    reader.readAsDataURL(res.data);
    reader.addEventListener('load', () => {
      imageSrc.value = reader.result as string;
    });
  });
}
onBeforeMount(() => {
  refresh();
});
defineExpose({ refresh });
</script>
<template>
  <div class="flex w-full items-center gap-3">
    <Input v-bind="inputAttrs" />
    <Image
      :preview="false"
      :src="imageSrc"
      alt="img-code"
      class="border-border cursor-pointer rounded border"
      style="width: 120px; height: 40px"
      @click="refresh"
    />
  </div>
</template>
