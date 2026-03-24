import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { 
  PlusOutlined, 
  EditOutlined, 
  CheckCircleFilled, 
  LeftOutlined, 
  EnvironmentOutlined 
} from "@ant-design/icons";
import { Button, Spin, Tag } from "antd";
import { useCheckoutStore } from "../../../store/useCheckoutStore";
import useGetAddress from "../hooks/useGetAddress";

export default function AddressListManagement() {
  const navigate = useNavigate();
  const location = useLocation();
  
  const { source, items } = location.state || {};

  const { data, isPending } = useGetAddress();
  const addresses = data?.data ?? [];
  const { selectedAddress, setSelectedAddress } = useCheckoutStore();

  const [tempSelectedId, setTempSelectedId] = useState(selectedAddress?._id || null);

  const handleConfirm = () => {
    const finalAddress = addresses.find(a => a._id === tempSelectedId);
    if (finalAddress) {
      setSelectedAddress(finalAddress);
    }
    navigate("/checkout", { state: { source, items } }); 
  };

  const goToEdit = (id: string) => {
    navigate(`/checkout/edit-address`, { state: { source, items, id } });
  };

  const goToAdd = () => {
    navigate("/checkout/add-address", { state: { source, items } });
  };

  if (isPending) return <div className="flex justify-center py-20"><Spin size="large" /></div>;

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 min-h-screen">
      <div className="flex items-center gap-4 mb-8">
        <Button type="text" icon={<LeftOutlined />} onClick={() => navigate(-1)} />
        <h1 className="text-2xl font-black flex items-center gap-2">
          <EnvironmentOutlined className="text-orange-500" /> Địa chỉ nhận hàng
        </h1>
      </div>

      <div className="space-y-4 mb-32">
        {addresses.length > 0 ? (
          addresses.map((item) => (
            <div 
              key={item._id} 
              onClick={() => setTempSelectedId(item._id)}
              className={`p-6 rounded-[24px] border-2 cursor-pointer transition-all relative group ${
                tempSelectedId === item._id 
                ? 'border-orange-500 bg-orange-50/30' 
                : 'border-gray-100 bg-white hover:border-orange-200 shadow-sm'
              }`}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2 font-bold text-lg">
                    {item.name} | {item.phone}
                    {item.isDefault && <Tag color="orange" className="ml-2 border-none font-bold uppercase text-[10px]">Mặc định</Tag>}
                  </div>
                  <p className="text-gray-500 text-sm leading-relaxed">{item.address}</p>
                </div>
                
                <div className="flex items-center gap-4">
                  <Button 
                    type="text" 
                    icon={<EditOutlined className="text-gray-400 group-hover:text-orange-500" />}
                    onClick={(e) => {
                      e.stopPropagation();
                      goToEdit(item._id);
                    }}
                  />
                  <div className={`text-2xl ${tempSelectedId === item._id ? 'text-orange-500' : 'text-gray-200'}`}>
                    <CheckCircleFilled />
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-[32px] border-2 border-dashed border-gray-200 text-gray-400">
            Chưa có địa chỉ nào được lưu
          </div>
        )}

        <Button 
          type="dashed" 
          block 
          size="large" 
          icon={<PlusOutlined />} 
          className="h-16 rounded-[24px] border-2 font-bold text-gray-600 hover:text-orange-500 hover:border-orange-500"
          onClick={goToAdd}
        >
          Thêm địa chỉ mới
        </Button>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md p-6 border-t z-50">
        <div className="max-w-3xl mx-auto flex gap-4">
          <Button 
            size="large" 
            className="flex-1 h-14 rounded-2xl font-bold border-gray-200" 
            onClick={() => navigate(-1)}
          >
            HỦY
          </Button>
          <Button 
            type="primary" 
            size="large" 
            className={`flex-[2] h-14 rounded-2xl font-black border-none shadow-lg transition-all ${
              tempSelectedId ? 'bg-orange-600 shadow-orange-100' : 'bg-gray-300'
            }`}
            disabled={!tempSelectedId} 
            onClick={handleConfirm}
          >
            XÁC NHẬN ĐỊA CHỈ
          </Button>
        </div>
      </div>
    </div>
  );
}