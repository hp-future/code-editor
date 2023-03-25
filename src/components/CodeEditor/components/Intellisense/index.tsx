import { useEffect, useRef } from 'react';
import { Store } from '../../store';
import { GlobalVars } from '../../types';
import styles from './style.module.scss';
import { Label } from './components/label';
import useStateReducer from './hooks/stateReducer';
import useScroll from './hooks/useScroll';
import { insertTextByRange } from '../../utils/range';
import { hiddenIntellisense } from '../../utils/showIntellisense';

const Intellisense = () => {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (contentRef.current) {
      // 设置智能提示框的最大高度
      const maxHeight = Store.outboxDom!.clientHeight / 2;
      contentRef.current.style.cssText = `max-height: ${maxHeight}px`;
    }
  }, []);

  // 使用useReducer解决keydown事件中setIndex不更新的问题
  const [redcuerState, dispatch] = useStateReducer(contentRef);
  // 优化滚动条
  useScroll(contentRef, redcuerState);

  // 点击某一项
  function clickItem(props: GlobalVars, index: number) {
    dispatch({ type: 'currentIndex', currentIndex: index });
  }

  return (
    <div className={styles.Intellisense} style={{ display: redcuerState.list.length > 0 ? 'block' : 'none' }}>
      <div className={styles.content} ref={contentRef}>
        {redcuerState.list.map((item, index) => (
          <div
            className={styles.item}
            key={item.code + '_' + index}
            onClick={() => clickItem(item, index)}
            onDoubleClick={() => {
              insertTextByRange(item.code);
              hiddenIntellisense();
            }}
          >
            <Label code={item.code} />
            {/* <span className={styles.typeName}>
              {item?.additional?.varTypeName}
            </span> */}
          </div>
        ))}
      </div>
      <div className={styles.detail} style={{ display: redcuerState.desc ? 'block' : 'none' }}>
        {redcuerState.desc}
      </div>
    </div>
  );
};

export default Intellisense;
