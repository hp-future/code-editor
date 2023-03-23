import { getCalParamConfigs, getBusinessFactors, getFunctions, funcType } from '../api';
import { Store } from '../store';
import { GlobalVars } from '../store/types';

type InitVarsType = {
  result?: string;
  apiList?: any[];
};

export async function initVars({ result, apiList }: InitVarsType) {
  const calParams = await getCalParamConfigs();
  const functions = await getFunctions();

  let vars: GlobalVars[] = [];

  calParams.forEach((item) => {
    vars.push({
      type: 'calParam',
      code: item.calParamCode,
      name: item.calParamName,
      additional: {
        varTypeName: '计算参数',
      },
    });
  });

  functions.forEach((item) => {
    vars.push({
      type: 'function',
      code: item.functionSign,
      name: item.functionName,
      additional: {
        ...item,
        varTypeName: funcType[item.functionType],
      },
    });
  });

  Store.lexer.functionPattern = new RegExp(`^(${functions.map((item) => item.functionSign).join('|')})$`);
  Store.lexer.calParamPattern = new RegExp(`^(${calParams.map((item) => item.calParamCode).join('|')})$`);

  // 更新计算结果
  if (result) {
    Store.lexer.resultPattern = new RegExp(`^${result}$`);
    const findResultIndex = Store.lexer.vars.findIndex((item) => item.type === 'result');
    if (findResultIndex === -1) {
      Store.lexer.vars.push({
        type: 'result',
        code: result,
        name: '计算结果',
      });
    } else {
      Store.lexer.vars[findResultIndex].code = result;
    }
  }

  // 更新api列表
  let businessFactors;
  if (apiList) {
    vars = vars.filter((item) => item.type !== 'api');
    apiList.forEach((item) => {
      vars.push({
        type: 'api',
        code: item.itemCode,
        name: item.itemName,
        additional: {
          varTypeName: 'api',
        },
      });
    });
    Store.lexer.apiPattern = new RegExp(`^(${apiList.map((item) => item.itemCode).join('|')})$`);
  } else {
    businessFactors = await getBusinessFactors();
    businessFactors.forEach((item) => {
      vars.push({
        type: 'api',
        code: item.itemCode,
        name: item.itemName,
        additional: {
          varTypeName: 'api',
        },
      });
    });
    Store.lexer.apiPattern = new RegExp(`^(${businessFactors.map((item) => item.itemCode).join('|')})$`);
  }

  Store.lexer.vars = vars;

  return {
    calParams,
    businessFactors,
    vars,
  };
}
