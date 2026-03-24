import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  ClockCircleOutlined, 
  ThunderboltOutlined, 
  TeamOutlined, 
  ShoppingOutlined,
  CheckSquareFilled,
  BorderOutlined,
  InfoCircleOutlined,
  StopOutlined
} from '@ant-design/icons';
import { Button, Tag, Spin, message, Affix } from 'antd';

import useGetRecipeDetail from '../hooks/useGetRecipeDetail';
import useGetMe from '../../../hooks/useGetMe';
import NutritionCard from '../components/NutritionCard';
import SuggestCard from '../components/SuggestCard';
import FolkTips from '../components/FolkTips';
import { formatDisplayQuantity } from '../../../utils/helper';
import { useCheckoutStore } from '../../../store/useCheckoutStore';

const RecipeDetail = () => {
  const location = useLocation();
  const idFromState = location.state?.title;
  
  const navigate = useNavigate();
  const { data: meData } = useGetMe(false);
  const isLoggedIn = !!meData;

  const setCheckoutData = useCheckoutStore((state) => state.setCheckoutData);
  const clearCheckout = useCheckoutStore((state) => state.clearCheckout);

  const { data: recipeDetail, isPending } = useGetRecipeDetail(idFromState);
  const [selectedIngredients, setSelectedIngredients] = useState([]);

  const recipe = recipeDetail?.data;

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const getEffectivePrice = (ingredient) => {
    const price = ingredient?.price || 0;
    const sale = ingredient?.salePercent;
    
    if (!sale || !sale.percent) return price;

    const now = new Date();
    const start = new Date(sale.startDate);
    const end = new Date(sale.endDate);

    if (now >= start && now <= end) {
      return Math.ceil(price * (1 - sale.percent / 100));
    }

    return price;
  };

  const toggleCheck = (item) => {
    const isBuyable = item.itemType === 'Product';
    if (!isBuyable) return;

    const productId = item.ingredientId?._id;
    if (!productId) return;

    const isExisting = selectedIngredients.find(i => i.productId === productId);
    if (isExisting) {
      setSelectedIngredients(prev => prev.filter(i => i.productId !== productId));
    } else {
      const priceToCharge = getEffectivePrice(item.ingredientId);

      setSelectedIngredients(prev => [
        ...prev, 
        {
          productId,
          quantity: item.quantity || 1,
          name: item.ingredientId?.name || item.ingredientId?.customName,
          price: priceToCharge
        }
      ]);
    }
  };

  const totalPrice = selectedIngredients.reduce((sum, item) => {
    return sum + (item.price * Math.ceil(item.quantity));
  }, 0);

  const handleBuyIngredients = () => {
    if (!isLoggedIn) {
      message.warning("Vui lòng đăng nhập để mua nguyên liệu!");
      return;
    }
    if (selectedIngredients.length === 0) {
      message.info("Vui lòng chọn ít nhất một nguyên liệu.");
      return;
    }

    clearCheckout();

    const groupedItems = selectedIngredients.reduce((acc, current) => {
      const pId = current.productId;
      if (!acc[pId]) acc[pId] = { productId: pId, quantity: 0 };
      acc[pId].quantity += Number(current.quantity) || 0;
      return acc;
    }, {});

    const itemsToCheckout = (Object.values(groupedItems) as any[]).map(item => ({
      productId: item.productId,
      quantity: Math.ceil(item.quantity),
    }));

    setCheckoutData(itemsToCheckout, "recipe");
    navigate("/checkout", { state: { source: "recipe", items: itemsToCheckout } });
  };

  if (isPending) return (
    <div className="flex justify-center items-center min-h-screen">
      <Spin size="large" tip="Đang tải công thức..." />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FDFCFB] rounded-2xl">
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-7 space-y-12">
          <div className="relative rounded-[40px] overflow-hidden shadow-2xl aspect-video group">
            <img 
              src={recipe?.image || "/assets/banner/gao.png"} 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              alt={recipe?.name}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            <h1 className="absolute bottom-8 left-10 right-10 text-white text-4xl font-black leading-tight">
              {recipe?.name}
            </h1>
          </div>

          <div className="grid grid-cols-3 gap-4 bg-white p-8 rounded-[32px] shadow-sm border border-gray-50">
            <SummaryItem icon={<ClockCircleOutlined />} value={recipe?.cookTime} label="PHÚT" />
            <SummaryItem icon={<ThunderboltOutlined />} value={recipe?.difficulty} label="ĐỘ KHÓ" />
            <SummaryItem icon={<TeamOutlined />} value={recipe?.meta?.servings} label="KHẨU PHẦN" />
          </div>

          <section>
            <h2 className="text-2xl font-black text-[#5C4033] mb-8 flex items-center gap-3">
              <div className="w-2 h-8 bg-orange-500 rounded-full" />
              Các bước thực hiện
            </h2>
            <div className="space-y-10 ml-4">
              {recipe?.instructions?.sort((a, b) => a.step - b.step).map((item, index) => (
                <div key={index} className="flex gap-8 group">
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 rounded-full bg-[#5C4033] text-white flex items-center justify-center font-black shadow-lg group-hover:bg-orange-500 transition-colors">
                      {item.step}
                    </div>
                    {index !== recipe.instructions.length - 1 && (
                      <div className="w-1 bg-gray-100 flex-1 my-2 rounded-full" />
                    )}
                  </div>
                  <div className="pb-10 flex-1">
                    <h4 className="text-xl font-black text-[#5C4033] mb-3">{item.title}</h4>
                    <p className="text-gray-500 leading-relaxed text-lg">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {recipe?.extraInfo?.map((item, index) => {
               if (item.type === 'nutrition') return <NutritionCard key={index} data={item.data} />;
               if (item.type === 'folkTips') return <FolkTips key={index} data={item.data} />;
               if (item.type === 'suggestedSideDishes') return <SuggestCard key={index} data={item.data} />;
               return null;
            })}
          </div>
        </div>

        <div className="lg:col-span-5">
          <Affix offsetTop={130}>
            <div 
              className="bg-white rounded-[40px] shadow-xl border border-orange-50 overflow-hidden flex flex-col"
              style={{ maxHeight: 'calc(100vh - 140px)' }}
            >
              <div className="bg-orange-50 p-6 flex-shrink-0">
                <h3 className="text-xl font-black text-orange-800 flex items-center gap-2">
                  <ShoppingOutlined /> Danh sách nguyên liệu
                </h3>
                <p className="text-orange-600/70 text-sm font-medium mt-1">
                  Chọn những thứ bạn còn thiếu để mua ngay
                </p>
              </div>

              <div className="p-6 overflow-y-auto no-scrollbar flex-grow">
                <div className="space-y-4 mb-8">
                  {recipe?.ingredients?.map((item) => {
                    const productId = item.ingredientId?._id;
                    const isBuyable = item.itemType === 'Product';
                    const isChecked = selectedIngredients.some(ing => ing.productId === productId);
                    
                    const originalPrice = item.ingredientId?.price || 0;
                    const effectivePrice = getEffectivePrice(item.ingredientId);
                    const hasActiveSale = effectivePrice < originalPrice;

                    return (
                      <div 
                        key={item._id}
                        onClick={() => toggleCheck(item)}
                        className={`
                          flex items-center justify-between p-4 rounded-2xl border transition-all
                          ${isBuyable ? 'cursor-pointer' : 'bg-gray-50 opacity-60 cursor-not-allowed'}
                          ${isChecked ? 'bg-orange-50 border-orange-200' : 'bg-white border-gray-100 hover:border-orange-100'}
                        `}
                      >
                        <div className="flex items-center gap-4">
                          {isBuyable ? (
                            isChecked ? <CheckSquareFilled className="text-xl text-orange-500" /> : <BorderOutlined className="text-xl text-gray-300" />
                          ) : (
                            <StopOutlined className="text-xl text-gray-300" />
                          )}
                          <div>
                            <p className={`font-bold text-sm ${isChecked ? 'text-orange-700' : 'text-[#5C4033]'}`}>
                              {item.ingredientId?.name || item.ingredientId?.customName}
                            </p>
                            <div className="flex items-center gap-2">
                              {isBuyable ? (
                                <>
                                  <span className="text-orange-600 font-bold text-xs">
                                    {formatPrice(effectivePrice)}
                                  </span>
                                  {hasActiveSale && (
                                    <span className="text-gray-400 line-through text-[10px]">
                                      {formatPrice(originalPrice)}
                                    </span>
                                  )}
                                </>
                              ) : (
                                <span className="text-[10px] text-gray-400 uppercase font-black">Tự chuẩn bị</span>
                              )}
                            </div>
                          </div>
                        </div>
                        <span className="text-xs font-bold text-gray-400 bg-gray-50 px-3 py-1 rounded-full">
                          {formatDisplayQuantity(item.quantity, item.ingredientId?.unit)}
                        </span>
                      </div>
                    );
                  })}
                </div>
                {recipe?.additionalIngredients?.length > 0 && (
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                      <InfoCircleOutlined /> Gia vị & Phụ liệu (Sẵn có)
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {recipe.additionalIngredients.map((item, idx) => (
                        <Tag key={idx} className="m-0 rounded-full border-gray-100 bg-gray-50 text-gray-500 font-medium px-4 py-1">
                          {item.name}: {formatDisplayQuantity(item.quantity, item.unit)}
                        </Tag>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="p-6 border-t border-gray-100 bg-gray-50/50 flex-shrink-0">
                {selectedIngredients.length > 0 && (
                  <div className="flex justify-between items-center mb-4 px-2">
                    <span className="text-gray-500 font-bold">Tổng cộng:</span>
                    <span className="text-xl font-black text-orange-600">{formatPrice(totalPrice)}</span>
                  </div>
                )}
                <Button 
                  type="primary" 
                  size="large" 
                  block
                  onClick={handleBuyIngredients}
                  disabled={selectedIngredients.length === 0}
                  className="h-14 rounded-2xl bg-[#E25822] hover:bg-[#D35400] border-none font-black text-lg shadow-xl shadow-orange-100"
                >
                  {selectedIngredients.length > 0 
                    ? `MUA ${selectedIngredients.length} NGUYÊN LIỆU` 
                    : "CHỌN NGUYÊN LIỆU"}
                </Button>
              </div>
            </div>
          </Affix>
        </div>
      </div>
    </div>
  );
};

const SummaryItem = ({ icon, value, label }) => (
  <div className="flex flex-col items-center justify-center text-center">
    <div className="text-orange-500 text-xl mb-1">{icon}</div>
    <span className="text-xl font-black text-[#5C4033] leading-none">{value}</span>
    <span className="text-[10px] font-black text-gray-400 mt-1 uppercase tracking-widest">{label}</span>
  </div>
);

export default RecipeDetail;