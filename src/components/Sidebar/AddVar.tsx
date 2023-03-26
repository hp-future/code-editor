import { Modal, Form, ModalProps, Input } from "antd";
import { useEffect } from "react";

const AddVar = (props: ModalProps) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (props.open) {
      form.resetFields();
    }
  }, [props.open]);

  return (
    <Modal
      title="新增全局变量"
      {...props}
      onOk={async () => {
        const valuse = await form.validateFields();
        props.onOk && props.onOk(valuse);
      }}
    >
      <Form form={form} labelCol={{ flex: "80px" }}>
        <Form.Item label="Code" name="code" rules={[{ required: true }]}>
          <Input></Input>
        </Form.Item>
        <Form.Item label="Name" name="name" rules={[{ required: true }]}>
          <Input></Input>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddVar;
