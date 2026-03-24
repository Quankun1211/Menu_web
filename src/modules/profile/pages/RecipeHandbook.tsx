import React, { useState } from 'react';
import { 
  BookOpen, 
  Heart, 
  Plus, 
  MoreVertical, 
  Edit2, 
  Trash2, 
  Loader2,
  Book,
  HeartOff,
  ChevronRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useGetMyRecipe from '../hooks/useGetMyRecipe';
import useDeleteMyRecipe from '../hooks/useDeleteMyRecipe';
import useGetSavedRecipe from '../hooks/useGetSavedRecipe';
import RenderMyRecipe from '../components/RenderMyRecipe';
import RenderSavedRecipe from '../components/RenderSavedRecipe';

export default function RecipeHandbook() {
  const [activeTab, setActiveTab] = useState('mine');
  const [isMenuVisible, setMenuVisible] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState<any>(null);
  const navigate = useNavigate();

  const { data: myRecipes, isPending: myRecipesPending } = useGetMyRecipe();
  const { data: savedRecipes, isPending: savedRecipesPending } = useGetSavedRecipe();
  console.log(savedRecipes?.data);
  
  const { mutate: deleteMyRecipe } = useDeleteMyRecipe();

  const openMenu = (item: any) => {
    setSelectedRecipe(item);
    setMenuVisible(true);
  };

  const handleUpdateRecipe = () => {
    setMenuVisible(false);
    navigate(`/profile/update-recipe`, { state: {recipeId: selectedRecipe._id} });
  };

  const handleDeleteRecipe = () => {
    setMenuVisible(false);
    if (selectedRecipe?._id) {
      deleteMyRecipe(selectedRecipe._id);
    }
  };

  const renderEmptyState = (type: 'saved' | 'mine') => (
    <div className="flex flex-col items-center justify-center mt-20 px-10 text-center">
      <div className="bg-gray-50 p-6 rounded-full mb-6">
        {type === 'saved' ? (
          <HeartOff size={64} className="text-gray-300" />
        ) : (
          <Book size={64} className="text-gray-300" />
        )}
      </div>
      <h3 className="text-xl font-bold text-gray-700 mb-2">
        {type === 'saved' ? "Chưa có công thức đã lưu" : "Bạn chưa tạo công thức nào"}
      </h3>
      <p className="text-gray-400 max-w-sm mb-8">
        {type === 'saved' 
          ? "Hãy khám phá những món ăn ngon và lưu lại để thực hiện nhé!" 
          : "Chia sẻ niềm đam mê nấu nướng của bạn với mọi người ngay thôi."}
      </p>
      <button 
        className="bg-[#D35400] hover:bg-[#A04000] text-white font-bold py-3 px-8 rounded-full transition-all active:scale-95 shadow-lg shadow-orange-100"
        onClick={() => navigate(type === 'saved' ? "/explore/recipe" : "/profile/create-recipe")}
      >
        {type === 'saved' ? "Khám phá ngay" : "Tạo công thức đầu tiên"}
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-white max-w-3xl mx-auto pb-24 relative rounded-xl">
      <div className=" bg-white/95 backdrop-blur-sm border-b shadow-sm flex w-full rounded-t-xl">
        <button 
          className={`flex-1 py-4 text-sm font-black transition-all border-b-2 uppercase tracking-tight ${
            activeTab === 'mine' 
              ? "border-[#D35400] text-[#D35400]" 
              : "border-transparent text-gray-400 hover:text-gray-600"
          }`}
          onClick={() => setActiveTab('mine')}
        >
          Của tôi
        </button>
        <button 
          className={`flex-1 py-4 text-sm font-black transition-all border-b-2 uppercase tracking-tight ${
            activeTab === 'saved' 
              ? "border-[#D35400] text-[#D35400]" 
              : "border-transparent text-gray-400 hover:text-gray-600"
          }`}
          onClick={() => setActiveTab('saved')}
        >
          Đã lưu
        </button>
      </div>

      <div className="p-4">
        {activeTab === 'mine' ? (
          <div className="space-y-6">
            {myRecipesPending ? (
              <div className="flex justify-center py-20">
                <Loader2 className="animate-spin text-[#D35400]" size={40} />
              </div>
            ) : myRecipes?.data && myRecipes.data.length > 0 ? (
              <>
                <div className="flex justify-between items-end mb-4">
                  <div>
                    <h2 className="text-2xl font-black text-gray-800 tracking-tight">Bài viết của tôi</h2>
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Quản lý nội dung</p>
                  </div>
                  <span className="text-[10px] font-black text-[#D35400] bg-orange-50 px-2 py-1 rounded">MỚI NHẤT</span>
                </div>

                <div className="grid gap-4">
                  {myRecipes.data.map((item: any) => (
                    <RenderMyRecipe key={item._id} item={item} openMenu={openMenu} />
                  ))}
                </div>
                
                {/* Draft Box */}
                <div className="flex items-center gap-4 bg-[#F8F9F8] p-4 rounded-2xl border border-dashed border-gray-200 mt-8">
                  <div className="bg-white p-2 rounded-xl shadow-sm text-[#4A614D]">
                    <BookOpen size={20} />
                  </div>
                  <p className="flex-1 text-sm font-medium text-gray-600">Bạn còn bản nháp chưa hoàn thiện</p>
                  <button className="text-[#D35400] text-sm font-bold flex items-center">
                    Tiếp tục <ChevronRight size={16} />
                  </button>
                </div>
              </>
            ) : renderEmptyState('mine')}
          </div>
        ) : (
          <div className="space-y-4">
            {savedRecipesPending ? (
              <div className="flex justify-center py-20">
                <Loader2 className="animate-spin text-[#D35400]" size={40} />
              </div>
            ) : savedRecipes?.data && savedRecipes.data.length > 0 ? (
              <div className="grid gap-4">
                {savedRecipes.data.map((item: any) => (
                  <RenderSavedRecipe key={item._id} item={item} />
                ))}
              </div>
            ) : renderEmptyState('saved')}
          </div>
        )}
      </div>

      {/* Floating Action Button */}
      <button
        onClick={() => navigate("/create-recipe")}
        className="fixed bottom-8 right-8 w-14 h-14 bg-[#D35400] text-white rounded-full flex items-center justify-center shadow-xl shadow-orange-200 hover:scale-110 active:scale-90 transition-all z-20"
      >
        <Plus size={32} />
      </button>

      {/* Bottom Sheet Menu / Modal */}
      {isMenuVisible && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/40 backdrop-blur-sm transition-opacity">
          <div 
            className="absolute inset-0" 
            onClick={() => setMenuVisible(false)} 
          />
          <div className="relative w-full max-w-md bg-white rounded-t-[32px] p-6 shadow-2xl animate-in slide-in-from-bottom duration-300">
            <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-6" />
            <h4 className="text-center font-bold text-gray-800 mb-6 px-4 line-clamp-1">
              {selectedRecipe?.name}
            </h4>
            
            <div className="space-y-2">
              <button 
                className="w-full flex items-center gap-4 p-4 hover:bg-gray-50 rounded-2xl transition-colors text-gray-700 font-semibold"
                onClick={handleUpdateRecipe}
              >
                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                  <Edit2 size={20} />
                </div>
                Chỉnh sửa công thức
              </button>

              <button 
                className="w-full flex items-center gap-4 p-4 hover:bg-red-50 rounded-2xl transition-colors text-red-600 font-semibold"
                onClick={handleDeleteRecipe}
              >
                <div className="p-2 bg-red-50 text-red-600 rounded-lg">
                  <Trash2 size={20} />
                </div>
                Xóa bài viết
              </button>

              <button 
                className="w-full mt-4 py-4 text-gray-400 font-bold hover:text-gray-600"
                onClick={() => setMenuVisible(false)}
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}