import { Form, Input } from "antd";
import { UserOutlined, MailOutlined, LockOutlined } from "@ant-design/icons";
import Button from "../../../components/ui/Button";
import type { RegisterRequest } from "../types/api-request";

function SignUpForm({ 
  onFinish, 
  isLoading 
}: { 
  onFinish: (values: RegisterRequest) => void, 
  isLoading: boolean 
}) {
  return (
    <Form
      layout="vertical"
      onFinish={onFinish}
      size="large"
      className="w-full"
      requiredMark={false}
    >
      <Form.Item
        label={<span className="font-semibold text-gray-700">Họ và tên</span>}
        name="name"
        rules={[{ required: true, message: "Vui lòng nhập họ và tên!" }]}
      >
        <Input 
          placeholder="Nhập họ và tên của bạn" 
          prefix={<UserOutlined className="text-gray-400 mr-2" />}
          className="rounded-lg py-3"
        />
      </Form.Item>

      <Form.Item
        label={<span className="font-semibold text-gray-700">Tên đăng nhập</span>}
        name="username"
        rules={[{ required: true, message: "Vui lòng nhập tên đăng nhập!" }]}
      >
        <Input 
          placeholder="username123" 
          prefix={<UserOutlined className="text-gray-400 mr-2" />}
          className="rounded-lg py-3"
        />
      </Form.Item>

      <Form.Item
        label={<span className="font-semibold text-gray-700">Email</span>}
        name="email"
        rules={[
          { required: true, message: "Vui lòng nhập Email!" },
          { type: 'email', message: "Email không đúng định dạng!" }
        ]}
      >
        <Input 
          placeholder="example@email.com" 
          prefix={<MailOutlined className="text-gray-400 mr-2" />}
          className="rounded-lg py-3"
        />
      </Form.Item>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
        <Form.Item
          label={<span className="font-semibold text-gray-700">Mật khẩu</span>}
          name="password"
          rules={[
            { required: true, message: "Nhập mật khẩu!" },
            { min: 8, message: "Tối thiểu 8 ký tự!" }
          ]}
        >
          <Input.Password 
            placeholder="********" 
            prefix={<LockOutlined className="text-gray-400 mr-2" />}
            className="rounded-lg py-3"
          />
        </Form.Item>

        <Form.Item
          label={<span className="font-semibold text-gray-700">Xác nhận mật khẩu</span>}
          name="confirmPassword"
          dependencies={['password']}
          rules={[
            { required: true, message: "Xác nhận lại mật khẩu!" },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('Mật khẩu không khớp!'));
              },
            }),
          ]}
        >
          <Input.Password 
            placeholder="********" 
            prefix={<LockOutlined className="text-gray-400 mr-2" />}
            className="rounded-lg py-3"
          />
        </Form.Item>
      </div>

      <Form.Item className="mt-4">
        <Button
          type="primary"
          block
          htmlType="submit"
          loading={isLoading}
          className="h-14 bg-orange-600! hover:bg-orange-500! border-none text-lg font-bold rounded-xl"
        >
          {isLoading ? "Đang xử lý..." : "Đăng Ký Ngay"}
        </Button>
      </Form.Item>
    </Form>
  );
}

export default SignUpForm;