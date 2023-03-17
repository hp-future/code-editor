/**
 * 创建行
 * @param html
 * @returns
 */
export function createLine(html: string = '') {
  const div = document.createElement('div');
  div.className = 'line';
  div.innerHTML = html;
  return div;
}
