<script lang="ts" setup>
import type { MenuInfo } from 'ant-design-vue/es/menu/src/interface';

import { Page, useVbenModal, type VbenFormProps } from '@vben/common-ui';

import {
  Button,
  Dropdown,
  Menu,
  MenuDivider,
  MenuItem,
  message,
  Modal,
  Popconfirm,
  Tag,
} from 'ant-design-vue';

import { useVbenVxeGrid, type VxeTableGridOptions } from '#/adapter/vxe-table';
import { ApiTask } from '#/api';

import CFormModal from './modules/formModal.vue';
import CImportModal from './modules/importModal.vue';
import CQuickImportModal from './modules/quickImportModal.vue';

defineOptions({ name: 'ProjectTask' });

const formOptions: VbenFormProps = {
  schema: [
    {
      fieldName: 'name',
      component: 'Input',
      componentProps: {
        clearable: true,
      },
      label: '名称',
    },
    {
      fieldName: 'status',
      component: 'Select',
      label: '状态',
      componentProps: {
        options: [
          { label: '默认', value: -1 },
          { label: '已停止', value: 0 },
          { label: '执行中', value: 1 },
        ],
      },
      defaultValue: -1,
    },
    {
      fieldName: 'project_id',
      component: 'Select',
      label: '项目',
    },
  ],
};

const gridOptions: VxeTableGridOptions = {
  height: 'auto',
  columns: [
    { title: 'id', field: 'id', width: 50 },
    { field: 'name', title: '名称' },
    { field: 'projectName', title: '项目' },
    {
      field: 'status',
      title: '状态',
      slots: { default: 'status' },
    },
    { field: 'outboundType', title: '外呼类型' },
    { field: 'noCalls', title: '未呼数' },
    { field: 'total', title: '总数' },
    { field: 'action', title: '操作', slots: { default: 'action' } },
  ],
  proxyConfig: {
    ajax: {
      query({ page }, formValues) {
        return ApiTask.getPageList({
          name: formValues.name || '',
          project_id: formValues.project_id || '0',
          status: formValues.status || -1,
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

const [Grid, gridApi] = useVbenVxeGrid({
  gridOptions,
  formOptions,
});

const [FormModal, formModalApi] = useVbenModal({
  connectedComponent: CFormModal,
  destroyOnClose: true,
});

const [ImportModal, importModalApi] = useVbenModal({
  connectedComponent: CImportModal,
  destroyOnClose: true,
});

const [QuickImportModal, quickImportModalApi] = useVbenModal({
  connectedComponent: CQuickImportModal,
  destroyOnClose: true,
});

function handleEdit(row: ApiTask.TaskModel) {
  formModalApi.setData(row);
  formModalApi.open();
}

function handleDelete(row: ApiTask.TaskModel) {
  ApiTask.remove(row.id).then(() => {
    message.success('删除成功');
    gridApi.query();
  });
}
function handleAdd() {
  formModalApi.setData({});
  formModalApi.open();
}
function onTaskSaved() {
  gridApi.query();
}

function handleClear(row: ApiTask.TaskModel) {
  Modal.confirm({
    title: '确认操作',
    content: `确认清空任务【${row.name}】吗？`,
    onOk() {
      const hideMessage = message.loading({
        content: `正在清空...`,
        duration: 0,
        key: `clear-${row.id}`,
      });
      ApiTask.clear(row.id)
        .then(() => {
          message.success({
            content: '清空成功',
            duration: 2,
            key: `clear-${row.id}`,
          });
          gridApi.query();
        })
        .catch(() => {
          hideMessage();
        });
    },
  });
}
function handleRecovery(row: ApiTask.TaskModel) {
  Modal.confirm({
    title: '确认操作',
    content: `确认回收任务【${row.name}】吗？`,
    onOk() {
      const hideMessage = message.loading({
        content: `正在回收...`,
        duration: 0,
        key: `recovery-${row.id}`,
      });
      ApiTask.recovery(row.id)
        .then(() => {
          message.success({
            content: '回收成功',
            duration: 2,
            key: `recovery-${row.id}`,
          });
          gridApi.query();
        })
        .catch(() => {
          hideMessage();
        });
    },
  });
}
function handleSetStatus(row: ApiTask.TaskModel) {
  const statusText = row.status === 0 ? '执行' : '停止';
  Modal.confirm({
    title: '确认操作',
    content: `确认${statusText}任务【${row.name}】吗？`,
    onOk() {
      const status = row.status === 0 ? 1 : 0;
      const hideMessage = message.loading({
        content: `正在${statusText}...`,
        duration: 0,
        key: `set-status-${row.id}`,
      });
      ApiTask.setStatus(row.id, status)
        .then(() => {
          message.success({
            duration: 2,
            content: `${statusText}成功`,
            key: `set-status-${row.id}`,
          });
          gridApi.query();
        })
        .catch(() => {
          hideMessage();
        });
    },
  });
}

function onActionClick({ key }: MenuInfo, row: ApiTask.TaskModel) {
  switch (key) {
    case 'clear': {
      handleClear(row);
      break;
    }
    case 'import': {
      importModalApi.setData(row);
      importModalApi.open();
      break;
    }
    case 'quickImport': {
      quickImportModalApi.setData(row);
      quickImportModalApi.open();
      break;
    }
    case 'recovery': {
      handleRecovery(row);
      break;
    }
    case 'status': {
      handleSetStatus(row);
      break;
    }
  }
}
</script>
<template>
  <Page auto-content-height>
    <FormModal @success="onTaskSaved" />
    <ImportModal @success="onTaskSaved" />
    <QuickImportModal @success="onTaskSaved" />
    <Grid>
      <template #toolbar-actions>
        <Button type="primary" @click="handleAdd">创建新任务</Button>
      </template>
      <template #status="{ row }">
        <Tag v-if="row.status === 0" color="error">已停止</Tag>
        <Tag v-else-if="row.status === 1" color="processing">执行中</Tag>
      </template>
      <template #action="{ row }">
        <Button link size="small" type="link" @click="handleEdit(row)">
          编辑
        </Button>
        <Popconfirm title="确认删除吗？" @confirm="handleDelete(row)">
          <Button danger link size="small" type="link">删除</Button>
        </Popconfirm>
        <Dropdown>
          <Button size="small" type="link">更多</Button>
          <template #overlay>
            <Menu @click="onActionClick($event, row)">
              <MenuItem key="status">
                {{ row.status === 0 ? '执行' : '停止' }}
              </MenuItem>
              <MenuDivider />
              <MenuItem key="quickImport">快速导入</MenuItem>
              <MenuItem key="import">导入数据</MenuItem>
              <MenuDivider />
              <MenuItem key="recovery">回收未呼</MenuItem>
              <MenuItem key="clear">清空未呼</MenuItem>
            </Menu>
          </template>
        </Dropdown>
      </template>
    </Grid>
  </Page>
</template>
