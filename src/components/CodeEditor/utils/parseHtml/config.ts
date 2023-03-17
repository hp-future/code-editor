// token类型
export enum TokenType {
  // 运算符
  operator = 'operate',
  // api
  api = 'api',
  // 计算结果
  result = 'result',
  // 计算函数
  function = 'function',
  // 计算参数
  calParam = 'calParam',
  // 空格
  space = 'space',
  // 常量
  const = 'const',
  // 普通字符串
  text = 'text',
}

export const parseRules = {
  // 运算符
  operateRule: { pattern: /\+|\-|\*|\/|=|==|!=|>|>=|<|<=/, type: TokenType.operator },
  // // 关键字
  // keywordRule: { pattern: /如果|否则|则|并且|或者/, type: TokenType.keyword },
  // // 标点符号
  // punctuationRule: { pattern: /\;|\{|\}|\(|\)|\[|\]|\,|\./, type: TokenType.keyword },
};
