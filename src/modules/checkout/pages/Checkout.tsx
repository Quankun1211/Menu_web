import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  EnvironmentOutlined, 
  CreditCardOutlined, 
  TagOutlined, 
  RightOutlined,
  InfoCircleOutlined,
  TruckOutlined,
  LoadingOutlined,
  CheckCircleFilled
} from '@ant-design/icons';
import { Button, Modal, Spin, message, Divider, Radio, Space } from 'antd';

import useGetAddress from '../hooks/useGetAddress';
import { useCheckoutStore } from '../../../store/useCheckoutStore';
import { usePreviewCheckout } from '../hooks/usePreviewCheckout';
import { formatVND } from '../../../utils/helper';
import useCheckout from '../hooks/useCheckout';
import useGetMyCoupons from "../hooks/useGetMyCoupons";
import PromoModal from '../components/PromoModal'; 

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { 
    selectedAddress, 
    setSelectedAddress, 
    checkoutItems, 
    source 
  } = useCheckoutStore();
console.log(checkoutItems);

  const { data: previewRes, isPending: previewPending } = usePreviewCheckout(checkoutItems);
  const { data: couponsData } = useGetMyCoupons();
  const { data: getAddress, isPending: addressPending } = useGetAddress();
  const { mutate: checkoutApply, isPending: checkoutPending } = useCheckout();

  const [isConfirmModalVisible, setConfirmModalVisible] = useState(false);
  const [isPromoModalVisible, setPromoModalVisible] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [discountValue, setDiscountValue] = useState(0);
  const [appliedCode, setAppliedCode] = useState("");

  const totalAmount = previewRes?.data?.totalAmount ?? 0;
  console.log(totalAmount);
  
  const addresses = getAddress?.data ?? [];
  const displayAddress = selectedAddress || addresses.find((a) => a.isDefault) || addresses[0] || null;

  const shippingFee = 25000;
  const subTotal = previewRes?.data?.totalAmount ?? 0; 
  console.log(subTotal);
  
