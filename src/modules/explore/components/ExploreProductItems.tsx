import { useNavigate } from "react-router-dom";
import { 
  ShoppingCartOutlined, 
  HeartOutlined, 
  ThunderboltFilled,
  LoadingOutlined
} from "@ant-design/icons";
import { formatVND } from "../../../utils/helper";
import { useState, useEffect } from "react";
import { message, Tooltip } from "antd";
import useAddToCart from "../../cart/hooks/useAddToCart";
import useAddToWishList from "../../../modules/profile/hooks/useAddToWishList";
import useGetMe from '../../../hooks/useGetMe';

export default function ExploreProductItems({ product }) {
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState("");
  
  const { data: meData } = useGetMe(false);
  const isLoggedIn = !!meData?.data;

  const hasSale = product.salePercent && product.salePercent.percent > 0;
  const discountedPrice = hasSale 
    ? product.price * (1 - product.salePercent.percent / 100) 
    : product.price;

  const handleNavigate = () => {
    navigate(`/explore/product-detail/${product.slug}`, { 
      state: { productId: product._id } 
    });
  };

  const { mutate: addToCart, isPending: pendingCart } = useAddToCart();
  const { mutate: addToFavourite, isPending: pendingFav } = useAddToWishList();

  const handleAddCart = (e) => {
    e.stopPropagation();
    
    if (!isLoggedIn) {
      return message.warning("Vui lòng đăng nhập để thêm vào giỏ hàng!");
    }

    addToCart({ productId: product._id, quantity: 1 }, {
      onSuccess: () => message.success(`Đã thêm ${product.name} vào giỏ!`),
      onError: () => message.error("Không thể thêm vào giỏ hàng!")
    });
  };

  const handleAddFavourite = (e) => {
    e.stopPropagation();

    if (!isLoggedIn) {
      return message.warning("Vui lòng đăng nhập để lưu sản phẩm yêu thích!");
    }

    addToFavourite({ productId: product._id }, {
      onSuccess: () => message.success("Đã lưu vào danh sách yêu thích!"),
      onError: () => message.error("Lỗi khi thêm vào yêu thích!")
    });
  };

  useEffect(() => {
    if (!hasSale || !product.salePercent.endDate) return;

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const end = new Date(product.salePercent.endDate).getTime();
      const distance = end - now;
      const twoDaysInMs = 2 * 24 * 60 * 60 * 1000;

      if (distance < 0 || distance > twoDaysInMs) {
        setTimeLeft("");
        if (distance < 0) clearInterval(timer);
        return;
      }

      const h = Math.floor(distance / (1000 * 60 * 60));
      const m = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((distance % (1000 * 60)) / 1000);
      
      setTimeLeft(`${h}:${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`);
    }, 1000);

    return () => clearInterval(timer);
  }, [product.salePercent, hasSale]);

  return (
    <div 
      className="group bg-white rounded-[24px] overflow-hidden border border-[#E8C5A8]/30 hover:shadow-2xl hover:shadow-[#D16D2F]/15 transition-all duration-500 flex flex-col cursor-pointer h-full"
      onClick={handleNavigate}
    >
      <div className="relative aspect-square overflow-hidden bg-[#faece1]/20">
        <img 
          src={product.images} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
          alt={product.name}
        />
        
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {hasSale && (
            <div className="bg-[#D16D2F] text-white text-[11px] font-black px-3 py-1 rounded-full shadow-lg uppercase tracking-tight">
              -{product.salePercent.percent}%
            </div>
          )}
          
          {timeLeft && (
            <div className="bg-white/95 backdrop-blur-sm border border-[#D16D2F]/20 text-[#D16D2F] text-[10px] font-black px-2.5 py-1 rounded-full shadow-sm flex items-center gap-1">
              <ThunderboltFilled className="text-[11px] animate-pulse" />
              <span>{timeLeft}</span>
            </div>
          )}
        </div>

        <div className="absolute top-3 right-3 flex flex-col gap-2 translate-x-14 group-hover:translate-x-0 transition-transform duration-500 z-20">
          <Tooltip title="Yêu thích" placement="left">
            <button 
              disabled={pendingFav}
              className={`p-2.5 rounded-full shadow-md transition-all border border-[#E8C5A8]/20 flex items-center justify-center
                ${pendingFav ? "bg-gray-50 cursor-not-allowed" : "bg-white hover:bg-red-50 text-[#A88E7A] hover:text-red-500"}
              `}
              onClick={handleAddFavourite}
            >
              {pendingFav ? <LoadingOutlined className="text-red-400" /> : <HeartOutlined />}
            </button>
          </Tooltip>

          <Tooltip title="Bỏ vào giỏ" placement="left">
            <button 
              disabled={pendingCart}
              className={`p-2.5 rounded-full shadow-md transition-all flex items-center justify-center
                ${pendingCart ? "bg-[#8B5E3C] cursor-not-allowed" : "bg-[#5C4033] hover:bg-[#D16D2F]"}
                text-white
              `}
              onClick={handleAddCart}
            >
              {pendingCart ? <LoadingOutlined /> : <ShoppingCartOutlined />}
            </button>
          </Tooltip>
        </div>
      </div>

      <div className="p-4 flex-1 flex flex-col bg-gradient-to-b from-transparent to-[#faece1]/10">
        <h3 className="text-[#5C4033] font-black text-[15px] md:text-[16px] line-clamp-1 group-hover:text-[#D16D2F] transition-colors leading-tight">
          {product.name}
        </h3>

        <p className={`text-[#A88E7A] text-[12px] mt-1 leading-snug font-medium ${hasSale ? 'line-clamp-1' : 'line-clamp-2'}`}>
          {product.description || "Mô tả sản phẩm đang được cập nhật..."}
        </p>

        <div className="mt-auto">
          <div className="h-[14px]">
            {hasSale ? (
              <span className="text-[11px] text-[#A88E7A] line-through opacity-70">
                {formatVND(product.price)}
              </span>
            ) : null}
          </div>

          <div className="flex items-baseline gap-1 flex-nowrap min-w-0 overflow-hidden">
            <span className="text-[#D16D2F] font-black text-xl whitespace-nowrap shrink-0">
              {formatVND(hasSale ? discountedPrice : product.price)}
            </span>
            
            <span className="text-[#A88E7A] text-[10px] font-bold uppercase tracking-tighter truncate opacity-80">
              / {product.unit}
            </span>
          </div>

          <div className="flex justify-between items-center mt-3 pt-3 border-t border-[#E8C5A8]/30">
            <span className="text-[10px] text-[#A88E7A] font-black uppercase tracking-[0.5px]">
              Đã bán {product.soldCount}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}