import React from 'react';
import { ShoppingCartOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { Button, Divider, Tooltip } from 'antd';
import { formatVND } from '../../../utils/helper';

const CartSummarySide = ({ total, selectedCount, onCheckout }) => {
  const shippingFee = 25000;
  const grandTotal = total > 0 ? total + shippingFee : 0;

  return (
    <div className="bg-white rounded-[40px] p-8 shadow-xl border border-orange-50">
      <h3 className="text-xl font-black text-[#5C4033] mb-6">Tóm tắt đơn hàng</h3>
      
      <div className="space-y-4">
        <div className="flex justify-between text-gray-500">
          <span>Tạm tính ({selectedCount} sản phẩm)</span>
          <span className="font-bold text-[#5C4033]">{formatVND(total)}</span>
        </div>
        
        <div className="flex justify-between text-gray-500 italic">
          <div className="flex items-center gap-1">
            <span>Phí vận chuyển</span>
            <Tooltip title="Phí cố định cho mọi đơn hàng">
              <InfoCircleOutlined className="text-xs" />
            </Tooltip>
          </div>
          <span className="font-bold text-[#5C4033]">{formatVND(shippingFee)}</span>
        </div>

        <Divider className="my-6 border-gray-100" />

        <div className="flex justify-between items-end mb-8">
          <span className="font-bold text-[#5C4033] text-lg">Tổng cộng</span>
          <div className="text-right">
            <p className="text-3xl font-black text-orange-600 leading-none">
              {formatVND(grandTotal)}
            </p>
            <p className="text-[10px] text-gray-400 uppercase tracking-widest mt-2 font-bold">
              Đã bao gồm VAT
            </p>
          </div>
        </div>

        <Button 
          type="primary" 
          size="large" 
          block
          icon={<ShoppingCartOutlined />}
          disabled={selectedCount === 0}
          onClick={onCheckout}
          className="h-16 rounded-2xl bg-[#E25822] hover:bg-[#D35400] border-none font-black text-lg shadow-xl shadow-orange-100 flex items-center justify-center gap-2"
        >
          TIẾN HÀNH THANH TOÁN
        </Button>

        <p className="text-center text-gray-400 text-xs mt-4">
          Bằng cách đặt hàng, bạn đồng ý với Điều khoản dịch vụ của chúng tôi.
        </p>
      </div>
    </div>
  );
};

export default CartSummarySide;