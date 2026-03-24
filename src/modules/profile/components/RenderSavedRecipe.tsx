import React from 'react';
import { Clock, Bookmark, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { RecipeResponse } from '../../../modules/explore/types/api-response';
import useSaveRecipe from '../../../modules/explore/hooks/useSaveRecipe';

type RenderSavedRecipeProps = {
  item: RecipeResponse;
};

const RenderSavedRecipe = ({ item }: RenderSavedRecipeProps) => {
  const navigate = useNavigate();
  const { mutate: unSaveRecipe, isPending } = useSaveRecipe();

  const handleUnSaved = (e: React.MouseEvent) => {
    e.stopPropagation();
    unSaveRecipe(item._id);
  };

  const getDifficultyStyles = (difficulty: string) => {
    switch (difficulty) {
      case 'Dễ': return 'bg-green-50 text-green-600';
      case 'Trung bình': return 'bg-orange-50 text-orange-600';
      default: return 'bg-red-50 text-red-600';
    }
  };

  return (
    <div className="flex bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow relative group">
      <div 
        className="w-32 h-32 flex-shrink-0 cursor-pointer overflow-hidden"
        onClick={() => navigate(`/explore/${item._id}`)}
      >
        <img 
          src={item.image} 
          alt={item.name} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
      </div>

      <div className="flex-1 p-4 flex flex-col justify-between">
        <div 
          className="cursor-pointer"
          onClick={() => navigate(`/explore/${item._id}`)}
        >
          <h3 className="text-base font-bold text-gray-800 line-clamp-1 group-hover:text-[#D35400] transition-colors">
            {item.name}
          </h3>
          
          <div className="flex items-center gap-2 mt-2 text-gray-500 text-xs">
            <Clock size={14} />
            <span>{item.cookTime} phút</span>
          </div>
        </div>

        <div className="flex items-center justify-between mt-3">
          {item.difficulty && (
            <span className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase ${getDifficultyStyles(item.difficulty)}`}>
              {item.difficulty}
            </span>
          )}
          
          <button 
            onClick={handleUnSaved}
            disabled={isPending}
            className="p-2 text-[#D35400] hover:bg-orange-50 rounded-full transition-all active:scale-90 disabled:opacity-50"
          >
            {isPending ? (
              <Loader2 size={20} className="animate-spin" />
            ) : (
              <Bookmark size={20} fill="#D35400" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RenderSavedRecipe;