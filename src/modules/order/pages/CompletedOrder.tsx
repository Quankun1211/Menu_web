import React from 'react';
import { Heart } from 'lucide-react';
import CompletedOrderItem from '../components/CompletedOrderItem';
import { OrderResponse } from '../types/api-response';

const CompletedOrders = ({ orders }: { orders: OrderResponse[] }) => {
  return (
    <div className="flex flex-col gap-4">
      {orders.map((item) => <CompletedOrderItem key={item._id} order={item} />)}
      
      {orders.length === 0 && (
        <p className="text-center py-5 text-gray-400 font-bold uppercase">Quý khách chưa có đơn hàng nào</p>
      )}

      <div className="mt-4 p-4 bg-[#FFF2E8] border border-[#FFD8BF] rounded-lg flex gap-3">
        <Heart size={20} className="text-[#F26522] shrink-0" />
        <p className="text-[#D46B08] text-sm leading-relaxed">
          Cảm ơn bạn đã lựa chọn Bếp Việt. Hy vọng bạn có một bữa ăn ngon miệng và hài lòng với những sản phẩm chúng tôi mang đến!
        </p>
      </div>
    </div>
  );
};

export default CompletedOrders;