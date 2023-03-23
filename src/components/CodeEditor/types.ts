export interface IProps {
  fontSize: number;
  fontWeight: boolean;
  // 计算结果
  result: string;
  // api列表
  apiList: any[];

  code: string;
}

export type ShowIntellisenseProps = {
  position: { left: number; top: number };
};
