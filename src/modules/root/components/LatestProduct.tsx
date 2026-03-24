import { useNavigate } from 'react-router-dom';
import useGetLatestProduct from '../hooks/useGetLatestProduct';

export default function LatestProduct() {
  const { data: latestProduct, isPending } = useGetLatestProduct();
  const navigate = useNavigate();

  if (isPending) return <div className="h-64 animate-pulse bg-gray-200 rounded-2xl" />;

  return (
    <div 
      className="relative h-[300px] md:h-[450px] w-full rounded-3xl overflow-hidden cursor-pointer group shadow-lg"
      onClick={() => navigate(`/explore/special-detail/${latestProduct?.data.slug}`, { state: { productId: latestProduct?.data._id } })}
    >
      <img 
        src={latestProduct?.data.images} 
        alt={latestProduct?.data.name}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
      
      {/* Overlay Gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-8 text-white">
        <span className="bg-orange-500 text-xs font-bold uppercase px-3 py-1 rounded-full w-fit mb-3">
          Đặc sản mới nhất
        </span>
        <h1 className="text-3xl md:text-5xl font-bold mb-2">{latestProduct?.data.name}</h1>
        <p className="text-gray-200 text-lg">
          Đặc sản miền {latestProduct?.data.region}
        </p>
      </div>
    </div>
  );
}