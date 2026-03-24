import React from 'react';
import { ShopOutlined, CheckCircleOutlined, CarOutlined, HomeOutlined } from '@ant-design/icons';
import { formatDate, formatStepTime } from '../../../utils/helper';

export default function DeliveryStatusHorizontal({ currentStatus, orderData }: any) {
  const statusPriority: any = { 'pending': 0, 'confirmed': 1, 'processing': 1, 'shipping': 2, 'delivered': 3 };
  const currentPriority = statusPriority[currentStatus] ?? 0;

  const steps = [
    { title: 'Đặt hàng', icon: <ShopOutlined />, time: formatStepTime(orderData?.createdAt) },
    { title: 'Chuẩn bị', icon: <CheckCircleOutlined />, time: formatStepTime(orderData?.updatedAt) },
    { title: 'Đang giao', icon: <CarOutlined />, time: orderData?.shippedAt ? formatStepTime(orderData?.shippedAt) : '--:--' },
    { title: 'Hoàn tất', icon: <HomeOutlined />, time: orderData?.deliveredAt ? formatStepTime(orderData?.deliveredAt) : '--:--' },
  ];

  return (
    <div className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-100">
      <div className="relative flex justify-between items-start">
        {/* Progress Line Background */}
        <div className="absolute top-6 left-0 w-full h-1 bg-gray-100"></div>
        
        {/* Active Progress Line */}
        <div 
          className="absolute top-6 left-0 h-1 bg-orange-500 transition-all duration-1000 ease-out"
          style={{ width: `${(currentPriority / (steps.length - 1)) * 100}%` }}
        ></div>

        {steps.map((step, index) => {
          const isCompleted = currentPriority > index;
          const isActive = currentPriority === index;
          const isPending = currentPriority < index;

          return (
            <div key={index} className="relative z-10 flex flex-col items-center flex-1">
              <div className={`
                w-12 h-12 rounded-full flex items-center justify-center text-xl border-4 border-white transition-all duration-500
                ${isCompleted || isActive ? 'bg-orange-500 text-white shadow-lg shadow-orange-200 scale-110' : 'bg-gray-200 text-gray-400'}
              `}>
                {step.icon}
              </div>
              <div className="mt-4 text-center">
                <p className={`text-xs font-black uppercase tracking-tight ${isActive ? 'text-orange-600' : 'text-gray-400'}`}>
                  {step.title}
                </p>
                <p className="text-[10px] text-gray-400 font-bold mt-1">{step.time}</p>
              </div>
              {isActive && (
                <div className="absolute -top-10 bg-orange-600 text-white text-[10px] px-2 py-1 rounded-md font-bold animate-bounce">
                  Hiện tại
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}