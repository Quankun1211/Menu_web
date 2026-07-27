import { Link } from "react-router-dom";
import PageMeta from "./PageMeta";

export default function NotFound() {
  return (
    <section className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center px-6 text-center">
      <PageMeta title="Không tìm thấy trang | Bếp Việt" description="Trang bạn tìm kiếm không tồn tại." indexable={false} />
      <p className="text-sm font-bold uppercase tracking-[0.3em] text-orange-600">Lỗi 404</p>
      <h1 className="mt-3 text-4xl font-black text-[#5C4033]">Không tìm thấy trang</h1>
      <p className="mt-4 text-slate-600">Đường dẫn có thể đã thay đổi hoặc nội dung không còn tồn tại.</p>
      <Link to="/" className="mt-8 rounded-full bg-orange-600 px-6 py-3 font-bold text-white hover:bg-orange-700">
        Về trang chủ
      </Link>
    </section>
  );
}
