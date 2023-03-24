// token类型
export enum TokenType {
  // 运算符
  operator = 'operate',
  // 变量
  var = 'var',
  // 空格
  space = 'space',
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
  // 字符串（半角引号包裹）
  string = 'string',
}

// 边界符
export const boundary = ['(', ')', '[', ']', '{', '}'];
// 运算符
const operate = ['+', '-', '*', '/', '>', '=', '>=', '<', '<=', '==', '!='];
// 关键字
const keyword = ['如果', '否则', '则', '并且', '或者', 'null', 'undefined'];
