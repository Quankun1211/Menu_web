import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  LeftOutlined, 
  EnvironmentOutlined, 
  UserOutlined, 
  PhoneOutlined, 
  SearchOutlined,
  LoadingOutlined
} from '@ant-design/icons';
import { 
  Button, 
  Input, 
  Switch, 
  Form, 
  message, 
  Modal, 
  List, 
  Spin, 
  Card 
} from 'antd';
import useGetAddressDetail from "../hooks/useGetAddressDetail";
import useUpdateAddress from "../hooks/useUpdateAddress";
import debounce from 'lodash/debounce';

const GOONG_API_KEY = "AkqTvBuwzoIlNaku55keEDNlo3nPSlteAc36yRsE"; 

export default function EditAddressPage() {
  const navigate = useNavigate();
  const location = useLocation();
  
  const { source, items, id: addressId } = location.state || {};

  const [form] = Form.useForm();
  const { data: detailData, isPending: loadingDetail } = useGetAddressDetail(addressId);
  const { mutate: updateAddress, isPending: updatePending } = useUpdateAddress();

  const [isMapModalVisible, setIsMapModalVisible] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [loadingSearch, setLoadingSearch] = useState(false);

  useEffect(() => {
    if (detailData?.data) {
      form.setFieldsValue({
        name: detailData.data.name,
        phone: detailData.data.phone,
        address: detailData.data.address,
        isDefault: detailData.data.isDefault,
      });
    }
  }, [detailData, form]);

  const handleSave = (values: any) => {
    updateAddress(
      { addressId, ...values },
      {
        onSuccess: () => {
          message.success('Cập nhật địa chỉ thành công');
          navigate("/checkout/address", { state: { source, items } });
        },
        onError: (error: any) => {
          message.error(error.message || 'Cập nhật thất bại');
        },
      }
    );
  };

  const fetchSuggestions = async (input: string) => {
    if (!input) return;
    setLoadingSearch(true);
    try {
      const res = await fetch(
        `https://rsapi.goong.io/Place/AutoComplete?api_key=${GOONG_API_KEY}&input=${encodeURIComponent(input)}`
      );
      const data = await res.json();
      if (data.status === 'OK') {
        setSearchResults(data.predictions);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingSearch(false);
    }
  };

  const debouncedSearch = useCallback(debounce(fetchSuggestions, 500), []);

  const onSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchText(value);
    debouncedSearch(value);
  };

  const selectPlace = async (item: any) => {
    setLoadingSearch(true);
    try {
      const res = await fetch(
        `https://rsapi.goong.io/Place/Detail?place_id=${item.place_id}&api_key=${GOONG_API_KEY}`
      );
      const data = await res.json();
      if (data.status === 'OK') {
        form.setFieldsValue({ address: data.result.formatted_address });
        setIsMapModalVisible(false);
        setSearchText('');
        setSearchResults([]);
      }
    } catch (error) {
      message.error("Không thể lấy chi tiết địa chỉ");
    } finally {
      setLoadingSearch(false);
    }
  };

  if (loadingDetail) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <Spin indicator={<LoadingOutlined style={{ fontSize: 40 }} spin />} />
        <p className="text-gray-500 font-medium">Đang tải thông tin địa chỉ...</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10 min-h-screen">
      <div className="flex items-center gap-4 mb-8">
        <Button 
          type="text" 
          icon={<LeftOutlined />} 
          onClick={() => navigate(-1)}
          className="hover:bg-gray-100 rounded-full"
        />
        <h1 className="text-2xl font-black text-gray-800">Chỉnh sửa địa chỉ</h1>
      </div>

      <Card className="rounded-[32px] shadow-sm border-gray-100 p-2">
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSave}
          requiredMark={false}
        >
          <Form.Item
            label={<span className="font-bold text-gray-600">Họ và tên</span>}
            name="name"
            rules={[{ required: true, message: 'Vui lòng nhập tên người nhận' }]}
          >
            <Input 
              prefix={<UserOutlined className="text-orange-500" />} 
              placeholder="Nhập tên người nhận" 
              className="h-12 rounded-xl"
            />
          </Form.Item>

          <Form.Item
            label={<span className="font-bold text-gray-600">Số điện thoại</span>}
            name="phone"
            rules={[
              { required: true, message: 'Vui lòng nhập số điện thoại' },
              { pattern: /^[0-9]{10,11}$/, message: 'Số điện thoại không hợp lệ' }
            ]}
          >
            <Input 
              prefix={<PhoneOutlined className="text-orange-500" />} 
              placeholder="Nhập số điện thoại" 
              className="h-12 rounded-xl"
            />
          </Form.Item>

          <Form.Item
            label={
              <div className="flex justify-between w-full items-center">
                <span className="font-bold text-gray-600">Địa chỉ giao hàng</span>
                <Button 
                  type="link" 
                  size="small" 
                  className="text-orange-500 font-bold p-0"
                  icon={<EnvironmentOutlined />}
                  onClick={() => setIsMapModalVisible(true)}
                >
                  Thay đổi trên bản đồ
                </Button>
              </div>
            }
            name="address"
            rules={[{ required: true, message: 'Vui lòng nhập địa chỉ' }]}
          >
            <Input.TextArea 
              placeholder="Số nhà, tên đường, phường, quận..." 
              className="rounded-xl"
              rows={4}
            />
          </Form.Item>

          <div className="flex items-center justify-between bg-gray-50 p-4 rounded-2xl mb-8">
            <div>
              <p className="font-bold text-gray-800 m-0">Đặt làm mặc định</p>
              <p className="text-xs text-gray-500 m-0">Sử dụng cho các lần mua hàng sau</p>
            </div>
            <Form.Item name="isDefault" valuePropName="checked" className="m-0">
              <Switch />
            </Form.Item>
          </div>

          <div className="flex gap-4">
            <Button 
              size="large" 
              className="flex-1 h-14 rounded-2xl font-bold"
              onClick={() => navigate(-1)}
            >
              HỦY
            </Button>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={updatePending}
              className="flex-[2] h-14 rounded-2xl bg-orange-600 hover:bg-orange-700 border-none font-black text-lg shadow-lg shadow-orange-100"
            >
              LƯU THAY ĐỔI
            </Button>
          </div>
        </Form>
      </Card>

      <Modal
        title={<span className="font-black text-lg">Tìm kiếm địa chỉ mới</span>}
        open={isMapModalVisible}
        onCancel={() => setIsMapModalVisible(false)}
        footer={null}
        centered
        width={600}
      >
        <div className="space-y-4 py-2">
          <Input
            prefix={<SearchOutlined className="text-gray-400" />}
            placeholder="Nhập địa chỉ mới..."
            value={searchText}
            onChange={onSearchChange}
            className="h-12 rounded-xl border-orange-200"
            suffix={loadingSearch ? <Spin size="small" /> : null}
          />
          <div className="max-h-80 overflow-y-auto">
            <List
              dataSource={searchResults}
              renderItem={(item) => (
                <List.Item
                  className="cursor-pointer hover:bg-orange-50 p-4 rounded-xl border-none"
                  onClick={() => selectPlace(item)}
                >
                  <List.Item.Meta
                    avatar={<EnvironmentOutlined className="text-orange-500" />}
                    title={item.description}
                  />
                </List.Item>
              )}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}