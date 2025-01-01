export namespace ApiProject {
  // const ApiPrefix = '/admin/project';
  export type ProjectModel = {
    [k: string]: any;
    id: number;
    name: string;
  };
  /**
   * 获取项目列表
   * @description 此接口是虚拟数据，请根据实际接口替换
   * @returns
   */
  export function getProjectList() {
    // return requestClient.get(`${ApiPrefix}/list`);
    return [{ id: 1, name: 'test' }];
  }
}
