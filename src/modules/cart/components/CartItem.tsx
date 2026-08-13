import React, { useEffect, useState } from 'react';
import {
  DeleteOutlined,
  MinusOutlined,
  PlusOutlined,
  CheckOutlined,
  StopOutlined,
} from '@ant-design/icons';
import { Button, message, Popconfirm } from 'antd';
import { formatVND } from '../../../utils/helper';

import useRemoveCartItems from '../hooks/useRemoveCartItems';
import useUpdateCartQuantity from '../hooks/useUpdateCartQuantity';

const CartItemRow = ({
  item,
  isEditing,
  isSelected,
  onSelect,
}) => {
  const isProductActive =
    item?.product?.isActive !== false;

  const {
    removeCartItems,
    isPending: removeLoading,
  } = useRemoveCartItems();

  const {
    mutate: updateQuantity,
    isPending: updateLoading,
  } = useUpdateCartQuantity();

  const [localQuantity, setLocalQuantity] =
    useState(item.quantity);

  useEffect(() => {
    setLocalQuantity(item.quantity);
  }, [item.quantity]);

  const discountPercent = item.sale?.percent;

  const hasDiscount =
    discountPercent && discountPercent > 0;

  const handleUpdateQty = val => {
    if (
      !isProductActive ||
      updateLoading ||
      !val ||
      val < 1
    ) {
      return;
    }

    const oldQty = localQuantity;

    setLocalQuantity(val);

    updateQuantity(
      {
        productId: item.productId,
        quantity: val,
      },
      {
        onError: () => {
          setLocalQuantity(oldQty);
          message.error(
            'Cập nhật số lượng thất bại'
          );
        },
      }
    );
  };

  const handleDelete = () => {
    if (removeLoading) return;

    removeCartItems(
      {
        productIds: [item.productId],
      },
      {
        onSuccess: () => {
          message.success(
            `Đã xóa ${item.product.name}`
          );
        },
      }
    );
  };

  const handleSelect = e => {
    e.stopPropagation();

    if (!isProductActive) {
      message.warning(
        'Sản phẩm không còn hoạt động và không thể thanh toán.'
      );
      return;
    }

    onSelect();
  };

  return (
    <div
      className={`
        relative flex items-center
        p-6 gap-6
        transition-colors group
        ${
          isProductActive
            ? 'hover:bg-gray-50/50'
            : 'bg-gray-100/70'
        }
      `}
    >
      <div
        className={`
          flex items-center gap-6
          flex-1 min-w-0
          ${
            !isProductActive
              ? 'opacity-50'
              : ''
          }
        `}
      >
        <button
          type="button"
          onClick={handleSelect}
          disabled={!isProductActive}
          aria-label={
            isSelected
              ? 'Bỏ chọn sản phẩm'
              : 'Chọn sản phẩm'
          }
          className={`
            flex-shrink-0
            w-8 h-8
            rounded-lg
            border-2
            flex items-center justify-center
            transition-all duration-200
            focus:outline-none

            ${
              !isProductActive
                ? `
                  cursor-not-allowed
                  bg-gray-200
                  border-gray-400
                `
                : isSelected
                  ? `
                    cursor-pointer
                    bg-orange-500
                    border-orange-500
                    shadow-md
                    shadow-orange-200
                  `
                  : `
                    cursor-pointer
                    bg-white
                    border-gray-600
                    hover:border-orange-500
                    hover:bg-orange-50
                  `
            }
          `}
        >
          {isSelected && isProductActive && (
            <CheckOutlined
              className="
                text-white
                text-sm
                font-bold
              "
            />
          )}
        </button>

        <div
          className="
            relative
            w-24 h-24
            flex-shrink-0
            bg-gray-100
            rounded-2xl
            overflow-hidden
            border border-gray-100
          "
        >
          <img
            src={item.product.images}
            alt={item.product.name}
            className="
              w-full
              h-full
              object-cover
            "
          />

          {hasDiscount &&
            isProductActive && (
              <div
                className="
                  absolute
                  top-2
                  left-2
                  bg-red-500
                  text-white
                  text-[10px]
                  font-black
                  px-2
                  py-0.5
                  rounded-lg
                  shadow-sm
                "
              >
                -{discountPercent}%
              </div>
            )}
        </div>

        <div className="flex-1 min-w-0">
          <h4
            className="
              font-bold
              text-[#5C4033]
              text-lg
              truncate
              pr-4
            "
          >
            {item.product.name}
          </h4>

          <p
            className="
              text-gray-400
              text-sm
              line-through
              mb-1
            "
          >
            {formatVND(item.product.price)}
          </p>

          <span
            className="
              text-xl
              font-black
              text-orange-600
            "
          >
            {formatVND(
              item.finalPrice * localQuantity
            )}
          </span>
        </div>
      </div>

      <div
        className="
          flex items-center
          gap-4
          flex-shrink-0
          relative
          z-30
        "
      >
        <div
          className={`
            flex items-center
            border border-gray-200
            rounded-xl
            overflow-hidden
            bg-white
            ${
              !isProductActive
                ? 'opacity-50'
                : ''
            }
          `}
        >
          <Button
            type="text"
            icon={<MinusOutlined />}
            disabled={
              !isProductActive ||
              updateLoading ||
              localQuantity <= 1
            }
            onClick={() =>
              handleUpdateQty(
                localQuantity - 1
              )
            }
            className="
              border-none
              flex items-center
              justify-center
              hover:bg-gray-50
            "
          />

          <span
            className="
              px-4
              font-bold
              text-[#5C4033]
              min-w-[40px]
              text-center
              border-x
              border-gray-100
            "
          >
            {localQuantity}
          </span>

          <Button
            type="text"
            icon={<PlusOutlined />}
            disabled={
              !isProductActive ||
              updateLoading
            }
            onClick={() =>
              handleUpdateQty(
                localQuantity + 1
              )
            }
            className="
              border-none
              flex items-center
              justify-center
              hover:bg-gray-50
            "
          />
        </div>

        <Popconfirm
          title="Xóa sản phẩm?"
          description={
            !isProductActive
              ? 'Sản phẩm này không còn hoạt động. Bạn có muốn xóa khỏi giỏ hàng?'
              : `Bạn có chắc muốn xóa "${item.product.name}" khỏi giỏ hàng?`
          }
          onConfirm={handleDelete}
          okText="Xóa"
          cancelText="Hủy"
          okButtonProps={{
            danger: true,
            loading: removeLoading,
          }}
        >
          <Button
            type="text"
            danger
            icon={
              <DeleteOutlined className="text-xl" />
            }
            disabled={removeLoading}
            aria-label="Xóa sản phẩm"
            className="
              flex items-center
              justify-center
              w-11 h-11
              rounded-xl
              text-red-500
              hover:text-red-600
              hover:bg-red-50
              border border-transparent
              hover:border-red-100
              transition-all
            "
          />
        </Popconfirm>
      </div>

      {!isProductActive && (
        <div
          className="
            absolute
            inset-0
            z-10
            flex items-center
            justify-center
            bg-gray-500/25
            backdrop-grayscale
            pointer-events-none
          "
        >
          <div
            className="
              flex items-center
              gap-2
              px-4 py-2
              rounded-xl
              bg-white/95
              border border-gray-200
              shadow-sm
            "
          >
            <StopOutlined className="text-gray-500" />

            <span
              className="
                text-sm
                font-bold
                text-gray-600
              "
            >
              Sản phẩm không còn hoạt động
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartItemRow;