import React from 'react';
import { 
  Clock, 
  ChevronLeft, 
  Share2, 
  Edit3, 
  CheckCircle2, 
  Info,
  Loader2,
  ArrowLeft
} from 'lucide-react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import useGetRecipeDetail from '../hooks/useGetRecipeDetail';

export default function RecipeDetailWeb() {
  const location = useLocation();
  
  const idFromState = location.state?.recipeId;
  const navigate = useNavigate();
  const { data, isPending } = useGetRecipeDetail(idFromState as string);

  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-[#D35400]" size={40} />
      </div>
    );
  }

  const recipe = data?.data;

  return (
    <div className="min-h-screen bg-gray-50 pb-20 rounded-xl">
      <div className=" bg-white/80 backdrop-blur-md border-b rounded-t-xl">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-[#D35400] transition-colors font-medium"
          >
            <ArrowLeft size={20} />
            <span>Quay lại</span>
          </button>
          <div className="flex gap-3">
            <button className="p-2 hover:bg-gray-100 rounded-full text-gray-600 transition-colors">
              <Share2 size={20} />
            </button>
            <button 
              onClick={() => navigate(`/profile/update-recipe`, { state: {recipeId: idFromState} })}
              className="flex items-center gap-2 bg-[#D35400] text-white px-4 py-2 rounded-xl hover:bg-orange-700 transition-all shadow-md shadow-orange-100"
            >
              <Edit3 size={18} />
              <span className="text-sm font-bold">Chỉnh sửa</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          <div className="lg:col-span-5 space-y-8">
            <div className="relative aspect-video lg:aspect-square rounded-3xl overflow-hidden shadow-xl">
              <img 
                src={recipe?.image} 
                alt={recipe?.name} 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-8">
                <h1 className="text-3xl font-black text-white leading-tight">
                  {recipe?.name}
                </h1>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-black text-gray-800">Nguyên liệu</h2>
                <div className="flex flex-col items-center bg-orange-50 px-4 py-2 rounded-2xl">
                  <span className="text-[#D35400] font-black text-lg">{recipe?.cookTime}</span>
                  <span className="text-[10px] text-orange-400 font-bold uppercase tracking-widest">Phút</span>
                </div>
              </div>
              
              <div className="space-y-4">
                {recipe?.ingredients.map((item: any, index: number) => (
                  <div key={index} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
                    <span className="text-gray-700 font-medium">{item.name}</span>
                    <span className="text-[#D35400] font-bold bg-orange-50 px-3 py-1 rounded-lg text-sm">
                      {item.quantity}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-8">
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
              <h2 className="text-xl font-black text-gray-800 mb-8">Các bước thực hiện</h2>
              
              <div className="space-y-10 relative">
                {/* Đường kẻ nối các bước */}
                <div className="absolute left-[19px] top-2 bottom-2 w-0.5 bg-gray-100 z-0 hidden sm:block" />

                {recipe?.instructions.map((step: any, index: number) => (
                  <div key={index} className="relative z-10 flex gap-6">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#D35400] text-white flex items-center justify-center font-black shadow-lg shadow-orange-200">
                      {step.step}
                    </div>
                    <div className="flex-1 pt-1">
                      <h3 className="text-lg font-bold text-gray-800 mb-2">Bước {step.step}</h3>
                      <p className="text-gray-600 leading-relaxed text-base">
                        {step.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {recipe?.familyNotes && (
              <div className="bg-[#FFF9F5] rounded-3xl p-8 border border-orange-100 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10 text-[#D35400]">
                  <Info size={80} />
                </div>
                <div className="relative z-10">
                  <div className="flex items-center gap-2 text-[#D35400] mb-3">
                    <CheckCircle2 size={20} />
                    <span className="font-black uppercase tracking-wider text-sm">Lưu ý cá nhân</span>
                  </div>
                  <p className="text-gray-700 italic text-lg leading-relaxed">
                    &ldquo;{recipe.familyNotes}&rdquo;
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}