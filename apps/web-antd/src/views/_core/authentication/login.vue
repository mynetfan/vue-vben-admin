<script lang="ts" setup>
import type { VbenFormSchema } from '@vben/common-ui';
import type { BasicOption } from '@vben/types';

import { computed, markRaw } from 'vue';

import { AuthenticationLogin, SliderCaptcha, z } from '@vben/common-ui';
import { $t } from '@vben/locales';

import { useAuthStore } from '#/store';

defineOptions({ name: 'Login' });

const authStore = useAuthStore();

const PRESET_COMPANY: BasicOption[] = [
  {
    label: 'Admin',
    value: 'admin',
  },
  {
    label: 'Test',
    value: 'test001',
  },
];

const formSchema = computed((): VbenFormSchema[] => {
  return [
    {
      component: 'Select',
      componentProps: {
        options: PRESET_COMPANY,
        placeholder: $t('authentication.selectAccount'),
        class: 'w-full',
        size: 'large',
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
                password: '123456',
                username: findUser.value,
              });
            }
          }
        },
        triggerFields: ['company'],
      },
      fieldName: 'username',
      label: $t('authentication.username'),
      rules: z.string().min(1, { message: $t('authentication.usernameTip') }),
    },
    {
      component: 'VbenInputPassword',
      componentProps: {
        placeholder: $t('authentication.password'),
      },
      fieldName: 'password',
      label: $t('authentication.password'),
      rules: z.string().min(1, { message: $t('authentication.passwordTip') }),
    },
    {
      component: markRaw(SliderCaptcha),
      fieldName: 'captcha',
      // rules: z.string().length(4, { message: '请输入正确的验证码' }),
    },
  ];
});
</script>

<template>
  <AuthenticationLogin
    :form-schema="formSchema"
    :loading="authStore.loginLoading"
    @submit="authStore.authLogin"
  />
</template>
