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
    keyword: ['如果', '否则', '则', '并且', '或者', 'null', 'undefined'],
    // 全局变量
    vars: [],
    varsFilter: [],
    varPattern: /^$/,
  },
  inputKeyword: '',
  intellisenseVisible: false,
  lineHeight: 19,
};

