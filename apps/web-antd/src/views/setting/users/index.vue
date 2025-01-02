<script lang="ts" setup>
import { useRouter } from 'vue-router';

import { Page, useVbenDrawer, useVbenModal } from '@vben/common-ui';
import { DEFAULT_HOME_PATH } from '@vben/constants';
import { useAccessStore, useTabbarStore, useUserStore } from '@vben/stores';

import { Button, message, Modal, Popconfirm, Tag } from 'ant-design-vue';

import { useVbenVxeGrid, type VxeTableGridOptions } from '#/adapter/vxe-table';
import { ApiUsers } from '#/api/setting/users';
import { generateAccess } from '#/router/access';
import { useAuthStore } from '#/store';

import UpdateForm from './modules/form.vue';
import RechargeForm from './modules/recharge.vue';

defineOptions({ name: 'SettingUsers' });
const gridOptions: VxeTableGridOptions = {
  height: 'auto',
  columns: [
    { field: 'company', title: '公司名' },
    { field: 'name', title: '名称' },

    { field: 'contact', title: '联系人' },
    { field: 'telephone', title: '联系电话' },
    { field: 'record_format', title: '录音格式' },
    {
      field: 'record_type',
      title: '录音类型',
      showOverflow: false,
      slots: { default: 'record_type' },
    },
    { field: 'stored_days', title: '存储时长' },
    { field: 'balance', title: '余额' },
    { field: 'decrypt', title: '号码脱敏', slots: { default: 'decrypt' } },
    {
      field: 'actions',
      title: '操作',
      fixed: 'right',
      showOverflow: false,
      width: 260,
      slots: { default: 'actions' },
    },
  ],
  proxyConfig: {
    ajax: {
      query({ page }, formValues) {
        return ApiUsers.getPageList({
          name: formValues.name || '',
          page: page.currentPage,
          limit: page.pageSize,
        });
      },
    },
  },
  keepSource: true,
  pagerConfig: {},
  toolbarConfig: {
    refresh: {
      code: 'query',
    },
    search: true,
  },
};

const formOptions: VbenFormProps = {
  schema: [
    {
      fieldName: 'name',
      component: 'Input',
      componentProps: {
        clearable: true,
      },
      label: '用户名',
    },
  ],
};

const [Grid, gridApi] = useVbenVxeGrid({ gridOptions, formOptions });
const [FormDrawer, formDrawerApi] = useVbenDrawer({
  connectedComponent: UpdateForm,
  destroyOnClose: true,
});

const [RechargeModal, rechargeModalApi] = useVbenModal({
  connectedComponent: RechargeForm,
  destroyOnClose: true,
});
function getRecordTypeTagColor(type: number) {
  switch (type) {
    case 1: {
      return 'success';
    }
    case 2: {
      return 'processing';
    }
    case 3: {
      return 'error';
    }
    default: {
      return 'warning';
    }
  }
}
function getRecordTypeText(type: number) {
  return ApiUsers.RecordTypes.find((v) => v.value === type)?.label ?? type;
}

function getDecryptColor(decrypt: string) {
  switch (decrypt) {
    case 'hide': {
      return 'processing';
    }
    case 'md5': {
      return 'success';
    }
    case 'none': {
      return 'error';
    }
    default: {
      return 'default';
    }
  }
}

function getDecryptText(decrypt: string) {
  return (
    ApiUsers.DecryptTypes.find((v) => v.value === decrypt)?.label ?? decrypt
  );
}

function handleAdd() {
  formDrawerApi.setData({});
  formDrawerApi.open();
}
function handleEdit(row: ApiUsers.UserModel) {
  formDrawerApi.setData(row);
  formDrawerApi.open();
}
function handleDelete(row: ApiUsers.UserModel) {
  ApiUsers.remove(row.id).then(() => {
    gridApi.query();
  });
}
const authStore = useAuthStore();
const router = useRouter();
const accessStore = useAccessStore();
const userStore = useUserStore();
const tabbarStore = useTabbarStore();
async function handleQuickLogin(row: ApiUsers.UserModel) {
  const hideMsg = message.loading({
    content: '正在获取快捷登陆信息...',
    duration: 0,
    key: 'quick-login',
  });
  try {
    const { access_token, role } = await ApiUsers.quickLogin(row.id);
    message.success({
      content: '成功获取凭据',
      duration: 2,
      key: 'quick-login',
    });
    Modal.confirm({
      title: '快捷登陆',
      content: `即将以${row.name}的身份重新登陆系统，角色是【${role}】。要继续吗？`,
      onOk() {
        authStore.loginInit(access_token, role, async () => {
          // 生成菜单和路由
          const { accessibleMenus, accessibleRoutes } = await generateAccess({
            roles: [],
            router,
            routes: [],
          });
          // 保存菜单信息和路由信息
          accessStore.setAccessMenus(accessibleMenus);
          accessStore.setAccessRoutes(accessibleRoutes);
          accessStore.setIsAccessChecked(true);
          tabbarStore.tabs = [];
          await router.push(userStore.userInfo?.homePath || DEFAULT_HOME_PATH);
        });
      },
    });
  } catch {
    hideMsg();
  }
}
function handleRecharge(row: ApiUsers.UserModel) {
  rechargeModalApi.setData(row);
  rechargeModalApi.open();
}
</script>
<template>
  <Page auto-content-height>
    <FormDrawer @success="gridApi.query()" />
    <RechargeModal @success="gridApi.query()" />
    <Grid>
      <template #toolbar-actions>
        <Button type="primary" @click="handleAdd">创建新用户</Button>
      </template>
      <template #record_type="{ row }">
        <Tag :color="getRecordTypeTagColor(row.record_type)">
          {{ getRecordTypeText(row.record_type) }}
        </Tag>
      </template>
      <template #decrypt="{ row }">
        <Tag :color="getDecryptColor(row.decrypt)">
          {{ getDecryptText(row.decrypt) }}
        </Tag>
      </template>
      <template #actions="{ row }">
        <Button size="small" type="link" @click="handleEdit(row)">编辑</Button>
        <Button size="small" type="link" @click="handleRecharge(row)">
          充值
        </Button>
        <Button size="small" type="link" @click="handleQuickLogin(row)">
          快捷登陆
        </Button>
        <Popconfirm title="确认删除吗？" @confirm="handleDelete(row)">
          <Button danger size="small" type="link">删除</Button>
        </Popconfirm>
      </template>
    </Grid>
  </Page>
</template>
