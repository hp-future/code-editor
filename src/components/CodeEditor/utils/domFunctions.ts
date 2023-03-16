/**
 * 获取所有兄弟元素
 * @param target    目标元素
 */
export function getSibling(target: Element | null | undefined) {
  return [...getPrevSibling(target), ...getNextSibling(target)];
}

/**
 * 获取前面所有兄弟元素
 * @param target    目标元素
 */
export function getPrevSibling(target: Element | null | undefined) {
  const prevSiblings = [];

  let el = target;

  while (el) {
    el = el.previousElementSibling;
    if (el) {
      prevSiblings.push(el);
    }
  }

  return prevSiblings;
}

/**
 * 获取后面所有兄弟元素
 * @param target    目标元素
 */
export function getNextSibling(target: Element | null | undefined) {
  const nextSiblings = [];

  let el = target;

  while (el) {
    el = el.nextElementSibling;
    if (el) {
      nextSiblings.push(el);
    }
  }

  return nextSiblings;
}
