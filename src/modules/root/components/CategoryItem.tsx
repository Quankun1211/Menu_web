import { useNavigate } from "react-router-dom";

export default function CategoryItem({ category }) {
  const navigate = useNavigate();

  const handlePress = () => {
    navigate(`/explore/product?category=${category._id}`);
  };

  return (
    <div 
      onClick={handlePress}
      className="relative w-full aspect-square rounded-2xl overflow-hidden cursor-pointer shadow-sm group active:scale-95 transition-transform duration-200"
    >
      <img 
        src={category.image} 
        alt={category.name}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
      />
      
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex items-end justify-center p-3">
        <span className="text-white text-sm md:text-base font-bold text-center drop-shadow-md">
          {category.name}
        </span>
      </div>
    </div>
  );
}