const finalTotal = Math.max(subTotal + shippingFee - Math.abs(discountValue), 0);

  useEffect(() => {
    if (checkoutItems.length === 0) {
      navigate("/cart");
    }
  }, [checkoutItems, navigate]);

  useEffect(() => {
    if (!selectedAddress && displayAddress) {
      setSelectedAddress(displayAddress);
    }
  }, [addresses, displayAddress, setSelectedAddress, selectedAddress]);

  const onApplyPromo = (discount, code) => {
    setDiscountValue(discount);
    setAppliedCode(code);
    setPromoModalVisible(false);
  };

  const handlePlaceOrder = () => {
    if (!displayAddress) {
      message.error("Vui lòng thêm địa chỉ nhận hàng");
      return;
    }

    checkoutApply({
      items: checkoutItems,
      address: displayAddress._id,
      couponCode: appliedCode,
      source: source as any,
      paymentMethod: paymentMethod,
      shippingFee: shippingFee,
      platform: "web"
    }, {
      onSuccess: (response) => {
        
        const paymentUrl = response?.data?.paymentUrl;
        if (paymentUrl) {
          window.location.href = paymentUrl;
        } else {
          message.success('Đặt hàng thành công');
          navigate("/order/list");
        }
      },
      onError: (error) => {
        message.error(error.message || 'Có lỗi xảy ra khi đặt hàng');
      }
    });
  };

  if (previewPending || addressPending) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} tip="Đang chuẩn bị đơn hàng..." />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-black text-[#5C4033] mb-8">Thanh toán</h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white rounded-[32px] p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <EnvironmentOutlined className="text-orange-500" /> Địa chỉ nhận hàng
              </h2>
              <Button type="link" className="text-orange-500 font-bold" onClick={() => navigate('/checkout/address')}>
                {displayAddress ? "Thay đổi" : "Thêm địa chỉ"}
              </Button>
            </div>
            
            {displayAddress ? (
              <div className="bg-orange-50/50 p-4 rounded-2xl border border-orange-100">
                <p className="font-bold text-gray-800">{displayAddress.name} | {displayAddress.phone}</p>
                <p className="text-gray-500 text-sm mt-1">{displayAddress.address}</p>
              </div>
            ) : (
              <div className="text-center py-4 text-gray-400 italic">Chưa có địa chỉ nhận hàng</div>
            )}
          </div>

          <div className="bg-white rounded-[32px] p-6 shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
              <CreditCardOutlined className="text-orange-500" /> Phương thức thanh toán
            </h2>
            <Radio.Group onChange={(e) => setPaymentMethod(e.target.value)} value={paymentMethod} className="w-full">
              <Space direction="vertical" className="w-full">
                <div className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between ${paymentMethod === 'vnpay' ? 'border-orange-500 bg-orange-50/30' : 'border-gray-100'}`}
                     onClick={() => setPaymentMethod('vnpay')}>
                  <div className="flex items-center gap-4">
                    <img src="https://vnpay.vn/s1/statics.vnpay.vn/2023/9/09n8zf9sh8v11695442541348.png" className="w-10 h-10 object-contain" alt="vnpay" />
                    <div>
                      <p className="font-bold">Ví VNPay</p>
                      <p className="text-xs text-gray-400">Ưu đãi giảm 10k khi dùng VNPay</p>
                    </div>
                  </div>
                  <Radio value="vnpay" />
                </div>

                <div className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between ${paymentMethod === 'cod' ? 'border-orange-500 bg-orange-50/30' : 'border-gray-100'}`}
                     onClick={() => setPaymentMethod('cod')}>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-500">
                      <CreditCardOutlined />
                    </div>
                    <div>
                      <p className="font-bold">Tiền mặt (COD)</p>
                      <p className="text-xs text-gray-400">Thanh toán khi nhận hàng</p>
                    </div>
                  </div>
                  <Radio value="cod" />
                </div>
              </Space>
            </Radio.Group>
          </div>

          <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 flex items-center justify-between cursor-pointer hover:border-orange-200 transition-colors"
               onClick={() => setPromoModalVisible(true)}>
            <div className="flex items-center gap-3">
              <TagOutlined className="text-2xl text-orange-500" />
              <span className="font-bold text-gray-700">
                {appliedCode ? `Đã áp dụng: ${appliedCode}` : "Sử dụng mã giảm giá"}
              </span>
            </div>
            <RightOutlined className="text-gray-300" />
          </div>
        </div>

        <div className="lg:col-span-4">
          <div className="bg-white rounded-[32px] p-8 shadow-xl border border-gray-50 sticky top-24">
            <h2 className="text-xl font-black mb-6">Chi tiết đơn hàng</h2>
            <div className="space-y-4">
              <div className="flex justify-between text-gray-500">
                <span>Tạm tính</span>
                <span className="font-bold text-gray-800">{formatVND(subTotal)}</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>Phí vận chuyển</span>
                <span className="font-bold text-gray-800">{formatVND(shippingFee)}</span>
              </div>
              <div className="flex justify-between items-center text-green-600">
                <span className="flex items-center gap-1">Giảm giá <InfoCircleOutlined className="text-[10px]" /></span>
                <span className="font-bold">-{formatVND(Math.abs(discountValue))}</span>
              </div>
              <Divider className="my-4" />
              <div className="flex justify-between items-end mb-8">
                <span className="font-bold text-lg">Tổng cộng</span>
                <span className="text-3xl font-black text-orange-600 tracking-tighter">{formatVND(finalTotal)}</span>
              </div>
              <Button type="primary" size="large" block className="h-14 rounded-2xl bg-orange-600 font-black text-lg shadow-lg"
                      onClick={() => setConfirmModalVisible(true)} loading={checkoutPending}>
                ĐẶT HÀNG NGAY
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Modal title={null} open={isConfirmModalVisible} onCancel={() => setConfirmModalVisible(false)} footer={null} centered closable={false}>
        <div className="p-10 text-center">
          <CheckCircleFilled className="text-5xl text-green-500 mb-4" />
          <h3 className="text-2xl font-black text-[#5C4033] mb-2">Xác nhận đơn hàng</h3>
          <p className="text-gray-500 mb-8">Xác nhận đặt đơn hàng trị giá <span className="font-bold text-orange-600">{formatVND(finalTotal)}</span>?</p>
          <div className="grid grid-cols-2 gap-4">
            <Button size="large" className="rounded-xl font-bold" onClick={() => setConfirmModalVisible(false)}>Quay lại</Button>
            <Button size="large" type="primary" className="rounded-xl bg-orange-600 font-bold border-none" onClick={handlePlaceOrder}>Xác nhận</Button>
          </div>
        </div>
      </Modal>

      <PromoModal isVisible={isPromoModalVisible} onClose={() => setPromoModalVisible(false)} onApply={onApplyPromo} 
                  totalAmount={subTotal} items={checkoutItems} userCoupons={couponsData?.data || []} />
    </div>
  );
}