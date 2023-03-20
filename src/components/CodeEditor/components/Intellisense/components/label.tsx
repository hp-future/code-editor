import { useRef, useEffect } from 'react';
import styles from '../style.module.scss';
import { Store } from '../../../store';

export function Label({ code }: any) {
  const spanRef = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    if (spanRef.current) {
      spanRef.current.innerHTML = code.replace(
        new RegExp(Store.inputKeyword, 'i'),
        `<span style="color: rgb(5 59 247)">${code.match(new RegExp(Store.inputKeyword, 'gi'))?.[0]}</span>`
      );
    }
  }, []);
  return <span ref={spanRef} className={styles.code} />;
}
