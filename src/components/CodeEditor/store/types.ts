export interface StoreType {
  // 当前行
  current: {
    lineNo: number;
    target: HTMLDivElement | null | undefined;
  };
  // 输入框
  inputDom: HTMLDivElement | null;
  // 代码展示样式
  codeDom: HTMLDivElement | null;
  // 总行数
  lineTotal: number;
}
