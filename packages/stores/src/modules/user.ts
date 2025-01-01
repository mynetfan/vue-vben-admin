import type { BasicUserInfo } from '@vben-core/typings';

import { acceptHMRUpdate, defineStore } from 'pinia';

interface AccessState {
  /**
   * 用户信息
   */
  userInfo: BasicUserInfo | null;
  /**
   * 用户角色
   */
  userRole: string;
}

/**
 * @zh_CN 用户信息相关
 */
export const useUserStore = defineStore('core-user', {
  actions: {
    setUserInfo(userInfo: BasicUserInfo | null) {
      // 设置用户信息
      this.userInfo = userInfo
        ? {
            ...userInfo,
            avatar: '',
            realName: userInfo?.name ?? '',
          }
        : null;
      // 设置角色信息
      // const roles = userInfo?.roles ?? [];
      // this.setUserRoles(roles);
    },
    setUserRole(role: string) {
      this.userRole = role;
    },
  },
  state: (): AccessState => ({
    userInfo: null,
    userRole: '',
  }),
});

// 解决热更新问题
const hot = import.meta.hot;
if (hot) {
  hot.accept(acceptHMRUpdate(useUserStore, hot));
}
