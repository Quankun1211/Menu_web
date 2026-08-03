import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeftOutlined,
  CheckCircleFilled,
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  StarFilled,
} from "@ant-design/icons";
import { Button, Empty, Modal, Skeleton, Tag, message } from "antd";
import { useCheckoutStore } from "../../../store/useCheckoutStore";
import useGetAddress from "../hooks/useGetAddress";
import { useDeleteAddress, useSetDefaultAddress } from "../hooks/useAddressActions";

export default function AddressListManagement() {
  const navigate = useNavigate();
  const { data, isPending } = useGetAddress();
  const addresses = data?.data ?? [];
  const { selectedAddress, setSelectedAddress } = useCheckoutStore();
  const [selectedId, setSelectedId] = useState<string | null>(selectedAddress?._id || null);
  const deleteAddress = useDeleteAddress();
  const setDefault = useSetDefaultAddress();

  useEffect(() => {
    if (!selectedId && addresses.length) {
      setSelectedId((addresses.find((item) => item.isDefault) || addresses[0])._id);
    }
  }, [addresses, selectedId]);

  const confirmSelection = () => {
    const address = addresses.find((item) => item._id === selectedId);
    if (!address) return;
    setSelectedAddress(address);
    navigate("/checkout");
  };

  const handleDelete = (id: string) => {
    Modal.confirm({
      title: "Xóa địa chỉ này?",
      content: "Địa chỉ đã xóa sẽ không thể khôi phục.",
      okText: "Xóa địa chỉ",
      cancelText: "Giữ lại",
      okButtonProps: { danger: true },
      centered: true,
      onOk: () =>
        deleteAddress.mutateAsync(id).then(() => {
          if (selectedId === id) {
            setSelectedId(null);
            setSelectedAddress(null);
          }
          message.success("Đã xóa địa chỉ");
        }),
    });
  };

  const handleDefault = (id: string) => {
    setDefault.mutate(id, {
      onSuccess: () => message.success("Đã đặt làm địa chỉ mặc định"),
      onError: () => message.error("Không thể cập nhật địa chỉ mặc định"),
    });
  };

  return (
    <main className="min-h-screen bg-slate-50 py-6 sm:py-10">
      <div className="mx-auto max-w-3xl px-4">
        <div className="mb-6 flex items-center gap-3">
          <Button type="text" shape="circle" icon={<ArrowLeftOutlined />} onClick={() => navigate("/checkout")} />
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Địa chỉ nhận hàng</h1>
            <p className="mt-1 text-sm text-slate-500">Chọn nơi bạn muốn nhận đơn hàng</p>
          </div>
        </div>

        {isPending ? (
          <div className="rounded-2xl bg-white p-6"><Skeleton active paragraph={{ rows: 7 }} /></div>
        ) : (
          <div className="space-y-3 pb-28">
            {addresses.map((item) => {
              const active = selectedId === item._id;
              return (
                <article
                  key={item._id}
                  onClick={() => setSelectedId(item._id)}
                  className={`cursor-pointer rounded-2xl border bg-white p-4 transition-all sm:p-5 ${
                    active ? "border-emerald-500 ring-2 ring-emerald-100" : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <div className="flex gap-3">
                    <div className={`mt-0.5 text-xl ${active ? "text-emerald-600" : "text-slate-300"}`}>
                      <CheckCircleFilled />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <strong className="text-slate-800">{item.name}</strong>
                        <span className="text-slate-300">|</span>
                        <span className="text-sm text-slate-600">{item.phone}</span>
                        {item.isDefault && <Tag color="green">Mặc định</Tag>}
                      </div>
                      <p className="mt-2 text-sm leading-6 text-slate-500">{item.address}</p>
                      <div className="mt-3 flex flex-wrap items-center gap-1" onClick={(event) => event.stopPropagation()}>
                        <Button type="link" size="small" icon={<EditOutlined />} onClick={() => navigate("/checkout/edit-address", { state: { id: item._id } })}>
                          Chỉnh sửa
                        </Button>
                        {!item.isDefault && (
                          <Button type="link" size="small" icon={<StarFilled />} loading={setDefault.isPending} onClick={() => handleDefault(item._id)}>
                            Đặt mặc định
                          </Button>
                        )}
                        <Button danger type="link" size="small" icon={<DeleteOutlined />} loading={deleteAddress.isPending} onClick={() => handleDelete(item._id)}>
                          Xóa
                        </Button>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}

            {!addresses.length && (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-white py-12">
                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Bạn chưa lưu địa chỉ nhận hàng" />
              </div>
            )}

            <Button
              block
              size="large"
              icon={<PlusOutlined />}
              className="h-14 rounded-xl border-dashed font-semibold"
              onClick={() => navigate("/checkout/add-address")}
            >
              Thêm địa chỉ mới
            </Button>
          </div>
        )}
      </div>

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-slate-200 bg-white/95 p-4 backdrop-blur">
        <div className="mx-auto flex max-w-3xl gap-3">
          <Button size="large" className="h-12 flex-1 rounded-xl" onClick={() => navigate("/checkout")}>Quay lại</Button>
          <Button type="primary" size="large" disabled={!selectedId} className="h-12 flex-[2] rounded-xl bg-emerald-600 font-semibold" onClick={confirmSelection}>
            Giao đến địa chỉ này
          </Button>
        </div>
      </div>
    </main>
  );
}
