import { useNavigate } from "react-router-dom";
import CategoryItem from "../components/CategoryItem";
import useGetCategory from "../hooks/useGetCategory";

const CategorySection = () => {
  const navigate = useNavigate();
  const { data: getAllCategory, isPending } = useGetCategory(4);

  const handleSeeAll = () => {
    navigate("/explore/product?categoryId=all");
  };

  return (
    <section className="py-6 pt-0!">
      <div className="flex justify-between items-center mb-6 px-2">
        <h2 className="text-xl font-bold text-gray-800">Danh Mục</h2>
        <button 
          onClick={handleSeeAll}
          className="text-orange-600 font-semibold hover:underline text-sm transition-all"
        >
          Xem tất cả
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {isPending ? (
          [...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-100 animate-pulse rounded-2xl" />
          ))
        ) : (
          getAllCategory?.data?.map((category) => (
            <CategoryItem 
              key={category._id} 
              category={category} 
            />
          ))
        )}
      </div>
    </section>
  );
};

export default CategorySection;