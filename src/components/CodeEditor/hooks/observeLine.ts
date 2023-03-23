import { Store } from './../store/index';
import { useEffect } from 'react';

/**
 * 自定义 hook，观察行变化
 */
function useObserveLine() {
  useEffect(() => {
    const target = document.getElementById('codeStyleContainer');

    if (!target) return;

    const mutationObserver = new MutationObserver(() => {
      // 更新总行数
      Store.lineTotal = target.children.length;
      // todo
    });
    mutationObserver.observe(target, { childList: true });

    return () => {
      mutationObserver.disconnect();
    };
  }, []);
}

export default useObserveLine;
