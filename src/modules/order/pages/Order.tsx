import React, { useState } from 'react';
import { ShoppingCart, LogIn } from 'lucide-react';
import useGetMyOrders from '../hooks/useGetOrders';
import useGetMe from '../../../hooks/useGetMe';
import { useNavigate } from 'react-router-dom';
import AllOrders from './AllOrder';
import { ProcessingOrders, ShippingOrders} from './Processing';
import CancelledOrders from './CancelledOrder';
import CompletedOrders from './CompletedOrder';

const TABS = [
  { id: 'all', label: 'Tất cả' },
  { id: 'delivered', label: 'Hoàn thành' },
  { id: 'pending', label: 'Đang xử lý' },
  { id: 'shipping', label: 'Đang giao' },
  { id: 'cancelled', label: 'Đã hủy' },
];

export default function OrdersPage() {
  const [activeTab, setActiveTab] = useState('all');
  const navigate = useNavigate();
  const { data: meData } = useGetMe(false);
  const isLoggedIn = !!meData?.data;
  const { data, isPending } = useGetMyOrders(isLoggedIn);

  const orders = data?.data ?? [];

  if (!isLoggedIn) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] bg-gray-50 p-5">
        <ShoppingCart size={100} className="text-gray-300" />
        <h2 className="text-lg text-gray-600 mt-5 text-center">
          Vui lòng đăng nhập để xem đơn hàng của bạn
        </h2>
        <button 
          onClick={() => navigate('/login')}
          className="mt-5 bg-[#F26522] text-white px-8 py-3 rounded-full font-bold flex items-center gap-2 hover:bg-[#d5561d] transition"
        >
          <LogIn size={20} /> Đăng nhập ngay
        </button>
      </div>
    );
  }

  if (isPending) return <div className="text-center p-10">Đang tải...</div>;

  return (
    <div className="max-w-4xl mx-auto bg-gray-50 min-h-screen rounded-xl">
      <div className="flex overflow-x-auto bg-white border-b no-scrollbar rounded-t-xl">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 min-w-fit px-6 py-4 text-sm font-bold transition-colors border-b-2 ${
              activeTab === tab.id 
              ? 'text-[#F26522] border-[#F26522]' 
              : 'text-gray-500 border-transparent hover:text-gray-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="p-4">
        {activeTab === 'all' && <AllOrders orders={orders} />}
        {activeTab === 'delivered' && <CompletedOrders orders={orders.filter(o => o.status === 'delivered')} />}
        {activeTab === 'pending' && <ProcessingOrders orders={orders.filter(o => o.status === 'pending')} />}
        {activeTab === 'shipping' && <ShippingOrders orders={orders.filter(o => o.status === 'shipping')} />}
        {activeTab === 'cancelled' && <CancelledOrders orders={orders.filter(o => o.status === 'cancelled')} />}
      </div>
    </div>
  );
}