interface BasicOption {
  [key: string]: any;
  label: string;
  value: string;
}

type SelectOption = BasicOption;

type TabOption = BasicOption;

enum PermissionCode {
  /** 全局 */
  Global = 1,
  /** 个人 */
  Personal = 4,
  /** 项目 */
  Project = 2,
  /** 标签组 */
  TagGroup = 3,
}

type DecryptType = 'hide' | 'md5' | 'none';
interface BasicUserInfo {
  [key: string]: any;
  /** 管理员设置，是否支持坐席下载数据 */
  allow_down?: string;
  /** 管理员设置，是否支持坐席质检录音 */
  allow_inspection?: string;
  /** 号码加密字符，由超管设置，级别一级，控制坐席 */
  decrypt?: DecryptType;
  /** 号码加密字符，由超管设置，级别二级，控制管理员和坐席 */
  hideTel?: DecryptType;
  /** 用户名 */
  name: string;
  /** 用户权限*/
  permission: PermissionCode;
}
type ClassType = Array<object | string> | object | string;

export type {
  BasicOption,
  BasicUserInfo,
  ClassType,
  DecryptType,
  PermissionCode,
  SelectOption,
  TabOption,
};
