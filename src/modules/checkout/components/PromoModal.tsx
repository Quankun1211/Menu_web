import React, { useState } from "react";
import { 
  Modal, 
  Input, 
  Button, 
  Tag, 
  Empty, 
  Divider, 
  message 
} from "antd";
import { 
  IeOutlined, 
  CloseOutlined, 
  CheckCircleFilled,
  InfoCircleOutlined 
} from "@ant-design/icons";
import { useApplyCoupon } from "../hooks/useApplyCoupon";
import { formatVND } from "../../../utils/helper";

const PromoModal = ({
  isVisible,
  onClose,
  onApply,
  totalAmount,
  items,
  userCoupons = [],
}) => {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");

  const { mutate: applyCoupon, isPending } = useApplyCoupon();

  const processApply = (couponCode) => {
    const cleanCode = couponCode?.trim().toUpperCase();
    if (!cleanCode) {
      setError("Vui lòng nhập mã giảm giá");
      return;
    }

    applyCoupon(
      {
        code: cleanCode,
        totalAmount,
        items,
      },
      {
        onSuccess: (res) => {
          onApply(res.data.discountAmount, res.data.code);
          message.success(`Đã áp dụng mã ${res.data.code} thành công!`);
          handleClose();
        },
        onError: (err) => {
        //   const errMsg = err?.response?.data?.message || "Mã giảm giá không hợp lệ hoặc đã hết hạn";
          setError("Mã giảm giá không hợp lệ hoặc đã hết hạn");
          message.error("Mã giảm giá không hợp lệ hoặc đã hết hạn");
        },
      }
    );
  };

  const handleClose = () => {
    setCode("");
    setError("");
    onClose();
  };

  return (
    <Modal
      title={
        <div className="flex items-center justify-between pr-8">
          <span className="text-xl font-black text-gray-800">Mã giảm giá</span>
        </div>
      }
      open={isVisible}
      onCancel={handleClose}
      footer={null}
      width={500}
      centered
      closeIcon={<CloseOutlined className="text-gray-400 hover:text-orange-500" />}
      bodyStyle={{ padding: '0 24px 24px 24px', maxHeight: '70vh', overflowY: 'auto' }}
    >
      <div className="sticky top-0 bg-white pt-4 pb-6 z-10">
        <div className="flex gap-2">
          <Input
            placeholder="Nhập mã của bạn (VD: Giam20k...)"
            value={code}
            onChange={(e) => {
              setCode(e.target.value);
              setError("");
            }}
            onPressEnter={() => processApply(code)}
            className={`h-12 rounded-xl border-gray-200 text-base uppercase font-bold tracking-wider ${error ? 'border-red-500 hover:border-red-500' : 'hover:border-orange-400'}`}
          />
          <Button 
            type="primary" 
            className="h-12 px-8 rounded-xl bg-orange-600 hover:bg-orange-700 border-none font-bold"
            loading={isPending}
            onClick={() => processApply(code)}
          >
            Áp dụng
          </Button>
        </div>
        {error && <p className="text-red-500 text-sm mt-2 ml-1 flex items-center gap-1">
          <InfoCircleOutlined /> {error}
        </p>}
      </div>

      <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-4">Voucher của bạn</h3>

      <div className="space-y-4">
        {userCoupons.length > 0 ? (
          userCoupons.map((item, index) => {
            const couponInfo = item.couponId;
            const minOrderValue = couponInfo?.minOrderValue || 0;
            const isMinAmountMet = totalAmount >= minOrderValue;

            return (
              <div 
                key={item._id || index}
                className={`group relative flex items-center p-4 rounded-2xl border-2 transition-all overflow-hidden
                  ${isMinAmountMet 
                    ? 'border-gray-100 hover:border-orange-200 bg-white cursor-pointer' 
                    : 'border-gray-50 bg-gray-50/50 opacity-60 grayscale'
                  }`}
                onClick={() => isMinAmountMet && processApply(couponInfo?.code)}
              >
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 
                  ${isMinAmountMet ? 'bg-orange-100 text-orange-600' : 'bg-gray-200 text-gray-400'}`}>
                  <IeOutlined className="text-2xl" />
                </div>

                <div className="ml-4 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-black text-gray-800 tracking-tight">{couponInfo?.code}</span>
                    {isMinAmountMet && (
                      <CheckCircleFilled className="text-green-500 text-xs" />
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
                    Giảm <span className="text-orange-600 font-bold">{formatVND(couponInfo?.value)}</span> cho đơn từ {formatVND(minOrderValue)}
                  </p>
                  
                  {!isMinAmountMet && (
                    <p className="text-[10px] text-red-500 font-bold mt-1 bg-red-50 inline-block px-2 py-0.5 rounded-md">
                      Thiếu {formatVND(minOrderValue - totalAmount)} để sử dụng
                    </p>
                  )}
                </div>

                <div className="ml-2">
                  <Button 
                    type="link" 
                    className={`font-black uppercase text-xs p-0 ${isMinAmountMet ? 'text-orange-500' : 'text-gray-400'}`}
                    disabled={!isMinAmountMet}
                  >
                    Dùng
                  </Button>
                </div>
                
                <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-2 h-4 bg-gray-50 rounded-r-full border-r border-gray-100 group-hover:bg-white" />
                <div className="absolute -right-1 top-1/2 -translate-y-1/2 w-2 h-4 bg-gray-50 rounded-l-full border-l border-gray-100 group-hover:bg-white" />
              </div>
            );
          })
        ) : (
          <Empty 
            image={Empty.PRESENTED_IMAGE_SIMPLE} 
            description={<span className="text-gray-400">Bạn chưa có mã giảm giá nào</span>} 
          />
        )}
      </div>

      <Divider className="my-6" />
      
      <div className="text-center">
        <p className="text-xs text-gray-400">
          Vui lòng kiểm tra điều kiện của mã trước khi áp dụng.
        </p>
      </div>
    </Modal>
  );
};

export default PromoModal