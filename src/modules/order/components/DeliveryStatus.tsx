import React from 'react';
import { CheckCircleOutlined, ShopOutlined, CarOutlined, HomeOutlined } from '@ant-design/icons';
import { formatDate, formatStepTime } from '../../../utils/helper';

export default function DeliveryStatus({ currentStatus, orderData }: any) {
  const statusPriority: any = { 'pending': 0, 'confirmed': 1, 'processing': 1, 'shipping': 2, 'delivered': 3 };
  const currentPriority = statusPriority[currentStatus] ?? 0;

  const steps = [
    { title: 'Đơn hàng đã đặt', time: `${formatDate(orderData?.createdAt)} - ${formatStepTime(orderData?.createdAt)}`, icon: <ShopOutlined /> },
    { title: 'Đang chuẩn bị hàng', time: formatStepTime(orderData?.shippedAt || orderData?.updatedAt), icon: <CheckCircleOutlined /> },
    { title: 'Đang giao hàng', time: formatStepTime(orderData?.shippedAt), icon: <CarOutlined />, sub: "Tài xế đang đến gần điểm giao" },
    { title: 'Đã giao thành công', time: orderData?.deliveredAt ? `${formatDate(orderData.deliveredAt)} - ${formatStepTime(orderData.deliveredAt)}` : "Dự kiến: --:--", icon: <HomeOutlined /> },
  ];

  return (
    <div className="bg-white rounded-[32px] p-6 shadow-sm border border-gray-100">
      <h2 className="text-lg font-bold mb-8">Trạng thái vận chuyển</h2>
      <div className="space-y-0 relative">
        {steps.map((step, index) => {
          const isCompleted = currentPriority > index;
          const isActive = currentPriority === index;

          return (
            <div key={index} className="flex gap-4 min-h-[80px]">
              <div className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg z-10 transition-colors ${isCompleted || isActive ? 'bg-orange-500 text-white shadow-lg shadow-orange-200' : 'bg-gray-100 text-gray-400'}`}>
                  {step.icon}
                </div>
                {index !== steps.length - 1 && (
                  <div className={`w-0.5 flex-1 transition-colors ${isCompleted ? 'bg-orange-500' : 'bg-gray-100'}`}></div>
                )}
              </div>
              <div className="pb-8">
                <p className={`font-bold ${isActive ? 'text-orange-600 text-lg' : 'text-gray-700'}`}>{step.title}</p>
                <p className="text-xs text-gray-400 font-medium">{step.time}</p>
                {step.sub && isActive && <p className="text-xs text-blue-500 mt-1 italic font-bold tracking-tight">{step.sub}</p>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}