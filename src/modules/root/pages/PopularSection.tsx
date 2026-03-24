import { useNavigate } from "react-router-dom";
import ProductItem from "../components/ProductItem";
import useGetPopularProducts from "../hooks/useGetPopularProducts";
import { ChevronRight } from "lucide-react";

const PopularSection = () => {
  const navigate = useNavigate();
  const { data: getPopularProducts, isPending } = useGetPopularProducts();

  const handleSeeAll = () => {
    navigate("/explore/product?sortInit=sold_desc");
  };

  return (
    <section className="py-10 bg-white rounded-3xl px-6 shadow-sm border border-gray-50">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-xl font-bold text-gray-800 uppercase tracking-tight ">
            🔥 Sản Phẩm Phổ Biến
          </h2>
          <p className="text-gray-500 mt-1 text-sm md:text-base">
            Những đặc sản được khách hàng yêu thích nhất trong tháng này
          </p>
        </div>
        
        <button 
          onClick={handleSeeAll}
          className="group flex items-center gap-1 text-orange-600 font-bold hover:text-orange-700 transition-all"
        >
          Xem tất cả 
          <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {isPending ? (
          [...Array(5)].map((_, i) => (
            <div key={i} className="space-y-4">
              <div className="aspect-square bg-gray-100 animate-pulse rounded-2xl" />
              <div className="h-4 bg-gray-100 animate-pulse rounded w-3/4" />
              <div className="h-4 bg-gray-100 animate-pulse rounded w-1/2" />
            </div>
          ))
        ) : (
          getPopularProducts?.data?.slice(0, 10).map((product) => (
            <ProductItem key={product._id} products={product} />
          ))
        )}
      </div>
    </section>
  );
};

export default PopularSection;