import { useNavigate } from "react-router-dom";
import { 
  UserOutlined, 
  ClockCircleOutlined, 
  ArrowRightOutlined 
} from "@ant-design/icons";
import { formatVND } from "../../../utils/helper";

const ListMenuItem = ({ item }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-[32px] overflow-hidden border border-orange-100 shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col h-full">
      <div className="relative aspect-[16/10] overflow-hidden">
        <img 
          src={item.image} 
          alt={item.title} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute top-4 right-4">
          <div className="bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full shadow-sm border border-orange-50">
            <span className="text-[#D16D2F] font-black text-sm">
              {formatVND(item.totalPrice)}
            </span>
          </div>
        </div>
      </div>

      <div className="p-6 flex flex-col flex-1">
        <div className="mb-4">
          <h3 className="text-xl font-black text-[#5C4033] line-clamp-1 group-hover:text-[#D16D2F] transition-colors">
            {item.title}
          </h3>
          <p className="text-[#A88E7A] text-xs font-bold uppercase tracking-wider mt-1 line-clamp-1">
            {item.titleBanner}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-6">
          {item.recipes.map((food, index) => (
            <div 
              key={index} 
              className="flex items-center gap-2 bg-orange-50/50 p-2 rounded-xl border border-orange-100/50"
            >
              <img 
                src={food.image} 
                className="w-8 h-8 rounded-full object-cover border-2 border-white shadow-sm" 
                alt={food.name} 
              />
              <span className="text-[11px] font-bold text-[#5C4033] truncate">
                {food.name}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-50">
          <div className="flex items-center gap-4 text-[#A88E7A]">
            <div className="flex items-center gap-1.5">
              <UserOutlined className="text-sm" />
              <span className="text-xs font-black">{item.meta.servings}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <ClockCircleOutlined className="text-sm" />
              <span className="text-xs font-black">{item.cookTime}p</span>
            </div>
          </div>

          <button
            onClick={() => navigate(`/explore/menu-detail/${item.title}`, {
                state: { title: item._id } 
            })}
            className="flex items-center gap-2 bg-[#5C4033] hover:bg-[#D16D2F] text-white px-5 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all active:scale-95 shadow-md shadow-orange-900/10"
          >
            Chi tiết
            <ArrowRightOutlined />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ListMenuItem;