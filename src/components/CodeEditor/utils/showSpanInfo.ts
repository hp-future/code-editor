import { createRoot, Root } from 'react-dom/client';
import { Store } from '../store';
import SpanInfo from '../components/spanInfo';
import React from 'react';

let lastSpan: any;
/**
 * 鼠标放在了第几个 span 标签上
 */
export function querySpan(lineNo: number, mousePosition: { x: number; y: number }) {
  const codeLineSpans = Store.codeDom!.children[lineNo].children;

  let i = 0;
  let width = 0;
  while (i < codeLineSpans.length) {
    width += codeLineSpans[i].getBoundingClientRect().width;

    if (width >= mousePosition.x) {
      if (lastSpan !== codeLineSpans[i]) {
        showSpanInfo(codeLineSpans[i] as HTMLElement);
        lastSpan = codeLineSpans[i];
      }
      break;
    }
    i++;
  }
}

let SpanInfoRoot: Root;
/**
 * 鼠标放在变量上时，显示变量的详情
 * @param node
 */
function showSpanInfo(node: HTMLElement) {
  const info = Store.lexer.vars.find((item) => item.code === node.innerText);

  hiddenSpanInfo();

  if (!info) {
    return;
  }

  const nodePx = node.getBoundingClientRect();
  const outboxRect = Store.outboxDom!.getBoundingClientRect();
  const position = {
    left: nodePx.left - outboxRect.left,
    top: nodePx.top - outboxRect.top,
  };

  const div = document.createElement('div');
  div.id = 'SpanInfo-container';
  div.style.cssText = `position:absolute;left:${position.left}px;top:${position.top}px;margin-top: calc(1em + 5px);`;

  SpanInfoRoot = createRoot(div);
  SpanInfoRoot.render(React.createElement(SpanInfo, info));
  Store.overlaysDom?.appendChild(div);
}

/**
 * 关闭变量详情
 */
export function hiddenSpanInfo() {
  document.getElementById('SpanInfo-container')?.remove();
  SpanInfoRoot?.unmount();
  lastSpan = null;
}
