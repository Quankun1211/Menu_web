import { useNavigate } from "react-router-dom";
import useGetShockDeals from "../hooks/useGetShockDeals";
import DiscountItems from "../components/DiscountItems";
import { Timer, ArrowRight, ShoppingBag } from "lucide-react";

const DiscountProducts = () => {
  const navigate = useNavigate();
  
  const { data, isPending } = useGetShockDeals(1, 4);

  const productsList = (data as any)?.data || [];

  const handleSeeAll = () => {
    navigate("/sale");
  };

  return (
    <section className="py-12 px-4 md:px-0">
      <div className="bg-gradient-to-br from-[#D16D2F] to-[#E25822] rounded-[2.5rem] p-8 md:p-12 shadow-2xl shadow-orange-200/50 overflow-hidden relative border-4 border-white/20">
        <div className="absolute top-[-10%] right-[-5%] w-64 h-64 bg-white/10 rounded-full blur-3xl select-none" />
        <div className="absolute bottom-0 left-0 text-9xl opacity-5 select-none translate-y-10 -translate-x-10 rotate-12">🌿</div>
        
        <div className="flex flex-col lg:flex-row gap-12 relative z-10">
          <div className="lg:w-1/3 text-[#F5F5DC] space-y-6 flex flex-col justify-center">
            <div className="inline-flex items-center gap-2 bg-[#F5F5DC]/20 backdrop-blur-md px-4 py-2 rounded-full border border-white/30 self-start">
              <Timer size={18} className="animate-pulse text-yellow-300" />
              <span className="font-black uppercase tracking-[0.2em] text-[10px] text-yellow-300">
                Đang diễn ra
              </span>
            </div>
            
            <h2 className="text-4xl md:text-6xl font-black leading-[1.1] tracking-tighter">
              ƯU ĐÃI <br /> <span className="text-[#5C4033] drop-shadow-sm">CỰC SỐC!</span>
            </h2>
            <p className="text-[#F5F5DC]/80 text-lg font-medium leading-relaxed max-w-sm">
              Cơ hội sở hữu đặc sản vùng miền với mức giá không tưởng. Giảm đến 50% chỉ trong hôm nay.
            </p>
            
            <button 
              onClick={handleSeeAll}
              className="bg-[#F5F5DC] text-[#D16D2F] px-10 py-4 rounded-2xl font-black flex items-center gap-3 hover:bg-white hover:scale-105 transition-all shadow-xl active:scale-95 group w-fit"
            >
              MUA NGAY 
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="lg:w-2/3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {isPending ? (
                [...Array(4)].map((_, i) => (
                  <div key={i} className="h-44 bg-white/10 animate-pulse rounded-[2rem] border border-white/5" />
                ))
              ) : productsList.length > 0 ? (
                productsList.map((product) => (
                  <DiscountItems key={product._id} product={product} />
                ))
              ) : (
                <div className="col-span-full flex flex-col items-center justify-center py-16 bg-white/5 rounded-[2.5rem] border-2 border-dashed border-white/20 text-[#F5F5DC]/60">
                  <ShoppingBag size={48} className="mb-4 opacity-20" />
                  <p className="font-bold italic text-center px-4 leading-relaxed">
                    Đang chuẩn bị những ưu đãi mới... <br /> 
                    <span className="text-sm font-normal opacity-70 italic">Vui lòng quay lại sau ít phút nhé!</span>
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DiscountProducts;