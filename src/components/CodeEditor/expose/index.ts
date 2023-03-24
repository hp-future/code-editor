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

export const getContentWithTag = () => {
  const lines = Array.from(Store.codeDom?.children || []);

  if (lines.length === 0) {
    return '';
  }

  const brackets: number[] = [];

  const lineTexts = lines.map((line, lineNo) => {
    let lineText = '';
    Array.from(line.children).forEach((span) => {
      const spanText = span.innerHTML;
      // 计算函数使用标签包裹
      if (Store.lexer.functionPattern.test(spanText)) {
        brackets[brackets.length] = lineNo;
        lineText += `<function${brackets.length + lineNo}>` + spanText;
      } else if (spanText === '(') {
        lineText += spanText;
        if (brackets.length > 0) {
          brackets[brackets.length - 1] += 1;
        }
      } else if (spanText === ')') {
        lineText += spanText;
        if (brackets.length > 0) {
          brackets[brackets.length - 1] -= 1;
          if (brackets[brackets.length - 1] === lineNo) {
            lineText += `</function${brackets.length + lineNo}>`;
            brackets.pop();
          }
        }
      } else {
        lineText += spanText;
      }
    });

    return lineText;
  });

  return lineTexts.join('\r\n');
};
