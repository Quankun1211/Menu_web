import React from 'react';
import { Info, ChevronRight, RotateCcw, MoreHorizontal } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { OrderResponse } from '../types/api-response';
import { formatDate, formatStepTime, formatVND } from '../../../utils/helper';

interface OrderItemProps {
  order: OrderResponse;
}

const OrderItem = ({ order }: OrderItemProps) => {
  const navigate = useNavigate();

  const getStatusConfig = () => {
    switch (order.status) {
      case 'confirmed': return { label: "Đã xác nhận", color: 'text-blue-500', bg: 'bg-blue-500' };
      case 'shipping': return { label: "Đang giao", color: 'text-orange-500', bg: 'bg-orange-500' };
      case 'delivered': return { label: "Đã hoàn thành", color: 'text-green-500', bg: 'bg-green-500' };
      case 'cancelled': return { label: "Đã hủy", color: 'text-gray-500', bg: 'bg-gray-500' };
      default: return { label: "Đang xử lý", color: 'text-black', bg: 'bg-black' };
    }
  };

  const status = getStatusConfig();

  const handleRebuy = () => {
    const items = order.itemsForRebuy.map(i => ({ productId: i.productId, quantity: i.quantity }));
    navigate('/checkout', { state: { source: 'cart', items: JSON.stringify(items) } });
  };

  return (
    <div className="bg-white rounded-xl p-4 mb-4 shadow-sm border border-gray-100 flex gap-4 min-h-[140px]">
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className={`w-2 h-2 rounded-full ${status.bg}`} />
            <span className={`text-[12px] font-bold uppercase tracking-tight ${status.color}`}>
              {status.label}
            </span>
          </div>

          <h3 className="font-bold text-gray-900 line-clamp-1">
            Đơn hàng #VN-{order._id.slice(-5).toUpperCase()}
          </h3>
          <p className="text-[11px] text-gray-500 mt-1">
            {formatDate(order.createdAt)} • {formatStepTime(order.createdAt)}
          </p>
          <p className="text-sm font-bold text-[#F26522] mt-1">
            {formatVND(order.totalPrice)}
          </p>
        </div>

        <div className="flex flex-wrap gap-2 mt-4">
          {(order.status === 'pending' || order.status === 'confirmed' || order.status === 'assigned') && (
            <button 
              onClick={() => navigate(`/order/detail`, { 
                state: { orderId: order._id } 
              })}
              className="flex items-center gap-1 px-4 py-1.5 bg-gray-100 text-gray-600 rounded-lg text-xs font-bold hover:bg-gray-200 transition-colors"
            >
              Chi tiết <Info size={14} />
            </button>
          )}

          {order.status === 'shipping' && (
            <button 
              onClick={() => navigate(`/order/detail`, { 
                state: { orderId: order._id } 
              })}
              className="flex items-center gap-1 px-4 py-1.5 bg-[#F26522] text-white rounded-lg text-xs font-bold hover:bg-orange-600 transition-colors"
            >
              Theo dõi <ChevronRight size={14} />
            </button>
          )}

          {order.status === 'delivered' && (
            <div className="flex gap-2">
              <button 
                onClick={handleRebuy} 
                className="flex items-center gap-1 px-4 py-1.5 border border-[#F26522] text-[#F26522] rounded-lg text-xs font-bold hover:bg-orange-50 transition-colors"
              >
                Mua lại <RotateCcw size={14} />
              </button>
              <button 
                onClick={() => navigate(`/order/detail`, { 
                  state: { orderId: order._id } 
                })}
                className="p-2 text-gray-400 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <MoreHorizontal size={18} />
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="flex-shrink-0 self-start">
        <img 
          src={order.thumbnail} 
          alt="product" 
          className="w-20 h-20 rounded-lg object-cover bg-gray-50 border border-gray-50 shadow-sm" 
        />
      </div>
    </div>
  );
};

export default OrderItem;