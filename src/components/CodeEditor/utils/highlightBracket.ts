import { Store } from '../store';
import * as domFunctions from '../utils/domFunctions';

const rightBracketEnum: Record<string, string> = {
  '(': ')',
  '{': '}',
  '[': ']',
};

/**
 * 高亮括号
 */
export const highlightBracket = () => {
  // 移除括号的高亮效果
  Store.codeDom?.querySelectorAll('.is-highlight').forEach((span) => span.classList.remove('is-highlight'));

  const leftBracket = getRealLeftBracket();

  if (!leftBracket) {
    return;
  }
  const rightBracket = getRightBracketByName(leftBracket.innerHTML, rightBracketEnum[leftBracket.innerHTML]);

  if (!rightBracket) {
    return;
  }

  leftBracket.classList.add('is-highlight');
  rightBracket.classList.add('is-highlight');
};

// 获取最近的左括号
function getLeftBracketByName(leftName: string, rightName: string) {
  const { startLine, startOffset } = Store.cursor;

  let startIndex: number | undefined = startOffset;

  let line = startLine;
  let flag = 0;
  while (line) {
    let leftText = startLine?.innerText.substring(0, startIndex) || '';
    let option = leftText.length - 1;
    while (option >= 0) {
      let char = leftText[option];

      if (char === rightName) {
        flag++;
      }
      if (char === leftName) {
        if (flag === 0) {
          return { lineNo: domFunctions.getPrevSibling(line).length, index: option };
        }
        flag--;
      }
      option--;
    }

    if (option === -1) {
      line = line?.previousElementSibling as HTMLElement | null;
      startIndex = undefined;
    }
  }

  return null;
}

function getRealLeftBracket() {
  const brackets = [
    getLeftBracketByName('(', ')'),
    getLeftBracketByName('{', '}'),
    getLeftBracketByName('[', ']'),
  ].filter(Boolean);

  if (brackets.length === 0) {
    return null;
  }

  const maxLineNo = Math.max(...brackets.map((item) => item!.lineNo));
  const maxIndex = Math.max(...brackets.filter((item) => item!.lineNo === maxLineNo).map((item) => item!.index));

  const codeLineSpans = Store.codeDom?.children[maxLineNo].children || [];
  let i = 0;
  let width = 0;
  while (i < codeLineSpans.length) {
    width += (codeLineSpans[i] as HTMLElement).innerText.length;

    if (width === maxIndex + 1) {
      return codeLineSpans[i];
    }
    i++;
  }

  return null;
}

// 获取右括号
function getRightBracketByName(leftName: string, rightName: string) {
  let { startLine, startOffset } = Store.cursor;

  let line = startLine;
  let flag = 0;
  while (line) {
    let rightText = startLine?.innerText.substring(startOffset) || '';
    let option = 0;
    while (option < rightText.length) {
      let char = rightText[option];

      if (char === leftName) {
        flag++;
      }
      if (char === rightName) {
        if (flag === 0) {
          return getRealRightBracket(line, option);
        }
        flag--;
      }
      option++;
    }

    if (option === rightText.length) {
      line = line?.nextElementSibling as HTMLElement | null;
      startOffset = 0;
    }
  }

  return null;
}

function getRealRightBracket(line: HTMLElement, index: number) {
  let i = 0;
  let width = 0;
  const { startLineNo, startOffset } = Store.cursor;
  const lineNo = domFunctions.getPrevSibling(line).length;
  if (lineNo === startLineNo) {
    index += startOffset;
  }
  const codeLineSpans = Store.codeDom?.children[lineNo].children || [];

  while (i < codeLineSpans.length) {
    width += (codeLineSpans[i] as HTMLElement).innerText.length;

    if (width === index + 1) {
      return codeLineSpans[i];
    }
    i++;
  }

  return null;
}
