import { useState } from 'react';
import CodeEditor, { EditorOptionType } from './components/CodeEditor';

function App() {
  const vars: EditorOptionType['vars'] = [
    {
      code: 'num',
      name: '数字',
    },
    // {
    //   code: 'obj1',
    //   name: '对象1',
    //   children: [
    //     {
    //       code: 'property1',
    //       name: '对象1-属性1',
    //     },
    //     {
    //       code: 'property2',
    //       name: '对象1-属性2',
    //     },
    //   ],
    // },
    {
      code: 'price',
      name: '价格',
    },
    {
      code: 'total',
      name: '总数',
    },
  ];

  return (
    <div className="App">
      <CodeEditor
        options={{
          vars,
        }}
      />
    </div>
  );
}

export default App;