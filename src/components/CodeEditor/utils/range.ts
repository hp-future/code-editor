import { createLine } from '../methods/line';
import { Store } from '../store';
import { parseHtml } from './parseHtml';
import * as domFunctions from './domFunctions';
import { editHistory } from '../history';

/**
 * 在光标处插入文本
 * @param text  要插入的文本
 */
export function insertTextByRange(text: string) {
  let { startOffset, endOffset, startLineNo, endLineNo } = Store.cursor;

  if (Store.intellisenseVisible) {
    startOffset -= Store.inputKeyword.length;
  }

  const inputDomText = Array.from(Store.inputDom?.children || [])
    .map((line) => (line as HTMLElement).innerText)
    .join('\n');

  let wholeText = '';
  inputDomText.split('\n').forEach((lineText, index) => {
    if (index < startLineNo) {
      wholeText += lineText + '\n';
    } else if (index === startLineNo) {
      if (startLineNo === endLineNo) {
        wholeText += lineText.substring(0, startOffset) + text + lineText.substring(endOffset) + '\n';
      } else {
        wholeText += lineText.substring(0, startOffset) + text;
      }
    } else if (index > startLineNo) {
      if (index === endLineNo) {
        wholeText += lineText.substring(endOffset) + '\n';
      } else if (index > endLineNo) {
        wholeText += lineText + '\n';
      }
    }
  });

  Store.inputDom!.innerHTML = '';
  wholeText.split('\n').forEach((lineText) => {
    Store.inputDom?.append(createLine(lineText));
  });
  parseHtml(wholeText);

  editHistory.addhistory({
    lineNo: Store.cursor.startLineNo,
    startOffset: Store.cursor.startOffset,
    endOffset: Store.cursor.endOffset,
    value: Store.inputDom!.innerText || '',
  });

  const selection = window.getSelection();
  const range = document.createRange();
  selection?.removeAllRanges();
  const splitTexts = text.split('\n');

  let newLineNo = startLineNo;
  if (splitTexts.length > 1) {
    newLineNo = splitTexts.length + startLineNo - 1;
    const newLine = Store.inputDom?.children[newLineNo];
    const lastText = splitTexts.pop();
    range.setStart(newLine!.firstChild! || newLine, lastText?.length || 0);
  } else {
    const newLine = Store.inputDom?.children[startLineNo];
    range.setStart(newLine!.firstChild! || newLine, startOffset + text.length);
  }
  selection?.addRange(range);
}

/**
 * 保存光标信息
 * @param range
 */
export function setCursorInfo(range: Range) {
  const { startOffset, startContainer, endContainer, endOffset, collapsed } = range;

  Store.cursor.startOffset = startOffset;
  Store.cursor.endOffset = endOffset;

  if (startOffset > endOffset) {
    Store.cursor.startOffset = endOffset;
    Store.cursor.endOffset = startOffset;
  }

  Store.cursor.startLine =
    startContainer.nodeName === '#text' ? startContainer.parentElement : (startContainer as HTMLDivElement);
  Store.cursor.startLineNo = domFunctions.getPrevSibling(Store.cursor.startLine).length;
  Store.cursor.endLine =
    endContainer.nodeName === '#text' ? endContainer.parentElement : (endContainer as HTMLDivElement);
  Store.cursor.endLineNo = domFunctions.getPrevSibling(Store.cursor.endLine).length;
  Store.cursor.collapsed = collapsed;

  getNodeByCursor();
}

/**
 * 获取光标位置
 */
export function getRangePx(range: Range) {
  const rangeRect = range!.getBoundingClientRect();
  const outboxRect = Store.outboxDom!.getBoundingClientRect();
  const left = rangeRect.left - outboxRect.left;
  const top = rangeRect.top - outboxRect.top;

  return { left, top };
}

/**
 * 通过光标定位所在节点
 */
export function getNodeByCursor() {
  const { startOffset, startLineNo, collapsed, startLine } = Store.cursor;
  if (!collapsed || startOffset === 0) {
    Store.cursor.codeSpan = null;
    return;
  }

  const codeLineSpans = Store.codeDom?.children[startLineNo].children || [];

  const leftText = startLine?.innerText.substring(0, startOffset) || '';

  let i = 0;
  let width = 0;
  while (i < codeLineSpans.length) {
    width += (codeLineSpans[i] as HTMLElement).innerText.length;

    if (width >= leftText.length) {
      Store.cursor.codeSpan = codeLineSpans[i] as HTMLSpanElement;
      return codeLineSpans[i];
    }
    i++;
  }

  Store.cursor.codeSpan = null;
  return null;
}
