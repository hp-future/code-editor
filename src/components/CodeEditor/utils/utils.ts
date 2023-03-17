import { Store } from '../store';
import * as domFunctions from '../utils/domFunctions';

/**
 * 高亮当前行
 */
export function highlightCurrentLine() {
  const currentLine = Store.inputDom?.children[Store.current.lineNo];
  Store.current.target = currentLine as HTMLDivElement | null;

  currentLine?.classList.add('current');
  domFunctions.getSibling(currentLine).forEach((item) => item.classList.remove('current'));
}
