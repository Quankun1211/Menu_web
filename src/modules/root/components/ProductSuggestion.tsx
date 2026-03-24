import ProductItem from './ProductItem';
import useGetSuggestionProducts from '../hooks/useGetSuggestionProducts';
import { Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router';

const ProductSuggestion = () => {
  const navigate = useNavigate();
  
  const { data: products, isPending } = useGetSuggestionProducts(1, 10);
  
  return (
    <section className="py-12 border-t border-gray-100">
      <div className="flex items-center justify-between mb-8 px-2">
        <div className="flex items-center gap-2">
          <Sparkles size={22} className="text-orange-500" />
          <h2 className="text-2xl font-semibold text-[#5C4033] tracking-tight uppercase">
            Gợi Ý Cho Bạn
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {isPending ? (
          [...Array(10)].map((_, i) => (
            <div key={i} className="flex flex-col gap-3">
              <div className="aspect-square bg-gray-100 animate-pulse rounded-[30px]" />
              <div className="h-4 bg-gray-100 animate-pulse rounded w-3/4" />
              <div className="h-4 bg-gray-100 animate-pulse rounded w-1/2" />
            </div>
          ))
        ) : (
          products?.data.map((product) => (
            <div key={product._id} className="transition-all duration-300">
              <ProductItem products={product} />
            </div>
          ))
        )}
      </div>

      <div className="mt-12 flex justify-center">
        <button 
          onClick={() => navigate(`/suggest`)}
          className="px-10 py-3 border border-[#D16D2F] text-[#D16D2F] rounded-full hover:bg-orange-50 transition-all duration-300 text-sm font-bold uppercase tracking-wider"
        >
          Xem thêm tất cả gợi ý
        </button>
      </div>
    </section>
  );
};

export default ProductSuggestion;