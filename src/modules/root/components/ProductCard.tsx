import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Typography } from 'antd';
import { ShoppingCartOutlined, EyeOutlined, FireFilled } from '@ant-design/icons';
import { calcSalePrice, formatVND } from "../../../utils/helper";

const { Text } = Typography;

export default function ProductCard({ product }) {
  const navigate = useNavigate();

  const now = new Date();
  const hasSale = product.salePercent && 
                  new Date(product.salePercent.startDate) <= now && 
                  new Date(product.salePercent.endDate) >= now;

  const sellPercent = Math.min(Math.floor((product.soldCount / (product.stock || 1)) * 100), 100);

  const handleNavigate = () => {
    navigate(`/explore/product-detail/${product.slug}`, { 
      state: { productId: product._id } 
    });
  };

  return (
    <div 
      onClick={handleNavigate}
      className="group bg-white rounded-[30px] p-3 border border-gray-100 hover:shadow-2xl hover:shadow-orange-100 transition-all duration-500 cursor-pointer h-full flex flex-col relative overflow-hidden"
    >
      {hasSale && (
        <div className="absolute top-0 left-0 z-20 flex items-center justify-center">
          <div className="bg-[#D16D2F] text-[#F5F5DC] text-[10px] font-black px-4 py-2 rounded-br-[20px] shadow-md flex flex-col items-center leading-none">
            <span className="mb-0.5 uppercase">Tiết kiệm</span>
            <span className="text-sm">-{product.salePercent.percent}%</span>
          </div>
          <div className="absolute -right-1 -bottom-1 w-2 h-2 bg-[#F5F5DC] rotate-45 border border-[#D16D2F]"></div>
        </div>
      )}

      <div className="relative h-48 w-full overflow-hidden rounded-3xl bg-[#FDFCFB] mb-3">
        <img 
          alt={product.name} 
          src={product.images || 'https://via.placeholder.com/300'} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
        />
        
        <div className="absolute inset-0 bg-[#5C4033]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
          <div className="bg-white p-3 rounded-full text-[#5C4033] hover:bg-[#D16D2F] hover:text-white transition-colors shadow-lg">
            <EyeOutlined />
          </div>
          <div className="bg-white p-3 rounded-full text-[#5C4033] hover:bg-[#D16D2F] hover:text-white transition-colors shadow-lg">
            <ShoppingCartOutlined />
          </div>
        </div>

        {hasSale && product.salePercent.percent >= 30 && (
          <div className="absolute bottom-2 left-2 bg-red-500/90 backdrop-blur-sm text-white text-[9px] font-bold px-2 py-1 rounded-full flex items-center gap-1 animate-bounce">
            <FireFilled /> SIÊU ƯU ĐÃI
          </div>
        )}
      </div>

      <div className="flex flex-col flex-1 px-1">
        <Text className="text-[10px] text-[#D16D2F] uppercase font-black tracking-[0.15em] mb-1 opacity-80">
          {product.categoryId?.name || 'Thực phẩm sạch'}
        </Text>
        
        <h3 className="text-[#5C4033] font-bold text-base truncate mb-1 group-hover:text-[#D16D2F] transition-colors duration-300">
          {product.name}
        </h3>

        <div className="flex flex-col mb-3">
          <div className="flex items-baseline gap-2">
            <Text className={`font-black text-lg ${hasSale ? 'text-[#E25822] animate-pulse-slow' : 'text-[#5C4033]'}`}>
              {hasSale 
                ? formatVND(calcSalePrice(product.price, product.salePercent.percent))
                : formatVND(product.price)
              }
            </Text>
            
            {hasSale && (
              <Text delete className="text-gray-400 text-[11px] font-medium opacity-70">
                {formatVND(product.price)}
              </Text>
            )}
          </div>
          
          {hasSale && (
            <span className="text-[10px] text-[#D16D2F] font-medium bg-orange-50 self-start px-2 py-0.5 rounded-full border border-orange-100 mt-0.5">
              Tiết kiệm {formatVND(product.price - calcSalePrice(product.price, product.salePercent.percent))}
            </span>
          )}
        </div>

        <div className="mt-auto pt-2 border-t border-gray-50">
          <div className="flex justify-between items-center mb-1.5">
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">
              Đã bán {product.soldCount || 0}
            </span>
            {sellPercent > 80 && (
              <span className="text-[10px] text-red-500 font-black flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-ping"></span> SẮP HẾT
              </span>
            )}
          </div>
          <div className="w-full bg-[#F5F5DC] h-1.5 rounded-full overflow-hidden border border-gray-50">
            <div 
              className={`h-full transition-all duration-1000 ease-out ${sellPercent > 80 ? 'bg-linear-to-r from-orange-400 to-red-500' : 'bg-[#D16D2F]'}`}
              style={{ width: `${sellPercent}%` }} 
            />
          </div>
        </div>
      </div>
    </div>
  );
}