import { useState } from "react";
import { HeartFilled, HeartOutlined, LoadingOutlined } from "@ant-design/icons";
import { message, Tooltip } from "antd";
import useAddToWishList from "../../modules/profile/hooks/useAddToWishList";
import { useAppStore } from "../../store/app.store";

export default function FavoriteButton({ productId, className = "", label = false }) {
  const userData = useAppStore((state) => state.userData);
  const { mutate: addToFavourite, isPending } = useAddToWishList();
  const [isSaved, setIsSaved] = useState(false);

  const handleClick = (event) => {
    event.stopPropagation();
    if (!userData) {
      message.warning("Vui lòng đăng nhập để lưu sản phẩm yêu thích!");
      return;
    }

    addToFavourite({ productId }, {
      onSuccess: () => {
        setIsSaved(true);
        message.success("Đã lưu vào danh sách yêu thích!");
      },
      onError: () => message.error("Không thể lưu sản phẩm yêu thích!"),
    });
  };

  return (
    <Tooltip title="Thêm vào yêu thích">
      <button
        type="button"
        aria-label="Thêm vào danh sách yêu thích"
        disabled={isPending}
        onClick={handleClick}
        className={`inline-flex min-h-10 min-w-10 items-center justify-center gap-2 rounded-full border border-red-100 bg-white text-red-500 shadow-md transition hover:border-red-200 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60 ${className}`}
      >
        {isPending ? <LoadingOutlined /> : isSaved ? <HeartFilled /> : <HeartOutlined />}
        {label && <span>Yêu thích</span>}
      </button>
    </Tooltip>
  );
}
