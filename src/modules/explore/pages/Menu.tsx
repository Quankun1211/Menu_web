import { useState, useMemo, useRef } from 'react';
import { Spin, Empty } from 'antd';
import { 
  AppstoreOutlined, 
  FireOutlined,
  CheckCircleOutlined
} from "@ant-design/icons";

import useGetCategoryMenu from '../hooks/useGetCategoryMenu';
import useGetMenu from '../hooks/useGetMenu';
import ListMenuItem from '../components/ListMenuItem';

export default function Menu() {
  const [activeTab, setActiveTab] = useState("all");
  
  const { data: getCategoryMenu } = useGetCategoryMenu();
  const { data: menuResponse, isPending: pendingMenu } = useGetMenu(activeTab);
  
  const categoriesWithAll = useMemo(() => {
    const allTab = { 
      _id: 'all', 
      name: 'Tất cả',
      title: 'Tự nấu mâm cơm chuẩn vị',
      description: 'Nguyên liệu tươi sạch kèm công thức chuẩn đầu bếp'
    };
    if (!getCategoryMenu?.data) return [allTab];
    return [allTab, ...getCategoryMenu.data];
  }, [getCategoryMenu?.data]);

  const listMenus = useMemo(() => {
    return menuResponse?.data || [];
  }, [menuResponse]);

  const activeCategoryInfo = useMemo(() => {
    return categoriesWithAll.find(cat => cat._id === activeTab);
  }, [activeTab, categoriesWithAll]);

  const handleChangeCategory = (id) => {
    setActiveTab(id);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 overflow-x-auto pb-6 scrollbar-hide">
        {categoriesWithAll.map((item) => (
          <button
            key={item._id}
            onClick={() => handleChangeCategory(item._id)}
            className={`
              px-6 py-2.5 rounded-full whitespace-nowrap text-sm font-bold transition-all duration-300 border
              ${activeTab === item._id 
                ? "bg-[#D16D2F] text-white border-[#D16D2F] shadow-lg shadow-orange-900/20 scale-105" 
                : "bg-white text-[#5C4033] border-orange-100 hover:border-[#D16D2F] hover:bg-orange-50"}
            `}
          >
            {item.name}
          </button>
        ))}
      </div>

      <div className="mb-10 mt-4">
        <div className="flex items-center gap-3 mb-2">
          <FireOutlined className="text-[#D16D2F] text-xl" />
          <h2 className="text-3xl font-black text-[#5C4033]">
            {activeCategoryInfo?.title || activeCategoryInfo?.name}
          </h2>
        </div>
        <p className="text-[#A88E7A] font-medium text-lg ml-8">
          {activeCategoryInfo?.description || "Khám phá các mâm cơm ngon"}
        </p>
      </div>

      {pendingMenu ? (
        <div className="flex justify-center items-center py-20">
          <Spin size="large" tip="Đang tìm mâm cơm ngon..." />
        </div>
      ) : listMenus.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {listMenus.map((item) => (
            <div key={item._id} className="transform hover:-translate-y-2 transition-transform duration-300">
              <ListMenuItem item={item} />
            </div>
          ))}
        </div>
      ) : (
        <div className="py-20 bg-white rounded-[40px] border border-dashed border-orange-200">
          <Empty 
            description={
              <span className="text-[#A88E7A] font-bold">
                Không có mâm cơm nào ở mục này
              </span>
            } 
          />
        </div>
      )}

      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { icon: <CheckCircleOutlined />, text: "Nguyên liệu tươi mới mỗi ngày" },
          { icon: <AppstoreOutlined />, text: "Thực đơn đa dạng vùng miền" },
          { icon: <FireOutlined />, text: "Công thức chuẩn đầu bếp" }
        ].map((feat, idx) => (
          <div key={idx} className="flex items-center justify-center gap-3 p-4 bg-orange-50 rounded-2xl border border-orange-100">
            <span className="text-[#D16D2F]">{feat.icon}</span>
            <span className="text-[#5C4033] font-bold text-sm">{feat.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}