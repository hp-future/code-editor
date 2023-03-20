import { StoreType } from './types';

export const Store: StoreType = {
  current: {
    lineNo: 0,
    target: null,
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
  },
  inputKeyword: '',
  intellisenseVisible: false,
};
