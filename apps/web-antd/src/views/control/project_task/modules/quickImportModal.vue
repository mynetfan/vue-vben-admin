<script lang="ts" setup>
import { computed, ref, watch } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { message, Textarea } from 'ant-design-vue';

import { ApiTask } from '#/api';

defineOptions({ name: 'ProjectTaskQuickImportModal' });

const emit = defineEmits(['success']);
const data = ref('');
const task = ref<ApiTask.TaskModel>();
const lines = computed(() =>
  data.value.split('\n').filter((line) => !!line.trim()),
);
const validPhoneNumbers = computed(() =>
  lines.value.filter((line) => /^1\d{10}$/.test(line.trim())),
);
const [Modal, modalApi] = useVbenModal({
  onOpenChange(isOpen) {
    if (isOpen) {
      data.value = '';
      task.value = modalApi.getData<ApiTask.TaskModel>();
    }
  },
  onConfirm() {
    if (!task.value || validPhoneNumbers.value.length === 0) {
      return;
    }
    ApiTask.quickImport({
      project_id: task.value.project_id,
      task_id: task.value.id,
      tels: validPhoneNumbers.value.join(','),
    }).then(() => {
      message.success('导入成功');
      emit('success');
      modalApi.close();
    });
  },
});

watch(
  () => validPhoneNumbers.value.length,
  (val) => {
    if (val > 0) {
      modalApi.setState({ confirmDisabled: false });
    } else {
      modalApi.setState({ confirmDisabled: true });
    }
  },
  { immediate: true },
);
</script>
<template>
  <Modal :title="`快速导入任务数据${task ? `  - ${task.name}` : ''}`">
    <Textarea
      v-model:value="data"
      :rows="10"
      placeholder="请粘贴或输入手机号码，一行一个"
    />
    <template #prepend-footer>
      <span v-if="validPhoneNumbers.length > 0">
        当前{{ validPhoneNumbers.length }}个有效号码
      </span>
    </template>
  </Modal>
</template>
