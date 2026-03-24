import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ShoppingCartOutlined, 
  ToolOutlined 
} from '@ant-design/icons';
import { Button, Tooltip, Tag, message } from 'antd';
import { formatVND } from '../../../utils/helper';
import { useCheckoutStore } from '../../../store/useCheckoutStore';
import useGetMe from '../../../hooks/useGetMe';

const MenuItems = ({ item }) => {
  const navigate = useNavigate();
  const { data: meData } = useGetMe(false);
  const isLoggedIn = !!meData?.data;

  const details = item.ingredientId;

  if (!details) return null;

  const displayName = details.customName || details.name;
  const displayImage = details.image || details.images;
  const displayPrice = details.price || 0;
  const { setCheckoutData } = useCheckoutStore();
  
  const isInShop = item.itemType === 'Product' || !!details.productId;

  const handleQuickPurchase = () => {
    if (!isLoggedIn) {
      return message.warning("Vui lòng đăng nhập để thực hiện mua hàng!");
    }

    const memoiData = [{
      productId: details._id,
      quantity: 1,
    }];
    
    setCheckoutData(memoiData, "cart");
    
    navigate("/checkout", { 
      state: { 
        source: "buy_now", 
        items: memoiData 
      } 
    });
  };

  return (
    <div className={`
      flex items-center justify-between p-3 rounded-[24px] transition-all duration-300
      ${isInShop 
        ? "bg-white border border-orange-50 hover:border-orange-200 hover:shadow-md" 
        : "bg-gray-50/50 border border-dashed border-gray-200 opacity-80"}
    `}>
      <div className="flex items-center gap-4 flex-1 min-w-0">
        <div className="relative group">
          <img 
            src={displayImage || "/assets/placeholder-food.jpg"} 
            alt={displayName}
            className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm group-hover:scale-110 transition-transform"
          />
          {!isInShop && (
            <div className="absolute inset-0 bg-gray-900/10 rounded-full flex items-center justify-center">
              <ToolOutlined className="text-white text-[10px]" />
            </div>
          )}
        </div>

        <div className="flex flex-col min-w-0">
          <h4 className="text-sm font-bold text-[#5C4033] truncate leading-tight">
            {displayName}
          </h4>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-[11px] font-black text-orange-600 bg-orange-50 px-2 py-0.5 rounded-md">
              {item.quantity} {details.unit}
            </span>
            <span className="text-[11px] text-[#A88E7A] font-medium">
              • {formatVND(displayPrice)} / {details.unit}
            </span>
          </div>
        </div>
      </div>
      
      <div className="ml-4">
        {isInShop ? (
          <Tooltip title="Mua lẻ nguyên liệu này">
            <Button
              type="primary"
              shape="circle"
              icon={<ShoppingCartOutlined className="text-sm" />}
              onClick={handleQuickPurchase}
              className="bg-orange-50 border-orange-100 text-orange-600 hover:bg-orange-600 hover:text-white flex items-center justify-center shadow-none"
            />
          </Tooltip>
        ) : (
          <Tag 
            icon={<ToolOutlined />} 
            className="mr-0 border-none bg-gray-200 text-gray-500 font-bold text-[9px] uppercase px-3 py-1 rounded-full"
          >
            Tự chuẩn bị
          </Tag>
        )}
      </div>
    </div>
  );
};

export default MenuItems;