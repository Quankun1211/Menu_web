import React, { useState } from 'react';
import { Row, Col, Typography, Spin, Empty, Pagination } from 'antd';
import { ThunderboltFilled, GiftFilled, ClockCircleFilled } from '@ant-design/icons';
import useGetShockDeals from '../hooks/useGetShockDeals'; 
import ProductCard from '../components/ProductCard'; 

const { Title, Text } = Typography;

export default function SalePage() {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 12;

  const { data, isPending } = useGetShockDeals(currentPage, pageSize);
  const productsList = (data as any)?.data || [];

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#FDFCFB] py-12 px-6 md:px-20">
      <div className="max-w-7xl mx-auto mb-12">
        <div className="bg-[#D16D2F] rounded-[40px] p-8 md:p-12 relative overflow-hidden shadow-xl shadow-orange-100 border-4 border-white/20">
          <div className="absolute top-[-20px] right-[-20px] text-[150px] opacity-10 rotate-12 select-none">🌿</div>
          <div className="absolute bottom-[-20px] left-[-20px] text-[100px] opacity-10 -rotate-12 select-none">🧧</div>

          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-3 mb-4">
                <span className="bg-[#F5F5DC] text-[#D16D2F] px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-sm">
                  Đang diễn ra
                </span>
                <div className="flex items-center gap-1.5 text-[#F5F5DC] text-xs font-bold animate-pulse">
                  <ClockCircleFilled /> Kết thúc sau: 12:00:00
                </div>
              </div>
              <Title level={1} className="text-[#F5F5DC]! m-0! font-black! uppercase text-4xl md:text-6xl tracking-tighter italic">
                Đại tiệc <span className="text-[#5C4033]">Ưu đãi</span>
              </Title>
              <Text className="text-[#F5F5DC] opacity-90 text-lg block mt-2 font-medium">
                Thưởng thức nông sản sạch với giá hời nhất trong tuần
              </Text>
            </div>

            <div className="bg-[#F5F5DC]/10 backdrop-blur-md border border-white/30 p-8 rounded-[40px] text-center min-w-[220px] transform hover:scale-105 transition-transform">
              <div className="text-[#F5F5DC] text-xs uppercase font-black mb-1 tracking-widest">Giảm đến</div>
              <div className="text-[#F5F5DC] text-6xl font-black italic tracking-tighter drop-shadow-lg">50%</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        {isPending ? (
          <div className="flex flex-col items-center justify-center py-40">
            <Spin size="large" />
            <div className="mt-4 text-[#D16D2F] font-bold tracking-widest animate-pulse uppercase text-xs">
              Đang săn tìm deal hời...
            </div>
          </div>
        ) : !productsList || productsList.length === 0 ? (
          <div className="bg-white rounded-[40px] py-20 shadow-sm border border-dashed border-gray-200 text-center">
            <Empty description={<span className="text-gray-400 font-medium">Hiện chưa có chương trình giảm giá nào mới.</span>} />
          </div>
        ) : (
          <>
            <Row gutter={[24, 32]}>
              {productsList.map((product) => (
                <Col xs={12} sm={12} md={8} lg={6} key={product._id}>
                  <ProductCard product={product} />
                </Col>
              ))}
            </Row>

            <div className="flex justify-center mt-16">
              <Pagination 
                current={currentPage} 
                total={data?.pagination.totalPages || 0} 
                pageSize={pageSize}
                onChange={handlePageChange}
                showSizeChanger={false}
                className="custom-pagination"
              />
            </div>
          </>
        )}
      </div>

      <div className="max-w-7xl mx-auto mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 border-t border-[#5C4033]/10 pt-16">
        <div className="group text-center p-8 bg-white rounded-[30px] shadow-sm hover:shadow-md transition-all border border-gray-50">
          <div className="w-16 h-16 bg-[#D16D2F]/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
            <GiftFilled className="text-2xl text-[#D16D2F]" />
          </div>
          <Title level={4} className="text-[#5C4033]! font-bold">Quà tặng kèm</Title>
          <Text className="text-gray-400">Nhiều phần quà hấp dẫn cho đơn hàng từ 500k.</Text>
        </div>
        
        <div className="group text-center p-8 bg-white rounded-[30px] shadow-sm hover:shadow-md transition-all border border-gray-50">
          <div className="w-16 h-16 bg-[#D16D2F]/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
            <ThunderboltFilled className="text-2xl text-[#D16D2F]" />
          </div>
          <Title level={4} className="text-[#5C4033]! font-bold">Săn Deal Chớp Nhoáng</Title>
          <Text className="text-gray-500">Cập nhật sản phẩm giảm giá mới mỗi 12 giờ.</Text>
        </div>

        <div className="group text-center p-8 bg-white rounded-[30px] shadow-sm hover:shadow-md transition-all border border-gray-50">
          <div className="w-16 h-16 bg-[#D16D2F]/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
            <span className="text-2xl">🛡️</span>
          </div>
          <Title level={4} className="text-[#5C4033]! font-bold">Cam kết chất lượng</Title>
          <Text className="text-gray-400">Dù giảm giá nhưng chất lượng sản phẩm không đổi.</Text>
        </div>
      </div>
    </div>
  );
}