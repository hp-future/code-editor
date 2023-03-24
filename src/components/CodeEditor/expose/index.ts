import { Store } from './../store/index';
/**
 * 暴露给外部使用的方法
 */

import { insertTextByRange } from '../utils/range';

export const insertText = insertTextByRange;

export const getHtml = () => Store.codeDom?.innerHTML;

export const getText = () => {
  return Array.from(Store.inputDom?.children || [])
    .map((line) => (line as HTMLElement).innerText)
    .join('\n');
};
