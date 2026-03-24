import React from 'react';
import { RefreshCcw, HelpCircle } from 'lucide-react';
import CancelledOrderItem from '../components/CancelledOrderItem';
import { OrderResponse } from '../types/api-response';

const CancelledOrders = ({ orders }: { orders: OrderResponse[] }) => {
  return (
    <div className="flex flex-col gap-4">
      {orders.map((item) => <CancelledOrderItem key={item._id} order={item} />)}

      <div className="mt-4 space-y-3">
        <div className="p-4 bg-[#F6FFED] border border-[#B7EB8F] rounded-lg flex gap-3">
          <RefreshCcw size={20} className="text-[#52C41A] shrink-0" />
          <p className="text-[#237804] text-sm">
            Đơn hàng thanh toán online sẽ được hoàn tiền trong 3-5 ngày làm việc theo quy định của VNPAY/Ngân hàng.
          </p>
        </div>

        <div className="p-4 bg-[#FFF7E6] border border-[#FFD591] rounded-lg flex gap-3">
          <HelpCircle size={20} className="text-[#FA8C16] shrink-0" />
          <p className="text-[#874D00] text-sm">
            Bạn lỡ tay hủy đơn? Hãy vào chi tiết đơn hàng và bấm "Mua lại" để chúng tôi chuẩn bị hàng sớm nhất nhé.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CancelledOrders;