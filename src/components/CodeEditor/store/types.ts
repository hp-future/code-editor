export interface StoreType {
  current: {
    lineNo: number;
    target: HTMLDivElement | null | undefined;
  };
  inputDom: HTMLDivElement | null;
  codeDom: HTMLDivElement | null;
}
