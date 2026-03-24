import React, { useState, useRef, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  LeftOutlined, 
  EnvironmentOutlined, 
  UserOutlined, 
  PhoneOutlined, 
  SearchOutlined,
  CloseCircleFilled,
  LoadingOutlined,
  CheckCircleFilled
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
import useAddAddress from '../hooks/useAddAddress';
import debounce from 'lodash/debounce';

const GOONG_API_KEY = "AkqTvBuwzoIlNaku55keEDNlo3nPSlteAc36yRsE";

export default function AddAddressPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { source, items } = location.state || {};

  const [form] = Form.useForm();
  const { mutate: addAddress, isPending } = useAddAddress();

  const [isMapModalVisible, setIsMapModalVisible] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [loadingSearch, setLoadingSearch] = useState(false);

  const handleSave = (values: any) => {
    addAddress(
      { ...values },
      {
        onSuccess: () => {
          message.success('Đã thêm địa chỉ mới');
          navigate("/checkout/address", { state: { source, items } });
        },
        onError: (error: any) => {
          message.error(error.message || 'Thêm địa chỉ thất bại');
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

  return (
    <div className="max-w-2xl mx-auto px-4 py-10 min-h-screen">
      <div className="flex items-center gap-4 mb-8">
        <Button 
          type="text" 
          icon={<LeftOutlined />} 
          onClick={() => navigate(-1)}
          className="hover:bg-gray-100 rounded-full"
        />
        <h1 className="text-2xl font-black text-gray-800">Thêm địa chỉ mới</h1>
      </div>

      <Card className="rounded-[32px] shadow-sm border-gray-100 p-2">
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSave}
          initialValues={{ isDefault: false }}
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
                  Tìm trên bản đồ
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

          <Button 
            type="primary" 
            htmlType="submit" 
            block 
            loading={isPending}
            className="h-14 rounded-2xl bg-orange-600 hover:bg-orange-700 border-none font-black text-lg shadow-lg shadow-orange-100"
          >
            LƯU ĐỊA CHỈ
          </Button>
        </Form>
      </Card>

      <Modal
        title={<span className="font-black text-lg">Tìm kiếm địa chỉ</span>}
        open={isMapModalVisible}
        onCancel={() => setIsMapModalVisible(false)}
        footer={null}
        centered
        width={600}
        className="rounded-3xl overflow-hidden"
      >
        <div className="space-y-4 py-2">
          <Input
            prefix={<SearchOutlined className="text-gray-400" />}
            placeholder="Nhập địa chỉ của bạn để tìm nhanh..."
            value={searchText}
            onChange={onSearchChange}
            className="h-12 rounded-xl border-orange-200"
            suffix={loadingSearch ? <Spin indicator={<LoadingOutlined spin />} size="small" /> : null}
          />

          <div className="max-h-96 overflow-y-auto custom-scrollbar">
            <List
              dataSource={searchResults}
              renderItem={(item) => (
                <List.Item
                  className="cursor-pointer hover:bg-orange-50 transition-colors border-none p-4 rounded-xl"
                  onClick={() => selectPlace(item)}
                >
                  <List.Item.Meta
                    avatar={<EnvironmentOutlined className="text-orange-500 mt-1" />}
                    title={<span className="font-medium text-gray-800">{item.description}</span>}
                  />
                </List.Item>
              )}
            />
            {searchText && searchResults.length === 0 && !loadingSearch && (
              <div className="text-center py-10 text-gray-400">
                Không tìm thấy kết quả nào
              </div>
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
}