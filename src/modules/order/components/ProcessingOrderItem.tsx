import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CustomerServiceOutlined } from '@ant-design/icons';
import { formatDate, formatVND } from '../../../utils/helper';
import { OrderResponse } from '../types/api-response';

export default function ProcessingOrderItem({ order }: { order: OrderResponse }) {
  const navigate = useNavigate();

  return (
    <div 
      className="rounded-[24px] p-4 flex justify-between items-center transition-transform hover:scale-[1.02] cursor-pointer shadow-sm min-h-[140px]" // Thêm min-h để đảm bảo độ cao tối thiểu
      style={{ background: 'linear-gradient(135deg, #C5DED3 0%, #f0f6fd 100%)' }}
      onClick={() => navigate(`/order/detail`, { 
        state: { orderId: order._id } 
      })}
    >
      <div className="flex flex-col justify-between flex-1 pr-4 h-full"> 
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
            <span className="text-xs font-bold text-orange-600 uppercase tracking-tight">Đang xử lý</span>
          </div>
          
          <h3 className="font-bold text-gray-800 mb-1 line-clamp-1"> 
            Đơn hàng #VN-{order._id.slice(-5).toUpperCase()}
          </h3>
          <p className="text-[13px] text-gray-500 mb-3">
            {formatDate(order.createdAt)} • {formatVND(order.totalPrice)}
          </p>
        </div>

        <div className="flex gap-2 mt-auto">
          <button 
            onClick={(e) => { e.stopPropagation();  }}
            className="flex items-center gap-1 bg-orange-500/10 border border-orange-500/20 px-3 py-1.5 rounded-full text-orange-600 text-[11px] font-bold hover:bg-orange-500/20 transition-colors"
          >
            <CustomerServiceOutlined /> Hỗ trợ
          </button>
          <button className="bg-white px-4 py-1.5 rounded-full text-[11px] font-bold shadow-sm hover:bg-gray-50 transition-colors">
            Chi tiết
          </button>
        </div>
      </div>

      <div className="flex-shrink-0"> 
        <img 
          src={order.thumbnail} 
          alt="product" 
          className="w-24 h-24 rounded-2xl object-cover shadow-md border-2 border-white"
        />
      </div>
    </div>
  );
}