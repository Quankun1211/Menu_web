import React from 'react';
import { RotateCcw } from 'lucide-react';
import { OrderResponse } from '../types/api-response';
import { formatDate, formatVND } from '../../../utils/helper';

const CancelledOrderItem = ({ order }: { order: OrderResponse }) => {
  return (
    <div className="bg-white rounded-3xl overflow-hidden shadow-lg mb-6 border border-gray-100 transition hover:shadow-xl">
      <div className="relative h-40 w-full">
        <img src={order.thumbnail} className="w-full h-full object-cover opacity-80" alt="cancelled order" />
        <div className="absolute inset-0 bg-black/10" />
        {/* Ribbon Đã hủy */}
        <div className="absolute top-4 right-[-30px] bg-orange-700/90 text-white px-10 py-1 rotate-[35deg] text-[10px] font-bold tracking-widest shadow-md">
          ĐÃ HỦY
        </div>
      </div>

      <div className="p-5">
        <span className="text-[10px] font-bold text-orange-600 uppercase tracking-tighter">
          {order.cancelledBy === "user" ? "Đơn hàng đã hủy" : "Hệ thống đã hủy đơn"}
        </span>
        
        <h3 className="text-xl font-bold mt-1 text-gray-900">Mã đơn: #VN-{order._id.slice(-5).toUpperCase()}</h3>
        <p className="text-sm text-gray-400 mt-1">{formatDate(order.cancelledAt)} • {formatVND(order.totalPrice)}</p>
        
        <p className="text-xs text-gray-400 italic mt-3 line-clamp-2">
          Lý do: {order.cancelledBy === "user" ? order.cancelReason : order.cancelRequest?.reason}
        </p>

        <div className="flex justify-end mt-4">
          <button className="flex items-center gap-2 bg-[#D3764C] text-white px-6 py-2 rounded-full font-bold text-sm hover:bg-[#b85e3a] transition shadow-md">
            <RotateCcw size={16} /> Đặt lại
          </button>
        </div>
      </div>
    </div>
  );
};

export default CancelledOrderItem;