export type GlobalVars = {
  type: 'operate' | 'keyword' | 'boundary' | 'var' | 'function' | 'calParam' | 'api';
  code: string;
  name: string;
  // 附加参数
  additional?: {
    [x: string]: any;
  };
};

export interface StoreType {
  // 当前行
  current: {
    lineNo: number;
    target: HTMLDivElement | null | undefined;
  };
  // 光标信息
  cursor: {
    startLine: HTMLElement | null | undefined;
    startLineNo: number;
    endLine: HTMLElement | null | undefined;
    endLineNo: number;
    startOffset: number;
    endOffset: number;
    collapsed: boolean;
  };
  // 输入框
  inputDom: HTMLDivElement | null;
  // 代码展示样式
  codeDom: HTMLDivElement | null;
  // 悬浮层
  overlaysDom: HTMLDivElement | null;
  // 最外层容器
  outboxDom: HTMLDivElement | null;
  // 总行数
  lineTotal: number;
  // 词法分析器相关配置
  lexer: {
    // 边界符
    boundary: string[];
    // 运算符
    operate: string[];
    // 关键字
    keyword: string[];
    // 全局变量
    vars: GlobalVars[];
  };
  // 输入关键字
  inputKeyword: string;
  // 智能提示框显示状态
  intellisenseVisible: boolean;
}
