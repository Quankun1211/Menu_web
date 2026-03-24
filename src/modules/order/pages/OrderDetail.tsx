import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  ArrowLeftOutlined, 
  CheckCircleFilled, 
  ClockCircleFilled, 
  CloseCircleFilled, 
  EnvironmentOutlined,
  WalletOutlined,
  ExclamationCircleOutlined,
  UndoOutlined,
  CustomerServiceOutlined,
  PhoneOutlined
} from '@ant-design/icons';
import { Button, Spin, Modal, Input, message } from 'antd';
import DeliveryStatusHorizontal from '../components/DeliveryStatusHorizontal';
import OrderItemDetail from '../components/OrderDetailItem';
import useGetOrderDetail from '../hooks/useGetOrderDetail';
import useCancelOrder from '../hooks/useCancelOrder';
import { formatVND } from '../../../utils/helper';

export default function OrderDetailWeb() {
  const location = useLocation();
  const idFromState = location.state?.orderId;
  const navigate = useNavigate();
  const { data, isPending } = useGetOrderDetail(idFromState);
  const { mutate: cancelOrder, isPending: cancelPending } = useCancelOrder();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState('');

  const order = data?.data;
  const status = order?.status ?? "pending";

  const getBannerInfo = (status: string, paymentStatus?: string) => {
    if (paymentStatus === "refunded") return { title: "Đã hoàn tiền", sub: "Tiền đã được hoàn lại thành công", icon: <UndoOutlined />, color: "text-green-600", bg: "bg-green-50" };
    switch (status) {
      case "delivered": return { title: "Giao hàng thành công", sub: "Đơn hàng đã được giao", icon: <CheckCircleFilled />, color: "text-orange-600", bg: "bg-orange-50" };
      case "shipping": return { title: "Đang giao hàng", sub: "Người giao hàng đang đến", icon: <ClockCircleFilled />, color: "text-blue-600", bg: "bg-blue-50" };
      case "cancelled": return { title: "Đã hủy đơn", sub: "Đơn hàng đã được hủy thành công", icon: <CloseCircleFilled />, color: "text-red-600", bg: "bg-red-50" };
      default: return { title: "Đang xử lý", sub: "Chúng tôi đang chuẩn bị hàng", icon: <ClockCircleFilled />, color: "text-orange-600", bg: "bg-orange-50" };
    }
  };

  const handleCancel = () => {
    if (!cancelReason.trim()) return message.warning("Vui lòng nhập lý do hủy");
    cancelOrder({ orderId: idFromState, reason: cancelReason }, {
      onSuccess: () => {
        message.success("Đã gửi yêu cầu hủy đơn");
        setIsModalOpen(false);
      }
    });
  };

  if (isPending) return <div className="h-screen flex items-center justify-center"><Spin size="large" tip="Đang tải..." /></div>;
  if (!order) return null;

  const banner = getBannerInfo(status, order.paymentStatus);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 min-h-screen bg-gray-50 text-gray-800">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-400 hover:text-orange-600 mb-6 font-bold transition-colors group">
        <ArrowLeftOutlined className="group-hover:-translate-x-1 transition-transform" /> Quay lại danh sách
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className={`${banner.bg} rounded-[32px] p-8 border border-white shadow-sm flex items-center justify-between`}>
            <div>
              <p className="text-[10px] font-black uppercase tracking-[2px] opacity-60 mb-1">Trạng thái đơn hàng</p>
              <h1 className={`text-3xl font-black ${banner.color}`}>{banner.title}</h1>
              <p className="text-gray-500 font-medium mt-1">{banner.sub}</p>
            </div>
            <div className={`text-5xl ${banner.color} opacity-20`}>{banner.icon}</div>
          </div>

          <DeliveryStatusHorizontal currentStatus={status} orderData={order} />

          <div className="bg-white rounded-[32px] p-6 shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <EnvironmentOutlined className="text-green-500" /> Địa chỉ giao hàng
            </h2>
            <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100">
              <p className="font-black text-gray-800 text-base">{order.address?.name}</p>
              <p className="text-gray-500 text-sm mt-2 leading-relaxed">{order.address?.address}</p>
            </div>
            
            {status === 'shipping' && (
              <div className="mt-4 p-4 bg-blue-50 rounded-2xl flex items-center gap-4 border border-blue-100">
                <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-100">
                  <PhoneOutlined className="text-xl" />
                </div>
                <div className="flex-1">
                  <p className="text-[10px] font-bold text-blue-400 uppercase tracking-wider">Shipper đang giao</p>
                  <p className="font-bold text-blue-900">Tài xế đang mang hàng đến cho bạn</p>
                </div>
                <Button type="primary" shape="round" className="bg-blue-600 border-none font-bold">Gọi điện</Button>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-[32px] p-6 shadow-sm border border-gray-100 sticky top-8">
            <h2 className="text-lg font-bold mb-6">Chi tiết sản phẩm</h2>
            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              {order.items?.map((item: any) => (
                <OrderItemDetail key={item.productId} orderDetail={item} />
              ))}
            </div>
            
            <div className="mt-6 pt-6 border-t border-dashed border-gray-200 space-y-4">
              <div className="flex justify-between text-gray-500 font-medium">
                <span>Tạm tính</span>
                <span>{formatVND(order.totalPrice)}</span>
              </div>
              <div className="flex justify-between text-gray-500 font-medium">
                <span>Phí vận chuyển</span>
                <span className="text-green-500 font-bold">Miễn phí</span>
              </div>
              <div className="flex justify-between text-xl font-black text-gray-900 pt-2">
                <span>Tổng cộng</span>
                <span className="text-orange-600">{formatVND(order.totalPrice)}</span>
              </div>
            </div>

            <div className={`mt-8 p-4 rounded-2xl flex items-center gap-3 ${order.paymentStatus === 'paid' ? 'bg-green-50' : 'bg-orange-50'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${order.paymentStatus === 'paid' ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'}`}>
                <WalletOutlined />
              </div>
              <div className="flex-1">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Trạng thái thanh toán</p>
                <p className="text-xs font-black text-gray-700 uppercase">{order.paymentMethod} • {order.paymentStatus === 'paid' ? 'Đã thanh toán' : 'Chưa thanh toán'}</p>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <Button icon={<CustomerServiceOutlined />} className="rounded-xl font-bold border-gray-200 text-gray-500 h-12">Hỗ trợ</Button>
              {["pending", "confirmed", "processing"].includes(status) && (
                <Button 
                  danger 
                  className="h-12 rounded-xl font-bold bg-red-50 border-none text-red-500 hover:bg-red-500 hover:text-white"
                  onClick={() => setIsModalOpen(true)}
                  loading={cancelPending}
                >
                  Hủy đơn
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      <Modal
        title={null}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        centered
        closable={false}
        className="rounded-[32px] overflow-hidden"
      >
        <div className="p-4 text-center">
          <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
            <ExclamationCircleOutlined />
          </div>
          <h3 className="text-2xl font-black mb-2 text-gray-800">Hủy đơn hàng?</h3>
          <p className="text-gray-400 mb-8 px-4">Đơn hàng sẽ được hủy ngay lập tức sau khi bạn xác nhận. Hãy cho chúng tôi biết lý do của bạn.</p>
          <Input.TextArea 
            rows={4} 
            placeholder="Ví dụ: Tôi muốn đổi địa chỉ, chọn nhầm sản phẩm..." 
            className="rounded-2xl mb-8 bg-gray-50 border-none p-4"
            value={cancelReason}
            onChange={(e) => setCancelReason(e.target.value)}
          />
          <div className="grid grid-cols-2 gap-4">
            <Button size="large" className="rounded-2xl font-bold border-none bg-gray-100 h-14" onClick={() => setIsModalOpen(false)}>Quay lại</Button>
            <Button size="large" type="primary" danger className="rounded-2xl font-bold h-14 shadow-lg shadow-red-100" onClick={handleCancel}>Xác nhận hủy</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}