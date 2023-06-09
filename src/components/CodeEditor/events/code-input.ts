import { editHistory } from './../history/index';
import React from 'react';
import { Store } from '../store';
import * as domFunctions from '../utils/domFunctions';
import { parseHtml } from '../utils/parseHtml';
import { highlightCurrentLine, showIntellisenseByKeyword, queryLineByMouseMove } from '../utils/utils';
import { hiddenIntellisense } from '../utils/showIntellisense';
import { insertTextByRange, setCursorInfo } from '../utils/range';
import { getText } from '../expose';
import { highlightBracket } from '../utils/highlightBracket';

let beforeInputEventTimeId: NodeJS.Timeout;

/**
 * 输入框输入前事件
 */
export function beforeInputEvent(e: any) {
  if (e.data === '\n') {
    return;
  }

  editHistory.addhistory({
    lineNo: Store.cursor.startLineNo,
    startOffset: Store.cursor.startOffset,
    endOffset: Store.cursor.endOffset,
    value: Store.inputDom!.innerText || '',
  });
  clearTimeout(beforeInputEventTimeId);
  beforeInputEventTimeId = setTimeout(() => {
    showIntellisenseByKeyword();
  }, 0);
}

/**
 * 输入框输入事件
 */
export function inputEvent(e: React.FormEvent) {
  parseHtml();
}

/**
 * 输入框点击事件
 */
export function clickEvent(e: React.MouseEvent) {
  const target = e.target as HTMLDivElement;
  // 判断点击的是否是行，并高亮当前行
  const isCurrent = target.classList.value.includes('line');
  const currentLine = isCurrent ? target : target.lastElementChild;
  Store.current.lineNo = domFunctions.getPrevSibling(currentLine).length;
  highlightCurrentLine();
  hiddenIntellisense();
}

let keyDownEventTimeId: NodeJS.Timeout;
/**
 * 输入框键盘按键事件
 */
export function keyDownEvent(e: React.KeyboardEvent) {
  switch (e.key) {
    case 'Enter':
      if (Store.intellisenseVisible) {
        return e.preventDefault();
      }

      Store.current.lineNo++;
      clearTimeout(keyDownEventTimeId);
      keyDownEventTimeId = setTimeout(() => {
        highlightCurrentLine();
      }, 0);
      break;
    case 'Backspace':
      const innerText = Store.current.target?.innerText || '';

      if (innerText.length === 0) {
        if (Store.current.lineNo === 0) {
          return e.preventDefault();
        }
        Store.current.lineNo--;
      }
      clearTimeout(keyDownEventTimeId);
      keyDownEventTimeId = setTimeout(() => {
        highlightCurrentLine();
        showIntellisenseByKeyword();
      }, 0);

      break;
    case 'ArrowUp':
      if (Store.intellisenseVisible) {
        return e.preventDefault();
      }
      break;
    case 'ArrowDown':
      if (Store.intellisenseVisible) {
        return e.preventDefault();
      }
      break;
    case 'z':
      if (e.ctrlKey) {
        editHistory.undo();
        hiddenIntellisense();
        return e.preventDefault();
      }
      break;
    case 'y':
      if (e.ctrlKey) {
        editHistory.redo();
        hiddenIntellisense();
        return e.preventDefault();
      }
      break;
    case 'Tab':
      insertTextByRange('  ');
      return e.preventDefault();
    default:
      break;
  }
}

/**
 * 光标事件
 */
export function selectEvent() {
  const selection = window.getSelection()!;
  if (selection.rangeCount === 0) {
    return;
  }
  const range = selection.getRangeAt(0);
  setCursorInfo(range);

  highlightCurrentLine();
  if (range.collapsed) {
    highlightBracket();
  }
}

/**
 * 粘贴事件
 */
export async function pasteCaptureEvent(e: React.ClipboardEvent) {
  e.preventDefault();

  const text = await navigator.clipboard.readText();

  insertTextByRange(text.replaceAll('\r', ''));
}

/**
 * 鼠标移动事件
 */
export function mouseMoveEvent(e: React.MouseEvent) {
  queryLineByMouseMove(e);
}
