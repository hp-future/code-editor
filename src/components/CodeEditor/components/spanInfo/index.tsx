import styles from './style.module.scss';

const SpanInfo = (props: any) => {
  return (
    <div className={styles.SpanInfo}>
      <div className={styles.title}>{props.name}</div>
      <div className={styles.desc}>{props.desc ?? '暂无描述信息'}</div>
    </div>
  );
};

export default SpanInfo;
