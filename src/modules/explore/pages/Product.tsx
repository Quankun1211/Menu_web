import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import CategoryItem from '../components/CategoryItem';
import ExploreProductItems from '../components/ExploreProductItems';
import useGetCategory from '../../root/hooks/useGetCategory';
import useGetProductByRegion from '../hooks/useGetProductByRegion';
import { Select, Empty, Spin, Pagination } from 'antd';
import { FilterOutlined, EnvironmentOutlined, AppstoreOutlined } from '@ant-design/icons';

const REGIONS = [
  { id: 'bac', name: 'Miền Bắc' },
  { id: 'trung', name: 'Miền Trung' },
  { id: 'nam', name: 'Miền Nam' },
];

export default function Product() {
  const [searchParams] = useSearchParams();
  
  const regionId = searchParams.get('region') || 'bac';
  const categoryId = searchParams.get('categoryId') || 'all';
  const sortInit = searchParams.get('sortInit') || 'newest';

  const [selectedRegion, setSelectedRegion] = useState(regionId);
  const [activeTab, setActiveTab] = useState(categoryId);
  const [sort, setSortBy] = useState(sortInit);
  
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 12; 

  const { data: getAllCategory } = useGetCategory();

  const { data: productsData, isPending } = useGetProductByRegion({
    region: selectedRegion,
    categoryId: activeTab === 'all' ? undefined : activeTab,
    sort,
    page: currentPage,
    limit: pageSize
  });

  const products = productsData?.data || [];
  const totalItems = productsData?.pagination?.totalItems || 0;

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedRegion, activeTab, sort]);

  const categoriesWithAll = useMemo(() => {
    const allTab = { _id: 'all', name: 'Tất cả sản vật' };
    if (!getAllCategory?.data) return [allTab];
    return [allTab, ...getAllCategory.data];
  }, [getAllCategory]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="max-w-[1600px] mx-auto px-6 py-10 min-h-screen bg-[#faece1]/30">
      <div className="flex flex-col lg:flex-row gap-10">
        
        <aside className="w-full lg:w-80 flex-shrink-0">
          <div className="sticky top-8 space-y-8">
            
            <div className="bg-white rounded-[32px] p-6 shadow-sm border border-[#E8C5A8]/30">
              <span className="flex items-center gap-2 text-[#D16D2F] font-black uppercase text-[10px] tracking-[2px] mb-4">
                <EnvironmentOutlined /> Vùng miền
              </span>
              <div className="flex flex-col gap-2">
                {REGIONS.map((region) => (
                  <button
                    key={region.id}
                    onClick={() => setSelectedRegion(region.id)}
                    className={`w-full px-6 py-3 rounded-xl text-xs transition-all uppercase tracking-widest font-black text-left ${
                      selectedRegion === region.id 
                      ? 'bg-[#D16D2F] text-white shadow-md' 
                      : 'text-[#8B5E3C] hover:bg-[#f2dbc9] bg-[#f2dbc9]/30'
                    }`}
                  >
                    {region.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-[32px] p-6 shadow-sm border border-[#E8C5A8]/30">
              <span className="text-[#A88E7A] font-black uppercase text-[10px] tracking-[2px] mb-4 block">
                Sắp xếp theo
              </span>
              <Select
                value={sort}
                onChange={setSortBy}
                className="w-full custom-select-folklore"
                bordered={false}
                options={[
                  { value: 'newest', label: 'Mới nhất' },
                  { value: 'price_asc', label: 'Giá thấp đến cao' },
                  { value: 'price_desc', label: 'Giá cao đến thấp' },
                  { value: 'sold_desc', label: 'Bán chạy nhất' },
                ]}
                suffixIcon={<FilterOutlined className="text-[#D16D2F]" />}
                style={{ 
                  backgroundColor: '#f2dbc9/20', 
                  borderRadius: '12px',
                  border: '1px solid #E8C5A8',
                  height: '46px',
                  width: '100%'
                }}
              />
            </div>

            <div className="bg-white rounded-[32px] p-6 shadow-sm border border-[#E8C5A8]/30">
              <span className="flex items-center gap-2 text-[#A88E7A] font-black uppercase text-[10px] tracking-[2px] mb-4">
                <AppstoreOutlined /> Danh mục
              </span>
              <div className="space-y-1">
                {categoriesWithAll.map((item) => (
                  <button
                    key={item._id}
                    onClick={() => setActiveTab(item._id)}
                    className={`w-full text-left px-4 py-3 rounded-xl text-sm transition-all font-bold ${
                      activeTab === item._id 
                      ? 'text-[#D16D2F] bg-[#D16D2F]/5' 
                      : 'text-[#8B5E3C] hover:text-[#D16D2F]'
                    }`}
                  >
                    {item.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </aside>

        <main className="flex-1">
          {isPending ? (
            <div className="flex flex-col items-center justify-center py-40 gap-4 bg-white/40 rounded-[40px]">
              <Spin size="large" />
              <p className="text-[#8B5E3C] font-black uppercase text-[10px] tracking-[3px] animate-pulse">
                Đang bày biện sản vật {REGIONS.find(r => r.id === selectedRegion)?.name}...
              </p>
            </div>
          ) : products.length > 0 ? (
            <div className="space-y-12">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map((product: any) => (
                  <div key={product._id} className="hover:-translate-y-2 transition-transform duration-500">
                    <ExploreProductItems product={product} />
                  </div>
                ))}
              </div>

              <div className="flex justify-center pb-10">
                <div className="bg-white px-8 py-4 rounded-full shadow-sm border border-[#E8C5A8]/20">
                  <Pagination
                    current={currentPage}
                    total={totalItems} 
                    pageSize={pageSize}
                    onChange={handlePageChange}
                    showSizeChanger={false}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white/40 rounded-[60px] py-40 border-2 border-dashed border-[#E8C5A8] flex flex-col items-center justify-center">
              <Empty 
                image={Empty.PRESENTED_IMAGE_SIMPLE} 
                description={
                  <div className="text-center space-y-2">
                    <p className="text-[#8B5E3C] font-black uppercase tracking-widest text-sm">Chưa có sản vật nào</p>
                    <p className="text-[#A88E7A] text-xs italic">
                      Danh mục này tại {REGIONS.find(r => r.id === selectedRegion)?.name} đang đợi ngày lên kệ
                    </p>
                  </div>
                } 
              />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}