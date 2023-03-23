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
  // 关键字
  keyword = 'keyword',
  // 标点符号
  punctuation = 'punctuation',
  // 边界符
  boundary = 'boundary',
  // 数字
  number = 'number',
}
