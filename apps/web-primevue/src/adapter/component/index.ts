/**
 * 通用组件共同的使用的基础组件，原先放在 adapter/form 内部，限制了使用范围，这里提取出来，方便其他地方使用
 * 可用于 vben-form、vben-modal、vben-drawer 等组件使用,
 */

import type { Component } from 'vue';

import type { BaseFormComponentType } from '@vben/common-ui';
import type { Recordable } from '@vben/types';

import { defineAsyncComponent, defineComponent, h, ref } from 'vue';

import { ApiComponent, globalShareState, IconPicker } from '@vben/common-ui';
import { $t } from '@vben/locales';

import { useToast } from 'primevue/usetoast';

const Button = defineAsyncComponent(() =>
  import('primevue/button').then((res) => res.default),
);
const Checkbox = defineAsyncComponent(() =>
  import('primevue/checkbox').then((res) => res.default),
);
const DatePicker = defineAsyncComponent(() =>
  import('primevue/datepicker').then((res) => res.default),
);
const Divider = defineAsyncComponent(() =>
  import('primevue/divider').then((res) => res.default),
);
const InputText = defineAsyncComponent(() =>
  import('primevue/inputtext').then((res) => res.default),
);
const InputNumber = defineAsyncComponent(() =>
  import('primevue/inputnumber').then((res) => res.default),
);
const Password = defineAsyncComponent(() =>
  import('primevue/password').then((res) => res.default),
);
const RadioButton = defineAsyncComponent(() =>
  import('primevue/radiobutton').then((res) => res.default),
);
const Select = defineAsyncComponent(() =>
  import('primevue/select').then((res) => res.default),
);
const Textarea = defineAsyncComponent(() =>
  import('primevue/textarea').then((res) => res.default),
);
const ToggleSwitch = defineAsyncComponent(() =>
  import('primevue/toggleswitch').then((res) => res.default),
);
const TreeSelect = defineAsyncComponent(() =>
  import('primevue/treeselect').then((res) => res.default),
);
const FileUpload = defineAsyncComponent(() =>
  import('primevue/fileupload').then((res) => res.default),
);

const withDefaultPlaceholder = <T extends Component>(
  component: T,
  type: 'input' | 'select',
  componentProps: Recordable<any> = {},
) => {
  return defineComponent({
    name: component.name,
    inheritAttrs: false,
    setup: (props: any, { attrs, expose, slots }) => {
      const placeholder =
        props?.placeholder ||
        attrs?.placeholder ||
        $t(`ui.placeholder.${type}`);
      // 透传组件暴露的方法
      const innerRef = ref();
      expose(
        new Proxy(
          {},
          {
            get: (_target, key) => innerRef.value?.[key],
            has: (_target, key) => key in (innerRef.value || {}),
          },
        ),
      );
      return () =>
        h(
          component,
          { ...componentProps, placeholder, ...props, ...attrs, ref: innerRef },
          slots,
        );
    },
  });
};

// 这里需要自行根据业务组件库进行适配，需要用到的组件都需要在这里类型说明
export type ComponentType =
  | 'ApiSelect'
  | 'ApiTreeSelect'
  | 'Checkbox'
  | 'DatePicker'
  | 'DefaultButton'
  | 'Divider'
  | 'IconPicker'
  | 'Input'
  | 'InputNumber'
  | 'InputPassword'
  | 'PrimaryButton'
  | 'RadioButton'
  | 'Select'
  | 'Switch'
  | 'Textarea'
  | 'TreeSelect'
  | 'Upload'
  | BaseFormComponentType;

async function initComponentAdapter() {
  const components: Partial<Record<ComponentType, Component>> = {
    // 如果你的组件体积比较大，可以使用异步加载
    // Button: () =>
    // import('xxx').then((res) => res.Button),
    ApiSelect: withDefaultPlaceholder(
      {
        ...ApiComponent,
        name: 'ApiSelect',
      },
      'select',
      {
        component: Select,
        loadingSlot: 'dropdownicon',
        visibleEvent: 'onShow',
        modelPropName: 'modelValue',
      },
    ),
    ApiTreeSelect: withDefaultPlaceholder(
      {
        ...ApiComponent,
        name: 'ApiTreeSelect',
      },
      'select',
      {
        component: TreeSelect,
        loadingSlot: 'dropdownicon',
        modelPropName: 'modelValue',
        optionsPropName: 'options',
        visibleEvent: 'onShow',
      },
    ),
    Checkbox,
    DatePicker,
    // 自定义默认按钮
    DefaultButton: (props, { attrs, slots }) => {
      return h(Button, { ...props, attrs, severity: 'secondary' }, slots);
    },
    Divider,
    IconPicker: withDefaultPlaceholder(IconPicker, 'select', {
      iconSlot: 'addon',
      inputComponent: InputText,
      modelValueProp: 'modelValue',
    }),
    Input: withDefaultPlaceholder(InputText, 'input'),
    InputNumber: withDefaultPlaceholder(InputNumber, 'input'),
    InputPassword: withDefaultPlaceholder(Password, 'input'),
    // 自定义主要按钮
    PrimaryButton: (props, { attrs, slots }) => {
      return h(Button, { ...props, attrs }, slots);
    },
    RadioButton,
    Select: withDefaultPlaceholder(Select, 'select'),
    Switch: ToggleSwitch,
    Textarea: withDefaultPlaceholder(Textarea, 'input'),
    TreeSelect: withDefaultPlaceholder(TreeSelect, 'select'),
    Upload: FileUpload,
  };

  // 将组件注册到全局共享状态中
  globalShareState.setComponents(components);

  // 定义全局共享状态中的消息提示
  globalShareState.defineMessage({
    // 复制成功消息提示
    copyPreferencesSuccess: (title, content) => {
      try {
        const toast = useToast();
        toast.add({
          severity: 'success',
          summary: title,
          detail: content,
          life: 0,
        });
      } catch {
        // Toast service may not be available outside of setup context
      }
    },
  });
}

export { initComponentAdapter };
