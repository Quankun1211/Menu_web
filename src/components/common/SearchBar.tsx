import { useState, useEffect, useRef } from "react";
import { Input, Spin, Empty } from "antd";
import { SearchOutlined, RightOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import useSearchProducts from "../../hooks/useSearchProducts";

export default function SearchBar() {
  const [keyword, setKeyword] = useState("");
  const [debouncedKeyword, setDebouncedKeyword] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedKeyword(keyword);
    }, 500);
    return () => clearTimeout(handler);
  }, [keyword]);

  const { data, isLoading } = useSearchProducts(debouncedKeyword);
  const products = data?.data || [];

  const handleSelectItem = (productId) => {
    navigate(`/product-detail/${productId}`);
    setKeyword("");
    setIsFocused(false);
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto z-[9999]">
      <Input
        prefix={<SearchOutlined className="text-gray-400 mr-2" />}
        placeholder="Tìm kiếm đặc sản Việt..."
        className="rounded-full bg-gray-100 border-none h-11 hover:bg-gray-200 focus:bg-white focus:shadow-md transition-all px-5 text-base"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setTimeout(() => setIsFocused(false), 200)}
        suffix={
          (isLoading || keyword !== debouncedKeyword) && keyword.length > 0 ? (
            <Spin size="small" />
          ) : null
        }
        allowClear
      />

      {isFocused && keyword.length > 0 && (
        <div className="absolute top-full left-0 w-full mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden max-h-[450px] flex flex-col animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="overflow-y-auto no-scrollbar">
            {products.length > 0 ? (
              <div className="py-2">
                <div className="px-4 py-2 text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                  Kết quả tìm kiếm
                </div>
                {products.map((item) => (
                  <div
                    key={item._id}
                    className="flex items-center gap-4 px-4 py-3 hover:bg-orange-50 cursor-pointer transition-colors group"
                    onClick={() => handleSelectItem(item._id)}
                  >
                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-50 flex-shrink-0 border border-gray-100">
                      <img
                        src={item.images}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-gray-800 truncate">
                        {item.name}
                      </div>
                      <div className="text-xs text-gray-400 mt-0.5">
                        {item.origin || "Đặc sản vùng miền"}
                      </div>
                    </div>
                    <RightOutlined className="text-gray-300 group-hover:text-orange-500 text-[10px]" />
                  </div>
                ))}
              </div>
            ) : debouncedKeyword.length > 0 && !isLoading ? (
              <div className="py-10 text-center">
                <Empty description="Không tìm thấy sản phẩm phù hợp" image={Empty.PRESENTED_IMAGE_SIMPLE} />
              </div>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
}