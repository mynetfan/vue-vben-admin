<script lang="ts" setup>
import { ref } from 'vue';

import { useVbenDrawer, z } from '@vben/common-ui';

import { useVbenForm } from '#/adapter/form';
import { ApiUsers } from '#/api/setting/users';

const emit = defineEmits(['success']);
const user = ref<ApiUsers.UserModel>();
interface Option {
  value: string;
}
const filterOption = (input: string, option: Option) => {
  return option.value.toUpperCase().includes(input.toUpperCase());
};
const [Form, formApi] = useVbenForm({
  showDefaultActions: false,
  schema: [
    {
      fieldName: 'name',
      component: 'Input',
      label: '用户名',
      rules: 'required',
    },
    {
      fieldName: 'passwd',
      component: 'Input',
      label: '密码',
      rules: z
        .string()
        .min(8, '密码至少8个字符')
        .regex(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/,
          '密码必须包含大小写字母、数字以及特殊字符',
        ),
    },
    {
      fieldName: 'company',
      component: 'Input',
      label: '公司名称',
      rules: 'required',
    },
    {
      fieldName: 'contact',
      component: 'Input',
      label: '联系人',
      rules: 'required',
    },
    {
      fieldName: 'telephone',
      component: 'Input',
      label: '联系电话',
      rules: z.string().regex(/^1[3-9]\d{9}$/, '请输入正确的手机号码'),
    },
    {
      fieldName: 'stored_days',
      component: 'InputNumber',
      label: '存储时长',
      rules: z.number().min(0, '存储时长不正确').default(0),
    },
    {
      fieldName: 'record_type',
      component: 'Select',
      label: '录音类型',
      componentProps: {
        options: ApiUsers.RecordTypes,
        class: 'w-full',
      },
      rules: 'required',
    },
    {
      fieldName: 'record_format',
      component: 'AutoComplete',
      label: '录音格式',
      componentProps: {
        class: 'w-full',
        options: [
          { value: 'mp3' },
          { value: 'wav' },
          { value: 'pcm' },
          { value: 'amr' },
          { value: `$\{ext}_$\{tel}_$\{date}.wav` },
        ],
        filterOption,
      },
      rules: 'required',
    },
    {
      fieldName: 'decrypt',
      component: 'Select',
      label: '号码脱敏',
      componentProps: {
        options: ApiUsers.DecryptTypes,
        class: 'w-full',
      },
      rules: 'required',
    },
  ],
});

const [Drawer, drawerApi] = useVbenDrawer({
  onOpenChange(isOpen) {
    if (isOpen) {
      user.value = drawerApi.getData<ApiUsers.UserModel>();
      formApi.setValues({
        name: user.value.name,
        passwd: '',
        company: user.value.company,
        contact: user.value.contact,
        telephone: user.value.telephone,
        stored_days: user.value.stored_days,
        record_type: user.value.record_type,
        record_format: user.value.record_format,
        decrypt: user.value.decrypt,
      });
    }
  },
  async onConfirm() {
    const { valid } = await formApi.validate();
    if (valid) {
      const values = await formApi.getValues();
      await (user.value && user.value.id
        ? ApiUsers.update(user.value.id, values)
        : ApiUsers.create(values));
      drawerApi.close();
      emit('success');
    }
  },
});
</script>
<template>
  <Drawer :title="user?.id ? '编辑用户' : '新增用户'">
    <Form />
  </Drawer>
</template>
