import React from 'react';
import { useNavigate } from "react-router-dom";
import { 
  BookOutlined, 
  BookFilled, 
  ClockCircleOutlined,
  ThunderboltOutlined 
} from '@ant-design/icons';
import { message, Tooltip } from 'antd';
import useSaveRecipe from '../hooks/useSaveRecipe';

const RecipeGridItem = ({ item }) => {
  const navigate = useNavigate();
  const { mutate: saveRecipe } = useSaveRecipe();

  const handleSave = (e) => {
    e.stopPropagation();
    saveRecipe(item._id, {
      onSuccess: () => {
        message.success(item.isSaved ? "Đã bỏ lưu món ăn" : "Đã lưu vào bộ sưu tập!");
      }
    });
  };

  const getDifficultyLevel = (difficulty) => {
    if (difficulty === 'Khó') return 3;
    if (difficulty === 'Trung bình') return 2;
    return 1;
  };

  return (
    <div 
      onClick={() => navigate(`/explore/recipe-detail/${item.slug}`, {state: {title: item._id}})}
      className="group relative bg-white rounded-[32px] overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-500 cursor-pointer border border-gray-50 h-full flex flex-col"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <img 
          src={item.image} 
          alt={item.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        <button 
          onClick={handleSave}
          className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/90 backdrop-blur-md rounded-2xl flex items-center justify-center shadow-sm hover:bg-white hover:scale-110 transition-all active:scale-95"
        >
          {item.isSaved ? (
            <BookFilled className="text-orange-600 text-lg" />
          ) : (
            <BookOutlined className="text-orange-600 text-lg" />
          )}
        </button>

        <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-xl flex items-center gap-1.5 border border-white/20">
          <ClockCircleOutlined className="text-white text-[12px]" />
          <span className="text-white text-[11px] font-bold tracking-wide">
            {item.cookTime} phút
          </span>
        </div>
      </div>

      <div className="p-5 flex flex-col flex-1">
        <h3 className="text-[#5C4033] font-black text-base leading-tight mb-3 line-clamp-1 group-hover:text-orange-600 transition-colors">
          {item.name}
        </h3>
        
        <div className="mt-auto flex items-center justify-between">
          <div className="flex gap-1">
            {[1, 2, 3].map((i) => (
              <ThunderboltOutlined 
                key={i} 
                className={`text-[12px] ${
                  i <= getDifficultyLevel(item.difficulty) 
                    ? 'text-orange-500' 
                    : 'text-gray-200'
                }`} 
              />
            ))}
            <span className="text-[10px] font-black uppercase tracking-tighter text-gray-400 ml-1">
              {item.difficulty}
            </span>
          </div>

          <Tooltip title="Xem chi tiết">
            <div className="w-6 h-6 rounded-full bg-orange-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <ThunderboltOutlined className="text-orange-500 text-[10px]" />
            </div>
          </Tooltip>
        </div>
      </div>
    </div>
  );
};

export default RecipeGridItem;