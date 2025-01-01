<script lang="ts" setup>
import { ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';
import { Upload as UploadIcon } from '@vben/icons';

import {
  Button,
  message,
  UploadDragger,
  type UploadFile,
} from 'ant-design-vue';

import { useVbenForm } from '#/adapter/form';
import { ApiTask } from '#/api';

defineOptions({ name: 'ProjectTaskImportModal' });
const emit = defineEmits(['success']);
const task = ref<ApiTask.TaskModel>();
const fileList = ref<UploadFile[]>([]);
const currentFile = ref<File>();

const [Form, formApi] = useVbenForm({
  showDefaultActions: false,
  wrapperClass: 'grid-cols-2',
  schema: [
    {
      fieldName: 'import_filter',
      component: 'Switch',
      label: '过滤重复',
      defaultValue: 0,
      componentProps: {
        checkedChildren: '是',
        unCheckedChildren: '否',
        checkedValue: 1,
        unCheckedValue: 0,
      },
    },
    {
      fieldName: 'import_order',
      component: 'Switch',
      label: '乱序导入',
      defaultValue: 0,
      componentProps: {
        checkedChildren: '是',
        unCheckedChildren: '否',
        checkedValue: 1,
        unCheckedValue: 0,
      },
    },
  ],
});

const [Modal, modalApi] = useVbenModal({
  onOpenChange(isOpen) {
    if (isOpen) {
      task.value = modalApi.getData<ApiTask.TaskModel>();
    }
  },
  async onConfirm() {
    const values = await formApi.getValues();
    ApiTask.importData({
      project_id: task.value!.project_id,
      task_id: task.value!.id,
      file: currentFile.value!,
      ...values,
    } as ApiTask.ImportDataType)
      .then(() => {
        message.success('导入成功');
        modalApi.close();
        emit('success');
      })
      .catch(() => {
        message.error('导入失败');
      });
  },
});
function downloadTemplate() {
  if (!task.value) {
    message.error('任务数据无效，下载失败');
  }
  ApiTask.downloadTemplate(task.value!.project_id, '任务数据模板.csv', 'gbk');
}

function handleBeforeUpload(file: File) {
  currentFile.value = file;
  return false;
}

function customRequest() {}
</script>
<template>
  <Modal :title="`导入任务数据${task ? `  - ${task.name}` : ''}`">
    <Form />
    <UploadDragger
      v-model:file-list="fileList"
      :before-upload="handleBeforeUpload"
      :custom-request="customRequest"
      :max-count="1"
      :multiple="false"
      accept=".csv,.txt"
      name="file"
      @remove="currentFile = undefined"
    >
      <p class="w-full text-center">
        <UploadIcon class="m-auto size-[48px]" />
      </p>
      <p class="ant-upload-text">点击或者将文件拖拽到此处</p>
      <p class="ant-upload-hint">
        <span>请务必按照模板来上传需要导入的数据。</span>
        <Button size="small" type="link" @click.stop.prevent="downloadTemplate">
          下载模板
        </Button>
      </p>
    </UploadDragger>
  </Modal>
</template>
