import React, { useState } from 'react';
import { Form, Input, Button, message, Card } from 'antd';
import { MailOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import PageMeta from "../../../components/common/PageMeta";
import useForgotPassword from '../hooks/useForgotPassword';

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const { mutate: sendOTP, isPending } = useForgotPassword();

  const handleFinish = (values: { email: string }) => {
    sendOTP(
      { email: values.email },
      {
        onSuccess: () => {
          message.success("Mã OTP đã được gửi đến email của bạn!");
          navigate("/account/verify", { 
            state: { email: values.email, type: 'reset' } 
          });
        },
        onError: (error: any) => {
          message.error(error?.response?.data?.message || "Không thể gửi mã OTP. Vui lòng thử lại!");
        }
      }
    );
  };

  return (
    <div className="min-h-screen bg-[#F9F7F5] flex flex-col justify-center items-center px-4">
      {/* <PageMeta title="Quên mật khẩu - Bếp Việt" /> */}
      <PageMeta title="Quên mật khẩu - Bếp Việt" description="Chào mừng bạn quay trở lại với Bếp Việt" />
      
      <Card className="w-full max-w-md rounded-3xl shadow-xl border-none p-4">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-50 text-orange-600 rounded-2xl mb-4 text-2xl">
            <MailOutlined />
          </div>
          <h2 className="text-2xl font-black text-[#5C4033]">Quên mật khẩu?</h2>
          <p className="text-gray-500 mt-2 text-sm">
            Nhập email của bạn, chúng tôi sẽ gửi mã OTP để đặt lại mật khẩu.
          </p>
        </div>

        <Form
          layout="vertical"
          onFinish={handleFinish}
          requiredMark={false}
          size="large"
        >
          <Form.Item
            name="email"
            rules={[
              { required: true, message: 'Vui lòng nhập email!' },
              { type: 'email', message: 'Email không đúng định dạng!' }
            ]}
          >
            <Input 
              prefix={<MailOutlined className="text-gray-400 mr-2" />} 
              placeholder="Email của bạn" 
              className="rounded-xl h-12"
            />
          </Form.Item>

          <Form.Item className="mb-2">
            <Button
              type="primary"
              htmlType="submit"
              block
              loading={isPending}
              className="h-12 rounded-xl bg-orange-600 hover:bg-orange-700 font-bold text-base shadow-lg shadow-orange-100 border-none"
            >
              GỬI MÃ XÁC THỰC
            </Button>
          </Form.Item>

          <Button 
            type="link" 
            icon={<ArrowLeftOutlined />} 
            onClick={() => navigate(-1)}
            className="flex items-center justify-center w-full text-gray-400 hover:text-orange-600 font-medium mt-2"
          >
            Quay lại đăng nhập
          </Button>
        </Form>
      </Card>
      
      <p className="mt-8 text-gray-400 text-xs">
        &copy; 2026 Bếp Việt. Tất cả quyền được bảo lưu.
      </p>
    </div>
  );
}