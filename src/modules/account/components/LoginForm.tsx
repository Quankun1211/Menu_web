import { Form, Checkbox } from "antd";
import type { logInRequest } from "../types/api-request";
import Input from "../../../components/ui/Input";
import Button from "../../../components/ui/Button";
import { MailOutlined } from "@ant-design/icons";

function LoginForm({ onFinish }: { onFinish: (values: logInRequest) => void }) {
  return (
    <Form
      onFinish={onFinish}
      onFinishFailed={() => {
        console.log("Login failed");
      }}
      layout="vertical"
      autoComplete="off"
      size="large"
      className="w-full"
    >
      <Form.Item<logInRequest>
        label={<span className="font-semibold text-gray-700">Email hoặc Số điện thoại</span>}
        name="username"
        rules={[
          {
            required: true,
            message: "Nhập đầy đủ tên đăng nhập!",
          },
        ]}
      >
        <Input
          placeholder="example@email.com"
          suffix={<MailOutlined className="text-gray-400" />}
          className="rounded-lg py-3"
        />
      </Form.Item>

      <Form.Item<logInRequest>
        label={<span className="font-semibold text-gray-700">Mật khẩu</span>}
        name="password"
        rules={[
          {
            required: true,
            message: "Hãy nhập đầy đủ mật khẩu của bạn!",
          },
          {
            min: 6,
            message: "Mật khẩu phải có ít nhất 6 ký tự!",
          },
        ]}
      >
        <Input
          placeholder="Nhập mật khẩu của bạn"
          type="password"
          className="rounded-lg py-3"
        />
      </Form.Item>

      <div className="flex items-center mb-6">
        <Checkbox className="text-gray-500">Ghi nhớ đăng nhập</Checkbox>
      </div>

      <Form.Item>
        <Button
          type="primary"
          block
          htmlType="submit"
          className="h-14 bg-orange-600! hover:bg-orange-500! border-none text-lg font-bold rounded-xl"
        >
          Đăng Nhập
        </Button>
      </Form.Item>
    </Form>
  );
}

export default LoginForm;