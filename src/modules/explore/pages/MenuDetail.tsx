import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import { 
    BookOutlined, 
    ShoppingCartOutlined, 
    CheckSquareFilled, 
    BorderOutlined,
    InfoCircleOutlined
} from "@ant-design/icons";
import { Button, Tag, message, Spin, Divider, Card } from "antd";

import useGetMenuDetail from '../hooks/useGetMenuDetail';
import useGetMe from '../../../hooks/useGetMe';
import { formatVND } from "../../../utils/helper";
import MenuItems from '../components/MenuItems';
import { useCheckoutStore } from '../../../store/useCheckoutStore';

export default function MenuDetailScreen() {
    const location = useLocation();
    const idFromState = location.state?.title;
    const navigate = useNavigate();
    
    const { data: meData } = useGetMe(false);
    const isLoggedIn = !!meData?.data; // Cập nhật kiểm tra theo cấu trúc data trả về

    const { data: menuDetail, isPending } = useGetMenuDetail(idFromState);
    const [selectedItems, setSelectedItems] = useState([]);
    const { setCheckoutData } = useCheckoutStore();

    const getSafeProductId = (ing) => {
        if (ing.itemType === 'Product') return ing.ingredientId?._id;
        return ing.ingredientId?.productId;
    };

    const purchasableIngredients = useMemo(() => {
        if (!menuDetail?.data?.recipes) return [];
        return menuDetail.data.recipes.flatMap(recipe => 
            recipe.ingredients.filter(ing => getSafeProductId(ing))
        );
    }, [menuDetail]);

    useEffect(() => {
        if (purchasableIngredients.length > 0) {
            const allIds = Array.from(new Set(purchasableIngredients.map(ing => getSafeProductId(ing))));
            setSelectedItems(allIds);
        }
    }, [purchasableIngredients]);

    const toggleItem = (productId) => {
        setSelectedItems(prev => 
            prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId]
        );
    };

    const groupedCheckoutData = useMemo(() => {
        const filtered = purchasableIngredients.filter(ing => {
            const detail = ing.ingredientId;
            const isProduct = ing.itemType === 'Product' || !!detail?.productId;
            return isProduct && selectedItems.includes(getSafeProductId(ing));
        });

        const groupedMap = filtered.reduce((acc, ing) => {
            const pId = getSafeProductId(ing);
            const rawQty = Number(ing.quantity) || 0;
            
            if (!acc[pId]) {
                acc[pId] = {
                    productId: pId,
                    quantity: 0,
                    price: ing.ingredientId?.price || 0,
                    name: ing.ingredientId?.name,
                    image: ing.ingredientId?.image
                };
            }
            acc[pId].quantity += rawQty;
            return acc;
        }, {});

        return (Object.values(groupedMap) as any[]).map(item => ({
            ...item,
            quantity: Math.ceil(item.quantity)
        }));
    }, [selectedItems, purchasableIngredients]);

    const totalPrice = useMemo(() => {
        return groupedCheckoutData.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    }, [groupedCheckoutData]);

    const isNothingSelected = selectedItems.length === 0;

    const handleCheckout = () => {
        if (!isLoggedIn) {
            return message.warning("Vui lòng đăng nhập để tiến hành thanh toán!");
        }

        if (isNothingSelected) {
            return message.error("Vui lòng chọn ít nhất một sản phẩm.");
        }

        if (setCheckoutData) {
            setCheckoutData(groupedCheckoutData, "menu"); 
        }

        navigate("/checkout", { 
            state: { source: "menu", items: groupedCheckoutData } 
        });
    };

    if (isPending) return (
        <div className="flex justify-center items-center min-h-screen"><Spin size="large" /></div>
    );

    return (
        <div className="min-h-screen bg-[#F9F7F5] pb-20">
            <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                <div className="lg:col-span-8 space-y-6">
                    {menuDetail?.data.recipes.map((recipe, index) => (
                        <Card key={recipe._id} className="rounded-3xl border-none shadow-sm overflow-hidden">
                            <div className="flex items-center gap-4 mb-6 p-2">
                                <img src={recipe.image} className="w-16 h-16 rounded-2xl object-cover shadow-sm" alt="" />
                                <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                        <span className="text-orange-500 font-black">0{index + 1}.</span>
                                        <h3 className="text-lg font-black text-[#5C4033]">{recipe.name}</h3>
                                    </div>
                                    <button 
                                        onClick={() => navigate(`/recipe/${recipe._id}`)}
                                        className="text-xs font-bold text-orange-400 hover:text-orange-600 transition-colors"
                                    >
                                        <BookOutlined /> Xem cách chế biến
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {recipe.ingredients.map((ingredient) => {
                                    const productId = getSafeProductId(ingredient);
                                    const isSelected = selectedItems.includes(productId);
                                    return (
                                        <div 
                                            key={ingredient._id} 
                                            className={`flex items-center p-3 rounded-2xl border transition-all ${
                                                productId && isSelected ? "bg-orange-50/40 border-orange-100" : "bg-white border-gray-50"
                                            }`}
                                        >
                                            {productId ? (
                                                <div onClick={() => toggleItem(productId)} className="mr-3 cursor-pointer shrink-0">
                                                    {isSelected ? <CheckSquareFilled className="text-xl text-orange-500" /> : <BorderOutlined className="text-xl text-gray-200" />}
                                                </div>
                                            ) : <div className="w-8" />}
                                            <div className="flex-1 scale-90 origin-left relative">
                                                <MenuItems item={ingredient} />
                                                {isSelected && Number(ingredient.quantity) < 1 && (
                                                    <div className="absolute -top-2 -right-2">
                                                        <Tag color="blue" className="text-[9px] m-0 rounded-md border-none px-2">
                                                            Mua 1 {ingredient.ingredientId?.unit}
                                                        </Tag>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {recipe.additionalIngredients?.length > 0 && (
                                <div className="mt-4 p-4 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
                                    <p className="text-[10px] font-black uppercase text-[#A88E7A] mb-2 flex items-center gap-2">
                                        <InfoCircleOutlined /> Gia vị sẵn có (Thường đã có trong bếp)
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        {recipe.additionalIngredients.map((extra, idx) => (
                                            <span key={idx} className="text-[11px] bg-white px-3 py-1 rounded-full border border-gray-100 text-gray-400 font-medium">
                                                {extra.name}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </Card>
                    ))}
                </div>

                <div className="lg:col-span-4">
                    <div className="sticky top-6 space-y-6">
                        <Card className="rounded-3xl border-none shadow-md p-2">
                            <img 
                                src={menuDetail?.data.image} 
                                className="w-full h-48 object-cover rounded-2xl mb-4 shadow-inner" 
                                alt="" 
                            />
                            <div className="px-3 pb-4">
                                <Tag color="orange" className="font-bold border-none rounded-md px-3 py-1 mb-3">Mâm cơm gia đình</Tag>
                                <h1 className="text-2xl font-black text-[#5C4033] mb-2 leading-tight">
                                    {menuDetail?.data.title}
                                </h1>
                                
                                <div className="bg-blue-50/50 p-3 rounded-xl mb-6 border border-blue-100">
                                    <p className="text-[11px] text-blue-600 leading-relaxed font-medium">
                                        <InfoCircleOutlined className="mr-1" /> 
                                        Một số nguyên liệu được bán theo gói/hộp. Bạn có thể để dành phần dư cho lần nấu sau nhé!
                                    </p>
                                </div>

                                <div className="space-y-3 mb-6">
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-gray-400 font-medium">Nguyên liệu đã chọn:</span>
                                        <span className={`font-bold ${isNothingSelected ? 'text-red-500' : 'text-[#5C4033]'}`}>
                                            {selectedItems.length} món
                                        </span>
                                    </div>
                                    <Divider className="my-2 border-gray-100" />
                                    <div className="flex justify-between items-end pt-2">
                                        <div>
                                            <span className="text-gray-400 text-[10px] font-bold uppercase block">TỔNG TIỀN THANH TOÁN</span>
                                            <p className="text-[9px] text-orange-400 italic font-medium">* Đã bao gồm các món mua nguyên gói</p>
                                        </div>
                                        <span className="text-2xl font-black text-orange-600 leading-none">
                                            {formatVND(totalPrice)}
                                        </span>
                                    </div>
                                </div>

                                <Button 
                                    type="primary" 
                                    size="large" 
                                    block
                                    icon={<ShoppingCartOutlined />}
                                    onClick={handleCheckout}
                                    disabled={isNothingSelected}
                                    className={`h-14 rounded-2xl border-none font-black text-base shadow-lg transition-all ${
                                        isNothingSelected 
                                        ? "bg-gray-300 cursor-not-allowed opacity-70" 
                                        : "bg-orange-600 hover:bg-orange-700 shadow-orange-100"
                                    }`}
                                >
                                    MUA NGUYÊN LIỆU
                                </Button>
                            </div>
                        </Card>

                        <div className="bg-[#5C4033] p-6 rounded-3xl shadow-lg border-b-4 border-orange-500">
                            <h4 className="text-orange-300 font-black text-sm mb-2 italic flex items-center gap-2">
                                Mẹo từ đầu bếp:
                            </h4>
                            <p className="text-white text-xs leading-relaxed font-medium opacity-90">
                                Mâm cơm này được định lượng cho 2-4 người ăn. Nếu bạn đã có sẵn mắm, muối, đường... hãy bỏ chọn chúng để tiết kiệm chi phí nhé!
                            </p>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}