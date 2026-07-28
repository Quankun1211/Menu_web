import { useNavigate } from "react-router-dom";
import FavoriteButton from "../../../components/common/FavoriteButton";

const ProductItem = ({ products }) => {
  const navigate = useNavigate();

  return (
    <div 
      onClick={() => navigate(`/explore/product-detail/${products.slug}`, { 
        state: { productId: products._id } 
      })}
      className="relative bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer h-full"
    >
      <FavoriteButton productId={products._id} className="absolute right-3 top-3 z-10" />
      <img 
        src={products.images} 
        alt={products.name}
        className="w-full aspect-square object-cover"
      />
      <div className="p-3">
        <h3 className="font-bold text-gray-800 text-sm line-clamp-1">{products.name}</h3>
        <p className="text-orange-600 font-bold mt-1">
          {products.price?.toLocaleString()}đ / {products.unit}
        </p>
      </div>
    </div>
  );
};

export default ProductItem;
