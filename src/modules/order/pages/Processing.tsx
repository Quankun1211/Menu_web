import React from 'react';
import { InfoCircleOutlined, CarOutlined, SafetyCertificateOutlined } from '@ant-design/icons';
import ProcessingOrderItem from '../components/ProcessingOrderItem';
import ShippingOrderItem from '../components/ShippingOrderItem';
import { OrderResponse } from '../types/api-response';

type Props = {
  orders: OrderResponse[];
};

export const ProcessingOrders = ({ orders }: Props) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {orders.map((order) => (
          <ProcessingOrderItem key={order._id} order={order} />
        ))}
      </div>

      {orders.length === 0 && (
        <div className="text-center py-10 text-gray-400 font-bold">
          QUÝ KHÁCH CHƯA CÓ ĐƠN HÀNG NÀO
        </div>
      )}

      <div className="bg-orange-50 border border-orange-100 p-4 rounded-2xl flex items-center gap-3">
        <InfoCircleOutlined className="text-orange-500 text-lg" />
        <p className="text-orange-700 text-sm">
          Các đơn hàng đang xử lý thường mất từ 15–30 phút để xác nhận.
        </p>
      </div>
    </div>
  );
};

export const ShippingOrders = ({ orders }: Props) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {orders.map((order) => (
          <ShippingOrderItem key={order._id} order={order} />
        ))}
      </div>

      {orders.length === 0 && (
        <div className="text-center py-10 text-gray-400 font-bold">
          QUÝ KHÁCH CHƯA CÓ ĐƠN HÀNG NÀO
        </div>
      )}

      <div className="space-y-2">
        <div className="bg-blue-50 border border-blue-100 p-4 rounded-2xl flex items-center gap-3">
          <SafetyCertificateOutlined className="text-blue-500 text-lg" />
          <p className="text-blue-700 text-sm">
            Vui lòng giữ điện thoại để Shipper liên lạc khi đơn hàng đến nơi.
          </p>
        </div>
        <div className="bg-orange-50 border border-orange-100 p-4 rounded-2xl flex items-center gap-3">
          <CarOutlined className="text-orange-500 text-lg" />
          <p className="text-orange-700 text-sm">
            Được đồng kiểm khi nhận hàng. Nếu sản phẩm lỗi, bạn có quyền từ chối nhận.
          </p>
        </div>
      </div>
    </div>
  );
};