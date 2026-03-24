import React from 'react';
import { Form, Input, Button, Modal, message, Card } from 'antd';
import { LockOutlined, CheckCircleFilled } from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import PageMeta from "../../../components/common/PageMeta";
import useResetPassword from "../hooks/useResetPassword";

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const location = useLocation();
  
  const { email, otp } = location.state || {};
  
  const { mutate: resetPassword, isPending } = useResetPassword();

  const onFinish = (values: any) => {
    if (!email || !otp) {
      message.error("Thiếu thông tin xác thực. Vui lòng thực hiện lại từ đầu.");
      return;
    }

    resetPassword(
      { 
        email: email as string, 
        otp: otp as string, 
        newPassword: values.newPassword 
      },
      {
        onSuccess: () => {
          showSuccessModal();
        },
        onError: (error: any) => {
          const serverMessage = error?.response?.data?.error || error?.response?.data?.message || "Đổi mật khẩu thất bại";
          message.error(serverMessage);
        }
      }
    );
  };

  const showSuccessModal = () => {
    Modal.success({
      icon: <CheckCircleFilled className="text-green-500" />,
      title: <span className="text-xl font-black text-[#5C4033]">Thành công!</span>,
      content: (
        <div className="text-gray-500 mt-2">
          Mật khẩu của bạn đã được thay đổi thành công. Vui lòng đăng nhập lại để tiếp tục.
        </div>
      ),
      okText: "Đăng nhập ngay",
      okButtonProps: {
        className: "bg-orange-600 hover:bg-orange-700 border-none rounded-lg h-10 px-6 font-bold"
      },
      onOk: () => navigate("/account/login"),
      centered: true,
      className: "rounded-3xl overflow-hidden"
    });
  };

  return (
    <div className="min-h-screen bg-[#F9F7F5] flex flex-col justify-center items-center px-4">
      <PageMeta title="Đặt lại mật khẩu - Bếp Việt" description="Chào mừng bạn quay trở lại với Bếp Việt" />
      
      <Card className="w-full max-w-md rounded-3xl shadow-xl border-none p-4">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-50 text-orange-600 rounded-2xl mb-4 text-2xl">
            <LockOutlined />
          </div>
          <h2 className="text-2xl font-black text-[#5C4033]">Mật khẩu mới</h2>
          <p className="text-gray-500 mt-2 text-sm">
            Vui lòng nhập mật khẩu mới để bảo mật tài khoản của bạn.
          </p>
        </div>

        <Form
          layout="vertical"
          onFinish={onFinish}
          requiredMark={false}
          size="large"
        >
          <Form.Item
            label={<span className="text-xs font-bold uppercase text-gray-400">Mật khẩu mới</span>}
            name="newPassword"
            rules={[
              { required: true, message: 'Vui lòng nhập mật khẩu mới!' },
              { min: 8, message: 'Mật khẩu phải có tối thiểu 8 ký tự!' }
            ]}
          >
            <Input.Password 
              prefix={<LockOutlined className="text-gray-400 mr-2" />} 
              placeholder="Tối thiểu 8 ký tự" 
              className="rounded-xl h-12"
            />
          </Form.Item>

          <Form.Item
            label={<span className="text-xs font-bold uppercase text-gray-400">Xác nhận mật khẩu</span>}
            name="confirmPassword"
            dependencies={['newPassword']}
            rules={[
              { required: true, message: 'Vui lòng xác nhận mật khẩu!' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('newPassword') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Mật khẩu xác nhận không khớp!'));
                },
              }),
            ]}
          >
            <Input.Password 
              prefix={<LockOutlined className="text-gray-400 mr-2" />} 
              placeholder="Nhập lại mật khẩu mới" 
              className="rounded-xl h-12"
            />
          </Form.Item>

          <Form.Item className="mt-8 mb-0">
            <Button
              type="primary"
              htmlType="submit"
              block
              loading={isPending}
              className="h-12 rounded-xl bg-orange-600 hover:bg-orange-700 font-bold text-base shadow-lg shadow-orange-100 border-none"
            >
              CẬP NHẬT MẬT KHẨU
            </Button>
          </Form.Item>
        </Form>
      </Card>
      
      <p className="mt-8 text-gray-400 text-xs text-center">
        Bạn gặp sự cố? <span className="text-orange-600 font-bold cursor-pointer">Liên hệ hỗ trợ</span>
      </p>
    </div>
  );
}