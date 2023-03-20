import { createRoot } from 'react-dom/client';
import { Store } from '../store';
import * as domFunctions from '../utils/domFunctions';
import Intellisense from '../components/Intellisense';
import { ShowIntellisenseProps } from '../types';
import React from 'react';

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

/**
 * 显示智能提示框
 */
export function showIntellisense({ position }: ShowIntellisenseProps) {
  hiddenIntellisense();

  Store.intellisenseVisible = true;

  const div = document.createElement('div');
  div.id = 'Intellisense-container';
  div.style.cssText = `position:absolute;left:${position.left}px;top:${position.top}px;margin-top: calc(1em + 5px);`;

  const root = createRoot(div);
  root.render(React.createElement(Intellisense));
  Store.overlaysDom?.appendChild(div);
}

/**
 * 关闭智能提示框
 */
export function hiddenIntellisense() {
  document.getElementById('Intellisense-container')?.remove();
  Store.intellisenseVisible = false;
}
