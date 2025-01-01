import type { ApiPageResult } from '../types';

import { useAccessStore } from '@vben/stores';
import { downloadFileFromBlobPart } from '@vben/utils';

import iconv from 'iconv-lite';

import { baseRequestClient, requestClient } from '#/api/request';

export namespace ApiTask {
  const ApiPrefix = '/admin/project_task';
  export type TaskModel = {
    [property: string]: any;
    create_stamp: string;
    id: number;
    name: string;
    noCalls: number;
    outboundType: number;
    project_id: number;
    projectName: string;
    status: number;
    timer: string;
    total: number;
  };

  export type SearchParams = {
    limit: number;
    name?: string;
    page: number;
    project_id?: number;
    status: number;
  };

  export function getPageList(params: SearchParams) {
    return requestClient.post<ApiPageResult<TaskModel>>(
      `${ApiPrefix}/grid`,
      params,
    );
  }

  export function remove(id: number | number[]) {
    return requestClient.post(`${ApiPrefix}/remove`, {
      ids: Array.isArray(id) ? id.join(',') : id,
    });
  }

  export function create(name: string, project_id: number) {
    return requestClient.post(`${ApiPrefix}/add`, { name, project_id });
  }

  export function update(id: number, name: string) {
    return requestClient.post(`${ApiPrefix}/edit`, { id, name });
  }

  export function setStatus(id: number, status: number) {
    return requestClient.post(`${ApiPrefix}/editStatus`, { id, status });
  }

  export type ImportDataType = {
    file: File;
    import_filter: 0 | 1;
    import_order: 0 | 1;
    project_id: number;
    task_id: number;
  };

  export function importData(data: ImportDataType) {
    return requestClient.post(`${ApiPrefix}/import`, data);
  }

  /**
   * 下载模板
   * @param project_id 项目ID
   * @param fileName 本地文件名
   * @param encoding 转换编码，留空不转换。如果使用csv格式，一般需要转换为gbk，否则excel打开可能会乱码
   */
  export async function downloadTemplate(
    project_id: number,
    fileName = 'task_template.csv',
    encoding = '',
  ) {
    const accessStore = useAccessStore();
    const result = await baseRequestClient.get(`/task/template`, {
      params: { project_id, access_token: accessStore.accessToken },
    });
    downloadFileFromBlobPart({
      source: encoding ? iconv.encode(result.data, encoding) : result.data,
      fileName,
    });
  }

  export type QuickImportParams = {
    project_id: number;
    task_id: number;
    tels: string;
  };

  export function quickImport(data: QuickImportParams) {
    return requestClient.post(`${ApiPrefix}/quick_import`, data);
  }

  export function recovery(id: number) {
    return requestClient.post(`${ApiPrefix}/recovery`, { id });
  }

  export function clear(id: number) {
    return requestClient.post(`${ApiPrefix}/clear`, { task_id: id });
  }
}
