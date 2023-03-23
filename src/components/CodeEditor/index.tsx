import styles from './styles/index.module.scss';
import {
  beforeInputEvent,
  inputEvent,
  clickEvent,
  keyDownEvent,
  selectEvent,
  pasteCaptureEvent,
  mouseMoveEvent,
} from './events/code-input';
import { CSSProperties, useEffect, useRef, useState } from 'react';
import { createLine } from './methods/line';
import useObserveLine from './hooks/observeLine';
import { IProps } from './types';
import { Store } from './store';
import { getVars } from './api';
import { initVars } from './utils/initVars';
import { parseHtml } from './utils/parseHtml';

const CodeEditor = (props: IProps) => {
  const codeInputRef = useRef<HTMLDivElement>(null);
  const codeStyleRef = useRef<HTMLDivElement>(null);
  const overlaysRef = useRef<HTMLDivElement>(null);
  const outboxRef = useRef<HTMLDivElement>(null);

  // 计算结果
  useEffect(() => {
    initVars({ result: props.result });
  }, [props.result]);
  // api列表
  useEffect(() => {
    initVars({ apiList: props.apiList });
  }, [props.apiList]);

  // 初始化
  useEffect(() => {
    if (codeInputRef.current) {
      Store.inputDom = codeInputRef.current;
      Store.codeDom = codeStyleRef.current;
      Store.overlaysDom = overlaysRef.current;
      Store.outboxDom = outboxRef.current;

      // 如果输入框没有子节点，添加一行
      if (codeInputRef.current.children?.length === 0) {
        codeInputRef.current.appendChild(createLine());
        parseHtml(codeInputRef.current.innerText);
      }
      setTimeout(() => {
        Store.lineHeight = codeInputRef.current?.querySelector('.line')?.clientHeight || 19;
      }, 100);
    }

    // 获取计算参数
    getVars();
  }, []);

  // 代码区域的一些样式
  const [containerStyle, setContainerStyle] = useState<CSSProperties>({});
  useEffect(() => {
    setContainerStyle({
      fontSize: (props.fontSize || 14) + 'px',
      fontWeight: props.fontWeight === false ? 'normal' : 'bold',
    });
  }, [props.fontSize, props.fontWeight]);

  // 观察行变化
  useObserveLine();

  return (
    <div className={styles.CodeEditor} ref={outboxRef}>
      <div className={styles.container} style={containerStyle}>
        <div id="codeStyleContainer" className={styles.codeStyleContainer} ref={codeStyleRef} />
        <div
          id="codeInput"
          className={styles.codeInput}
          ref={codeInputRef}
          contentEditable
          onBeforeInput={beforeInputEvent}
          onInput={inputEvent}
          onClick={clickEvent}
          onKeyDown={keyDownEvent}
          onSelect={selectEvent}
          onPasteCapture={pasteCaptureEvent}
          onMouseMove={mouseMoveEvent}
        />
      </div>
      <div className={styles.overlays} ref={overlaysRef}></div>
    </div>
  );
};

export default CodeEditor;
