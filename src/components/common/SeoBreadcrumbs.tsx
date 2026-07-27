import { ChevronRight, Home } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const privatePrefixes = ["/cart", "/checkout", "/order", "/profile", "/favourite"];

const pageLabels: Record<string, string> = {
  "/explore/product": "Sản phẩm",
  "/explore/special": "Đặc sản",
  "/explore/menu": "Thực đơn",
  "/explore/recipe": "Công thức",
  "/sale": "Khuyến mãi",
  "/suggest": "Gợi ý món ăn",
};

const detailRoutes = [
  {
    prefix: "/explore/product-detail/",
    parent: { label: "Sản phẩm", href: "/explore/product" },
    current: "Chi tiết sản phẩm",
  },
  {
    prefix: "/explore/special-detail/",
    parent: { label: "Đặc sản", href: "/explore/special" },
    current: "Chi tiết đặc sản",
  },
  {
    prefix: "/explore/menu-detail/",
    parent: { label: "Thực đơn", href: "/explore/menu" },
    current: "Chi tiết thực đơn",
  },
  {
    prefix: "/explore/recipe-detail/",
    parent: { label: "Công thức", href: "/explore/recipe" },
    current: "Chi tiết công thức",
  },
];

export default function SeoBreadcrumbs() {
  const { pathname } = useLocation();
  if (
    pathname === "/" ||
    privatePrefixes.some((prefix) => pathname.startsWith(prefix))
  ) {
    return null;
  }

  const detailRoute = detailRoutes.find(({ prefix }) =>
    pathname.startsWith(prefix),
  );
  const crumbs = detailRoute
    ? [
        detailRoute.parent,
        { label: detailRoute.current, href: pathname },
      ]
    : [
        {
          label: pageLabels[pathname] ?? "Khám phá",
          href: pathname,
        },
      ];

  return (
    <nav aria-label="Breadcrumb" className="mb-5">
      <ol className="flex flex-wrap items-center gap-2 text-sm text-[#765746]">
        <li>
          <Link
            to="/"
            className="inline-flex items-center gap-1 font-semibold hover:text-[#D16D2F]"
          >
            <Home size={15} aria-hidden="true" /> Trang chủ
          </Link>
        </li>
        {crumbs.map((crumb, index) => {
          const isLast = index === crumbs.length - 1;
          return (
            <li key={`${crumb.href}-${index}`} className="flex items-center gap-2">
              <ChevronRight size={14} aria-hidden="true" className="opacity-50" />
              {isLast ? (
                <span aria-current="page" className="font-bold text-[#5C4033]">
                  {crumb.label}
                </span>
              ) : (
                <Link
                  to={crumb.href}
                  className="font-semibold hover:text-[#D16D2F]"
                >
                  {crumb.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
