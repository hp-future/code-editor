import { Store } from '../store'
import { StoreType } from '../store/types'
import { GlobalVars } from '../types'
import { parseHtml } from '../utils/parseHtml'


/**
 * 监听vars变化，更新 varPattern，更新代码
 * @param initVars 
 */
export function proxyVars(initVars: GlobalVars[] = []) {
  Store.lexer = new Proxy({ ...Store.lexer }, {
    set(target: StoreType['lexer'], p: string, newValue: any, receiver: any) {
      if (p === 'vars') {
        const vars: GlobalVars[] = newValue
        Store.lexer.varPattern = new RegExp(`^(${vars.map((item) => item.code).join('|')})$`);
        parseHtml()
      }
      return Reflect.set(target, p, newValue, receiver)
    },
    get(target: StoreType['lexer'], p: string, receiver: any) {
      return Reflect.get(target, p, receiver)
    }
  })
  Store.lexer.vars = new Proxy(initVars, {
    set(target: GlobalVars[], p: string, newValue, receiver: any) {
      Reflect.set(target, p, newValue, receiver)
      Store.lexer.varPattern = new RegExp(`^(${Store.lexer.vars.map((item) => item.code).join('|')})$`);

      parseHtml()
      return true
    }
    ,
    get(target: GlobalVars[], p: any, receiver: any) {
      return Reflect.get(target, p, receiver)
    }
  })
}