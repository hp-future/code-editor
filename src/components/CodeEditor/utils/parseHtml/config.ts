// token类型
export enum TokenType {
  // 数字
  number = 'NUMBER',
  // 字符串
  string = 'STRING',
  // 关键字
  keyword = 'KEYWORD',
  // 标识符（变量名）
  identifier = 'IDENTIFIER',
  // 运算符
  operator = 'OPERATOR',
  // 标点符号
  punctuation = 'PUNCTUATION',
}

export const parseRules = {
  // 运算符
  operateRule: { pattern: /\+|\-|\*|\/|=|==|!=|>|>=|<|<=/, type: TokenType.operator },
  // 关键字
  keywordRule: { pattern: /如果|否则|则|并且|或者/, type: TokenType.keyword },
  // 标点符号
  punctuationRule: { pattern: /\;|\{|\}|\(|\)|\[|\]|\,|\./, type: TokenType.keyword },
};
