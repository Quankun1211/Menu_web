import React from 'react';
import { MoreVertical, Clock, Flame } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { MyRecipeResponse } from '../types/api-response';

type RenderMyRecipeProps = {
  item: MyRecipeResponse;
  openMenu: (item: MyRecipeResponse) => void;
};

const RenderMyRecipe = ({ item, openMenu }: RenderMyRecipeProps) => {
  const navigate = useNavigate();

  return (
    <div className="flex bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow group">
      <div 
        className="w-32 h-32 flex-shrink-0 cursor-pointer overflow-hidden"
        onClick={() => navigate(`/profile/recipe-detail`, { state: {recipeId: item._id} })}
      >
        <img 
          src={item.image} 
          alt={item.name} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
      </div>

      <div className="flex-1 p-4 flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-start">
            <h3 
              className="text-base font-bold text-gray-800 line-clamp-1 cursor-pointer hover:text-[#D35400]"
              onClick={() => navigate(`/my-recipe/${item._id}`)}
            >
              {item.name}
            </h3>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                openMenu(item);
              }}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors text-gray-400"
            >
              <MoreVertical size={18} />
            </button>
          </div>

          <div className="flex items-center gap-4 mt-2 text-gray-500">
            <div className="flex items-center gap-1 text-xs">
              <Clock size={14} />
              <span>{item.cookTime} phút</span>
            </div>
            <div className="flex items-center gap-1 text-xs">
              <Flame size={14} className="text-orange-500" />
              <span>Calo</span>
            </div>
          </div>
        </div>

        {item.familyNotes && (
          <div className="mt-3">
            <span className="inline-block px-3 py-1 rounded-lg text-[10px] font-bold bg-green-50 text-green-600 uppercase">
              {item.familyNotes}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default RenderMyRecipe;