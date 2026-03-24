import banner from "../../../assets/images/banner.png";
import PageMeta from "../../../components/common/PageMeta";
import type { FormProps } from "antd";
import type { logInRequest } from "../types/api-request";
import useLogin from "../hooks/useLogin";
import LoginForm from "../components/LoginForm";
import { Divider, Button } from 'antd';
import { GoogleOutlined, FacebookFilled, AppleFilled } from '@ant-design/icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUtensils } from '@fortawesome/free-solid-svg-icons';
import { NavLink } from "react-router";

export default function SignIn() {
  const { mutate: onLogin } = useLogin();

  const onFinish: FormProps<logInRequest>["onFinish"] = (values) => {
    onLogin(
      { ...values },
      {
        onSuccess: () => {
          console.log("Login successful");
        },
        onError: (error) => {
          console.log("Login failed", error);
        }
      }
    );
  };

  return (
    <div className="flex min-h-screen bg-white">
      <PageMeta title="Đăng nhập - Bếp Việt" description="Chào mừng bạn quay trở lại với Bếp Việt" />
      
      <div className="hidden lg:flex lg:w-1/2 relative bg-cover bg-center items-center px-20" 
           style={{ backgroundImage: `url(${banner})` }}>
        <div className="absolute inset-0 bg-black/50"></div>
        
        <div className="relative z-10 text-white">
          <FontAwesomeIcon icon={faUtensils} className='bg-orange-500 text-2xl p-3 rounded-xl' />
          
          <h1 className="text-5xl font-bold leading-tight mb-6 mt-8">
            Hương vị truyền thống<br />trong từng món ăn.
          </h1>
          
          <p className="text-lg text-gray-200 mb-12 max-w-md">
            Khám phá kho tàng ẩm thực Việt Nam với hàng ngàn công thức nấu ăn độc đáo và tươi ngon mỗi ngày.
          </p>
          
          <div className="flex gap-6">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl w-32 text-center">
              <div className="text-2xl font-bold">50k+</div>
              <div className="text-xs uppercase opacity-70">Người dùng</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl w-32 text-center">
              <div className="text-2xl font-bold">10k+</div>
              <div className="text-xs uppercase opacity-70">Công thức</div>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 md:px-24 lg:px-32 bg-white">
        <div className="mb-10">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Đăng Nhập</h2>
          <p className="text-gray-500 text-lg">Chào mừng trở lại! Đăng nhập để tiếp tục khám phá ẩm thực</p>
        </div>

        <LoginForm onFinish={onFinish} />

        <div className="flex justify-end mt-2">
          <NavLink 
            to="/account/forgot-password" 
            className="text-sm font-medium text-orange-600 hover:text-orange-500 transition-colors"
          >
            Quên mật khẩu?
          </NavLink>
        </div>

        <Divider plain className="text-gray-400 text-sm my-8 font-normal">Hoặc tiếp tục với</Divider>

        <div className="flex justify-center gap-4 mb-10">
          <Button icon={<GoogleOutlined />} className="h-12 flex items-center justify-center rounded-xl flex-1 max-w-[100px]" />
          <Button icon={<FacebookFilled className="text-blue-600!" />} className="h-12 flex items-center justify-center rounded-xl flex-1 max-w-[100px]" />
          <Button icon={<AppleFilled />} className="h-12 flex items-center justify-center rounded-xl flex-1 max-w-[100px]" />
        </div>

        <p className="text-center text-gray-600">
          Chưa có tài khoản? 
          <NavLink className="text-orange-600 font-bold hover:text-orange-500 pl-2" to="/account/register">
            Đăng ký ngay
          </NavLink>
        </p>
      </div>
    </div>
  );
}