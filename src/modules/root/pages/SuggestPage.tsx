import { useState, useEffect, useMemo } from 'react';
import { Row, Col, Typography, Spin, Empty, Pagination } from 'antd';
import { ThunderboltFilled, FireFilled } from '@ant-design/icons';
import useGetSuggestionProducts from '../hooks/useGetSuggestionProducts';
import ProductCard from '../components/ProductCard'; 

const { Title, Text } = Typography;

export default function SuggestionPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 12;

  const { data: products, pagination, isPending } = useGetSuggestionProducts(currentPage, pageSize);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const isLoading = isPending;

  return (
    <div className="min-h-screen bg-[#FDFCFB] py-12 px-6 md:px-20">
      <div className="max-w-7xl mx-auto mb-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-[#D16D2F] text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
                Dành riêng cho bạn
              </span>
            </div>
            <Title level={1} className="text-[#5C4033]! m-0! font-black! uppercase">
              Khám phá <span className="text-[#D16D2F]">Gợi ý</span> hôm nay
            </Title>
            <Text className="text-gray-400 text-lg">
              Dựa trên sở thích và thói quen mua sắm của bạn
            </Text>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-40">
            <Spin size="large" />
            <div className="mt-4 text-[#D16D2F] font-medium animate-pulse">
              Đang chuẩn bị những món ngon cho bạn...
            </div>
          </div>
        ) : !products || products?.data.length === 0 ? (
          <div className="bg-white rounded-[40px] py-20 shadow-sm border border-gray-100 text-center">
            <Empty description="Hiện chưa có gợi ý mới, hãy quay lại sau nhé!" />
          </div>
        ) : (
          <>
            <Row gutter={[24, 24]}>
              {products?.data.map((product) => (
                <Col xs={12} sm={12} md={8} lg={6} key={product._id}>
                  <ProductCard product={product} />
                </Col>
              ))}
            </Row>

            <div className="flex justify-center mt-16">
              <Pagination 
                current={currentPage} 
                total={pagination?.totalItems || 0} 
                pageSize={pageSize}
                onChange={handlePageChange}
                showSizeChanger={false}
                className="custom-pagination"
              />
            </div>
          </>
        )}
      </div>

      <div className="max-w-7xl mx-auto mt-20 border-t border-[#5C4033]/10 pt-12">
        <Row gutter={[32, 32]} className="text-center">
          <Col xs={24} md={8}>
            <div className="p-6 bg-[#5C4033]/5 rounded-[30px] h-full transition-transform hover:-translate-y-2">
              <FireFilled className="text-2xl text-[#D16D2F] mb-4" />
              <Title level={4} className="text-[#5C4033]!">Sản phẩm Hot nhất</Title>
              <Text className="text-gray-500">Luôn cập nhật xu hướng thị trường thực phẩm mới nhất.</Text>
            </div>
          </Col>
          <Col xs={24} md={8}>
            <div className="p-6 bg-[#5C4033]/5 rounded-[30px] h-full transition-transform hover:-translate-y-2">
              <ThunderboltFilled className="text-2xl text-[#D16D2F] mb-4" />
              <Title level={4} className="text-[#5C4033]!">Giao hàng siêu tốc</Title>
              <Text className="text-gray-500">Đảm bảo thực phẩm luôn tươi ngon khi đến tay bạn.</Text>
            </div>
          </Col>
          <Col xs={24} md={8}>
            <div className="p-6 bg-[#5C4033]/5 rounded-[30px] h-full transition-transform hover:-translate-y-2">
              <div className="text-2xl mb-4">🌿</div>
              <Title level={4} className="text-[#5C4033]!">100% Organic</Title>
              <Text className="text-gray-500">Nguồn gốc rõ ràng, đạt chuẩn an toàn vệ sinh thực phẩm.</Text>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
}