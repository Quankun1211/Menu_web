import React from "react";
import { 
  X, 
  ShoppingCart, 
  CheckSquare, 
  Square, 
  Loader2 
} from "lucide-react";
import { formatVND } from "../../../utils/helper";
import { WishListItemResponse } from "../types/api-response";
import useRemoveWishList from "../hooks/useRemoveWishList";
// import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

interface Props {
  item: WishListItemResponse;
  isEditing: boolean;
  isSelected: boolean;
  onToggleSelect: () => void;
  onAddToCart?: () => void;
}

const WishlistItem = ({
  item,
  isEditing,
  isSelected,
  onToggleSelect,
  onAddToCart,
}: Props) => {
  const { product } = item;
  const navigate = useNavigate();
  const { mutate: removeWishList, isPending } = useRemoveWishList();

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    removeWishList(
      { productIds: [product._id] },
      {
        onSuccess: () => {
        //   toast.success(`Đã xóa ${item.product.name} khỏi Yêu thích`);
        },
      }
    );
  };

  const goToDetail = () => {
    navigate(`/product/${product._id}`);
  };

  return (
    <div className="flex items-center p-4 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
      {isEditing && (
        <button 
          onClick={onToggleSelect} 
          className="mr-4 focus:outline-none"
        >
          {isSelected ? (
            <CheckSquare className="w-6 h-6 text-[#F26522]" />
          ) : (
            <Square className="w-6 h-6 text-gray-300" />
          )}
        </button>
      )}

      <div 
        onClick={goToDetail}
        className="cursor-pointer w-20 h-20 rounded-xl overflow-hidden bg-gray-50 flex-shrink-0"
      >
        <img 
          src={product.images} 
          alt={product.name}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="flex-1 ml-4">
        <div className="flex justify-between items-start">
          <h3 
            onClick={goToDetail}
            className="text-sm font-bold text-gray-800 cursor-pointer hover:text-[#F26522] transition-colors line-clamp-1 flex-1 mr-4"
          >
            {product.name}
          </h3>

          {!isEditing && (
            <button 
              onClick={handleRemove}
              disabled={isPending}
              className="text-gray-300 hover:text-red-500 transition-colors disabled:opacity-50"
            >
              {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <X className="w-5 h-5" />}
            </button>
          )}
        </div>

        <div className="flex justify-between items-center mt-3">
          <p className="font-black text-[#F26522]">
            {formatVND(product.finalPrice ?? product.price)}
          </p>

          {!isEditing && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onAddToCart?.();
              }}
              className="flex items-center gap-1.5 bg-[#F26522] text-white px-4 py-1.5 rounded-lg text-xs font-bold shadow-sm shadow-orange-100 hover:bg-orange-600 active:scale-95 transition-all"
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              <span>Thêm</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default React.memo(WishlistItem);