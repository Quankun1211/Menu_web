import React from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { formatVND } from "../../utils/helper";

type Product = {
  _id: string;
  type?: "product" | "special";
  name: string;
  slug?: string;
  price?: number;
  unit?: string;
  images?: string | string[];
  stock?: number;
};

type Props = {
  product: Product;
};

const ChatbotProductCard = ({ product }: Props) => {
  const image = Array.isArray(product.images)
    ? product.images[0]
    : product.images;

  const detailUrl =
    product.type === "special"
      ? `/explore/special-detail/${product.slug}`
      : `/explore/product-detail/${product.slug}`;

  return (
    <div className="w-full overflow-hidden rounded-xl border border-[#e8c5a8] bg-white shadow-sm">
      <div className="flex gap-3 p-3">
        <img
          src={image || "/placeholder-product.png"}
          alt={product.name}
          className="h-20 w-20 shrink-0 rounded-lg object-cover"
        />

        <div className="min-w-0 flex-1">
          <h4 className="line-clamp-2 text-sm font-bold text-gray-800">
            {product.name}
          </h4>

          <p className="mt-1 text-sm font-bold text-[#E25822]">
            {typeof product.price === "number"
              ? formatVND(product.price)
              : "Liên hệ"}
          </p>

          {product.unit && (
            <p className="text-xs text-gray-500">
              {product.unit}
            </p>
          )}

          {typeof product.stock === "number" &&
            (product.stock > 0 ? (
              <p className="mt-1 text-xs text-green-600">
                Còn hàng
              </p>
            ) : (
              <p className="mt-1 text-xs text-red-500">
                Hết hàng
              </p>
            ))}
        </div>
      </div>

      {product.slug && (
        <Link
          to={detailUrl}
          className="flex items-center justify-center gap-1 border-t border-gray-100 px-3 py-2 text-sm font-medium text-[#E25822] hover:bg-orange-50"
        >
          Xem chi tiết
          <ArrowRight size={15} />
        </Link>
      )}
    </div>
  );
};

export default ChatbotProductCard;