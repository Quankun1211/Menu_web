import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import { Input, Button, Modal, Result, message } from "antd";
import { MailOutlined, CheckCircleFilled, ArrowLeftOutlined } from "@ant-design/icons";
import PageMeta from "../../../components/common/PageMeta";
import useVerify from "../hooks/useVerify";
import useResendOTP from "../hooks/useResendOTP";

export default function Verify() {
  const navigate = useNavigate();
  const location = useLocation();
  
  const email = location.state?.email || "";
  const type = location.state?.type || "register"; 

  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const { mutate: verify, isPending } = useVerify();
  const { mutate: resendOTP, isPending: isResending } = useResendOTP();

  useEffect(() => {
    if (!email) {
      message.error("Thiếu thông tin Email!");
      navigate("/account/login");
    }
  }, [email, navigate]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleVerify = () => {
    if (otp.length < 6) return;

    verify(
      { email, otp, type },
      {
        onSuccess: () => {
          if (type === "reset") {
            navigate("/account/reset-password", { state: { email, otp } });
          } else {
            setShowSuccessModal(true);
          }
        },
        onError: (error: any) => {
          const errorMsg = error?.response?.data?.error || error?.response?.data?.message || "Mã OTP không chính xác";
          message.error(errorMsg);
        },
      }
    );
  };

  const handleResend = () => {
    if (!canResend) return;
    
    resendOTP({ email }, {
      onSuccess: () => {
        setTimer(60);
        setCanResend(false);
        setOtp("");
        message.success("Đã gửi lại mã OTP mới!");
      }
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center px-4">
      {/* <PageMeta title="Xác thực OTP - Bếp Việt" /> */}

      <div className="max-w-md w-full bg-white p-8 rounded-3xl shadow-sm border border-gray-100 text-center">
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center text-gray-400 hover:text-orange-500 mb-6 transition-colors"
        >
          <ArrowLeftOutlined className="mr-2" /> Quay lại
        </button>

        <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <MailOutlined className="text-3xl text-orange-500" />
        </div>

        <h2 className="text-3xl font-bold text-gray-900 mb-2">Xác thực Email</h2>
        <p className="text-gray-500 mb-8 px-4">
          Chúng tôi đã gửi mã OTP gồm 6 chữ số đến email:<br />
          <span className="font-semibold text-gray-800">{email}</span>
        </p>

        <div className="mb-8">
          <Input.OTP
            size="large"
            length={6}
            value={otp}
            onChange={(val) => setOtp(val)}
            formatter={(str) => str.toUpperCase()}
            className="justify-center"
          />
        </div>

        <Button
          type="primary"
          block
          size="large"
          loading={isPending}
          disabled={otp.length < 6}
          onClick={handleVerify}
          className="h-14 bg-orange-600! hover:bg-orange-500! border-none text-lg font-bold rounded-xl mb-6"
        >
          Xác Nhận
        </Button>

        <div className="flex flex-col items-center gap-2">
          <p className="text-gray-500">Không nhận được mã?</p>
          <Button 
            type="link" 
            disabled={!canResend || isResending}
            onClick={handleResend}
            className={`font-bold ${canResend ? 'text-orange-600' : 'text-gray-400'}`}
          >
            {canResend ? "Gửi lại mã ngay" : `Gửi lại sau (${timer}s)`}
          </Button>
        </div>
      </div>

      <Modal
        open={showSuccessModal}
        footer={null}
        centered
        closable={false}
        width={450}
      >
        <Result
          status="success"
          icon={<CheckCircleFilled className="text-green-500 text-6xl" />}
          title={<span className="text-2xl font-bold">Xác thực thành công!</span>}
          subTitle={
            <div className="text-gray-600 px-4">
              Tài khoản của bạn đã sẵn sàng để khám phá kho tàng ẩm thực Việt.
            </div>
          }
          extra={[
            <Button 
              type="primary" 
              key="login" 
              block
              className="h-12 bg-green-600! hover:bg-green-500! border-none font-bold rounded-xl"
              onClick={() => navigate('/account/login')}
            >
              ĐĂNG NHẬP NGAY
            </Button>
          ]}
        />
      </Modal>
    </div>
  );
}