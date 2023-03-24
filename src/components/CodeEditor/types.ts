export type GlobalVars = {
  /**
   * 变量代码
   */
  code: string;
  /**
   * 变量名称
   */
  name: string;
  /**
   * 变量描述
   */
  desc?: string;
  /**
   * 对象的属性
   */
  children?: Omit<GlobalVars, 'additional'>[];
  // 附加参数
  additional?: {
    [x: string]: any;
  };
};

export interface EditorOptionType {
  /**
   * 代码字体大小
   * @default 14
   */
  fontSize?: number;
  /**
   * 代码加粗
   * @default true
   */
  fontWeight?: boolean;
  /**
   * 初始化代码
   */
  code?: string;
  /**
   * 全局变量
   * @default []
   */
  vars: GlobalVars[];
}

export interface IProps {
  options: EditorOptionType;
}
export type ShowIntellisenseProps = {
  position: { left: number; top: number };
};
