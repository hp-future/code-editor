import { GlobalVars } from './../../../store/types';

type StateProps = {
  // 智能提示数据
  list: GlobalVars[];
  // 当前下标
  currentIndex: number;
};

export const state: StateProps = {
  list: [],
  currentIndex: 0,
};
