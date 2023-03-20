import { useEffect, useRef, useState, useReducer } from 'react';
import { Store } from '../../store';
import { GlobalVars } from '../../store/types';
import styles from './style.module.scss';
import { Label } from './components/label';
import useStateReducer from './stateReducer';

const Intellisense = () => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [desc, setDesc] = useState('');

  useEffect(() => {
    if (contentRef.current) {
      // 设置智能提示框的最大高度
      const maxHeight = Store.outboxDom!.clientHeight / 2;
      contentRef.current.style.cssText = `max-height: ${maxHeight}px`;
    }
  }, []);

  // 使用useReducer解决keydown事件中setIndex不更新的问题
  const [redcuerState, dispatch] = useStateReducer();

  useEffect(() => {
    if (
      redcuerState.currentIndex === -1 ||
      redcuerState.list.length === 0 ||
      contentRef.current?.children.length === 0
    ) {
      return;
    }

    setDesc(redcuerState.list[redcuerState.currentIndex].name);
    contentRef.current!.querySelector('.is-active')?.classList.remove('is-active');
    contentRef.current!.children.item(redcuerState.currentIndex)!.classList.add('is-active');
  }, [redcuerState.currentIndex, redcuerState.list]);

  // 点击某一项
  function clickItem(props: GlobalVars, index: number) {
    dispatch({ type: 'currentIndex', currentIndex: index });
  }

  return (
    <div className={styles.Intellisense}>
      <div className={styles.content} ref={contentRef}>
        {redcuerState.list.map((item, index) => (
          <div className={styles.item} key={item.code + '_' + index} onClick={() => clickItem(item, index)}>
            <Label code={item.code} />
            <span className={styles.typeName}>{item?.additional?.varTypeName}</span>
          </div>
        ))}
      </div>
      <div className={styles.detail} style={{ display: desc ? 'block' : 'none' }}>
        {desc}
      </div>
    </div>
  );
};

export default Intellisense;
