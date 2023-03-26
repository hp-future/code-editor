import { createLine } from '../../methods/line';
import { Store } from '../../store';
import { TokenType } from './config';

/**
 * 把输入的文本解析成html标签包裹
 */
export function parseHtml() {
  const lines = Array.from(Store.inputDom?.children || []).map(line => (line as HTMLDivElement).innerText)

  Store.codeDom?.replaceChildren();

  lines.forEach((lineText) => {
    Store.codeDom?.appendChild(createLine(getHtmlString(lineText), true));
  });
}

/**
 * 根据文本转为成html标签
 * @param text      目标文本
 * @return {String} html标签字符串
 */
function getHtmlString(text: string) {
  if (text.length === 0) {
    return '';
  }
  const tokens = [];

  let option = 0;

  while (option < text.length) {
    let char = text[option];

    // 空格
    if (/\s/.test(char)) {
      let value = '';
      while (/\s/.test(char)) {
        value += '&nbsp;';
        option++;
        char = text[option];
      }
      tokens.push({
        type: TokenType.space,
        value: value,
      });
      continue;
    }

    // 数字
    if (/[0-9]/.test(char)) {
      let value = '';
      while (char && !/[\s;,.(){}[\]+\-*\/>=<!]/.test(char)) {
        value += char;
        option++;
        char = text[option];
      }
      if (/^[0-9]+$/.test(value)) {
        tokens.push({
          type: TokenType.number,
          value: value,
        });
      } else {
        tokens.push({
          type: TokenType.text,
          value: value,
        });
      }
      continue;
    }

    // 字符串（半角引号包裹）
    if (char === "'") {
      let value = char;

      while (char) {
        option++;
        char = text[option];
        if (char) {
          value += char;
          if (char === "'") {
            option++;
            break;
          }
        } else {
          break;
        }
      }
      tokens.push({
        type: TokenType.string,
        value: value,
      });
      continue;
    }

    // 运算符 + - * /
    if (/\+|\-|\*|\//.test(char)) {
      tokens.push({
        type: TokenType.operator,
        value: char,
      });
      option++;
      continue;
    }

    // 运算符 = ==
    if (char === '=') {
      let value = '';
      while (char == '=') {
        value += char;
        option++;
        char = text[option];
      }
      if (/^=={0,1}$/.test(value)) {
        tokens.push({
          type: TokenType.operator,
          value: value,
        });
      } else {
        tokens.push({
          type: TokenType.text,
          value: value,
        });
      }
      continue;
    }

    // 运算符 > >= < <=
    if (/[><]/.test(char)) {
      let value = '';
      while (/[><=]/.test(char)) {
        value += char;
        option++;
        char = text[option];
      }
      if (/^[><]={0,1}$/.test(value)) {
        tokens.push({
          type: TokenType.operator,
          value: value,
        });
      } else {
        tokens.push({
          type: TokenType.text,
          value: value,
        });
      }
      continue;
    }

    // 运算符 !=
    if (char === '!') {
      let value = char;
      option++;
      char = text[option];
      while (char == '=') {
        value += char;
        option++;
        char = text[option];
      }
      if (value === '!=') {
        tokens.push({
          type: TokenType.operator,
          value: value,
        });
      } else {
        tokens.push({
          type: TokenType.text,
          value: value,
        });
      }
      continue;
    }

    // 边界符 (){}[]
    if (/[(){}[\]]/.test(char)) {
      tokens.push({
        type: TokenType.boundary,
        value: char,
      });
      option++;
      continue;
    }

    // 标点符号
    if (/[;,.]/.test(char)) {
      tokens.push({
        type: TokenType.punctuation,
        value: char,
      });
      option++;
      continue;
    }

    // 关键字 如果 否则 则 并且 或者
    if (/[如否则并或]/.test(char)) {
      let value = '';
      while (char && !/[+\-*\/=><!(){}[\];,.\s]/.test(char)) {
        value += char;
        option++;
        char = text[option];
      }
      if (/^(如果|否则|则|并且|或者)$/.test(value)) {
        tokens.push({
          type: TokenType.keyword,
          value: value,
        });
      } else {
        tokens.push({
          type: TokenType.text,
          value: value,
        });
      }
      continue;
    }

    // 标识符，全局变量
    if (/[a-zA-Z_]/.test(char)) {
      let value = '';
      while (char && /[a-zA-Z0-9_]/.test(char)) {
        value += char;
        option++;
        char = text[option];
      }

      // 变量
      if (Store.lexer.varPattern.test(value)) {
        tokens.push({
          type: TokenType.var,
          value: value,
        });
        continue;
      }

      // 关键字 null undefined
      if (/^(null|undefined)$/.test(value)) {
        tokens.push({
          type: TokenType.keyword,
          value: value,
        });
        continue;
      }

      tokens.push({
        type: TokenType.text,
        value: value,
      });
      continue;
    }

    let value = '';
    // 普通文本
    while (char) {
      value += char;
      option++;
      char = text[option];
      if (!char || /[+\-*\/=><!(){}[\];,.\s]/.test(char)) {
        tokens.push({
          type: TokenType.text,
          value: value,
        });
        break;
      }
    }
    continue;
  }

  return tokens.map((item) => `<span class="${item.type}">${item.value}</span>`).join('');
}