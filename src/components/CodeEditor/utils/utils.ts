import { Store } from '../store';
import * as domFunctions from '../utils/domFunctions';
import React from 'react';
import { getRangePx } from './range';
import { GlobalVars } from '../types';
import { querySpan, hiddenSpanInfo } from './showSpanInfo';
import { showIntellisense, hiddenIntellisense } from './showIntellisense';

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
  let inputKeyword = '';
  let vars: GlobalVars[] = [];
  // 点操作
  const matchs = text.match(/(?<=^|[\s,;(){}\[\]])[a-zA-Z_]*.\s*.\.\s*[a-zA-Z0-9_]*$/);
  if (matchs) {
    const [parentCode, code] = matchs[0].split(/\s*\.\s*/);
    inputKeyword = code || '';
    if (parentCode) {
      vars = Store.lexer.vars.filter(
        (item) =>
          item.additional?.parent &&
          item.code!.toLocaleLowerCase().includes(inputKeyword.toLocaleLowerCase()) &&
          item.additional?.parent.code === parentCode
      );
    }
  } else {
    const matchs = text.match(/(?<=^|[\s,.;(){}\[\]])[a-zA-Z_][a-zA-Z0-9_]*$/);
    inputKeyword = matchs ? matchs[0] : '';
    if (!inputKeyword) {
      return hiddenIntellisense();
    }
    vars = Store.lexer.vars.filter((item) => item.code!.toLocaleLowerCase().includes(inputKeyword.toLocaleLowerCase()));
  }
  Store.inputKeyword = inputKeyword;
  Store.lexer.varsFilter = vars;
  if (vars.length > 0) {
    const position = getRangePx(range);
    if (position.left > 0) {
      showIntellisense({ position });
    }
  } else {
    hiddenIntellisense();
  }
}

/**
 * 鼠标移动到第几行
 */
export function queryLineByMouseMove(e: React.MouseEvent) {
  if (!Store.outboxDom) {
    return;
  }
  // 编辑器相对于窗口位置
  const posi = Store.outboxDom.getBoundingClientRect();
  const editorPosition = {
    left: posi.left,
    top: posi.top,
  };

  // 鼠标相对于编辑器位置
  const mousePosition = {
    x: e.clientX - editorPosition.left,
    y: e.clientY - editorPosition.top,
  };

  // 第几行
  let lineNo = Math.floor(mousePosition.y / Store.lineHeight);

  // 超出总行数
  if (lineNo > Store.lineTotal - 1) {
    hiddenSpanInfo();
    return;
  }
  querySpan(lineNo, mousePosition);
}
