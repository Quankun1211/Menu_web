import { useLocation } from "react-router-dom";
import PageMeta from "./PageMeta";

const privatePrefixes = [
  "/cart", "/checkout", "/order", "/profile", "/favourite",
  "/account", "/login", "/register", "/forgot-password", "/change-password", "/verify",
  "/suggest",
];

const routeMeta = [
  {
    match: (path: string) => path === "/explore/product",
    title: "Thực phẩm Việt theo vùng miền | Bếp Việt",
    description: "Mua rau củ, gạo, gia vị, thịt và thủy hải sản Việt có nguồn gốc rõ ràng, giá minh bạch và giao hàng thuận tiện.",
  },
  {
    match: (path: string) => path === "/explore/special",
    title: "Đặc sản Việt Nam ba miền | Bếp Việt",
    description: "Khám phá và đặt mua đặc sản miền Bắc, miền Trung, miền Nam được tuyển chọn với thông tin nguồn gốc rõ ràng.",
  },
  {
    match: (path: string) => path === "/explore/menu",
    title: "Thực đơn món Việt cho gia đình | Bếp Việt",
    description: "Gợi ý thực đơn gia đình, thực đơn vùng miền và tiệc Việt kèm công thức, nguyên liệu cùng chi phí dự kiến.",
  },
  {
    match: (path: string) => path === "/explore/recipe",
    title: "Công thức nấu món Việt chuẩn vị | Bếp Việt",
    description: "Học nấu món Việt với nguyên liệu, định lượng, thời gian, khẩu phần và hướng dẫn từng bước dễ thực hiện.",
  },
  {
    match: (path: string) => path === "/sale",
    title: "Khuyến mãi thực phẩm và đặc sản Việt | Bếp Việt",
    description: "Cập nhật ưu đãi thực phẩm, nguyên liệu và đặc sản Việt đang diễn ra tại Bếp Việt.",
  },
  {
    match: (path: string) => path.includes("/product-detail/"),
    title: "Chi tiết thực phẩm Việt | Bếp Việt",
    description: "Xem giá bán, nguồn gốc, dinh dưỡng và hướng dẫn sử dụng sản phẩm tại Bếp Việt.",
  },
  {
    match: (path: string) => path.includes("/special-detail/"),
    title: "Chi tiết đặc sản Việt | Bếp Việt",
    description: "Tìm hiểu nguồn gốc, câu chuyện, giá bán và cách thưởng thức đặc sản Việt tại Bếp Việt.",
  },
  {
    match: (path: string) => path.includes("/menu-detail/"),
    title: "Chi tiết thực đơn món Việt | Bếp Việt",
    description: "Xem danh sách món, công thức, nguyên liệu và chi phí dự kiến cho một thực đơn Việt hoàn chỉnh.",
  },
  {
    match: (path: string) => path.includes("/recipe-detail/"),
    title: "Chi tiết công thức món Việt | Bếp Việt",
    description: "Xem nguyên liệu, định lượng và hướng dẫn từng bước để hoàn thành món Việt tại nhà.",
  },
];

export default function RouteSeo() {
  const { pathname } = useLocation();
  const isPrivate = privatePrefixes.some((prefix) => pathname.startsWith(prefix));
  const meta = routeMeta.find((item) => item.match(pathname));

  if (pathname === "/") return null;

  return (
    <PageMeta
      title={meta?.title || "Bếp Việt | Ẩm thực Việt Nam"}
      description={meta?.description || "Khám phá thực phẩm, đặc sản, thực đơn và công thức món Việt tại Bếp Việt."}
      canonicalPath={pathname}
      indexable={!isPrivate}
    />
  );
}
