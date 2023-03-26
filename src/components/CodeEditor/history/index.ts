import { createLine } from '../methods/line';
import { Store } from '../store';
import { parseHtml } from '../utils/parseHtml';

type HistoryType = {
  // 光标所在行
  lineNo: number;
  // 光标起点
  startOffset: number;
  // 光标终点
  endOffset: number;
  // 编辑器文本
  value: string;
};

type HistoryMethodType = {
  addhistory: (value: HistoryType) => void;
  undo: () => void;
  redo: () => void;
};

// 撤销栈
const undoData: HistoryType[] = [];
// 反撤销栈
const redoData: HistoryType[] = [];

let lastHistory: HistoryType = {
  lineNo: 0,
  startOffset: 0,
  endOffset: 0,
  value: '',
};
export const editHistory: HistoryMethodType = {
  // 撤销
  undo: () => {
    const lastHistory = undoData.pop();

    if (lastHistory) {
      Store.inputDom!.innerHTML = '';
      lastHistory.value.split('\n').forEach((lineText) => {
        Store.inputDom?.append(createLine(lineText));
      });

      parseHtml();
      setRange(lastHistory.lineNo, lastHistory.startOffset);

      if (redoData.length > 100) {
        redoData.shift();
      }
      redoData.push(lastHistory);
    }
  },
  // 反撤销
  redo: () => {
    const lastHistory = redoData.pop();

    if (lastHistory) {
      Store.inputDom!.innerHTML = '';
      lastHistory.value.split('\n').forEach((lineText) => {
        Store.inputDom?.append(createLine(lineText));
      });

      parseHtml();
      setRange(lastHistory.lineNo, lastHistory.startOffset);

      if (undoData.length > 100) {
        undoData.shift();
      }
      undoData.push(lastHistory);
    }
  },

  // 新增历史记录
  addhistory: (value) => {
    // 最多保存100条记录
    if (undoData.length > 100) {
      undoData.shift();
    }
    undoData.push(lastHistory);
    if (redoData.length > 100) {
      redoData.shift();
    }
    redoData.push(value);
    lastHistory = value;
  },
};

function setRange(startLineNo: number, startOffset: number) {
  const selection = window.getSelection();
  const range = document.createRange();
  selection?.removeAllRanges();

  const line = Store.inputDom!.children[startLineNo];
  range.setStart(line.firstChild! || line, startOffset);
  selection?.addRange(range);
}
