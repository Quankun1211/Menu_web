import { Link } from 'react-router-dom';
import { ArrowRight, BadgeCheck, BookOpen, MapPin, ShoppingBasket, Sparkles } from 'lucide-react';
import LatestProduct from '../components/LatestProduct';
import CategorySection from './CategorySection';
import RegionSection from './RegionSection';
import PopularSection from './PopularSection';
import DiscountProducts from './DiscountProducts';
import ProductSuggestion from '../components/ProductSuggestion';
import PageMeta from '../../../components/common/PageMeta';

export default function HomePage() {
  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  const title = 'Bếp Việt | Thực phẩm, đặc sản và công thức món Việt';
  const description = 'Khám phá thực phẩm Việt có nguồn gốc rõ ràng, đặc sản ba miền, thực đơn gia đình và công thức nấu món Việt chuẩn vị tại Bếp Việt.';
  const structuredData = [
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      '@id': `${origin}/#website`,
      url: `${origin}/`,
      name: 'Bếp Việt',
      alternateName: 'Bep Viet',
      inLanguage: 'vi-VN',
      description,
    },
    {
      '@context': 'https://schema.org',
      '@type': 'OnlineStore',
      '@id': `${origin}/#organization`,
      name: 'Bếp Việt',
      url: `${origin}/`,
      logo: `${origin}/chatavt.png`,
      image: `${origin}/chatavt.png`,
      description,
      areaServed: { '@type': 'Country', name: 'Việt Nam' },
    },
  ];

  return (
    <>
      <PageMeta
        title={title}
        description={description}
        canonicalPath="/"
        structuredData={structuredData}
      />

      <div className="min-h-screen pb-20">
        <section aria-labelledby="home-heading" className="relative overflow-hidden bg-[#5C4033] text-white">
          <div className="absolute -right-28 -top-28 h-96 w-96 rounded-full bg-[#D16D2F]/30 blur-3xl" />
          <div className="absolute -bottom-40 left-1/3 h-80 w-80 rounded-full bg-[#E8C5A8]/20 blur-3xl" />

          <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-14 md:px-8 md:py-20 lg:grid-cols-[1.35fr_0.65fr] lg:items-center">
            <div className="max-w-3xl">
              <p className="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-[0.22em] text-[#F4C7A5]">
                <Sparkles size={18} aria-hidden="true" />
                Gian bếp Việt trong mỗi gia đình
              </p>
              <h1 id="home-heading" className="text-4xl font-black leading-tight md:text-6xl">
                Thực phẩm Việt, đặc sản ba miền và công thức chuẩn vị
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-8 text-white/80 md:text-lg">
                Chọn nguyên liệu có nguồn gốc rõ ràng, khám phá sản vật địa phương
                và chuẩn bị bữa cơm Việt với công thức, định lượng cùng hướng dẫn chi tiết.
              </p>

              <nav aria-label="Khám phá nội dung chính" className="mt-8 flex flex-wrap gap-3">
                <Link
                  to="/explore/product?categoryId=all"
                  className="inline-flex items-center gap-2 rounded-full bg-[#D16D2F] px-6 py-3 font-bold text-white shadow-lg transition hover:bg-[#b95b27]"
                >
                  Mua thực phẩm Việt <ArrowRight size={18} aria-hidden="true" />
                </Link>
                <Link
                  to="/explore/recipe"
                  className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-6 py-3 font-bold text-white backdrop-blur transition hover:bg-white/20"
                >
                  Xem công thức nấu ăn <BookOpen size={18} aria-hidden="true" />
                </Link>
              </nav>

              <ul className="mt-8 grid gap-3 text-sm text-white/80 sm:grid-cols-3">
                <li className="flex items-center gap-2"><BadgeCheck size={18} aria-hidden="true" /> Nguồn gốc minh bạch</li>
                <li className="flex items-center gap-2"><MapPin size={18} aria-hidden="true" /> Sản vật ba miền</li>
                <li className="flex items-center gap-2"><ShoppingBasket size={18} aria-hidden="true" /> Đặt hàng thuận tiện</li>
              </ul>
            </div>

            <aside aria-label="Lối tắt ẩm thực" className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
              <Link to="/explore/special" className="rounded-3xl border border-white/15 bg-white/10 p-6 backdrop-blur transition hover:-translate-y-1 hover:bg-white/15">
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#F4C7A5]">Sản vật địa phương</span>
                <h2 className="mt-2 text-2xl font-black">Đặc sản ba miền</h2>
                <p className="mt-2 text-sm leading-6 text-white/70">Khám phá hương vị tiêu biểu từ Bắc vào Nam.</p>
              </Link>
              <Link to="/explore/menu" className="rounded-3xl border border-white/15 bg-white/10 p-6 backdrop-blur transition hover:-translate-y-1 hover:bg-white/15">
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#F4C7A5]">Gợi ý mỗi ngày</span>
                <h2 className="mt-2 text-2xl font-black">Thực đơn gia đình</h2>
                <p className="mt-2 text-sm leading-6 text-white/70">Phối hợp món Việt cân bằng cho từng bữa ăn.</p>
              </Link>
            </aside>
          </div>
        </section>

        <div className="mx-auto mt-10 max-w-7xl space-y-10 px-4">
          <CategorySection />
          <LatestProduct />
          <RegionSection />
          <PopularSection />
          <DiscountProducts />
          <ProductSuggestion />

          <section aria-labelledby="about-bep-viet" className="rounded-[36px] bg-[#FAECE1] px-6 py-10 md:px-12">
            <div className="grid gap-8 md:grid-cols-[1fr_0.8fr] md:items-center">
              <div>
                <h2 id="about-bep-viet" className="text-3xl font-black text-[#5C4033]">
                  Bếp Việt – nơi nguyên liệu gặp công thức
                </h2>
                <p className="mt-4 max-w-3xl leading-7 text-[#765746]">
                  Bếp Việt kết nối thực phẩm, đặc sản và tri thức nấu ăn trong cùng một
                  trải nghiệm. Mỗi công thức chỉ rõ nguyên liệu có thể mua, khẩu phần,
                  thời gian nấu và các bước thực hiện để bạn dễ dàng chuẩn bị món Việt tại nhà.
                </p>
              </div>
              <nav aria-label="Khám phá thêm" className="flex flex-wrap gap-3 md:justify-end">
                <Link to="/explore/product?categoryId=all" className="rounded-full bg-white px-5 py-3 font-bold text-[#5C4033] shadow-sm hover:text-[#D16D2F]">Thực phẩm Việt</Link>
                <Link to="/explore/special" className="rounded-full bg-white px-5 py-3 font-bold text-[#5C4033] shadow-sm hover:text-[#D16D2F]">Đặc sản Việt</Link>
                <Link to="/explore/recipe" className="rounded-full bg-white px-5 py-3 font-bold text-[#5C4033] shadow-sm hover:text-[#D16D2F]">Công thức món Việt</Link>
              </nav>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
