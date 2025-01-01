<script lang="ts" setup>
import { ref } from 'vue';

import { useVbenModal, z } from '@vben/common-ui';

import { useVbenForm } from '#/adapter/form';
import { ApiUsers } from '#/api/setting/users';

const emit = defineEmits(['success']);
const user = ref<ApiUsers.UserModel>();
const [Form, formApi] = useVbenForm({
  showDefaultActions: false,
  handleValuesChange(values) {
    formApi.setValues({
      after_balance: values.recharge_money
        ? values.balance + values.recharge_money
        : values.balance,
    });
  },
  schema: [
    {
      fieldName: 'name',
      component: 'Input',
      componentProps: { readonly: true },
      label: '用户名',
    },
    {
      fieldName: 'balance',
      component: 'Input',
      componentProps: { readonly: true },
      label: '当前余额',
    },
    {
      fieldName: 'after_balance',
      component: 'Input',
      componentProps: { readonly: true },
      defaultValue: 0,
      label: '充值后',
    },
    {
      fieldName: 'recharge_money',
      component: 'InputNumber',
      label: '充值额度',
      rules: z.number({ message: '请输入充值额度' }).min(1, '充值额度不正确'),
    },
    {
      fieldName: 'remark',
      component: 'Textarea',
      label: '备注',
    },
  ],
});
const [Modal, modalApi] = useVbenModal({
  onOpenChange(isOpen) {
    if (isOpen) {
      user.value = modalApi.getData<ApiUsers.UserModel>();
      formApi.setValues({
        name: user.value.name,
        recharge_money: undefined,
        balance: user.value.balance,
      });
    }
  },
  onConfirm: handleSubmit,
});

function handleSubmit() {
  formApi.validate().then(async (valid) => {
    if (valid) {
      const values = await formApi.getValues();
      await ApiUsers.recharge(
        values.name,
        values.recharge_money,
        values.remark,
      );
      modalApi.close();
      emit('success');
    }
  });
}
</script>
<template>
  <Modal :title="`正在充值：${user?.name}`" class="w-[400px]">
    <Form>
      <template #name="{ value }">
        {{ value }}
      </template>
      <template #balance="{ value: balance }">
        {{ balance }}
      </template>
      <template #after_balance="{ value }">
        {{ value }}
      </template>
    </Form>
  </Modal>
</template>
