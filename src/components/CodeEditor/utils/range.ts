import { editHistory } from '../history';
import { createLine } from '../methods/line';
import { Store } from '../store';
import { parseHtml } from './parseHtml';
import * as domFunctions from './domFunctions';

/**
 * 在光标处插入文本
 * @param text  要插入的文本
 */
export function insertTextByRange(text: string) {
  let { startOffset, endOffset, startLineNo, endLineNo } = Store.cursor;

  if (Store.intellisenseVisible) {
    startOffset -= Store.inputKeyword.length;
  }

  let wholeText = '';
  Store.inputDom!.innerText.split('\n').forEach((lineText, index) => {
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
    Store.inputDom?.append(createLine(lineText.replaceAll(/\s/g, '&nbsp;').replaceAll('<', '&lt;')));
  });
  parseHtml(wholeText);

  editHistory.addhistory({
    lineNo: startLineNo,
    startOffset: startOffset + text.length,
    endOffset: startOffset + text.length,
    value: wholeText,
  });

  const selection = window.getSelection();
  const range = document.createRange();
  selection?.removeAllRanges();
  const splitTexts = text.split('\n');
  if (splitTexts.length > 1) {
    const newLineNo = splitTexts.length + startLineNo - 1;
    const lastText = splitTexts.pop();
    range.setStart(Store.inputDom!.children[newLineNo].firstChild!, lastText?.length || 0);
  } else {
    range.setStart(Store.inputDom!.children[startLineNo].firstChild!, startOffset + text.length);
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
