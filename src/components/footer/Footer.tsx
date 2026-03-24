import { faPhone, faEnvelope, faMapLocation } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useLocation } from 'react-router'

const Footer = () => {
  const location = useLocation();

  const isPaymentPageSlug = location.pathname.startsWith('/payment/');
  const isPaymentPage = location.pathname === '/payment';
  const isFavouritePage = location.pathname === '/favourite';
  const isHistoryPage = location.pathname === '/history';
  
  if (isPaymentPage || isFavouritePage || isHistoryPage || isPaymentPageSlug) {
    return null;
  }

  return (
    <footer className='px-20 py-12 bg-[#5C4033] flex gap-8 text-[#F5F5DC] border-t-4 border-[#D16D2F]'>
      <div className='w-1/4 flex flex-col gap-3'>
        <h1 className='text-2xl font-black uppercase tracking-tight text-[#D16D2F]'>
          Thực phẩm sạch ABC
        </h1>
        <div className='text-sm opacity-90 leading-relaxed'>
          <p className='font-bold text-lg mb-1'>Công ty TNHH Thực phẩm sạch ABC</p>
          <p>Địa chỉ: Số 123, đường XYZ, Phường 1, TP.HN</p>
          <p className='border-b border-[#F5F5DC]/30 pb-4'>Sở Kế hoạch và Đầu Tư Thành Phố Hà Nội</p>
        </div>
        
        <div className='mt-2 space-y-2'> 
          <div className='flex items-center gap-3 transition-colors hover:text-[#D16D2F] cursor-pointer'>
            <div className='bg-[#D16D2F] p-2 rounded-full w-8 h-8 flex items-center justify-center'>
              <FontAwesomeIcon icon={faPhone} size="xs" />
            </div>
            <span className='font-medium'>01234 5678 / 0987 654 321</span>
          </div>
          <div className='flex items-center gap-3 transition-colors hover:text-[#D16D2F] cursor-pointer'>
             <div className='bg-[#D16D2F] p-2 rounded-full w-8 h-8 flex items-center justify-center'>
              <FontAwesomeIcon icon={faEnvelope} size="xs" />
            </div>
            <span className='font-medium'>example@gmail.com</span>
          </div>
          <div className='flex items-start gap-3 transition-colors hover:text-[#D16D2F] cursor-pointer'>
             <div className='bg-[#D16D2F] p-2 rounded-full w-8 h-8 flex items-center justify-center mt-1'>
              <FontAwesomeIcon icon={faMapLocation} size="xs" />
            </div>
            <span className='font-medium flex-1 text-sm'>Số 123, đường XYZ, Phường 1, TP.HN</span>
          </div>
        </div>
      </div>

      <div className='w-1/4'>
        <h1 className='text-lg font-black uppercase mb-6 text-[#D16D2F] tracking-widest'>Trợ giúp nhanh</h1>
        <div className='flex flex-col gap-3 text-sm font-medium'>
          <p className='hover:translate-x-2 transition-transform cursor-pointer'>Chính sách và quy định chung</p>
          <p className='hover:translate-x-2 transition-transform cursor-pointer'>Hướng dẫn mua hàng</p>
          <p className='hover:translate-x-2 transition-transform cursor-pointer'>Liên hệ</p>
        </div>
      </div>

      <div className='w-1/4'>
        <h1 className='text-lg font-black uppercase mb-6 text-[#D16D2F] tracking-widest'>Chính sách bán hàng</h1>
        <div className='flex flex-col gap-3 text-sm font-medium'>
          <p className='hover:translate-x-2 transition-transform cursor-pointer'>Chính sách bảo mật</p>
          <p className='hover:translate-x-2 transition-transform cursor-pointer'>Chính sách vận chuyển</p>
          <p className='hover:translate-x-2 transition-transform cursor-pointer'>Chính sách đổi trả</p>
        </div>
      </div>

      <div className='w-1/4'>
        <h1 className='text-lg font-black uppercase mb-6 text-[#D16D2F] tracking-widest'>Dịch vụ khách hàng</h1>
        <div className='flex flex-col gap-3 text-sm font-medium'>
          <p className='hover:translate-x-2 transition-transform cursor-pointer'>Danh mục sản phẩm</p>
          <p className='hover:translate-x-2 transition-transform cursor-pointer'>Về chúng tôi</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer