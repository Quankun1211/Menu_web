import banner from "../../../assets/images/banner.png";
import PageMeta from "../../../components/common/PageMeta";
import { FormProps, Divider, Button, Modal, Result } from 'antd';
import { GoogleOutlined, FacebookFilled, AppleFilled, MailOutlined } from '@ant-design/icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUtensils } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from "react-router";
import { useState } from "react";
import useRegister from "../hooks/useRegister";
import SignUpForm from "../components/RegisterForm";
import type { RegisterRequest } from "../types/api-request";

export default function SignUp() {
  const navigate = useNavigate();
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState('');
  const { mutate: onRegister, isPending } = useRegister();

  const onFinish: FormProps<RegisterRequest>["onFinish"] = (values) => {
    onRegister(values, {
      onSuccess: () => {
        setRegisteredEmail(values.email);
        setShowSuccessModal(true);
      },
      onError: (error: any) => {
        const errorMsg = error?.response?.data?.error || "Đăng ký thất bại";
      },
    });
  };

  return (
    <div className="flex min-h-screen bg-white">
      <PageMeta title="Đăng ký - Bếp Việt" description="Tham gia cộng đồng Bếp Việt ngay hôm nay" />
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 md:px-24 lg:px-32 bg-white py-12">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Đăng Ký Tài Khoản</h2>
          <p className="text-gray-500 text-lg">Khám phá hương vị truyền thống Việt Nam cùng chúng tôi</p>
        </div>

        <SignUpForm onFinish={onFinish} isLoading={isPending} />

        <Divider plain className="text-gray-400 text-sm my-6">Hoặc đăng ký với</Divider>

        <div className="flex justify-around gap-4 mb-8">
          <Button icon={<GoogleOutlined />} className="h-12 flex items-center justify-center rounded-xl flex-1 max-w-25" />
          <Button icon={<FacebookFilled className="text-blue-600!" />} className="h-12 flex items-center justify-center rounded-xl flex-1 max-w-25" />
          <Button icon={<AppleFilled />} className="h-12 flex items-center justify-center rounded-xl flex-1 max-w-25" />
        </div>

        <p className="text-center text-gray-600">
          Đã có tài khoản? <span onClick={() => navigate('/account/login')} className="text-orange-600 font-bold hover:text-orange-500 cursor-pointer">Đăng nhập</span>
        </p>
      </div>

      <div className="hidden lg:flex lg:w-1/2 relative bg-cover bg-center items-center px-20" 
           style={{ backgroundImage: `url(${banner})` }}>
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="relative z-10 text-white">
          <FontAwesomeIcon icon={faUtensils} className='bg-orange-500 text-2xl p-3 rounded-xl' />
          <h1 className="text-5xl font-bold leading-tight mb-6 mt-8">
            Bắt đầu hành trình<br />ẩm thực của bạn.
          </h1>
          <p className="text-lg text-gray-200 mb-12 max-w-md">
            Đăng ký để lưu lại những công thức yêu thích và kết nối với cộng đồng yêu bếp trên toàn quốc.
          </p>
        </div>
      </div>

      <Modal
        open={showSuccessModal}
        footer={null}
        centered
        closable={false}
        width={500}
      >
        <Result
          status="success"
          icon={<MailOutlined className="text-orange-500 text-6xl" />}
          title={<span className="text-2xl font-bold">Kiểm tra Email</span>}
          subTitle={
            <div className="text-gray-600">
              Mã xác thực đã được gửi đến: <br />
              <b className="text-gray-900">{registeredEmail}</b>
            </div>
          }
          extra={[
            <Button 
              type="primary" 
              key="verify" 
              className="h-12 px-10 bg-orange-600! border-none font-bold rounded-xl"
              onClick={() => navigate('/account/verify', { state: { email: registeredEmail } })}
            >
              NHẬP MÃ XÁC THỰC NGAY
            </Button>
          ]}
        />
      </Modal>
    </div>
  );
}