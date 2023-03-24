/**
 * 创建行
 * @param html
 * @returns
 */
export function createLine(html: string = '', isHtml: boolean = false) {
  const div = document.createElement('div');
  div.className = 'line';
  if (isHtml) {
    div.innerHTML = html;
  } else {
    div.innerHTML = html.replaceAll(/\s/g, '&nbsp;').replaceAll('<', '&lt;');
  }
  return div;
}
