import type { BasicUserInfo, PermissionCode } from '@vben-core/typings';

import { acceptHMRUpdate, defineStore } from 'pinia';

interface AccessState {
  /**
   * 用户信息
   */
  userInfo: BasicUserInfo | null;
  /** 用户权限范围 */
  userPermission: PermissionCode;

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
      this.setUserPermission(userInfo?.permission ?? 4);
      this.updateHomePath();
    },
    setUserPermission(permission: PermissionCode) {
      this.userPermission = permission;
    },

    setUserRole(role: string) {
      this.userRole = role;
      this.updateHomePath();
    },

    updateHomePath() {
      if (this.userInfo && !this.userInfo.homePath) {
        if (this.userRole === 'super_admin') {
          this.userInfo.homePath = '/setting/users';
        } else if (this.userRole === 'admin') {
          this.userInfo.homePath = '/control/project_task';
        }
      }
    },
  },
  persist: {
    // 持久化
    pick: ['userRole'],
  },
  state: (): AccessState => ({
    userInfo: null,
    userPermission: 4,
    userRole: '',
  }),
});

// 解决热更新问题
const hot = import.meta.hot;
if (hot) {
  hot.accept(acceptHMRUpdate(useUserStore, hot));
}
