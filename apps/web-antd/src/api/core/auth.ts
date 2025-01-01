import type { AxiosResponse } from '@vben/request';

import { Md5 } from 'ts-md5';

import { baseRequestClient, requestClient } from '#/api/request';

export namespace AuthApi {
  /** 登录接口参数 */
  export interface LoginParams {
    company?: string;
    name?: string;
    passwd?: string;
    verifyCode?: string;
  }

  /** 登录接口返回值 */
  export interface LoginResult {
    access_token: string;
    role: string;
  }

  export interface RefreshTokenResult {
    data: string;
    status: number;
  }
}

export async function getVerifyImg() {
  return baseRequestClient.get<AxiosResponse<Blob>>('/verifyCode', {
    responseType: 'blob',
    withCredentials: true,
  });
}

/**
 * 登录
 */
export async function loginApi(data: AuthApi.LoginParams) {
  const passwd =
    data.passwd?.length === 32 ? data.passwd : Md5.hashStr(data.passwd || '');

  return requestClient.post<AuthApi.LoginResult>(
    '/login',
    { ...data, passwd },
    {
      withCredentials: true,
    },
  );
}

/**
 * 刷新accessToken
 */
export async function refreshTokenApi() {
  return baseRequestClient.post<AuthApi.RefreshTokenResult>('/auth/refresh', {
    withCredentials: true,
  });
}

/**
 * 退出登录
 */
export async function logoutApi() {
  return baseRequestClient.post('/auth/logout', {
    withCredentials: true,
  });
}

/**
 * 获取用户权限码
 */
export async function getAccessCodesApi() {
  return requestClient.get<string[]>('/auth/codes');
}
