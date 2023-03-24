import { useReducer, useEffect, Dispatch, RefObject } from 'react';
import { GlobalVars } from './../../../store/types';
import { Store } from '../../../store';
import { hiddenIntellisense } from '../../../utils/utils';
import { insertTextByRange } from '../../../utils/range';

export type StateType = {
  // 智能提示数据
  list: GlobalVars[];
  // 当前下标
  currentIndex: number;
  // 详情
  desc: string;
};

type ActionType = {
  type: 'increment' | 'decrement' | 'currentIndex' | 'setList';
  [x: string]: any;
};

const state: StateType = {
  list: [],
  currentIndex: 0,
  desc: '',
};

function reducer(state: StateType, action: ActionType) {
  switch (action.type) {
    case 'increment':
      if (state.currentIndex === state.list.length - 1) {
        return { ...state, currentIndex: 0, desc: state.list[0].name };
      }
      return { ...state, currentIndex: state.currentIndex + 1, desc: state.list[state.currentIndex + 1].name };
    case 'decrement':
      if (state.currentIndex === 0) {
        return { ...state, currentIndex: state.list.length - 1, desc: state.list[state.list.length - 1].name };
      }
      return { ...state, currentIndex: state.currentIndex - 1, desc: state.list[state.currentIndex - 1].name };
    case 'currentIndex':
      return { ...state, currentIndex: action.currentIndex, desc: state.list[action.currentIndex].name };
    case 'setList':
      return { ...state, list: action.list, currentIndex: 0, desc: action.list[0]?.name };
    default:
      return state;
  }
}

const useStateReducer = (contentRef: RefObject<HTMLDivElement>) => {
  const [reducerState, dispatch] = useReducer(reducer, state);

  useEffect(() => {
    dispatch({ type: 'setList', list: Store.lexer.varsFilter });
  }, []);

  useEffect(() => {
    const { currentIndex, list } = reducerState;
    if (currentIndex === -1 || list.length === 0 || contentRef.current?.children.length === 0) {
      return;
    }

    contentRef.current!.querySelector('.is-active')?.classList.remove('is-active');
    contentRef.current!.children.item(currentIndex)!.classList.add('is-active');

    document.addEventListener('keydown', keydownEvent, true);
    return () => {
      document.removeEventListener('keydown', keydownEvent, true);
    };
  }, [reducerState.currentIndex, reducerState.list]);

  // 键盘事件
  function keydownEvent(e: KeyboardEvent) {
    switch (e.key) {
      case 'Enter':
        const listItem = reducerState.list[reducerState.currentIndex];
        if (listItem.type === 'function') {
          insertTextByRange(listItem.additional!.functionExample);
        } else {
          insertTextByRange(listItem.code);
        }

        hiddenIntellisense();
        e.preventDefault();
        break;
      case 'ArrowUp':
        e.preventDefault();
        dispatch({ type: 'decrement' });
        break;
      case 'ArrowDown':
        e.preventDefault();
        dispatch({ type: 'increment' });
        break;
      default:
        break;
    }
  }

  return [reducerState, dispatch] as [StateType, Dispatch<ActionType>];
};

export default useStateReducer;
