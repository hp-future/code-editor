import { createLine } from '../../methods/line';
import { Store } from '../../store';
import { TokenType, parseRules } from './config';

/**
 * 把输入的文本解析成html标签包裹
 * @param text
 */
export function parseHtml(text: string) {
  let html = '';

  const lines = text.split('\n');

  Store.codeDom?.replaceChildren();

  lines.forEach((lineText) => {
    Store.codeDom?.appendChild(createLine(getHtmlString(lineText)));
  });
}

/**
 * 根据文本转为成html标签
 * @param text      目标文本
 * @return {String} html标签字符串
 */
function getHtmlString(text: string) {
  let html = '';
  const tokens = [];

  let currentOption = 0;

  while (currentOption < text.length) {
    let char = text[currentOption];

    // 字符串
    if (char === "'") {
      let value = char;
      currentOption++;
      char = text[currentOption];

      while (char && char !== "'") {
        value += char;
        currentOption++;
        char = text[currentOption];
      }
      if (char === "'") {
        tokens.push({
          type: TokenType.const,
          value: value + char,
        });
        currentOption++;
      } else {
        tokens.push({
          type: TokenType.text,
          value: value,
        });
      }

      continue;
    }

    // 数字
    if (/\d/.test(char)) {
      let value = '';

      while (char && !/[\s,.(){}\[\];+\-*\/']/.test(char)) {
        value += char;
        currentOption++;
        char = text[currentOption];
      }
      if (/^\d+$/.test(value)) {
        tokens.push({
          type: TokenType.const,
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

    // 空格
    if (/\s/.test(char)) {
      let value = '';

      while (char && /\s/.test(char)) {
        value += '&nbsp;';
        currentOption++;
        char = text[currentOption];
      }
      tokens.push({
        type: TokenType.space,
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

      currentOption++;
      continue;
    }

    // 运算符 = < > >= <= !=
    if (/=|<|>|!/.test(char)) {
      let value = char;
      currentOption++;
      char = text[currentOption];

      if (char !== '=' && value !== '!') {
        tokens.push({
          type: TokenType.operator,
          value: value,
        });
      } else {
        while (char === '=') {
          value += char;
          currentOption++;
          char = text[currentOption];
        }

        if (/^(=|<|>|!)=$/.test(value)) {
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
      }

      continue;
    }

    // 关键字 如果
    if (char === '如') {
      let value = char;
      currentOption++;
      char = text[currentOption];

      while (char && !/\s|\(/.test(char)) {
        value += char;
        currentOption++;
        char = text[currentOption];
      }

      if (value === '如果') {
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

    // 关键字 否则
    if (char === '否') {
      let value = char;
      currentOption++;
      char = text[currentOption];

      while (char && !/\s|\(/.test(char)) {
        value += char;
        currentOption++;
        char = text[currentOption];
      }

      if (value === '否则') {
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

    // 关键字 则
    if (char === '则') {
      let value = char;
      currentOption++;
      char = text[currentOption];
      if (/\s|\{/.test(char) || !char) {
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
    }

    // 关键字 并且
    if (char === '并') {
      let value = char;
      currentOption++;
      char = text[currentOption];

      while (char && !/\s|\(/.test(char)) {
        value += char;
        currentOption++;
        char = text[currentOption];
      }

      if (value === '并且') {
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

    // 关键字 并且
    if (char === '或') {
      let value = char;
      currentOption++;
      char = text[currentOption];

      while (char && !/\s|\(/.test(char)) {
        value += char;
        currentOption++;
        char = text[currentOption];
      }

      if (value === '或者') {
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

    // 边界符
    if (/[,.;(){}\[\]]/.test(char)) {
      tokens.push({
        type: TokenType.operator,
        value: char,
      });
      currentOption++;
      continue;
    }

    if (char) {
      tokens.push({
        type: TokenType.text,
        value: char,
      });
    }
    currentOption++;
  }

  return tokens.map((item) => `<span role="${item.type}">${item.value}</span>`).join('');
}
