import { RefObject, useEffect } from 'react';
import { StateType } from './stateReducer';

const useScroll = (contentRef: RefObject<HTMLDivElement>, reducerState: StateType) => {
  useEffect(() => {
    const { currentIndex, list } = reducerState;
    const contentDom = contentRef.current!;
    const contentDomHeight = contentDom.clientHeight;

    if (currentIndex === 0) {
      contentDom.scrollTop = 0;
    } else if (currentIndex === list.length - 1) {
      contentDom.scrollTop = list.length * 30 - contentDomHeight + 8;
    } else if (currentIndex * 30 + 8 >= contentDom.scrollTop + contentDomHeight) {
      contentDom.scrollTop = (currentIndex + 1) * 30 - contentDomHeight + 8;
    } else if (currentIndex * 30 + 8 <= contentDom.scrollTop) {
      contentDom.scrollTop = contentDom.scrollTop - 30;
    }
  }, [reducerState.currentIndex]);
};

export default useScroll;
