import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { 
  ShoppingOutlined, 
  EnvironmentOutlined, 
  ArrowRightOutlined,
  InboxOutlined,
  LoadingOutlined 
} from "@ant-design/icons";
import { Spin, message, Empty, Pagination } from "antd";

import useGetProductSpecial from '../hooks/useGetProductSpectial';
import useAddToCart from '../../cart/hooks/useAddToCart';
import useGetMe from "../../../hooks/useGetMe";
import { formatVND } from "../../../utils/helper";

const REGIONS = [
  { key: 'all', label: 'Tất cả vùng miền' },
  { key: 'bac', label: 'Thức quà Miền Bắc' },
  { key: 'trung', label: 'Vị ngon Miền Trung' },
  { key: 'nam', label: 'Sản vật Miền Nam' },
];

export default function SpecialProduct() {
  const navigate = useNavigate();
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 12;
  
  // Thêm state để theo dõi ID sản phẩm đang được thêm
  const [addingId, setAddingId] = useState(null);

  const { data: productsData, isPending, isFetching } = useGetProductSpecial({
    region: selectedRegion,
    sort: 'newest',
    page: currentPage,
    limit: pageSize,
  });

  const { mutate: addToCart } = useAddToCart();
  const { data: meData } = useGetMe(false);
  const isLoggedIn = !!meData;

  const handleAddCart = (product) => {
    if (!isLoggedIn) {
      message.warning("Mời bạn đăng nhập để chọn mua sản vật!");
      return;
    }

    setAddingId(product._id); // Bắt đầu loading cho sản phẩm này

    addToCart(
      { productId: product._id, quantity: 1 }, 
      {
        onSuccess: () => {
          message.success(`Đã thêm ${product.name} vào giỏ hàng 🛒`);
        },
        onSettled: () => {
          setAddingId(null); // Kết thúc loading dù thành công hay thất bại
        }
      }
    );
  };

  const products = productsData?.data || [];

  return (
    <div className="space-y-12 py-4">
      <header className="rounded-[32px] bg-white/70 p-7 text-center shadow-sm ring-1 ring-[#E8C5A8]/40">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-[#D16D2F]">Tinh hoa địa phương</p>
        <h1 className="mt-2 text-3xl font-black text-[#5C4033] md:text-4xl">Đặc sản Việt Nam ba miền</h1>
        <p className="mx-auto mt-3 max-w-3xl leading-7 text-[#765746]">Khám phá sản vật tiêu biểu với câu chuyện, nơi sản xuất, cách thưởng thức và giá bán rõ ràng.</p>
      </header>
      <div className="flex flex-col items-center gap-6">
        <div className="bg-[#f2dbc9] p-1.5 rounded-full border border-[#D16D2F]/20 shadow-inner inline-flex flex-wrap justify-center gap-2">
          {REGIONS.map((region) => (
            <button
              key={region.key}
              onClick={() => {
                setSelectedRegion(region.key);
                setCurrentPage(1);
              }}
              className={`px-8 py-2.5 rounded-full text-[12px] font-black transition-all uppercase tracking-[2px] ${
                selectedRegion === region.key
                  ? "bg-[#D16D2F] text-white shadow-lg"
                  : "text-[#8B5E3C] hover:bg-[#E8C5A8]/30"
              }`}
            >
              {region.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b-2 border-[#D16D2F]/20 pb-6">
        <div>
          <h2 className="text-2xl font-black text-[#5C4033] uppercase tracking-tighter">
            {selectedRegion === 'all' ? 'Sản vật tiêu biểu' : REGIONS.find(r => r.key === selectedRegion)?.label}
          </h2>
          <div className="h-1 w-20 bg-[#D16D2F] mt-2 rounded-full"></div>
        </div>
      </div>

      {isPending ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <Spin size="large" />
          <p className="text-[#8B5E3C] font-bold animate-pulse uppercase text-xs tracking-widest">Đang bày biện gian hàng...</p>
        </div>
      ) : products.length > 0 ? (
        <div className="space-y-10">
        <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 transition-opacity ${isFetching ? "opacity-60 pointer-events-none" : ""}`}>
          {products.map((item) => {
            const isThisItemAdding = addingId === item._id;
            
            return (
              <div 
                key={item._id}
                className="flex flex-col bg-[#fffaf5] rounded-t-[70px] rounded-b-2xl overflow-hidden border border-[#E8C5A8]/50 shadow-sm hover:shadow-2xl transition-all duration-500 group"
              >
                <div 
                  className="relative aspect-3/4 overflow-hidden cursor-pointer"
                  onClick={() => navigate(`/explore/special-detail/${item.slug}`, { state: { productId: item._id } })}
                >
                  <img 
                    src={item.images} 
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                  />
                  
                  {item.salePercent && (
                    <div className="absolute top-8 right-0 bg-[#D16D2F] text-white text-[10px] font-black px-4 py-1.5 rounded-l-full shadow-md z-10">
                      ƯU ĐÃI {item.salePercent.percent}%
                    </div>
                  )}
                  
                  <div className="absolute inset-0 bg-[#5C4033]/0 group-hover:bg-[#5C4033]/10 transition-colors duration-500" />
                </div>

                <div className="p-6 flex-1 flex flex-col items-center text-center">
                  <div className="flex items-center gap-1.5 mb-2">
                    <EnvironmentOutlined className="text-[#D16D2F] text-xs" />
                    <span className="text-[10px] font-black text-[#A88E7A] uppercase tracking-[3px]">
                      {item.origin || 'Việt Nam'}
                    </span>
                  </div>

                  <h3 className="text-xl font-black text-[#5C4033] mb-2 line-clamp-2 leading-tight min-h-[3rem]">
                    {item.name}
                  </h3>

                  <p className="text-[#8B5E3C]/70 text-xs line-clamp-2 mb-4 leading-relaxed italic">
                    {item.description}
                  </p>

                  <div className="mt-auto w-full">
                    <div className="flex flex-col items-center mb-5">
                      {item.salePercent && (
                        <span className="text-[#A88E7A] line-through text-[11px] font-bold">
                          {formatVND(item.price)}
                        </span>
                      )}
                      <p className="text-[#D16D2F] font-black text-2xl">
                        {formatVND(item.finalPrice)}
                        <span className="text-[#8B5E3C] text-[10px] font-bold lowercase"> / {item.unit}</span>
                      </p>
                    </div>

                    <button 
                      disabled={addingId !== null} // Vô hiệu hóa tất cả nút khi đang có một item được thêm
                      onClick={() => handleAddCart(item)}
                      className={`w-full py-3.5 rounded-xl font-black text-[10px] uppercase tracking-[2px] transition-all shadow-md active:scale-95 flex items-center justify-center gap-2 ${
                        isThisItemAdding 
                        ? "bg-[#D16D2F] text-white cursor-wait" 
                        : "bg-[#5C4033] hover:bg-[#D16D2F] text-white"
                      } disabled:opacity-70 disabled:active:scale-100`}
                    >
                      {isThisItemAdding ? (
                        <LoadingOutlined className="text-base animate-spin" />
                      ) : (
                        <ShoppingOutlined className="text-base" />
                      )}
                      {isThisItemAdding ? "Đang gói quà..." : "Thêm vào giỏ"}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        {isFetching && <div className="flex justify-center"><Spin size="small" /></div>}
        {(productsData?.pagination?.totalItems || 0) > pageSize && (
          <div className="flex justify-center">
            <Pagination
              current={currentPage}
              pageSize={pageSize}
              total={productsData?.pagination?.totalItems || 0}
              showSizeChanger={false}
              onChange={(page) => {
                setCurrentPage(page);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            />
          </div>
        )}
        </div>
      ) : (
        <div className="py-24 bg-[#faece1]/50 rounded-[60px] border-2 border-dashed border-[#E8C5A8]">
          <Empty 
            image={<InboxOutlined className="text-7xl text-[#E8C5A8]" />}
            description={
              <div className="space-y-2">
                <p className="text-[#8B5E3C] font-black uppercase tracking-widest">Chưa có sản vật</p>
                <p className="text-[#A88E7A] text-xs">Hẹn bạn dịp khác, gian hàng đang được chuẩn bị thêm.</p>
              </div>
            }
          />
        </div>
      )}
    </div>
  );
}
