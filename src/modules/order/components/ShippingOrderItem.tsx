import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ClockCircleOutlined, EnvironmentOutlined, ArrowRightOutlined } from '@ant-design/icons';
import { formatVND } from '../../../utils/helper';
import { OrderResponse } from '../types/api-response';

export default function ShippingOrderItem({ order }: { order: OrderResponse }) {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-[32px] overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
      {/* Giả lập phần Map Header */}
      <div className="relative h-32 bg-gray-200">
        <img 
          src="/assets/map-placeholder.jpg" // Thay bằng link ảnh map của bạn
          className="w-full h-full object-cover opacity-60"
          alt="delivery map"
        />
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1.5 rounded-full flex items-center gap-2 shadow-sm">
          <ClockCircleOutlined className="text-green-500" />
          <span className="text-xs font-bold text-green-600">Giao trong 15 phút</span>
        </div>
      </div>

      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <p className="text-xs font-bold text-green-600 uppercase tracking-wider">Đang vận chuyển</p>
            <h3 className="font-black text-gray-800">Đơn hàng #{order._id.slice(-5).toUpperCase()}</h3>
          </div>
          <div className="bg-green-100 p-2 rounded-full">
            <img src="/icons/bike.png" className="w-6 h-6" alt="bike" />
          </div>
        </div>

        <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-2xl mb-4">
          <div className="bg-white p-2 rounded-xl shadow-sm">
            <EnvironmentOutlined className="text-green-500" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold truncate text-gray-700">{order.address.address}</p>
            <p className="text-xs text-gray-400 truncate">{order.productSummary}</p>
          </div>
        </div>

        <div className="flex justify-between items-center pt-2">
          <span className="text-xl font-black text-orange-600">{formatVND(order.totalPrice)}</span>
          <button 
            onClick={() => navigate(`/order/${order._id}`)}
            className="flex items-center gap-2 bg-orange-600 text-white px-5 py-2 rounded-2xl font-bold text-sm hover:bg-orange-700 transition-colors"
          >
            Theo dõi <ArrowRightOutlined />
          </button>
        </div>
      </div>
    </div>
  );
}