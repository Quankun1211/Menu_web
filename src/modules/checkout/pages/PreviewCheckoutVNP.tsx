import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Result, Button, Spin, Typography, Card } from 'antd';
import { 
  CheckCircleFilled, 
  CloseCircleFilled, 
  InfoCircleFilled, 
  ShoppingOutlined,
  HistoryOutlined 
} from '@ant-design/icons';
import api from '../../../services/axios';

const { Text } = Typography;

export default function PaymentCheck() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<'success' | 'error' | 'cancel' | 'loading'>('loading');

  const orderId = searchParams.get('vnp_TxnRef');

  useEffect(() => {
    let active = true;

    const verifyPayment = async () => {
      try {
        const params = Object.fromEntries(searchParams.entries());
        const response = await api.get('/order/vnpay-confirm', { params });
        if (!active) return;
        setStatus(response.data?.data?.paymentStatus === 'paid' ? 'success' : 'error');
      } catch (error: any) {
        if (!active) return;
        if (searchParams.get('vnp_ResponseCode') === '24') {
          setStatus('cancel');
          return;
        }
        const actualOrderId =
          error?.data?.orderId ||
          error?.response?.data?.data?.orderId ||
          localStorage.getItem("pending_vnpay_order_id");
        if (searchParams.get('vnp_ResponseCode') === '00' && actualOrderId) {
          try {
            const reconciliation = await api.post(`/order/vnpay-reconcile/${actualOrderId}`);
            if (!active) return;
            setStatus(
              reconciliation.data?.data?.paymentStatus === 'paid' ? 'success' : 'error',
            );
            return;
          } catch {
            // The error state below is intentional: never trust the browser callback alone.
          }
        }
        setStatus('error');
      } finally {
        if (active) {
          localStorage.removeItem("pending_vnpay_order_id");
          setLoading(false);
        }
      }
    };

    verifyPayment();
    return () => {
      active = false;
    };
  }, [orderId, searchParams]);

  if (loading) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center bg-[#fffaf5]">
        <Spin size="large" />
        <Text className="mt-6 text-[#8B5E3C] font-black uppercase tracking-widest animate-pulse">
          Đang xác thực giao dịch từ VNPay...
        </Text>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] py-12 px-4 bg-[#fffaf5] flex items-center justify-center">
      <Card className="max-w-xl w-full rounded-[40px] shadow-2xl border-none overflow-hidden">
        {status === 'success' && (
          <Result
            icon={<CheckCircleFilled className="text-[#D16D2F] text-7xl" />}
            title={<h2 className="text-3xl font-black text-[#5C4033] uppercase">Thanh toán thành công</h2>}
            subTitle={
              <div className="space-y-2">
                <p className="text-[#8B5E3C]">Cảm ơn bạn đã tin chọn sản vật vùng miền.</p>
                <div className="bg-[#faece1] p-3 rounded-xl inline-block border border-[#E8C5A8]/30">
                  <Text strong>Mã đơn hàng: </Text>
                  <Text className="text-[#D16D2F] font-bold">#VN-{orderId?.slice(-5).toUpperCase()}</Text>
                </div>
              </div>
            }
            extra={[
              <Button 
                type="primary" 
                key="home" 
                size="large"
                onClick={() => navigate('/')}
                className="bg-[#5C4033] hover:bg-[#D16D2F] border-none rounded-xl h-12 font-black uppercase text-xs tracking-widest"
              >
                Tiếp tục mua sắm <ShoppingOutlined />
              </Button>,
              <Button 
                key="orders" 
                size="large"
                onClick={() => navigate('/order/list')}
                className="border-[#D16D2F] text-[#D16D2F] rounded-xl h-12 font-black uppercase text-xs tracking-widest"
              >
                Lịch sử đơn hàng <HistoryOutlined />
              </Button>
            ]}
          />
        )}

        {status === 'cancel' && (
          <Result
            status="warning"
            icon={<InfoCircleFilled className="text-amber-500 text-7xl" />}
            title={<h2 className="text-3xl font-black text-[#5C4033] uppercase">Giao dịch đã hủy</h2>}
            subTitle="Bạn đã hủy quá trình thanh toán trên cổng VNPay."
            extra={
              <Button 
                type="primary" 
                onClick={() => navigate('/checkout')}
                className="bg-[#D16D2F] border-none rounded-xl h-12 px-10 font-black uppercase text-xs"
              >
                Thử thanh toán lại
              </Button>
            }
          />
        )}

        {status === 'error' && (
          <Result
            status="error"
            icon={<CloseCircleFilled className="text-red-500 text-7xl" />}
            title={<h2 className="text-3xl font-black text-[#5C4033] uppercase">Thanh toán thất bại</h2>}
            subTitle="Có lỗi xảy ra trong quá trình xử lý giao dịch. Vui lòng liên hệ hỗ trợ."
            extra={
              <Button 
                danger 
                type="primary" 
                onClick={() => navigate('/checkout')}
                className="rounded-xl h-12 px-10 font-black uppercase text-xs"
              >
                Quay lại giỏ hàng
              </Button>
            }
          />
        )}
      </Card>
    </div>
  );
}
