import React from 'react';
import { Store } from '../store';
import * as domFunctions from '../utils/domFunctions';
import { highlightCurrentLine } from '../utils/utils';

/**
 * 输入框输入前事件
 */
export function beforeInputEvent(e: React.FormEvent) {}

/**
 * 输入框输入事件
 */
export function inputEvent(e: React.FormEvent) {}

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
}

/**
 * 输入框键盘按键事件
 */
export function keyDownEvent(e: React.KeyboardEvent) {
  switch (e.key) {
    case 'Enter':
      Store.current.lineNo++;
      setTimeout(() => highlightCurrentLine(), 0);
      break;
    case 'Backspace':
      // Store.current.target?.querySelector('br')?.remove();
      const innerText = Store.current.target?.innerText || '';

      if (innerText.length === 0) {
        if (Store.current.lineNo === 0) {
          return e.preventDefault();
        }
        Store.current.lineNo--;
        setTimeout(() => highlightCurrentLine(), 0);
      }

      break;
    default:
      break;
  }
}
