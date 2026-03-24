import { useNavigate } from "react-router-dom";
import { Home } from "lucide-react";

const RegionItem = ({ regionKey, title, sub }) => {
  const navigate = useNavigate();

  return (
    <div 
      onClick={() => navigate(`/explore/product?region=${regionKey}`)}
      className="flex items-center p-4 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md hover:border-orange-200 transition-all cursor-pointer group"
    >
      <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center text-orange-600 group-hover:bg-orange-600 group-hover:text-white transition-colors">
        <Home size={24} />
      </div>
      <div className="ml-4">
        <h4 className="font-bold text-gray-800 text-sm">{title}</h4>
        <p className="text-gray-500 text-xs mt-1">{sub}</p>
      </div>
    </div>
  );
};

export default RegionItem;