import axios from 'axios';
import { Store } from '../store';

export const funcType: Record<string, string> = {
  CommonFunctions: '常用函数',
  DayAndTimeFunctions: '时间函数',
  TextFunctions: '文本函数',
};

// 获取业务因子
export async function getBusinessFactors() {
  const { data } = await axios.post('/api/adv/engine/item/findAllCheckItemTree');
  const content = data.data;
  const list: any[] = [];

  function getList(data: any[]) {
    data.forEach((item) => {
      if (Array.isArray(item.itemList) && item.itemList.length > 0) {
        item.itemList.forEach((el: any) => list.push(el));
      }
      if (Array.isArray(item.children) && item.children.length > 0) {
        getList(item.children);
      }
    });
  }

  getList(content);

  return Promise.resolve(list);
}

// 获取计算参数
export async function getCalParamConfigs() {
  const list: any[] = [];

  const { data } = await axios.post('/api/adv/engine/calParamConfig/all', []);
  const { content } = data.data;

  content.forEach((item: any) => {
    list.push(item);
    if (Array.isArray(item.dataFormList) && item.dataFormList.length > 0) {
      item.dataFormList.forEach((el: any) => {
        list.push({
          parent: { ...item, code: item.calParamCode, name: item.calParamName },
          calParamCode: el.fieldCode,
          calParamName: el.fieldName,
          calParamType: el.calParamType,
        });
      });
    }
  });

  return Promise.resolve(list);
}

// 获取计算函数
export async function getFunctions() {
  const { data } = await axios.post('/api/adv/engine/calFunction/all', []);
  const { content } = data.data;

  return Promise.resolve(content as any[]);
}

// 获取全局变量
export async function getVars() {
  const calParams = await getCalParamConfigs();
  const businessFactors = await getBusinessFactors();
  const functions = await getFunctions();

  const vars: any[] = [];

  calParams.forEach((item) => {
    vars.push({
      type: 'calParam',
      code: item.calParamCode,
      name: item.calParamName,
      additional: {
        varTypeName: '计算参数',
        parent: item.parent,
      },
    });
  });

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

  Store.lexer.vars = vars;

  return {
    calParams,
    businessFactors,
    vars,
  };
}
