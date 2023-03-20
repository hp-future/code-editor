import { useReducer, useEffect, Dispatch } from 'react';
import { GlobalVars } from './../../../store/types';
import { Store } from '../../../store';
import { hiddenIntellisense } from '../../../utils/utils';

type StateType = {
  // 智能提示数据
  list: GlobalVars[];
  // 当前下标
  currentIndex: number;
};

type ActionType = {
  type: 'increment' | 'decrement' | 'currentIndex' | 'setList';
  [x: string]: any;
};

const state: StateType = {
  list: [],
  currentIndex: 0,
};

function reducer(state: StateType, action: ActionType) {
  switch (action.type) {
    case 'increment':
      if (state.currentIndex === state.list.length - 1) {
        return { ...state, currentIndex: 0 };
      }
      return { ...state, currentIndex: state.currentIndex + 1 };
    case 'decrement':
      if (state.currentIndex === 0) {
        return { ...state, currentIndex: state.list.length - 1 };
      }
      return { ...state, currentIndex: state.currentIndex - 1 };
    case 'currentIndex':
      return { ...state, currentIndex: action.currentIndex };
    case 'setList':
      return { ...state, list: action.list, currentIndex: 0 };
    default:
      return state;
  }
}

const useStateReducer = () => {
  const [reducerState, dispatch] = useReducer(reducer, state);

  useEffect(() => {
    const vars = Store.lexer.vars.filter((item) =>
      item.code!.toLocaleLowerCase().includes(Store.inputKeyword.toLocaleLowerCase())
    );

    dispatch({ type: 'setList', list: vars });

    document.addEventListener('keydown', keydownEvent, true);
    return () => {
      document.removeEventListener('keydown', keydownEvent, true);
    };
  }, []);

  // 键盘事件
  function keydownEvent(e: KeyboardEvent) {
    switch (e.key) {
      case 'Enter':
        const selection = window.getSelection();
        console.log(selection?.getRangeAt(0));

        hiddenIntellisense();
        e.preventDefault();
        break;
      case 'ArrowUp':
        dispatch({ type: 'decrement' });
        break;
      case 'ArrowDown':
        dispatch({ type: 'increment' });
        break;
      default:
        break;
    }
  }

  return [reducerState, dispatch] as [StateType, Dispatch<ActionType>];
};

export default useStateReducer;
