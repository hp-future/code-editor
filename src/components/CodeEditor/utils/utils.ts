import { createRoot, Root } from 'react-dom/client';
import { Store } from '../store';
import * as domFunctions from '../utils/domFunctions';
import Intellisense from '../components/Intellisense';
import { ShowIntellisenseProps } from '../types';
import React from 'react';
import { getRangePx } from './range';

/**
 * 高亮当前行
 */
export function highlightCurrentLine() {
  const selection = window.getSelection();
  const range = selection!.getRangeAt(0);
  if (!range.cloneRange) {
    return;
  }

  const { startContainer } = range;

  let currentLine;
  if (startContainer.nodeName === '#text') {
    currentLine = startContainer.parentElement as HTMLDivElement;
  } else {
    currentLine = startContainer as HTMLDivElement;
  }

  Store.current.lineNo = domFunctions.getPrevSibling(currentLine).length;
  Store.current.target = currentLine;

  currentLine?.classList.add('current');
  domFunctions.getSibling(currentLine).forEach((item) => item.classList.remove('current'));
}

let root: Root;
/**
 * 显示智能提示框
 */
export function showIntellisense({ position }: ShowIntellisenseProps) {
  hiddenIntellisense();

  Store.intellisenseVisible = true;

  const div = document.createElement('div');
  div.id = 'Intellisense-container';
  div.style.cssText = `position:absolute;left:${position.left}px;top:${position.top}px;margin-top: calc(1em + 5px);`;

  root = createRoot(div);
  root.render(React.createElement(Intellisense));
  Store.overlaysDom?.appendChild(div);
}

/**
 * 关闭智能提示框
 */
export function hiddenIntellisense() {
  document.getElementById('Intellisense-container')?.remove();
  root?.unmount();
  Store.intellisenseVisible = false;
}

/**
 * 根据输入关键字显示智能提示框
 */
export function showIntellisenseByKeyword() {
  const selection = window.getSelection();
  const range = selection!.getRangeAt(0);

  if (!range.collapsed) {
    return hiddenIntellisense();
  }

  // 截取输入关键字
  const { startOffset } = range;
  const text = Store.current.target!.innerText?.substring(0, startOffset);
  const matchs = text.match(/(?<=^|[\s,.;(){}\[\]])[a-zA-Z_][a-zA-Z0-9_]*$/);
  const inputKeyword = matchs ? matchs[0] : '';
  Store.inputKeyword = inputKeyword;

  if (!inputKeyword) {
    return hiddenIntellisense();
  }

  const vars = Store.lexer.vars.filter((item) =>
    item.code!.toLocaleLowerCase().includes(inputKeyword.toLocaleLowerCase())
  );

  if (vars.length > 0) {
    const position = getRangePx(range);
    if (position.left > 0) {
      showIntellisense({ position });
    }
  } else {
    hiddenIntellisense();
  }
}
