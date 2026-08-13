import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  DeleteOutlined,
  CheckOutlined,
  UserOutlined,
  ThunderboltFilled,
} from '@ant-design/icons';
import {
  Button,
  Spin,
  Empty,
  message,
  Modal,
  Row,
  Col,
  Typography,
  Badge,
} from 'antd';

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

  const {
    data: meData,
    isPending: mePending,
    isError: meError,
  } = useGetMe();

  const isLoggedIn = !!meData?.data;

  const {
    data: cartData,
    isPending: cartPending,
  } = useGetCart(isLoggedIn);

  const {
    removeCartItems,
    isPending: removeLoading,
  } = useRemoveCartItems();

  const {
    data: suggestionData,
    isPending: suggestionLoading,
  } = useGetSuggestionProducts();

  const [isEditing, setIsEditing] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);

  const items = cartData?.data?.items ?? [];
  const suggestionProducts = suggestionData?.data ?? [];

  /**
   * Có sản phẩm inactive trong giỏ hay không.
   *
   * Giữ nguyên logic này để khóa thanh toán
   * nếu trong giỏ còn bất kỳ sản phẩm inactive nào.
   */
  const hasInactiveProduct = items.some(
    item => item?.product?.isActive === false
  );

  /**
   * Danh sách sản phẩm còn hoạt động
   */
  const activeItems = useMemo(() => {
    return items.filter(
      item => item?.product?.isActive !== false
    );
  }, [items]);

  /**
   * Mặc định chọn toàn bộ sản phẩm ACTIVE.
   *
   * Không chọn sản phẩm inactive.
   */
  useEffect(() => {
    if (cartPending) return;

    if (items.length === 0) {
      setSelectedIds([]);
      return;
    }

    setSelectedIds(
      activeItems.map(item => item.productId)
    );
  }, [cartPending, items.length]);

  /**
   * Tổng tiền của các sản phẩm được chọn
   */
  const selectedTotalAmount = useMemo(() => {
    return items
      .filter(item =>
        selectedIds.includes(item.productId)
      )
      .reduce((sum, item) => {
        const amount =
          item.itemTotal ||
          item.finalPrice * item.quantity;

        return sum + Number(amount);
      }, 0);
  }, [items, selectedIds]);

  /**
   * Chọn / bỏ chọn một sản phẩm
   */
  const toggleSelect = id => {
    const item = items.find(
      product => product.productId === id
    );

    if (!item) return;

    /**
     * Không cho chọn inactive
     */
    if (item?.product?.isActive === false) {
      message.warning(
        'Sản phẩm không còn hoạt động và không thể thanh toán.'
      );
      return;
    }

    setSelectedIds(prev =>
      prev.includes(id)
        ? prev.filter(itemId => itemId !== id)
        : [...prev, id]
    );
  };

  /**
   * Chọn tất cả sản phẩm ACTIVE
   */
  const handleSelectAll = () => {
    setSelectedIds(
      activeItems.map(item => item.productId)
    );
  };

  /**
   * Bỏ chọn tất cả
   */
  const handleUnselectAll = () => {
    setSelectedIds([]);
  };

  /**
   * Xóa các sản phẩm đã chọn
   */
  const handleDeleteSelected = () => {
    if (selectedIds.length === 0) {
      message.info('Vui lòng chọn sản phẩm cần xóa');
      return;
    }

    Modal.confirm({
      title: 'Xác nhận xóa',
      content: `Bạn có chắc chắn muốn xóa ${selectedIds.length} sản phẩm đã chọn?`,
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',

      onOk: () => {
        removeCartItems(
          {
            productIds: selectedIds,
          },
          {
            onSuccess: () => {
              message.success('Đã cập nhật giỏ hàng');
              setSelectedIds([]);
              setIsEditing(false);
            },
          }
        );
      },
    });
  };

  const { setCheckoutData } = useCheckoutStore();

  /**
   * Thanh toán các sản phẩm được chọn
   */
  const handleCheckout = () => {
    if (selectedIds.length === 0) {
      message.info(
        'Vui lòng chọn sản phẩm để thanh toán'
      );
      return;
    }

    /**
     * Giữ nguyên business rule:
     * nếu giỏ còn inactive product thì không cho thanh toán.
     */
    if (hasInactiveProduct) {
      message.warning(
        'Vui lòng xóa sản phẩm không còn hoạt động trước khi thanh toán.'
      );
      return;
    }

    const itemsToCheckout = items
      .filter(item =>
        selectedIds.includes(item.productId)
      )
      .map(item => ({
        productId: item.productId,
        quantity: item.quantity,
      }));

    setCheckoutData(
      itemsToCheckout,
      'cart'
    );

    navigate('/checkout', {
      state: {
        source: 'cart',
        items: itemsToCheckout,
      },
    });
  };

  if (mePending && !meError) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <Spin size="large" />

        <Text className="text-gray-400 animate-pulse">
          Đang tải thông tin giỏ hàng...
        </Text>
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="flex flex-col lg:flex-row items-center justify-between bg-white rounded-[40px] p-12 shadow-sm border border-gray-50 gap-10">

          <div className="flex-1 text-center lg:text-left">

            <Badge
              count={
                <ThunderboltFilled className="text-orange-500" />
              }
              offset={[-10, 10]}
            >
              <div className="w-20 h-20 bg-orange-50 rounded-3xl flex items-center justify-center mb-6 mx-auto lg:mx-0">
                <UserOutlined className="text-3xl text-orange-400" />
              </div>
            </Badge>

            <h2 className="text-3xl font-black text-[#5C4033] mb-4">
              Đăng nhập để xem giỏ hàng
            </h2>

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

  const allActiveSelected =
    activeItems.length > 0 &&
    activeItems.every(item =>
      selectedIds.includes(item.productId)
    );

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">

      {/* HEADER */}
      <div className="flex items-center justify-between mb-8">

        <div>
          <h1 className="text-3xl font-black text-[#5C4033] flex items-center gap-3">
            Giỏ hàng

            <span className="text-lg font-medium text-gray-400">
              ({items.length} sản phẩm)
            </span>
          </h1>
        </div>

        {/* CHỈNH SỬA */}
        {items.length > 0 && (
          <Button
            type="text"
            onClick={() =>
              setIsEditing(prev => !prev)
            }
            className={`font-bold ${
              isEditing
                ? 'text-orange-500'
                : 'text-gray-400'
            }`}
          >
            {isEditing
              ? 'HOÀN TẤT'
              : 'CHỈNH SỬA'}
          </Button>
        )}

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* CART */}
        <div className="lg:col-span-8 space-y-4">

          {cartPending ? (

            <div className="py-20 text-center bg-white rounded-[40px] shadow-sm">
              <Spin size="large" />
            </div>

          ) : items.length === 0 ? (

            <div className="bg-white rounded-[40px] p-20 text-center shadow-sm border border-gray-50">

              <Empty description="Giỏ hàng của bạn đang trống" />

              <Button
                onClick={() =>
                  navigate('/explore/product')
                }
                className="mt-6 rounded-full font-bold border-orange-200 text-orange-600 h-10 px-6"
              >
                TIẾP TỤC MUA SẮM
              </Button>

            </div>

          ) : (

            <div className="bg-white rounded-[40px] overflow-hidden shadow-sm border border-gray-50">

              {/* SELECT ALL */}
              <div className="p-6 border-b border-gray-50 bg-gray-50/30 flex items-center justify-between">

                <button
                  type="button"
                  className="flex items-center gap-3 cursor-pointer group bg-transparent border-none p-0"
                  onClick={
                    allActiveSelected
                      ? handleUnselectAll
                      : handleSelectAll
                  }
                >

                  <span
                    className={`
                      w-7 h-7
                      rounded-lg
                      border-2
                      flex items-center justify-center
                      transition-all duration-200
                      ${
                        allActiveSelected
                          ? 'bg-orange-500 border-orange-500 shadow-md shadow-orange-200'
                          : 'bg-white border-gray-500 group-hover:border-orange-500 group-hover:bg-orange-50'
                      }
                    `}
                  >
                    {allActiveSelected && (
                      <CheckOutlined className="text-white text-sm font-bold" />
                    )}
                  </span>

                  <span className="font-bold text-[#5C4033] text-sm uppercase tracking-widest">
                    {allActiveSelected
                      ? 'Bỏ chọn tất cả'
                      : `Chọn tất cả (${activeItems.length})`}
                  </span>

                </button>

                <span className="text-sm text-gray-400">
                  Đã chọn{' '}
                  <strong className="text-orange-500">
                    {selectedIds.length}
                  </strong>{' '}
                  sản phẩm
                </span>

              </div>

              {/* ITEMS */}
              <div className="divide-y divide-gray-50">

                {items.map(item => (
                  <CartItemRow
                    key={item.productId}
                    item={item}
                    isSelected={selectedIds.includes(
                      item.productId
                    )}
                    onSelect={() =>
                      toggleSelect(item.productId)
                    }
                    isEditing={isEditing}
                  />
                ))}

              </div>

            </div>
          )}

          {/* SUGGESTIONS */}
          {!suggestionLoading &&
            suggestionProducts.length > 0 && (

              <div className="mt-12">

                <div className="flex items-center gap-2 mb-6">

                  <div className="bg-orange-100 p-2 rounded-xl">
                    <ThunderboltFilled className="text-orange-500 text-lg" />
                  </div>

                  <h2 className="text-xl font-black text-[#5C4033] m-0 uppercase">
                    Gợi ý cho bạn
                  </h2>

                </div>

                <Row gutter={[16, 16]}>

                  {suggestionProducts
                    .slice(0, 4)
                    .map(product => {

                      const now = new Date();

                      const hasSale =
                        product.salePercent &&
                        new Date(
                          product.salePercent.startDate
                        ) <= now &&
                        new Date(
                          product.salePercent.endDate
                        ) >= now;

                      return (
                        <Col
                          xs={12}
                          sm={12}
                          md={6}
                          key={product._id}
                        >

                          <div
                            onClick={() =>
                              navigate(
                                `/explore/product-detail/${product.slug}`,
                                {
                                  state: {
                                    productId:
                                      product._id,
                                  },
                                }
                              )
                            }
                            className="group bg-white rounded-[30px] p-3 border border-gray-100 hover:shadow-xl transition-all h-full flex flex-col cursor-pointer relative"
                          >

                            {hasSale && (
                              <div className="absolute top-0 left-0 bg-yellow-400 text-red-700 text-[10px] font-bold px-3 py-1 rounded-br-2xl z-10">
                                -{product.salePercent.percent}%
                              </div>
                            )}

                            <div className="h-40 w-full overflow-hidden rounded-[20px] bg-gray-50 mb-3">
                              <img
                                src={product.images}
                                alt={product.name}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                              />
                            </div>

                            <h3 className="text-[#5C4033] font-bold text-sm truncate px-1">
                              {product.name}
                            </h3>

                            <div className="px-1 mt-1">
                              <Text className="text-[#E25822] font-black">
                                {formatVND(
                                  hasSale
                                    ? calcSalePrice(
                                        product.price,
                                        product.salePercent.percent
                                      )
                                    : product.price
                                )}
                              </Text>
                            </div>

                          </div>

                        </Col>
                      );
                    })}

                </Row>

              </div>
            )}

        </div>

        {/* SUMMARY */}
        <div className="lg:col-span-4">

          <div className="sticky top-28">

            {isEditing ? (

              <div className="bg-white rounded-[40px] p-8 shadow-xl border border-red-50">

                <h3 className="text-lg font-black text-red-800 mb-4 flex items-center gap-2">
                  <DeleteOutlined />
                  Chỉnh sửa
                </h3>

                <p className="text-gray-400 text-sm mb-6">
                  Đã chọn {selectedIds.length} sản phẩm.
                </p>

                <Button
                  danger
                  type="primary"
                  block
                  size="large"
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
                hasInactiveProduct={hasInactiveProduct}
                onCheckout={handleCheckout}
              />

            )}

          </div>

        </div>

      </div>

    </div>
  );
}