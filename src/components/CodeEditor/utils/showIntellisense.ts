import { Root, createRoot } from 'react-dom/client';
import React from 'react';
import { ShowIntellisenseProps } from '../types';
import { Store } from '../store';
import Intellisense from '../components/Intellisense';

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
