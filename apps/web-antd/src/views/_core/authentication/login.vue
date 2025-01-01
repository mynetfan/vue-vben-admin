<script lang="ts" setup>
import type { VbenFormSchema } from '@vben/common-ui';
import type { BasicOption, Recordable } from '@vben/types';

import { computed, useTemplateRef } from 'vue';

import { AuthenticationLogin, z } from '@vben/common-ui';
import { $t } from '@vben/locales';

import { useAuthStore } from '#/store';

import ImgCodeInput from './img-code-input.vue';

defineOptions({ name: 'Login' });

const authStore = useAuthStore();

const PRESET_COMPANY: BasicOption[] = [
  {
    label: 'Admin',
    value: 'admin',
    pwd: 'Admin@123',
  },
  {
    label: 'Test',
    value: 'test001',
    pwd: 'Test@123',
  },
];

const formSchema = computed((): VbenFormSchema[] => {
  return [
    {
      component: 'VbenSelect',
      componentProps: {
        options: PRESET_COMPANY,
        placeholder: $t('authentication.selectAccount'),
      },
      fieldName: 'company',
      label: $t('authentication.selectAccount'),
      rules: z
        .string()
        .min(1, { message: $t('authentication.selectAccount') })
        .optional()
        .default('test001'),
    },
    {
      component: 'VbenInput',
      componentProps: {
        placeholder: $t('authentication.usernameTip'),
      },
      dependencies: {
        trigger(values, form) {
          if (values.company) {
            const findUser = PRESET_COMPANY.find(
              (item) => item.value === values.company,
            );
            if (findUser) {
              form.setValues({
                passwd: findUser.pwd,
                name: findUser.value,
              });
            }
          }
        },
        triggerFields: ['company'],
      },
      fieldName: 'name',
      label: $t('authentication.username'),
      rules: z.string().min(1, { message: $t('authentication.usernameTip') }),
    },
    {
      component: 'VbenInputPassword',
      componentProps: {
        placeholder: $t('authentication.password'),
      },
      fieldName: 'passwd',
      label: $t('authentication.password'),
      rules: z.string().min(1, { message: $t('authentication.passwordTip') }),
    },
    {
      component: 'Input',
      componentProps: { maxLength: 4 },
      fieldName: 'verifyCode',
      rules: z.string().length(4, { message: '请输入正确的验证码' }),
    },
  ];
});

const refImgCodeInput =
  useTemplateRef<InstanceType<typeof ImgCodeInput>[]>('refImgCodeInput');
const refLogin =
  useTemplateRef<InstanceType<typeof AuthenticationLogin>>('refLogin');
async function onSubmit(values: Recordable<any>) {
  try {
    await authStore.authLogin(values);
  } catch {
    refLogin.value?.getFormApi()?.setValues({ verifyCode: '' });
    refImgCodeInput.value?.[0]?.refresh();
  }
}
</script>

<template>
  <AuthenticationLogin
    ref="refLogin"
    :form-schema="formSchema"
    :loading="authStore.loginLoading"
    @submit="onSubmit"
  >
    <template #form-verifyCode="slotProps">
      <ImgCodeInput v-bind="slotProps" ref="refImgCodeInput" />
    </template>
  </AuthenticationLogin>
</template>
