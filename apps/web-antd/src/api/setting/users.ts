import type { ApiPageResult } from '../types';

import { requestClient } from '../request';

export namespace ApiUsers {
  const ApiPrefix = '/super_admin/admin';
  /**
   * 用户数据模型
   */
  export type UserModel = {
    [property: string]: any;
    /**
     * 余额
     */
    balance: number;
    /**
     * 公司
     */
    company: string;
    /**
     * 联系人
     */
    contact: string;
    /**
     * 号码脱敏
     */
    decrypt: string;
    /**
     * ID
     */
    id: number;
    /**
     * 用户名
     */
    name: string;
    /**
     * 密码
     */
    passwd: string;
    /**
     * 录音格式
     */
    record_format: string;
    /**
     * 录音类型
     */
    record_type: number;
    /**
     * 数据存储（天）
     */
    stored_days: number;
    /**
     * 电话号码
     */
    telephone: string;
  };

  export const RecordTypes = [
    { label: '不录音', value: 0 },
    { label: '全程录音', value: 1 },
    { label: '应答录音', value: 2 },
    { label: '转坐席录音', value: 3 },
  ];

  export const DecryptTypes = [
    { label: '不脱敏', value: 'none' },
    { label: '隐藏中间', value: 'hide' },
    { label: 'MD5加密', value: 'md5' },
  ];

  type SearchParams = {
    limit: number;
    name?: string;
    page: number;
  };
  /**
   * 获取用户信息列表
   */
  export function getPageList(params: SearchParams) {
    return requestClient.post<ApiPageResult<UserModel>>(
      `${ApiPrefix}/grid`,
      params,
    );
  }

  export function create(data: Omit<UserModel, 'balance' | 'id'>) {
    return requestClient.post(`${ApiPrefix}/add`, data);
  }

  export function update(id: number, data: Omit<UserModel, 'balance' | 'id'>) {
    return requestClient.post(`${ApiPrefix}/edit`, { ...data, id });
  }
  export function remove(id: number | number[]) {
    return requestClient.post(`${ApiPrefix}/remove`, {
      ids: Array.isArray(id) ? id.join(',') : id,
    });
  }

  export type QuickLoginData = {
    access_token: string;
    role: string;
  };

  export function quickLogin(id: number) {
    return requestClient.post<QuickLoginData>(`${ApiPrefix}/quick_login`, {
      id,
    });
  }

  export function recharge(name: string, recharge_money: number, remark = '') {
    return requestClient.post(`super_admin/recharge/add`, {
      name,
      recharge_money,
      remark,
    });
  }
}
