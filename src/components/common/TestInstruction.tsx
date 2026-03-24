import React, { useState, useEffect } from 'react';
import { Button, Typography, Divider, Tag, Space, Tooltip } from 'antd';
import { 
  ExperimentOutlined, 
  InfoCircleOutlined, 
  CreditCardOutlined, 
  KeyOutlined,
  CloseOutlined,
  BulbOutlined
} from '@ant-design/icons';

const { Text, Paragraph } = Typography;

export default function TestInstructionsModal() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="fixed bottom-6 left-6 z-[9999] flex flex-col items-start gap-3">
      {isOpen ? (
        <div className="w-[350px] md:w-[400px] bg-white rounded-3xl shadow-2xl border border-orange-100 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="bg-orange-50 px-5 py-3 flex justify-between items-center border-b border-orange-100">
            <Space>
              <ExperimentOutlined className="text-orange-500" />
              <span className="font-black text-[#5C4033] text-xs uppercase tracking-wider">Chế độ thử nghiệm</span>
            </Space>
            <Button 
              type="text" 
              icon={<CloseOutlined className="text-gray-400" />} 
              onClick={() => setIsOpen(false)}
              size="small"
            />
          </div>

          <div className="p-5 max-h-[70vh] overflow-y-auto">
            <Paragraph className="mb-4">
              <Text strong className="text-[#5C4033]">Xin chào! Website đang trong giai đoạn thử nghiệm. </Text>
              <br />
              <Text className="text-[13px] text-gray-500">
                Mọi hành động đặt hàng/thanh toán đều là <strong>mô phỏng</strong>.
                Bên dưới là thông tin thanh toán VNPay nếu bạn dùng thử.
              </Text>
            </Paragraph>

            <Divider orientation="left" plain className="m-0 mb-3">
              <Tag color="blue" icon={<CreditCardOutlined />} className="text-[10px] m-0">VNPAY TEST INFO</Tag>
            </Divider>

            <div className="bg-blue-50/50 p-3 rounded-2xl border border-blue-100 space-y-1.5 text-[13px]">
              <div className="flex justify-between">
                <Text type="secondary">Ngân hàng:</Text>
                <Text strong>NCB</Text>
              </div>
              <div className="flex justify-between">
                <Text type="secondary">Số thẻ:</Text>
                <Text copyable strong>9704198526191432198</Text>
              </div>
              <div className="flex justify-between">
                <Text type="secondary">Chủ thẻ:</Text>
                <Text strong className="uppercase">NGUYEN VAN A</Text>
              </div>
              <div className="flex justify-between">
                <Text type="secondary">Ngày thẻ:</Text>
                <Text strong>07/15</Text>
              </div>
              <div className="flex justify-between">
                <Text type="secondary">OTP:</Text>
                <Tag color="red" icon={<KeyOutlined />} className="m-0 border-none font-bold">123456</Tag>
              </div>
            </div>

            <div className="mt-4 flex items-start gap-2 bg-amber-50 p-2.5 rounded-xl border border-amber-100">
              <InfoCircleOutlined className="text-amber-500 mt-0.5 text-[12px]" />
              <Text className="text-[11px] text-amber-700 italic leading-tight">
                Vui lòng đợi hệ thống điều hướng quay lại website sau khi thanh toán thành công tại VNPAY.
              </Text>
            </div>
            
            <Button 
              block 
              className="mt-4 rounded-xl border-orange-200 text-orange-600 font-bold hover:bg-orange-50"
              onClick={() => setIsOpen(false)}
            >
              THU NHỎ
            </Button>
          </div>
        </div>
      ) : (
        <Tooltip title="Mở hướng dẫn thử nghiệm" placement="right">
          <Button
            type="primary"
            shape="circle"
            size="large"
            icon={<BulbOutlined className="text-xl" />}
            onClick={() => setIsOpen(true)}
            className="h-14 w-14 bg-orange-600 shadow-lg shadow-orange-200 border-none animate-bounce"
          />
        </Tooltip>
      )}
    </div>
  );
}