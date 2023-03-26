import { useEffect, useState } from "react";
import { GlobalVars } from "../CodeEditor";
import { Store } from "../CodeEditor/store";
import AddVar from "./AddVar";
import styles from "./style.module.scss";
import { Button } from "antd";

const Sidebar = () => {
  const [list, setList] = useState<GlobalVars[]>([]);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setList(Store.lexer.vars.filter((item) => item.name !== "关键字"));
    }, 0);
  }, []);

  function deleteVar(value: GlobalVars, index: number) {
    setList((prevValue) =>
      prevValue.filter((item) => item.code !== value.code)
    );
    Store.lexer.vars = Store.lexer.vars.filter(
      (item) => item.code !== value.code
    );
  }

  function addVar(value: any) {
    setList((prevValue) => [...prevValue, value]);
    Store.lexer.vars.push(value);
    setVisible(false);
  }

  return (
    <div className={styles.sidebar}>
      <Button type="text" className={styles.title}>
        全局变量
      </Button>
      <div className={styles.content}>
        {list.map((item, index) => {
          return (
            <div className={styles.item} key={item.code}>
              <span>{item.code}</span>
              <span
                className={styles.deleteBtn}
                onClick={() => deleteVar(item, index)}
              >
                删除
              </span>
            </div>
          );
        })}
      </div>
      <Button
        type="primary"
        className={styles.add}
        onClick={() => setVisible(true)}
      >
        新增全局变量
      </Button>
      <AddVar open={visible} onOk={addVar} onCancel={() => setVisible(false)} />
    </div>
  );
};

export default Sidebar;
