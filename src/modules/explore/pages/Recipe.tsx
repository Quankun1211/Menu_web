import { useMemo, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { 
  ClockCircleOutlined, 
  FireOutlined, 
  BookOutlined, 
  BookFilled,
  ThunderboltOutlined,
  LoadingOutlined,
  EnvironmentOutlined
} from "@ant-design/icons";
import { Spin, Button, Tag, Empty, message } from "antd";

import useGetCategoryRecipe from '../hooks/useGerCategoryRecipe';
import useGetRecipe from '../hooks/useGetRecipe';
import { useWeather } from '../../../hooks/useWeather';
import useSaveRecipe from '../hooks/useSaveRecipe';
import RecipeGridItem from '../components/RecipeGridItem';

export default function Recipe() {
  const [activeTab, setActiveTab] = useState("all");
  const navigate = useNavigate();
  const { temperature, condition } = useWeather();
  
  const { data: getCategoryRecipe } = useGetCategoryRecipe();
  const { data: recipeResponse, isPending: pendingRecipe } = useGetRecipe(activeTab);

  // Logic xác định trạng thái thời tiết
  const weatherMood = useMemo(() => {
    const cond = condition?.toLowerCase();
    if (temperature > 30) return 'hot'; 
    if (temperature < 22 || cond === 'rain' || cond === 'drizzle') return 'cold';
    return 'neutral';
  }, [temperature, condition]);

  // Mapping hiển thị tiếng Việt cho thời tiết
  const weatherInfo = useMemo(() => {
    const map = {
      hot: { label: 'Giải nhiệt', color: 'volcano', icon: '🔥', sub: 'Món thanh mát' },
      cold: { label: 'Ấm áp', color: 'blue', icon: '❄️', sub: 'Món nóng hổi' },
      neutral: { label: 'Phổ biến', color: 'orange', icon: '✨', sub: 'Gợi ý hôm nay' }
    };
    return map[weatherMood] || map.neutral;
  }, [weatherMood]);

  const categoriesWithAll = useMemo(() => {
    const allTab = { _id: 'all', name: 'Tất cả' };
    if (!getCategoryRecipe?.data) return [allTab];
    return [allTab, ...getCategoryRecipe.data];
  }, [getCategoryRecipe?.data]);

  const listRecipes = useMemo(() => recipeResponse?.data || [], [recipeResponse]);

  // Tìm món ăn nổi bật khớp với thời tiết
  const featuredRecipe = useMemo(() => {
    if (listRecipes.length === 0) return null;
    const recommended = listRecipes.find(item => item.weatherTag === weatherMood);
    return recommended || listRecipes[0]; 
  }, [listRecipes, weatherMood]);

  const { mutate: saveRecipe } = useSaveRecipe();

  const handleSave = (e, item) => {
    e.stopPropagation(); 
    saveRecipe(item._id, {
      onSuccess: () => {
        message.success(item.isSaved ? "Đã bỏ lưu công thức" : "Đã lưu công thức thành công!");
      }
    });
  };

  if (pendingRecipe && listRecipes.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[400px]">
        <Spin indicator={<LoadingOutlined style={{ fontSize: 40, color: '#E25822' }} spin />} />
        <p className="mt-4 text-gray-500 font-medium italic">Đang tìm kiếm công thức ngon...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fadeIn">
      {/* Tab Categories */}
      <div className="flex items-center gap-3 overflow-x-auto pb-8 no-scrollbar scroll-smooth">
        {categoriesWithAll.map((item) => (
          <button
            key={item._id}
            onClick={() => setActiveTab(item._id)}
            className={`
              px-8 py-2.5 rounded-full whitespace-nowrap text-sm font-bold transition-all duration-300
              ${activeTab === item._id 
                ? "bg-[#E25822] text-white shadow-lg shadow-orange-200 scale-105" 
                : "bg-white text-gray-500 border border-gray-100 hover:border-[#E25822] hover:text-[#E25822] shadow-sm"}
            `}
          >
            {item.name}
          </button>
        ))}
      </div>

      {/* Featured Recipe Section */}
      <div className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-black text-[#5C4033] flex items-center gap-2 uppercase tracking-tight">
            <FireOutlined className="text-orange-500" /> {weatherInfo.sub}
          </h2>
          <div className="hidden md:flex items-center gap-3 bg-white/80 backdrop-blur-md px-5 py-2 rounded-2xl border border-orange-100 shadow-sm">
            <EnvironmentOutlined className="text-orange-500 animate-bounce" />
            <span className="text-[#5C4033] text-sm font-bold">
              {temperature}°C — {condition === 'Clear' ? 'Trời quang' : condition}
            </span>
          </div>
        </div>

        {featuredRecipe ? (
          <div 
            onClick={() => navigate(`/explore/recipe-detail/${featuredRecipe.slug}`, {state: {title: featuredRecipe._id}})}
            className="group relative flex flex-col md:flex-row bg-white rounded-[40px] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 cursor-pointer border border-gray-100"
          >
            {/* Image Side */}
            <div className="md:w-1/2 h-[300px] md:h-[500px] overflow-hidden relative">
              <img 
                src={featuredRecipe.image || "/assets/placeholder-recipe.jpg"} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                alt={featuredRecipe.name}
              />
              <button 
                className="absolute top-8 left-8 z-10 bg-white/90 backdrop-blur-md p-3 rounded-2xl shadow-md hover:scale-110 transition-transform"
                onClick={(e) => handleSave(e, featuredRecipe)}
              >
                {featuredRecipe.isSaved ? 
                  <BookFilled className="text-orange-600 text-xl" /> : 
                  <BookOutlined className="text-orange-600 text-xl" />
                }
              </button>
              <div className="absolute top-8 right-8">
                <Tag color={weatherInfo.color} className="m-0 px-5 py-1.5 rounded-full font-black border-none uppercase tracking-widest shadow-xl text-[11px]">
                  {weatherInfo.icon} {weatherInfo.label}
                </Tag>
              </div>
            </div>

            {/* Content Side */}
            <div className="md:w-1/2 p-8 md:p-14 flex flex-col justify-center bg-gradient-to-br from-white to-orange-50/20">
              <div className="flex items-center gap-2 mb-6">
                <div className="flex">
                  {Array(featuredRecipe.difficulty === 'Khó' ? 3 : featuredRecipe.difficulty === 'Trung bình' ? 2 : 1).fill(0).map((_, i) => (
                    <FireOutlined key={i} className="text-orange-500 text-[10px]" />
                  ))}
                </div>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-400">Độ khó: {featuredRecipe.difficulty}</span>
              </div>
              
              <h1 className="text-3xl md:text-5xl font-black text-[#5C4033] mb-6 leading-tight group-hover:text-[#E25822] transition-colors">
                {featuredRecipe.name}
              </h1>
              
              <p className="text-gray-500 text-lg leading-relaxed mb-10 line-clamp-3 font-medium">
                {featuredRecipe.description || "Khám phá hương vị truyền thống với công thức nấu ăn chuẩn vị Bếp Việt, đơn giản và dễ làm tại nhà."}
              </p>

              <div className="flex items-center gap-10 mb-10">
                <div className="flex flex-col">
                  <span className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-2">Thời gian</span>
                  <div className="flex items-center gap-2 text-[#5C4033] font-black text-lg">
                    <ClockCircleOutlined className="text-orange-500" /> {featuredRecipe.cookTime} phút
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-2">Đặc điểm</span>
                  <div className="flex items-center gap-2 text-[#5C4033] font-black text-lg">
                    <ThunderboltOutlined className="text-orange-500" /> {featuredRecipe.difficulty}
                  </div>
                </div>
              </div>

              <Button 
                type="primary" 
                size="large"
                className="w-fit h-14 px-12 rounded-2xl bg-[#E25822] hover:bg-[#D35400] border-none font-black uppercase tracking-[0.15em] shadow-xl shadow-orange-100 transform active:scale-95 transition-all"
              >
                Nấu ngay
              </Button>
            </div>
          </div>
        ) : (
          <div className="h-[400px] flex items-center justify-center bg-white rounded-[40px] border border-gray-100 shadow-inner">
            <Spin size="large" />
          </div>
        )}
      </div>

      {/* Grid Recipes Section */}
      <div className="mt-20">
        <div className="flex items-center justify-between mb-10 border-b border-gray-100 pb-5">
          <div className="flex items-center gap-3">
            <div className="w-2 h-8 bg-[#E25822] rounded-full"></div>
            <h2 className="text-2xl font-black text-[#5C4033] uppercase">Món mới cập nhật</h2>
          </div>
          {pendingRecipe && <Spin indicator={<LoadingOutlined style={{ color: '#E25822' }} spin />} />}
        </div>

        {listRecipes.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-8">
            {listRecipes.map((item) => (
              <div key={item._id} className="transform hover:-translate-y-3 transition-all duration-500">
                <RecipeGridItem item={item} />
              </div>
            ))}
          </div>
        ) : (
          <div className="py-24 bg-white rounded-[40px] border border-dashed border-gray-200">
            <Empty description={<span className="text-gray-400 font-medium">Hiện chưa có món ăn nào trong mục này</span>} />
          </div>
        )}
      </div>
    </div>
  );
}