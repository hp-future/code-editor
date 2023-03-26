import { proxyVars } from '../proxy/proxyVars';
import { Store } from '../store';
import { GlobalVars } from '../types';

export async function initVars(vars: GlobalVars[]) {
  const keywordVars = Store.lexer.keyword.map(item => ({ code: item, name: '关键字' }))

  proxyVars([...keywordVars, ...vars])

  Store.lexer.varsFilter = [];
}
