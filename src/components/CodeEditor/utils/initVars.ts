import { Store } from '../store';
import { GlobalVars } from '../types';

export async function initVars(vars: GlobalVars[]) {
  const keywordVars = Store.lexer.keyword.map(item => ({ code: item, name: '关键字' }))
  Store.lexer.vars = [...keywordVars, ...vars];
  Store.lexer.varsFilter = [];
  Store.lexer.varPattern = new RegExp(`^(${vars.map((item) => item.code).join('|')})$`);
}
