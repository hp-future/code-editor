import React from 'react';
import { Store } from '../store';
import * as domFunctions from '../utils/domFunctions';
import { parseHtml } from '../utils/parseHtml';
import { hiddenIntellisense, highlightCurrentLine, showIntellisense } from '../utils/utils';

/**
 * 输入框输入前事件
 */
export function beforeInputEvent(e: React.FormEvent) {}

/**
 * 输入框输入事件
 */
export function inputEvent(e: React.FormEvent) {
  const target = e.target as HTMLDivElement;
  parseHtml(target.innerText);
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
}

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
      setTimeout(() => highlightCurrentLine(), 0);
      break;
    case 'Backspace':
      const innerText = Store.current.target?.innerText || '';

      if (innerText.length === 0) {
        if (Store.current.lineNo === 0) {
          return e.preventDefault();
        }
        Store.current.lineNo--;
        setTimeout(() => highlightCurrentLine(), 0);
      }

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
    default:
      break;
  }
}

/**
 * 光标事件
 */
export function selectEvent() {
  highlightCurrentLine();
  showIntellisenseByKeyword();
}

/**
 * 根据输入关键字显示智能提示框
 * @param range   光标对象
 */
function showIntellisenseByKeyword() {
  const selection = window.getSelection();
  const range = selection!.getRangeAt(0);
  if (!range.cloneRange) {
    Store.inputKeyword = '';
    hiddenIntellisense();
    return;
  }

  // 截取输入关键字
  const { startOffset } = range;
  const text = Store.current.target!.innerText?.substring(0, startOffset);
  const matchs = text.match(/(?<=^|[\s,.;(){}\[\]])[a-zA-Z_][a-zA-Z0-9_]*$/);
  const inputKeyword = matchs ? matchs[0] : '';
  Store.inputKeyword = inputKeyword;

  if (inputKeyword) {
    const position = getRangePx(range);
    if (position.left > 0) {
      showIntellisense({ position });
    }
  } else {
    hiddenIntellisense();
  }
}

/**
 * 获取光标位置
 */
function getRangePx(range: Range) {
  const rangeRect = range!.getBoundingClientRect();
  const outboxRect = Store.outboxDom!.getBoundingClientRect();
  const left = rangeRect.left - outboxRect.left;
  const top = rangeRect.top - outboxRect.top;

  return { left, top };
}
