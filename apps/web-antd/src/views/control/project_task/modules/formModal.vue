<script lang="ts" setup>
import type { Recordable } from '@vben/types';

import { ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';
import { pick } from '@vben/utils';

import { useVbenForm } from '#/adapter/form';
import { ApiTask } from '#/api';
import { ApiProject } from '#/api/control/project';

defineOptions({ name: 'ProjectTaskForm' });
const emit = defineEmits(['success']);
const recordId = ref();
const defaultProjectId = ref();
const [Form, formApi] = useVbenForm({
  showDefaultActions: false,
  schema: [
    {
      fieldName: 'project_id',
      component: 'ApiSelect',
      componentProps: {
        api: ApiProject.getProjectList,
        labelField: 'name',
        valueField: 'id',
        class: 'w-full',
        afterFetch: (data: Recordable<any>[]) => {
          if (data && data.length > 0) {
            defaultProjectId.value = data[0]?.id;
            if (!recordId.value) {
              formApi.setValues({ project_id: defaultProjectId.value });
            }
          }
        },
      },
      label: '项目',
      rules: 'required',
    },
    { fieldName: 'name', component: 'Input', label: '名称', rules: 'required' },
  ],
});

const [Modal, modalApi] = useVbenModal({
  onOpenChange(isOpen) {
    if (isOpen) {
      const data = modalApi.getData();
      if (data && data.id) {
        formApi.setValues(pick(data, ['id', 'name', 'project_id']));
        recordId.value = data.id;
        modalApi.setState({ title: '修改任务' });
      } else {
        formApi.setValues({ project_id: defaultProjectId.value });
        recordId.value = null;
        modalApi.setState({ title: '创建新任务' });
      }
    }
  },
  async onConfirm() {
    modalApi.setState({ confirmLoading: true });
    try {
      const { valid } = await formApi.validate();
      if (valid) {
        let result = false;
        const values = await formApi.getValues();
        result = recordId.value
          ? await ApiTask.update(recordId.value, values.name)
          : await ApiTask.create(values.name, values.project_id);
        if (result) {
          modalApi.close();
          emit('success');
        }
      }
    } catch {
      modalApi.setState({ confirmLoading: false });
    }
  },
});
</script>
<template>
  <Modal>
    <Form />
  </Modal>
</template>
