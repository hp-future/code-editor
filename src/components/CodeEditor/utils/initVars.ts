import { Store } from '../store';
import { GlobalVars } from '../types';

export async function initVars(vars: GlobalVars[]) {
  Store.lexer.vars = vars;
  Store.lexer.varsFilter = [];
  Store.lexer.varPattern = new RegExp(`^(${vars.map((item) => item.code).join('|')})$`);
}
