import { StoreType } from './types';

export const Store: StoreType = {
  current: {
    lineNo: 0,
    target: null,
  },
  cursor: {
    startLine: null,
    startLineNo: 0,
    endLine: null,
    endLineNo: 0,
    startOffset: 0,
    endOffset: 0,
    collapsed: true,
    codeSpan: null,
  },
  inputDom: null,
  codeDom: null,
  overlaysDom: null,
  outboxDom: null,
  lineTotal: 1,
  lexer: {
    // 边界符
    boundary: ['(', ')', '[', ']', '{', '}'],
    // 运算符
    operate: ['+', '-', '*', '/', '>', '=', '>=', '<', '<=', '==', '!='],
    // 关键字
    keyword: ['如果', '否则', '则'],
    // 全局变量
    vars: [],
    varsFilter: [],
    apiPattern: /^$/,
    functionPattern: /^$/,
    calParamPattern: /^$/,
    resultPattern: /^$/,
  },
  inputKeyword: '',
  intellisenseVisible: false,
  result: '',
  lineHeight: 19,
};
