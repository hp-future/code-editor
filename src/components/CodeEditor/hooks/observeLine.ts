import { useEffect } from 'react';
/**
 * 自定义 hook，观察行变化
 * @param target
 */
function useObserveLine(target: HTMLDivElement | null) {
  useEffect(() => {
    if (!target) return;

    const mutationObserver = new MutationObserver(() => {
      console.log(target);
    });
    mutationObserver.observe(target, { childList: true, subtree: true });
    return () => {
      mutationObserver.disconnect();
    };
  }, []);
}

export default useObserveLine;
