import React from 'react';
import { formatVND } from '../../../utils/helper';

export default function OrderItemDetail({ orderDetail }: any) {
  return (
    <div className="flex items-center gap-4 bg-gray-50/50 p-3 rounded-2xl hover:bg-gray-50 transition-colors">
      <img 
        src={orderDetail.image} 
        alt={orderDetail.name} 
        className="w-16 h-16 rounded-xl object-cover border border-white shadow-sm"
      />
      <div className="flex-1 min-w-0">
        <h4 className="font-bold text-gray-800 text-sm truncate">{orderDetail.name}</h4>
        <p className="text-xs text-gray-400">{orderDetail.quantity} {orderDetail.unit}</p>
      </div>
      <span className="font-black text-gray-700">{formatVND(orderDetail.total)}</span>
    </div>
  );
}