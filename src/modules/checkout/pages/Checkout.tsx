import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CheckCircleFilled,
  CreditCardOutlined,
  EnvironmentOutlined,
  LoadingOutlined,
  LockOutlined,
  RightOutlined,
  SafetyCertificateOutlined,
  ShoppingOutlined,
  TagOutlined,
  TruckOutlined,
  WalletOutlined,
} from "@ant-design/icons";
import { Alert, Button, Divider, Radio, Skeleton, Tag, message } from "antd";
import { useQueryClient } from "@tanstack/react-query";
import useGetAddress from "../hooks/useGetAddress";
import { useCheckoutStore } from "../../../store/useCheckoutStore";
import { usePreviewCheckout } from "../hooks/usePreviewCheckout";
import { formatVND } from "../../../utils/helper";
import useCheckout from "../hooks/useCheckout";
import useGetMyCoupons from "../hooks/useGetMyCoupons";
import PromoModal from "../components/PromoModal";
import useShippingFee from "../../../hooks/useShippingFee";
import api from "../../../services/axios";

export default function CheckoutPage() {
  // Một khóa chỉ sống trong đúng phiên checkout hiện tại. Nếu tái sử dụng khóa
  // của đơn cũ, backend sẽ trả lại đơn đó theo cơ chế idempotency thay vì tạo đơn mới.
  const checkoutSessionId = useRef(crypto.randomUUID());

  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { selectedAddress, setSelectedAddress, checkoutItems, source, clearCheckout } = useCheckoutStore();
  const { data: previewRes, isPending: previewPending, isError: previewError } = usePreviewCheckout(checkoutItems);
  const { data: couponsData } = useGetMyCoupons();
  const { data: addressRes, isPending: addressPending } = useGetAddress();
  const { mutate: checkout, isPending: checkoutPending } = useCheckout();
  const {
    data: shippingFee = 0,
    isPending: shippingFeePending,
    isError: shippingFeeError,
  } = useShippingFee();

  const [paymentMethod, setPaymentMethod] = useState<"cod" | "vnpay">("cod");
  const [discountValue, setDiscountValue] = useState(0);
  const [appliedCode, setAppliedCode] = useState("");
  const [promoOpen, setPromoOpen] = useState(false);
  const [addressWarning, setAddressWarning] = useState(false);

  const addresses = addressRes?.data ?? [];
  const displayAddress = selectedAddress || addresses.find((item) => item.isDefault) || addresses[0] || null;
  const previewItems = previewRes?.data?.items ?? [];
  const subTotal = previewRes?.data?.totalAmount ?? 0;
  const finalTotal = Math.max(subTotal + shippingFee - Math.abs(discountValue), 0);
  const totalQuantity = checkoutItems.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    if (!checkoutItems.length) navigate("/cart", { replace: true });
  }, [checkoutItems, navigate]);

  useEffect(() => {
    if (!selectedAddress && displayAddress) setSelectedAddress(displayAddress);
  }, [displayAddress, selectedAddress, setSelectedAddress]);

  useEffect(() => {
    const pendingOrderId = localStorage.getItem("pending_vnpay_order_id");
    if (!pendingOrderId) return;
    api.post(`/orders/${pendingOrderId}/payment-reconciliations`)
      .then((response) => {
        localStorage.removeItem("pending_vnpay_order_id");
        queryClient.invalidateQueries({ queryKey: ["get-my-orders"] });
        queryClient.invalidateQueries({ queryKey: ["cart"] });
        if (response.data?.data?.paymentStatus === "paid") {
          message.success("Thanh toán VNPay đã được xác nhận");
          navigate("/order/list", { replace: true });
        } else {
          message.info("Giao dịch chưa hoàn tất. Bạn có thể tiếp tục thanh toán trong đơn hàng.");
        }
      })
      .catch(() => message.warning("Giao dịch đang được đối soát. Vui lòng kiểm tra trong đơn hàng."));
  }, [navigate, queryClient]);

  const placeOrder = () => {
    if (!displayAddress) {
      setAddressWarning(true);
      document.getElementById("shipping-address")?.scrollIntoView({ behavior: "smooth", block: "center" });
      message.warning("Vui lòng thêm địa chỉ nhận hàng");
      return;
    }
    setAddressWarning(false);

    checkout(
      {
        items: checkoutItems,
        address: displayAddress._id,
        couponCode: appliedCode || undefined,
        source: source === "direct" ? "buy_now" : source,
        paymentMethod,
        platform: "web",
        checkoutSessionId: checkoutSessionId.current,
      },
      {
        onSuccess: (response) => {
          if (!response?.success || !response?.data?.orderId) {
            message.error(response?.message || "Backend không trả về đơn hàng vừa tạo");
            return;
          }
          const paymentUrl = response?.data?.paymentUrl;
          if (paymentUrl) {
            if (response.data?.orderId) localStorage.setItem("pending_vnpay_order_id", response.data.orderId);
            window.location.assign(paymentUrl);
            return;
          }
          clearCheckout();
          queryClient.invalidateQueries({ queryKey: ["cart"] });
          queryClient.invalidateQueries({ queryKey: ["get-my-orders"] });
          message.success("Đặt hàng thành công");
          navigate("/order/list", { replace: true });
        },
        onError: (error: any) => {
          if (error?.code === "INSUFFICIENT_STOCK") {
            const details = error.details;
            message.warning(
              details?.availableQuantity !== undefined
                ? `${details.productName} chỉ còn ${details.availableQuantity} sản phẩm. Vui lòng cập nhật giỏ hàng.`
                : error.message,
            );
            return;
          }
          message.error(error?.message || "Không thể tạo đơn hàng. Vui lòng thử lại.");
        },
      },
    );
  };

  if (previewPending || addressPending) {
    return (
      <main className="min-h-screen bg-slate-50 py-8">
        <div className="mx-auto max-w-6xl px-4"><Skeleton active paragraph={{ rows: 14 }} /></div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 pb-28 lg:pb-12">
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Thanh toán</h1>
            <p className="mt-1 text-sm text-slate-500">Kiểm tra thông tin trước khi đặt hàng</p>
          </div>
          <div className="hidden items-center gap-2 text-xs font-medium text-slate-400 sm:flex">
            <span className="text-emerald-600"><CheckCircleFilled /> Giỏ hàng</span>
            <RightOutlined />
            <span className="text-emerald-700">Thanh toán</span>
            <RightOutlined />
            <span>Hoàn tất</span>
          </div>
        </div>
      </div>

      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-5 px-4 py-6 lg:grid-cols-[minmax(0,1fr)_380px]">
        <div className="space-y-5">
          <section id="shipping-address" className={`rounded-2xl border bg-white p-5 sm:p-6 ${addressWarning ? "border-rose-400 ring-2 ring-rose-100" : "border-slate-200"}`}>
            <div className="mb-4 flex items-center justify-between gap-3">
              <h2 className="flex items-center gap-2 text-base font-bold text-slate-800">
                <EnvironmentOutlined className="text-emerald-600" /> Địa chỉ giao hàng
              </h2>
              <Button type="link" className="p-0 font-semibold text-emerald-600" onClick={() => navigate("/checkout/address")}>
                {displayAddress ? "Thay đổi" : "Thêm địa chỉ"}
              </Button>
            </div>
            {displayAddress ? (
              <div className="flex gap-3 rounded-xl bg-emerald-50/70 p-4">
                <EnvironmentOutlined className="mt-1 text-emerald-600" />
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <strong className="text-slate-800">{displayAddress.name}</strong>
                    <span className="text-slate-300">|</span>
                    <span className="text-sm text-slate-600">{displayAddress.phone}</span>
                    {displayAddress.isDefault && <Tag color="green">Mặc định</Tag>}
                  </div>
                  <p className="mt-1.5 text-sm leading-6 text-slate-600">{displayAddress.address}</p>
                </div>
              </div>
            ) : (
              <Alert
                type="warning"
                showIcon
                message="Chưa có địa chỉ nhận hàng"
                description="Thêm địa chỉ để hệ thống có thể giao đơn hàng cho bạn."
                action={<Button size="small" onClick={() => navigate("/checkout/add-address")}>Thêm ngay</Button>}
              />
            )}
          </section>

          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 sm:px-6">
              <h2 className="flex items-center gap-2 text-base font-bold text-slate-800">
                <ShoppingOutlined className="text-emerald-600" /> Sản phẩm
              </h2>
              <span className="text-sm text-slate-500">{totalQuantity} sản phẩm</span>
            </div>
            {previewError ? (
              <Alert className="m-5" type="error" showIcon message="Không thể cập nhật giá sản phẩm" description="Vui lòng quay lại giỏ hàng và thử lại." />
            ) : (
              <div className="divide-y divide-slate-100">
                {previewItems.map((item) => (
                  <div key={item.productId} className="flex items-start gap-4 px-5 py-4 sm:px-6">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-orange-500"><ShoppingOutlined /></div>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-slate-800">{item.name}</p>
                      <p className="mt-1 text-sm text-slate-500">{formatVND(item.finalPrice)} × {item.quantity}</p>
                    </div>
                    <strong className="whitespace-nowrap text-sm text-slate-800">{formatVND(item.total)}</strong>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
            <h2 className="mb-4 flex items-center gap-2 text-base font-bold text-slate-800">
              <CreditCardOutlined className="text-emerald-600" /> Phương thức thanh toán
            </h2>
            <Radio.Group value={paymentMethod} onChange={(event) => setPaymentMethod(event.target.value)} className="w-full">
              <div className="space-y-3">
                <label className={`flex cursor-pointer items-center gap-4 rounded-xl border p-4 transition-colors ${paymentMethod === "cod" ? "border-emerald-500 bg-emerald-50/60" : "border-slate-200 hover:border-slate-300"}`}>
                  <Radio value="cod" />
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-emerald-600 shadow-sm"><WalletOutlined /></div>
                  <div className="flex-1">
                    <p className="font-semibold text-slate-800">Thanh toán khi nhận hàng</p>
                    <p className="mt-0.5 text-xs text-slate-500">Thanh toán tiền mặt cho người giao hàng</p>
                  </div>
                </label>
                <label className={`flex cursor-pointer items-center gap-4 rounded-xl border p-4 transition-colors ${paymentMethod === "vnpay" ? "border-emerald-500 bg-emerald-50/60" : "border-slate-200 hover:border-slate-300"}`}>
                  <Radio value="vnpay" />
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-blue-600 shadow-sm"><CreditCardOutlined /></div>
                  <div className="flex-1">
                    <p className="font-semibold text-slate-800">Thanh toán qua VNPay</p>
                    <p className="mt-0.5 text-xs text-slate-500">Thẻ ATM, tài khoản ngân hàng hoặc mã QR</p>
                  </div>
                </label>
              </div>
            </Radio.Group>
          </section>
        </div>

        <aside>
          <div className="sticky top-24 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <h2 className="text-lg font-bold text-slate-900">Tóm tắt đơn hàng</h2>
            <button type="button" onClick={() => setPromoOpen(true)} className="mt-5 flex w-full items-center gap-3 rounded-xl border border-dashed border-orange-300 bg-orange-50/50 p-3 text-left">
              <TagOutlined className="text-lg text-orange-500" />
              <span className="flex-1 text-sm font-semibold text-slate-700">{appliedCode ? `Mã ${appliedCode}` : "Chọn mã giảm giá"}</span>
              <RightOutlined className="text-slate-400" />
            </button>

            <div className="mt-5 space-y-3 text-sm">
              <div className="flex justify-between text-slate-500"><span>Tạm tính ({totalQuantity} sản phẩm)</span><span className="font-medium text-slate-700">{formatVND(subTotal)}</span></div>
              <div className="flex justify-between text-slate-500"><span className="flex items-center gap-1"><TruckOutlined /> Phí vận chuyển</span><span className="font-medium text-slate-700">{formatVND(shippingFee)}</span></div>
              {discountValue > 0 && <div className="flex justify-between text-emerald-600"><span>Giảm giá</span><span className="font-semibold">-{formatVND(Math.abs(discountValue))}</span></div>}
            </div>
            <Divider className="my-5" />
            <div className="flex items-end justify-between">
              <span className="font-semibold text-slate-700">Tổng thanh toán</span>
              <span className="text-2xl font-bold text-orange-600">{formatVND(finalTotal)}</span>
            </div>
            <p className="mt-2 text-right text-xs text-slate-400">Đã bao gồm phí vận chuyển</p>

            <Button
              type="primary"
              block
              size="large"
              icon={checkoutPending ? <LoadingOutlined /> : paymentMethod === "vnpay" ? <LockOutlined /> : undefined}
              disabled={previewError || shippingFeePending || shippingFeeError || !checkoutItems.length}
              loading={checkoutPending}
              className="mt-6 h-13 rounded-xl bg-orange-600 text-base font-bold shadow-lg shadow-orange-100"
              onClick={placeOrder}
            >
              {paymentMethod === "vnpay" ? `Thanh toán ${formatVND(finalTotal)}` : "Đặt hàng"}
            </Button>
            <div className="mt-4 flex items-start gap-2 text-xs leading-5 text-slate-400">
              <SafetyCertificateOutlined className="mt-0.5 text-emerald-500" />
              Thông tin cá nhân và thanh toán của bạn được bảo vệ trong suốt quá trình đặt hàng.
            </div>
          </div>
        </aside>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-slate-200 bg-white p-3 lg:hidden">
        <div className="mx-auto flex max-w-6xl items-center gap-4">
          <div className="min-w-0 flex-1">
            <p className="text-xs text-slate-500">Tổng thanh toán</p>
            <p className="truncate text-lg font-bold text-orange-600">{formatVND(finalTotal)}</p>
          </div>
          <Button type="primary" loading={checkoutPending} disabled={previewError || shippingFeePending || shippingFeeError || !checkoutItems.length} className="h-12 rounded-xl bg-orange-600 px-6 font-bold" onClick={placeOrder}>
            {paymentMethod === "vnpay" ? "Thanh toán" : "Đặt hàng"}
          </Button>
        </div>
      </div>

      <PromoModal
        isVisible={promoOpen}
        onClose={() => setPromoOpen(false)}
        onApply={(discount, code) => {
          setDiscountValue(discount);
          setAppliedCode(code);
          setPromoOpen(false);
        }}
        totalAmount={subTotal}
        items={checkoutItems}
        userCoupons={couponsData?.data || []}
      />
    </main>
  );
}
