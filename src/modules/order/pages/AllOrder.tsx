import React from 'react';
import OrderItem from '../components/OrderItems';
import { OrderResponse } from '../types/api-response';

type Props = { orders: OrderResponse[] };

const AllOrders = ({ orders }: Props) => {
  return (
    <div className="flex flex-col gap-4">
      {orders.map((item) => (
        <OrderItem key={item._id} order={item} />
      ))}
      <div className="py-10 text-center border-t border-dashed mt-4">
        <p className="text-gray-400 font-bold text-sm uppercase">
          {orders.length === 0 ? "Quý khách chưa có đơn hàng nào" : "Cảm ơn quý khách"}
        </p>
      </div>
    </div>
  );
};

export default AllOrders;