import { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { 
  ShoppingCartOutlined, 
  EnvironmentOutlined, 
  MinusOutlined, 
  PlusOutlined,
  ClockCircleOutlined,
  BarChartOutlined,
  BulbOutlined,
  RocketOutlined,
  RestOutlined
} from "@ant-design/icons";
import { Spin, Button, Tag, message } from "antd";
import { useCheckoutStore } from '../../../store/useCheckoutStore';
import useGetProductDetail from "../hooks/useGetProductDetail";
import useTrackView from "../hooks/useTrackView";
import useGetMe from "../../../hooks/useGetMe";
import useAddToCart from "../../cart/hooks/useAddToCart";
import { calcSale, formatVND } from "../../../utils/helper";

export default function ProductDetailScreen() {
  const { slug } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { setCheckoutData } = useCheckoutStore();
  
  const idFromState = location.state?.productId;

  const { data: getProductDetail, isPending } = useGetProductDetail(idFromState);
  const { data: meData } = useGetMe(false);
  const { mutate: trackView } = useTrackView();
  const { mutate: addToCart, isPending: cartPending } = useAddToCart();

  const [quantity, setQuantity] = useState(1);
  const isLoggedIn = !!meData;

  const productData = getProductDetail?.data;
  const recipes = productData?.relatedRecipes || [];
  const nutrition = productData?.nutrition;
  
  const hasSale = productData?.salePercent && 
                  typeof productData.salePercent === 'object' && 
                  productData.salePercent.percent > 0;

  useEffect(() => {
    if (isLoggedIn && productData?.categoryId?._id) {
      trackView(productData.categoryId._id);
    }
  }, [isLoggedIn, productData?._id]);

  if (!idFromState && !isPending) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <RestOutlined className="text-6xl text-orange-200 mb-4" />
        <p className="text-gray-500 mb-4 font-medium">Không tìm thấy thông tin sản phẩm</p>
        <Button shape="round" type="primary" className="bg-orange-600" onClick={() => navigate("/explore")}>
          Quay lại cửa hàng
        </Button>
      </div>
    );
  }

  if (isPending) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#faece1]">
        <Spin size="large" tip="Đang tải đặc sản..." />
      </div>
    );
  }

  const handleAddCart = () => {
    if (!isLoggedIn) {
      message.warning("Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng!");
      return;
    }
    addToCart({ productId: idFromState, quantity }, {
      onSuccess: () => message.success("Đã thêm vào giỏ hàng thành công 🛒")
    });
  };

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

  return (
    <div className="min-h-screen bg-linear-to-b from-[#C9936E] via-[#E8C5A8] to-[#f2dbc9] py-8 px-4 rounded-2xl">
      <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8 md:p-0 md:pb-12">
            <div className="space-y-6">
              <div className="rounded-[32px] overflow-hidden shadow-inner bg-white aspect-square group">
                <img 
                  src={productData?.images} 
                  alt={productData?.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>
              
              <div className="flex items-center gap-4 p-5 bg-white/50 rounded-2xl border border-orange-100">
                <div className="bg-orange-100 p-3 rounded-xl">
                  <EnvironmentOutlined className="text-orange-600 text-xl" />
                </div>
                <div>
                  <p className="text-[10px] text-orange-400 uppercase font-black tracking-widest">Nguồn gốc</p>
                  <p className="text-gray-700 font-bold text-lg">{productData?.origin}</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col">
              <h1 className="text-3xl md:text-4xl font-black text-gray-800 mb-4 leading-tight">
                {productData?.name}
              </h1>

              <div className="flex flex-col gap-1 mb-8">
                {hasSale ? (
                  <>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-400 line-through text-lg font-medium opacity-80">
                        {formatVND(productData?.price)}
                      </span>
                      <Tag color="#F26522" className="border-none font-black px-2 py-0 rounded-md text-[10px] uppercase">
                        Tiết kiệm {productData.salePercent.percent}%
                      </Tag>
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-5xl font-black text-orange-600 tracking-tighter">
                        {calcSale(productData.price, productData.salePercent.percent)}
                      </span>
                      <span className="text-gray-500 font-black text-lg opacity-60">/ {productData?.unit}</span>
                    </div>
                  </>
                ) : (
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-black text-orange-600 tracking-tighter">
                      {formatVND(productData?.price)}
                    </span>
                    <span className="text-gray-500 font-black text-lg opacity-60">/ {productData?.unit}</span>
                  </div>
                )}
              </div>

              <div className="bg-white/40 p-6 rounded-[24px] border border-white/60 mb-8 shadow-sm">
                <h3 className="text-gray-800 font-black mb-3 flex items-center gap-2 uppercase text-xs tracking-wider">
                  <BulbOutlined className="text-orange-500" /> Mô tả sản phẩm
                </h3>
                <p className="text-gray-600 leading-relaxed text-sm whitespace-pre-line">
                  {productData?.description}
                </p>
              </div>

              {productData?.usage_instruction?.length > 0 && (
                <div className="mb-8 pl-4 border-l-4 border-orange-400">
                  <h3 className="text-gray-800 font-black mb-4 uppercase text-xs">Hướng dẫn sử dụng</h3>
                  <div className="grid grid-cols-1 gap-3">
                    {productData.usage_instruction.map((step, index) => (
                      <div key={index} className="flex items-start gap-3 bg-white/30 p-3 rounded-xl border border-white/50 shadow-sm">
                        <span className="w-5 h-5 bg-orange-500 text-white rounded-full flex items-center justify-center text-[10px] font-black flex-shrink-0 mt-0.5">
                          {index + 1}
                        </span>
                        <p className="text-gray-600 text-sm leading-snug">{step}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-auto space-y-6">
                <div className="flex items-center gap-6">
                  <span className="font-black text-gray-500 uppercase text-xs">Số lượng</span>
                  <div className="flex items-center bg-white rounded-full p-1 border border-orange-100 shadow-sm">
                    <Button 
                      type="text" 
                      shape="circle"
                      icon={<MinusOutlined />} 
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    />
                    <span className="w-12 text-center font-black text-lg text-gray-800">{quantity}</span>
                    <Button 
                      type="text" 
                      shape="circle"
                      icon={<PlusOutlined />} 
                      onClick={() => setQuantity(quantity + 1)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Button 
                    size="large" 
                    className="h-14 rounded-full border-2 border-orange-600 text-orange-600 font-black hover:bg-orange-50 uppercase tracking-wider text-[11px]"
                    icon={<ShoppingCartOutlined />}
                    loading={cartPending}
                    onClick={handleAddCart}
                  >
                    Thêm vào giỏ
                  </Button>
                  <Button 
                    size="large" 
                    type="primary"
                    className="h-14 rounded-full bg-orange-600 hover:bg-orange-700 shadow-xl shadow-orange-200 border-none font-black uppercase tracking-wider text-[11px]"
                    icon={<RocketOutlined />}
                    onClick={handleCheckout}
                  >
                    Mua ngay
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#faece1]/50 p-6 md:p-12 border-t border-white">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              <div className="lg:col-span-1">
                <h3 className="text-xl font-black mb-6 flex items-center gap-2 text-gray-800 uppercase text-sm tracking-widest">
                  <BarChartOutlined className="text-orange-600" /> Dinh dưỡng
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {nutrition && ['calories', 'protein', 'fat', 'carbs'].map((key) => {
                    const val = nutrition[key];
                    if (!val || val <= 0) return null;
                    return (
                      <div key={key} className="bg-white p-4 rounded-3xl text-center shadow-sm border border-orange-50 hover:border-orange-200 transition-colors">
                        <p className="text-[9px] text-orange-400 uppercase font-black mb-1">{key}</p>
                        <p className="text-xl font-black text-gray-800">{val}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="lg:col-span-2">
                <h3 className="text-xl font-black mb-6 flex items-center gap-2 text-gray-800 uppercase text-sm tracking-widest">
                  <ClockCircleOutlined className="text-orange-600" /> Công thức gợi ý
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {recipes.length > 0 ? (
                    recipes.map((item) => (
                      <div 
                        key={item._id} 
                        className="flex gap-4 p-3 bg-white rounded-2xl border border-white hover:border-orange-200 cursor-pointer group transition-all shadow-sm"
                        onClick={() => navigate(`/explore/recipe-detail/${item.slug}`, {state: {title: item._id}})}
                      >
                        <img src={item.image} className="w-20 h-20 rounded-xl object-cover shadow-sm" alt={item.name} />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-gray-800 text-sm truncate group-hover:text-orange-600">{item.name}</h4>
                          <div className="flex items-center gap-3 text-[10px] text-gray-400 mt-2 font-bold">
                            <span><ClockCircleOutlined /> {item.cookTime} phút</span>
                            <span className="capitalize"><BarChartOutlined /> {item.difficulty}</span>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-2 p-8 bg-white/30 border-2 border-dashed border-orange-200 rounded-[32px] text-center text-gray-400 font-medium italic">
                      Chưa có công thức gợi ý cho sản phẩm này
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
    </div>
  );
}