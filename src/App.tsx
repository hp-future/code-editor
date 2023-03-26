import CodeEditor, { EditorOptionType } from './components/CodeEditor';
import Sidebar from './components/Sidebar'
import styles from './App.module.scss'
import { Layout } from 'antd'

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
    <div className={styles.App}>
      <Layout>
        <Layout.Sider style={{ backgroundColor: '#fff' }}>

          <Sidebar />
        </Layout.Sider>
        <Layout.Content>

          <CodeEditor
            options={{
              vars,
            }}
          />
        </Layout.Content>
      </Layout>
    </div>
  );
}

export default App;