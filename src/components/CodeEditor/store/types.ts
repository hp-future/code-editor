import { GlobalVars } from '../types';

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
    codeSpan: HTMLSpanElement | null;
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
    // 全局变量
    vars: GlobalVars[];
    varsFilter: GlobalVars[];
    varPattern: RegExp;
  };
  // 输入关键字
  inputKeyword: string;
  // 智能提示框显示状态
  intellisenseVisible: boolean;
  // 行高
  lineHeight: number;
}
