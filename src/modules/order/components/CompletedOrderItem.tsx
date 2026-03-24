import React from 'react';
import { useNavigate } from 'react-router-dom';
import { OrderResponse } from '../types/api-response';
import { formatDate, formatStepTime, formatVND } from '../../../utils/helper';

const CompletedOrderItem = ({ order }: { order: OrderResponse }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-xl p-5 shadow-md border border-gray-50 flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <span className="font-bold text-gray-800">#VN-{order._id.slice(-5).toUpperCase()}</span>
        <span className="bg-green-50 text-green-700 text-xs font-bold px-3 py-1 rounded-full border border-green-100">
          Đã hoàn thành
        </span>
      </div>

      <p className="text-xs text-gray-400 -mt-2">
        {formatDate(order?.deliveredAt)} - {formatStepTime(order?.deliveredAt)}
      </p>

      <div className="flex gap-4 items-center">
        <img src={order.thumbnail} className="w-16 h-16 rounded-md object-cover" alt="" />
        <div className="flex-1">
          <h4 className="font-bold text-sm line-clamp-1">{order.productSummary}</h4>
          <p className="text-xs text-gray-500">{order.itemsForRebuy.length} sản phẩm</p>
          <p className="text-[#F26522] font-bold text-sm">{formatVND(order.totalPrice)}</p>
        </div>
      </div>

      <button 
        onClick={() => navigate('/checkout', { state: { items: JSON.stringify(order.itemsForRebuy) } })}
        className="w-full py-2.5 border border-[#F26522] text-[#F26522] rounded-lg font-bold text-sm transition hover:bg-orange-50"
      >
        Mua lại
      </button>
    </div>
  );
};

export default CompletedOrderItem;