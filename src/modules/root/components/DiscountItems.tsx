import { useNavigate } from "react-router-dom";
import { calcSalePrice, formatVND } from "../../../utils/helper";

export default function DiscountItems({ product }) {
  const navigate = useNavigate();
  
  const rawPercent = Math.floor((product.soldCount / product.stock) * 100);
  const percent = Math.min(rawPercent, 100); 
  
  const handleDetail = () => {
    navigate(`/explore/product-detail/${product.slug}`, { 
      state: { productId: product._id } 
    });
  };

  return (
    <div 
      onClick={handleDetail}
      className="group bg-white rounded-2xl p-3 flex gap-4 md:gap-6 cursor-pointer hover:shadow-xl transition-all duration-300 relative overflow-hidden border border-gray-100 min-h-[160px]"
    >
      {/* Tag giảm giá */}
      <div className="absolute top-0 left-0 bg-yellow-400 text-[#5C4033] text-[10px] font-black px-3 py-1 rounded-br-xl z-20 shadow-sm uppercase tracking-tighter">
        -{product.salePercent.percent}%
      </div>

      {/* Ảnh sản phẩm */}
      <div className="w-24 h-24 md:w-32 md:h-32 flex-shrink-0 rounded-xl overflow-hidden bg-gray-50 shadow-inner">
        <img 
          src={product.images} 
          alt={product.name} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
      </div>

      {/* Nội dung */}
      <div className="flex flex-col justify-between flex-1 min-w-0 py-0.5">
        <div>
          <span className="text-[10px] text-orange-500 uppercase tracking-widest mb-1 block opacity-80 font-bold">
            {product.categoryId.name}
          </span>
          
          <h3 className="text-[#5C4033] text-base md:text-lg font-black leading-tight truncate group-hover:text-[#D16D2F] transition-colors">
            {product.name}
          </h3>
          
          <div className="mt-2">
            {/* Hàng chứa giá và đơn vị */}
            <div className="flex items-baseline gap-1.5 flex-wrap">
              <span className="text-[#D16D2F] font-black text-lg md:text-xl leading-none whitespace-nowrap">
                {formatVND(calcSalePrice(product.price, product.salePercent.percent))}
              </span>
              <span className="text-[11px] text-gray-400 font-bold italic whitespace-nowrap">
                / {product.unit}
              </span>
            </div>
            
            {/* Giá gốc */}
            <span className="text-gray-400 line-through text-[11px] font-medium block mt-0.5">
              {formatVND(product.price)}
            </span>
          </div>
        </div>

        {/* Phần Progress Bar ở dưới cùng */}
        <div className="mt-2">
          <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden relative shadow-inner">
            <div 
              className={`h-full rounded-full transition-all duration-1000 ease-out ${percent > 80 ? 'bg-red-500' : 'bg-orange-400'}`} 
              style={{ width: `${percent}%` }} 
            />
          </div>

          <div className="flex justify-between items-center mt-1.5">
            <span className={`text-[9px] font-black uppercase tracking-tighter ${percent > 80 ? 'text-red-500 animate-pulse' : 'text-gray-400'}`}>
              {percent > 80 ? 'Sắp cháy hàng!' : 'Đang bán chạy'}
            </span>
            <span className="text-[9px] text-gray-500 font-black uppercase italic">
              Đã bán {percent}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}