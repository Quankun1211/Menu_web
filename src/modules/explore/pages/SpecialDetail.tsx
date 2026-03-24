import { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { 
  ShoppingOutlined, 
  ThunderboltOutlined, 
  EnvironmentOutlined, 
  SafetyCertificateOutlined,
  HeartOutlined,
  QrcodeOutlined,
  PlusOutlined,
  MinusOutlined,
  BulbOutlined,
  CoffeeOutlined
} from "@ant-design/icons";
import { Spin, Button, message, InputNumber, Tag, Divider, Empty } from "antd";

import useGetProductDetail from "../hooks/useGetProductDetail";
import useGetMe from "../../../hooks/useGetMe";
import useAddToCart from "../../cart/hooks/useAddToCart";
import useTrackView from "../hooks/useTrackView";
import { formatVND } from "../../../utils/helper";
import { useCheckoutStore } from "../../../store/useCheckoutStore";

export default function ProductSpecialWeb() {
  const location = useLocation();
  const idFromState = location.state?.productId;

  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);

  const { data: getProductDetail, isPending } = useGetProductDetail(idFromState);
  const { data: meData } = useGetMe(false);
  const { mutate: trackView } = useTrackView();
  const { mutate: addToCart, isPending: cartPending } = useAddToCart();
  const { setCheckoutData } = useCheckoutStore();

  const productData = getProductDetail?.data;
  const recipes = productData?.relatedRecipes || [];
  const isLoggedIn = !!meData;

  useEffect(() => {
    if (isLoggedIn && productData?.categoryId?._id) {
      trackView(productData.categoryId._id);
    }
  }, [isLoggedIn, productData?._id]);

  if (isPending) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Spin size="large" />
        <p className="text-[#8B5E3C] font-black uppercase text-xs tracking-widest">Đang bày biện sản vật...</p>
      </div>
    );
  }

  const handleCheckout = () => {
    if (!isLoggedIn) {
      message.warning("Vui lòng đăng nhập để tiếp tục thanh toán!");
      // navigate("/login", { state: { from: location.pathname } }); 
      return;
    }

    if (!idFromState) {
      message.error("Không thể xác định sản phẩm!");
      return;
    }

    const items = [{ 
      productId: idFromState, 
      quantity: quantity 
    }];
    setCheckoutData(items, "cart")

    navigate("/checkout", { 
      state: { 
        items, 
        source: "buy_now" 
      } 
    });
  };

  const handleAddCart = () => {
    if (!isLoggedIn) {
      message.warning("Mời bạn đăng nhập để chọn mua sản vật!");
      return;
    }
    addToCart({ productId: idFromState, quantity }, {
      onSuccess: () => message.success("Đã thêm vào giỏ hàng thành công!")
    });
  };

  return (
    <div className="max-w-7xl mx-auto space-y-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 bg-white/60 backdrop-blur-md rounded-[40px] p-8 border border-white shadow-xl">
        
        {/* Cột trái: Hình ảnh & Câu chuyện */}
        <div className="space-y-6">
          <div className="relative aspect-square rounded-[32px] overflow-hidden shadow-2xl border-4 border-white">
            <img 
              src={productData?.images} 
              className="w-full h-full object-cover"
              alt={productData?.name}
            />
            <div className="absolute top-6 left-6 bg-[#D16D2F] text-white px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest shadow-lg">
              Sản vật trứ danh
            </div>
          </div>

          <div className="bg-[#faece1] p-8 rounded-[32px] border border-[#E8C5A8]/50 relative overflow-hidden">
            <div className="absolute -top-4 -left-4 text-6xl text-[#E8C5A8]/30 italic font-serif">“</div>
            <p className="text-[#5C4033] italic leading-relaxed relative z-10 text-lg">
              {productData?.story}
            </p>
            <div className="absolute -bottom-10 -right-4 text-6xl text-[#E8C5A8]/30 italic font-serif">”</div>
          </div>
        </div>

        <div className="flex flex-col">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-[#D16D2F] font-black uppercase text-xs tracking-[3px]">
              <EnvironmentOutlined />
              {productData?.origin}
            </div>
            
            <h1 className="text-4xl font-black text-[#5C4033] leading-tight">
              {productData?.name}
            </h1>

            <div className="flex items-baseline gap-4 pt-2">
              <span className="text-4xl font-black text-[#D16D2F]">
                {formatVND(productData?.finalPrice)}
              </span>
              {productData?.salePercent?.percent > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-lg text-gray-400 line-through font-bold">
                    {formatVND(productData?.price)}
                  </span>
                  <Tag color="#D16D2F" className="border-none font-black rounded-full">
                    -{productData.salePercent.percent}%
                  </Tag>
                </div>
              )}
            </div>
          </div>

          <Divider className="border-[#E8C5A8]/50" />

          {/* Chứng nhận & Nguồn gốc */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-2xl border border-[#E8C5A8]/30">
              <p className="text-[10px] font-black text-[#A88E7A] uppercase mb-2">Truy xuất nguồn gốc</p>
              <div className="flex items-center gap-3">
                <QrcodeOutlined className="text-2xl text-[#D16D2F]" />
                <span className="text-xs font-bold text-[#5C4033]">{productData?.originFound}</span>
              </div>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-[#E8C5A8]/30">
              <p className="text-[10px] font-black text-[#A88E7A] uppercase mb-2">Chứng nhận</p>
              <div className="flex gap-2">
                <SafetyCertificateOutlined className="text-green-600" />
                <span className="text-xs font-bold text-[#5C4033]">VietGAP / OCOP</span>
              </div>
            </div>
          </div>

          <div className="mt-8 p-6 bg-[#5C4033] rounded-3xl space-y-6 shadow-xl">
            <div className="flex items-center justify-between">
              <span className="text-white/70 font-bold text-sm uppercase tracking-widest">Số lượng</span>
              <div className="flex items-center bg-white/10 rounded-xl p-1 border border-white/20">
                <Button 
                  type="text" 
                  icon={<MinusOutlined className="text-white" />} 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                />
                <span className="px-6 text-white font-black text-lg">{quantity}</span>
                <Button 
                  type="text" 
                  icon={<PlusOutlined className="text-white" />} 
                  onClick={() => setQuantity(quantity + 1)}
                />
              </div>
            </div>

            <div className="flex gap-4">
              <button 
                onClick={handleAddCart}
                disabled={cartPending}
                className="flex-1 bg-white hover:bg-[#faece1] text-[#5C4033] py-4 rounded-2xl font-black uppercase text-xs tracking-widest transition-all flex items-center justify-center gap-2"
              >
                <ShoppingOutlined className="text-lg" />
                Thêm vào giỏ
              </button>
              <button 
                onClick={handleCheckout}
                className="flex-[1.5] bg-[#D16D2F] hover:bg-[#b35a24] text-white py-4 rounded-2xl font-black uppercase text-xs tracking-widest transition-all flex items-center justify-center gap-2 shadow-lg shadow-black/20"
              >
                <ThunderboltOutlined className="text-lg" />
                Mua ngay
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-8 rounded-[40px] border border-[#E8C5A8]/30 shadow-sm">
            <div className="flex items-center gap-3 mb-8">
              <div className="bg-[#faece1] p-3 rounded-2xl">
                <BulbOutlined className="text-2xl text-[#D16D2F]" />
              </div>
              <h2 className="text-2xl font-black text-[#5C4033] uppercase tracking-tighter">Hướng dẫn thưởng thức</h2>
            </div>
            
            <div className="space-y-6">
              {productData?.usage_instruction?.map((step, index) => (
                <div key={index} className="flex gap-6 group">
                  <div className="flex-none w-10 h-10 bg-[#faece1] text-[#D16D2F] rounded-full flex items-center justify-center font-black group-hover:bg-[#D16D2F] group-hover:text-white transition-colors shadow-sm">
                    {index + 1}
                  </div>
                  <p className="text-[#8B5E3C] leading-relaxed pt-2 font-medium">
                    {step}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Gợi ý món ngon */}
        <div className="space-y-6">
          <div className="bg-[#5C4033] p-8 rounded-[40px] text-white shadow-xl h-full">
            <div className="flex items-center gap-3 mb-8">
              <CoffeeOutlined className="text-2xl text-[#E8C5A8]" />
              <h2 className="text-xl font-black uppercase tracking-tighter">Gợi ý món ngon</h2>
            </div>

            <div className="space-y-4">
              {recipes.length > 0 ? recipes.map((item) => (
                <div 
                  key={item._id}
                  onClick={() => navigate(`/recipe/${item._id}`)}
                  className="flex items-center gap-4 bg-white/10 p-3 rounded-2xl border border-white/5 hover:bg-white/20 cursor-pointer transition-all"
                >
                  <img src={item.image} className="w-16 h-16 rounded-xl object-cover" alt={item.name} />
                  <div className="flex-1">
                    <h4 className="font-black text-sm line-clamp-1">{item.name}</h4>
                    <p className="text-[10px] text-white/50 uppercase tracking-widest mt-1">Xem công thức &rarr;</p>
                  </div>
                </div>
              )) : (
                <div className="text-center py-10 opacity-40">
                  <Empty description={<span className="text-white">Chưa có gợi ý</span>} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}