import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  DeleteOutlined, 
  CheckCircleFilled, 
  BorderOutlined,
  UserOutlined,
  CloseCircleOutlined,
  ThunderboltFilled
} from '@ant-design/icons';
import { Button, Spin, Empty, message, Modal, Row, Col, Typography, Badge } from 'antd';

import useGetCart from '../hooks/useGetCart';
import useRemoveCartItems from '../hooks/useRemoveCartItems';
import useGetMe from '../../../hooks/useGetMe';
import CartItemRow from '../components/CartItem';
import CartSummarySide from '../components/CartSummary';
import { useCheckoutStore } from '../../../store/useCheckoutStore';
import useGetSuggestionProducts from '../../root/hooks/useGetSuggestionProducts'; 
import { calcSalePrice, formatVND } from '../../../utils/helper';

const { Text } = Typography;

export default function CartPage() {
  const navigate = useNavigate();
  
  const { data: meData, isPending: mePending, isError: meError } = useGetMe();
  const isLoggedIn = !!meData?.data;

  const { data: cartData, isPending: cartPending } = useGetCart(isLoggedIn);
  const { removeCartItems, isPending: removeLoading } = useRemoveCartItems();
  const { data: suggestionData, isPending: suggestionLoading } = useGetSuggestionProducts();

  const [isEditing, setIsEditing] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);

  const items = cartData?.data?.items ?? [];
  const suggestionProducts = suggestionData?.data ?? [];

  useEffect(() => {
    if (items.length > 0 && selectedIds.length === 0 && !cartPending) {
      setSelectedIds(items.map(i => i.productId));
    }
  }, [items.length, cartPending]);

  const selectedTotalAmount = useMemo(() => {
    return items
      .filter(item => selectedIds.includes(item.productId))
      .reduce((sum, item) => {
        const amount = item.itemTotal || (item.finalPrice * item.quantity);
        return sum + Number(amount);
      }, 0);
  }, [items, selectedIds]);

  const toggleSelect = (id) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    setSelectedIds(items.map(i => i.productId));
  };

  const handleUnselectAll = () => {
    setSelectedIds([]);
  };

  const handleDeleteSelected = () => {
    Modal.confirm({
      title: 'Xác nhận xóa',
      content: `Bạn có chắc chắn muốn xóa ${selectedIds.length} sản phẩm đã chọn?`,
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk: () => {
        removeCartItems(
          { productIds: selectedIds },
          {
            onSuccess: () => {
              message.success("Đã cập nhật giỏ hàng");
              setSelectedIds([]);
              setIsEditing(false);
            }
          }
        );
      }
    });
  };

  const { setCheckoutData } = useCheckoutStore();
  const handleCheckout = () => {
    if (selectedIds.length === 0) {
      message.info("Vui lòng chọn sản phẩm để thanh toán");
      return;
    }
    const itemsToCheckout = items
      .filter(i => selectedIds.includes(i.productId))
      .map(i => ({ productId: i.productId, quantity: i.quantity }));
    setCheckoutData(itemsToCheckout, "cart")
    navigate("/checkout", { 
      state: { source: "cart", items: itemsToCheckout } 
    });
  };

  if (mePending && !meError) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <Spin size="large" />
        <Text className="text-gray-400 animate-pulse">Đang tải thông tin giỏ hàng...</Text>
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="flex flex-col lg:flex-row items-center justify-between bg-white rounded-[40px] p-12 shadow-sm border border-gray-50 gap-10">
          <div className="flex-1 text-center lg:text-left">
            <Badge count={<ThunderboltFilled className="text-orange-500" />} offset={[-10, 10]}>
              <div className="w-20 h-20 bg-orange-50 rounded-3xl flex items-center justify-center mb-6 mx-auto lg:mx-0">
                <UserOutlined className="text-3xl text-orange-400" />
              </div>
            </Badge>
            <h2 className="text-3xl font-black text-[#5C4033] mb-4">Đăng nhập để xem giỏ hàng</h2>
            <p className="text-gray-500 text-lg mb-8 max-w-md">
              Vui lòng đăng nhập tài khoản Bếp Việt để xem lại danh sách món ngon bạn đã chọn.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button 
                type="primary" 
                size="large" 
                onClick={() => navigate('/login')}
                className="h-14 px-12 rounded-2xl bg-[#D16D2F] border-none font-black text-base shadow-lg shadow-orange-100 hover:scale-105 transition-all"
              >
                ĐĂNG NHẬP NGAY
              </Button>
            </div>
          </div>
          <div className="flex-1 flex justify-center opacity-40">
            <Empty description={false} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black text-[#5C4033] flex items-center gap-3">
            Giỏ hàng 
            <span className="text-lg font-medium text-gray-400">({items.length} sản phẩm)</span>
          </h1>
        </div>
        {items.length > 0 && (
          <Button 
            type="text" 
            onClick={() => setIsEditing(!isEditing)}
            className={`font-bold ${isEditing ? 'text-orange-500' : 'text-gray-400'}`}
          >
            {isEditing ? 'HOÀN TẤT' : 'CHỈNH SỬA'}
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-4">
          {cartPending ? (
            <div className="py-20 text-center bg-white rounded-[40px] shadow-sm"><Spin size="large" /></div>
          ) : items.length === 0 ? (
            <div className="bg-white rounded-[40px] p-20 text-center shadow-sm border border-gray-50">
              <Empty description="Giỏ hàng của bạn đang trống" />
              <Button 
                onClick={() => navigate('/explore/product')} 
                className="mt-6 rounded-full font-bold border-orange-200 text-orange-600 h-10 px-6"
              >
                TIẾP TỤC MUA SẮM
              </Button>
            </div>
          ) : (
            <div className="bg-white rounded-[40px] overflow-hidden shadow-sm border border-gray-50">
              <div className="p-6 border-b border-gray-50 bg-gray-50/30 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div 
                    className="cursor-pointer flex items-center gap-2 group" 
                    onClick={selectedIds.length === items.length ? handleUnselectAll : handleSelectAll}
                  >
                    {selectedIds.length === items.length ? (
                      <CheckCircleFilled className="text-xl text-orange-500" />
                    ) : (
                      <BorderOutlined className="text-xl text-gray-300 group-hover:text-orange-400" />
                    )}
                    <span className="font-bold text-[#5C4033] text-sm uppercase tracking-widest">
                      {selectedIds.length === items.length ? 'Bỏ chọn tất cả' : `Chọn tất cả (${items.length})`}
                    </span>
                  </div>
                </div>
              </div>
              <div className="divide-y divide-gray-50">
                {items.map((item) => (
                  <CartItemRow 
                    key={item.productId}
                    item={item}
                    isSelected={selectedIds.includes(item.productId)}
                    onSelect={() => toggleSelect(item.productId)}
                    isEditing={isEditing}
                  />
                ))}
              </div>
            </div>
          )}

          {!suggestionLoading && suggestionProducts.length > 0 && (
            <div className="mt-12">
              <div className="flex items-center gap-2 mb-6">
                <div className="bg-orange-100 p-2 rounded-xl">
                  <ThunderboltFilled className="text-orange-500 text-lg" />
                </div>
                <h2 className="text-xl font-black text-[#5C4033] m-0 uppercase">Gợi ý cho bạn</h2>
              </div>
              <Row gutter={[16, 16]}>
                {suggestionProducts.slice(0, 4).map((product) => {
                  const now = new Date();
                  const hasSale = product.salePercent && 
                                new Date(product.salePercent.startDate) <= now && 
                                new Date(product.salePercent.endDate) >= now;
                  return (
                    <Col xs={12} sm={12} md={6} key={product._id}>
                      <div 
                        onClick={() => navigate(`/explore/product-detail/${product.slug}`, { state: { productId: product._id } })}
                        className="group bg-white rounded-[30px] p-3 border border-gray-100 hover:shadow-xl transition-all h-full flex flex-col cursor-pointer relative"
                      >
                        {hasSale && (
                          <div className="absolute top-0 left-0 bg-yellow-400 text-red-700 text-[10px] font-bold px-3 py-1 rounded-br-2xl z-10">
                            -{product.salePercent.percent}%
                          </div>
                        )}
                        <div className="h-40 w-full overflow-hidden rounded-[20px] bg-gray-50 mb-3">
                          <img src={product.images} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                        </div>
                        <h3 className="text-[#5C4033] font-bold text-sm truncate px-1">{product.name}</h3>
                        <div className="px-1 mt-1">
                          <Text className="text-[#E25822] font-black">{formatVND(hasSale ? calcSalePrice(product.price, product.salePercent.percent) : product.price)}</Text>
                        </div>
                      </div>
                    </Col>
                  );
                })}
              </Row>
            </div>
          )}
        </div>

        <div className="lg:col-span-4">
          <div className="sticky top-28">
            {isEditing ? (
              <div className="bg-white rounded-[40px] p-8 shadow-xl border border-red-50">
                <h3 className="text-lg font-black text-red-800 mb-4 flex items-center gap-2"><DeleteOutlined /> Chỉnh sửa</h3>
                <p className="text-gray-400 text-sm mb-6">Đã chọn {selectedIds.length} sản phẩm.</p>
                <Button 
                  danger type="primary" block size="large"
                  disabled={selectedIds.length === 0}
                  loading={removeLoading}
                  onClick={handleDeleteSelected}
                  className="h-14 rounded-2xl font-black"
                >
                  XÓA ĐÃ CHỌN
                </Button>
              </div>
            ) : (
              <CartSummarySide 
                total={selectedTotalAmount}
                selectedCount={selectedIds.length}
                onCheckout={handleCheckout}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}