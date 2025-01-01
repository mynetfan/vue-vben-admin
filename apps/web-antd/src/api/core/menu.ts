import type { RouteRecordStringComponent } from '@vben/types';

import { requestClient } from '#/api/request';

type MenuRecord = {
  [key: string]: any;
  icon?: string;
  jump: string;
  list?: MenuRecord[];
  name: string;
  title: string;
};

/**
 * 获取用户所有菜单
 */
export async function getAllMenusApi() {
  const menus = await requestClient.get<MenuRecord[]>('/menu/get');
  function converMenus(data: MenuRecord[], parentPath = '/') {
    return data.map((item) => {
      const menu = {} as RouteRecordStringComponent;

      menu.path = `${parentPath}${parentPath.endsWith('/') ? '' : '/'}${item.name}`;
      menu.name = item.name;
      menu.meta = {
        title: item.title,
        icon: item.icon ?? 'ic:round-menu',
      };
      if (item.list && Array.isArray(item.list) && item.list.length > 0) {
        menu.children = converMenus(item.list, menu.path);
        menu.component = 'BasicLayout';
      } else {
        menu.component = item.jump;
      }

      return menu;
    });
  }
  return converMenus(menus);
}
