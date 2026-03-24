import React, { useState } from "react";
import { 
  Heart, 
  Trash2, 
  ShoppingCart, 
  CheckSquare, 
  Square, 
  Loader2,
  ChevronRight,
  Sparkles,
  ShoppingBag
} from "lucide-react";
import { formatVND } from "../../../utils/helper";
import useGetWishList from "../hooks/useGetWishList";
import useRemoveWishList from "../hooks/useRemoveWishList";
import useAddToCart from "../../../modules/cart/hooks/useAddToCart";
import useGetSuggestionProducts from "../../../modules/root/hooks/useGetSuggestionProducts";
import WishListItem from "../components/WishListItem";
import { useNavigate } from "react-router";

export default function Wishlist() {
  const navigate = useNavigate();
  const { data: getWishList, isPending: wishListPending } = useGetWishList();
  
  const { data: suggestionResponse, isPending: isSuggestionPending } = useGetSuggestionProducts(1, 8);

  const { mutate: addToCart, isPending: isAddingToCart } = useAddToCart();
  const { mutate: removeWishList, isPending: removePending } = useRemoveWishList();
  
  const [isEditing, setIsEditing] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const allIds = getWishList?.data?.map((item) => item.product._id) ?? [];
  const isSelectAll = selectedItems.length === allIds.length && allIds.length > 0;

  const handleAddToCart = (id: string) => {
    addToCart({
      productId: id,
      quantity: 1,
    });
  };

  const handleRemoveFavourite = () => {
    if (selectedItems.length === 0) return;
    removeWishList(
      { productIds: selectedItems },
      {
        onSuccess: () => {
          setSelectedItems([]);
          setIsEditing(false);
        },
      }
    );
  };

  const toggleSelectAll = () => {
    if (isSelectAll) {
      setSelectedItems([]);
    } else {
      setSelectedItems(allIds);
    }
  };

  const toggleSelectItem = (id: string) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter((itemId) => itemId !== id));
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  };

  if (wishListPending) {
    return (
      <div className="flex h-[60vh] w-full items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-[#F26522]" />
      </div>
    );
  }

  return (
    <div className="relative mx-auto w-full max-w-4xl px-4 pb-32 pt-6">
      <div className="mb-6 flex items-center justify-between border-b pb-4">
        <div className="flex items-center gap-2">
          <Heart className="h-5 w-5 text-[#F26522] fill-[#F26522]" />
          <h1 className="text-lg font-bold text-gray-800">
            Danh sách yêu thích ({getWishList?.data?.length ?? 0})
          </h1>
        </div>

        {getWishList?.data?.length > 0 && (
          <button
            disabled={removePending}
            onClick={() => {
              setIsEditing(!isEditing);
              setSelectedItems([]);
            }}
            className={`text-sm font-bold transition-colors ${
              isEditing ? "text-gray-400" : "text-[#F26522]"
            } disabled:opacity-50`}
          >
            {isEditing ? "Hủy" : "Chỉnh sửa"}
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4">
        {getWishList?.data?.map((item) => (
          <WishListItem
            key={item._id}
            item={item}
            isEditing={isEditing}
            isSelected={selectedItems.includes(item.product._id)}
            onToggleSelect={() => toggleSelectItem(item.product._id)}
            onAddToCart={() => handleAddToCart(item.product._id)}
          />
        ))}
        
        {getWishList?.data?.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-[32px] border border-gray-100 shadow-sm">
            <div className="relative mb-6">
              <Heart className="h-20 w-20 text-gray-100 fill-gray-50" />
              <ShoppingBag className="absolute bottom-0 right-0 h-8 w-8 text-[#F26522] animate-bounce" />
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">Danh sách đang trống</h2>
            <p className="text-gray-400 mb-8 max-w-[280px]">Hãy thêm những món ăn yêu thích để không bỏ lỡ chúng nhé!</p>
            <button 
              onClick={() => navigate('/')}
              className="flex items-center gap-2 bg-[#F26522] text-white px-8 py-3 rounded-full font-bold shadow-lg shadow-orange-100 hover:bg-orange-600 transition-all active:scale-95"
            >
              Mua sắm ngay
            </button>
          </div>
        )}
      </div>

      {/* Suggestion Section */}
      <div className="mt-16 bg-gray-50/50 rounded-3xl p-6 border border-dashed border-gray-200">
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Sparkles className="h-5 w-5 text-[#F26522]" />
            </div>
            <div>
              <h2 className="text-xl font-black text-gray-800 tracking-tight">Gợi ý cho bạn</h2>
              <p className="text-xs text-gray-500 font-medium">Dựa trên sở thích của bạn</p>
            </div>
          </div>
          <button 
            onClick={() => navigate('/suggest')}
            className="text-xs font-bold text-gray-500 flex items-center gap-1 hover:text-[#F26522] transition-colors"
          >
            Xem thêm <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {isSuggestionPending ? (
            [...Array(4)].map((_, i) => (
              <div key={i} className="flex flex-col gap-3">
                <div className="aspect-[4/5] bg-gray-200 animate-pulse rounded-2xl" />
                <div className="h-3 bg-gray-200 animate-pulse rounded w-1/2" />
                <div className="h-4 bg-gray-200 animate-pulse rounded w-3/4" />
              </div>
            ))
          ) : (
            suggestionResponse?.data.map((product) => (
              <div
                key={product._id}
                onClick={() => navigate(`/product/${product.slug || product._id}`)}
                className="group bg-white rounded-2xl p-2 border border-transparent shadow-sm hover:border-orange-200 hover:shadow-md transition-all duration-300 flex flex-col cursor-pointer"
              >
                <div className="relative aspect-[4/5] mb-3 overflow-hidden rounded-xl bg-gray-100">
                  <img
                    src={product.images}
                    alt={product.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddToCart(product._id);
                    }}
                    disabled={isAddingToCart}
                    className="absolute bottom-2 right-2 p-2 bg-white/90 backdrop-blur-sm rounded-lg text-[#F26522] shadow-sm translate-y-10 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 hover:bg-[#F26522] hover:text-white disabled:bg-gray-100"
                  >
                    <ShoppingCart className="h-4 w-4" />
                  </button>
                </div>
                
                <div className="px-1 flex-1 flex flex-col">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-orange-400 mb-1">
                    {product.categoryId?.name}
                  </p>
                  <h3 className="line-clamp-2 text-xs font-bold text-gray-800 leading-snug flex-1">
                    {product.name}
                  </h3>
                  <div className="mt-3 pt-2 border-t border-gray-50 flex items-baseline gap-1">
                    <p className="text-sm font-black text-[#F26522]">
                      {formatVND(product.price)}
                    </p>
                    <span className="text-[9px] text-gray-400">/{product.unit || 'cái'}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {isEditing && (
        <div className="fixed bottom-0 left-0 right-0 z-50 border-t bg-white/80 backdrop-blur-md p-4 shadow-[0_-8px_30px_rgb(0,0,0,0.04)]">
          <div className="mx-auto flex max-w-4xl items-center justify-between">
            <button
              className="flex items-center gap-2 text-gray-700 font-bold hover:text-[#F26522] transition-colors"
              onClick={toggleSelectAll}
              disabled={removePending}
            >
              {isSelectAll ? (
                <CheckSquare className="h-6 w-6 text-[#F26522]" />
              ) : (
                <Square className="h-6 w-6 text-gray-300" />
              )}
              <span>Tất cả</span>
            </button>

            <button
              onClick={handleRemoveFavourite}
              disabled={selectedItems.length === 0 || removePending}
              className="flex min-w-40 items-center justify-center gap-2 rounded-xl bg-[#F26522] py-3 px-6 font-bold text-white shadow-lg shadow-orange-200 transition-all hover:bg-orange-600 active:scale-95 disabled:opacity-50 disabled:shadow-none"
            >
              {removePending ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  <Trash2 className="h-5 w-5" />
                  <span>Xóa ({selectedItems.length})</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}