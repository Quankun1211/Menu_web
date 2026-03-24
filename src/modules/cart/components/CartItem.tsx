import React, { useEffect, useState } from 'react';
import { 
  DeleteOutlined, 
  MinusOutlined, 
  PlusOutlined, 
  CheckCircleFilled, 
  BorderOutlined 
} from '@ant-design/icons';
import { Button, InputNumber, message, Popconfirm } from 'antd';
import { formatVND } from '../../../utils/helper';
import useRemoveCartItems from '../hooks/useRemoveCartItems';
import useUpdateCartQuantity from '../hooks/useUpdateCartQuantity';

const CartItemRow = ({ item, isEditing, isSelected, onSelect }) => {
  const { removeCartItems, isPending: removeLoading } = useRemoveCartItems();
  const { mutate: updateQuantity } = useUpdateCartQuantity();
  const [localQuantity, setLocalQuantity] = useState(item.quantity);

  useEffect(() => {
    setLocalQuantity(item.quantity);
  }, [item.quantity]);

  const discountPercent = item.sale?.percent;
  const hasDiscount = discountPercent && discountPercent > 0;

  const handleUpdateQty = (val) => {
    if (!val || val < 1) return;
    const oldQty = localQuantity;
    setLocalQuantity(val);

    updateQuantity(
      { productId: item.productId, quantity: val },
      {
        onError: () => {
          setLocalQuantity(oldQty);
          message.error('Cập nhật số lượng thất bại');
        },
      }
    );
  };

  const handleDelete = () => {
    removeCartItems(
      { productIds: [item.productId] },
      {
        onSuccess: () => message.success(`Đã xóa ${item.product.name}`),
      }
    );
  };

  return (
    <div className="flex items-center p-6 gap-6 hover:bg-gray-50/50 transition-colors group">
      <div className="cursor-pointer" onClick={onSelect}>
        {isSelected ? (
          <CheckCircleFilled className="text-2xl text-orange-500" />
        ) : (
          <BorderOutlined className="text-2xl text-gray-300 hover:text-orange-200" />
        )}
      </div>

      <div className="relative w-24 h-24 flex-shrink-0 bg-gray-100 rounded-2xl overflow-hidden border border-gray-100">
        <img 
          src={item.product.images} 
          alt={item.product.name}
          className="w-full h-full object-cover"
        />
        {hasDiscount && (
          <div className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-black px-2 py-0.5 rounded-lg shadow-sm">
            -{discountPercent}%
          </div>
        )}
      </div>

      {/* Thông tin sản phẩm */}
      <div className="flex-grow min-w-0">
        <div className="flex justify-between items-start">
          <h4 className="font-bold text-[#5C4033] text-lg truncate pr-4">
            {item.product.name}
          </h4>
          {!isEditing && (
            <Popconfirm
              title="Xóa sản phẩm?"
              onConfirm={handleDelete}
              okText="Xóa"
              cancelText="Hủy"
              okButtonProps={{ danger: true }}
            >
              <Button 
                type="text" 
                danger 
                icon={<DeleteOutlined />} 
                className="opacity-0 group-hover:opacity-100 transition-opacity"
              />
            </Popconfirm>
          )}
        </div>
        
        <p className="text-gray-400 text-sm line-through mb-1">
          {formatVND(item.product.price)}
        </p>

        <div className="flex items-center justify-between mt-2">
          <span className="text-xl font-black text-orange-600">
            {formatVND(item.finalPrice * localQuantity)}
          </span>

          <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden bg-white">
            <Button 
              type="text" 
              icon={<MinusOutlined />} 
              disabled={localQuantity <= 1}
              onClick={() => handleUpdateQty(localQuantity - 1)}
              className="border-none flex items-center justify-center hover:bg-gray-50"
            />
            <span className="px-4 font-bold text-[#5C4033] min-w-[40px] text-center border-x border-gray-100">
              {localQuantity}
            </span>
            <Button 
              type="text" 
              icon={<PlusOutlined />} 
              onClick={() => handleUpdateQty(localQuantity + 1)}
              className="border-none flex items-center justify-center hover:bg-gray-50"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItemRow;