import { useNavigate } from "react-router-dom";
import { UtensilsCrossed, ChevronRight } from "lucide-react";
import RegionItem from "../components/RegionItem";
import useGetLastestRecipe from "../hooks/useGetLastest";

const RecipeSection = () => {
  const navigate = useNavigate();
  const { data, isPending } = useGetLastestRecipe();

  const REGIONS = [
    { key: "bac", title: "MIỀN BẮC", sub: "Cốm, Chè...", icon: "Home" },
    { key: "trung", title: "MIỀN TRUNG", sub: "Mắm, Nem...", icon: "Home" },
    { key: "nam", title: "MIỀN NAM", sub: "Trái cây, Cá...", icon: "Home" }
  ];

  return (
    <section className="space-y-8 py-4">
      <div>
        <div className="flex items-center gap-2 mb-4">
          <UtensilsCrossed size={20} className="text-[#F26522]" />
          <h2 className="text-xl font-bold text-gray-800 uppercase tracking-tight">
            Đặc sản vùng miền
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {REGIONS.map((region, index) => (
            <RegionItem 
              key={index} 
              regionKey={region.key} 
              title={region.title} 
              sub={region.sub} 
            />
          ))}
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <span>🍴</span> Công Thức Từ Đầu Bếp
          </h2>
          <button 
            onClick={() => navigate("/explore/recipe")}
            className="text-orange-600 text-sm font-semibold flex items-center hover:underline"
          >
            Khám phá <ChevronRight size={16} />
          </button>
        </div>

        {isPending ? (
          <div className="w-full h-64 bg-gray-100 animate-pulse rounded-2xl" />
        ) : (
          <div 
            className="relative h-64 md:h-80 w-full rounded-2xl overflow-hidden cursor-pointer group shadow-lg"
            onClick={() => navigate(`/explore/recipe-detail/${data.data.slug}`, {state: {title: data.data._id}})}
          >
            <img 
              src={data?.data.image} 
              alt={data?.data.name}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-6">
              <div className="bg-orange-600 text-white text-[10px] font-bold px-3 py-1 rounded-md w-fit mb-3">
                MÓN MỚI
              </div>
              <h3 className="text-white text-2xl font-bold mb-2">
                {data?.data.name}
              </h3>
              <p className="text-gray-200 text-sm line-clamp-2 max-w-2xl leading-relaxed">
                {data?.data.description}
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default RecipeSection;