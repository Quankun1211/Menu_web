import { Link, NavLink, useNavigate } from "react-router";
import { useAppStore } from "../../store/app.store";
import useLogout from "../../hooks/useLogOut";
import { BellOutlined, ShoppingOutlined, UserOutlined, NotificationOutlined, EyeOutlined } from '@ant-design/icons';
import { Avatar, Badge, Dropdown, Modal, type MenuProps, Button, Empty, Tag } from "antd";
import SearchBar from "../common/SearchBar";
import { formatVND, formatDate } from "../../utils/helper";
import { useState } from "react";
import useGetMe from "../../hooks/useGetMe";
import useGetCart from "../../modules/cart/hooks/useGetCart";
import useGetNotification from "../../hooks/useGetNotification";
import useReadNotification from "../../hooks/useReadNotification";
import useReadAllNotification from "../../hooks/useReadAllNotification";

export default function Header() {
  const { userData } = useAppStore();
  const { data: meData } = useGetMe(false);
  const isLoggedIn = !!meData?.data;

  const { data: cartData } = useGetCart(isLoggedIn);
  const { data: allNotification } = useGetNotification();
  
  const [modal, contextHolder] = Modal.useModal();
  const { mutate: onLogOut } = useLogout();
  const { mutate: onReadNoti } = useReadNotification()
  const { mutate: onReadAllNoti } = useReadAllNotification()
  const navigate = useNavigate();

  const [selectedNoti, setSelectedNoti] = useState<any>(null);
  const [isNotiModalOpen, setIsNotiModalOpen] = useState(false);
  const [notiDropdownOpen, setNotiDropdownOpen] = useState(false);

  const items = isLoggedIn ? (cartData?.data?.items ?? []) : [];
  const notifications = isLoggedIn ? (allNotification?.data ?? []) : [];
  const unreadCount = isLoggedIn ? (allNotification?.unreadCount ?? 0) : 0;

  const handleOpenNoti = (noti: any) => {
    onReadNoti(noti._id, {
      onSuccess: () => {
        
      }
    })
    setNotiDropdownOpen(false);
    setSelectedNoti(noti);
    setIsNotiModalOpen(true);
  };
  const handleReadAll = () => {
    onReadAllNoti()
  }

  const showLogoutConfirm = () => {
    modal.confirm({
      title: 'Xác nhận',
      content: 'Bạn có chắc chắn muốn đăng xuất không?',
      okText: 'Đăng xuất',
      cancelText: 'Hủy',
      okButtonProps: { danger: true },
      centered: true,
      onOk: () => {
        return new Promise((resolve) => {
          onLogOut(undefined, {
            onSettled: () => {
              resolve(true);
            }
          });
        });
      },
    });
  };

  const userMenuItems: MenuProps['items'] = [
    { label: <NavLink to="/profile/wishlist">Sản phẩm yêu thích</NavLink>, key: '0' },
    { label: <NavLink to="/order/list">Đơn hàng</NavLink>, key: '1' },
    { label: <NavLink to="/profile">Thông tin cá nhân</NavLink>, key: '2' },
    { type: 'divider' },
    { label: <span className="text-red-500" onClick={showLogoutConfirm}>Đăng xuất</span>, key: '3' },
  ];

  const notificationDropdownContent = (
    <div className="bg-white shadow-2xl rounded-2xl border border-gray-100 w-[380px] overflow-hidden">
      <div className="p-4 border-b border-gray-50 flex justify-between items-center bg-orange-50/30">
        <span className="font-black text-[#5C4033] uppercase text-xs tracking-widest">Thông báo mới nhất</span>
        {isLoggedIn && <Link to="/notifications" onClick={() => setNotiDropdownOpen(false)} className="text-[#D16D2F] text-xs font-bold hover:underline">Xem tất cả</Link>}
      </div>

      <div className="max-h-[400px] overflow-y-auto">
        {!isLoggedIn ? (
          <div className="py-12 px-6 text-center flex flex-col items-center">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
              <NotificationOutlined className="text-gray-300 text-2xl" />
            </div>
            <p className="text-sm font-bold text-[#5C4033] mb-1">Bạn chưa đăng nhập</p>
            <p className="text-xs text-gray-400 mb-6">Đăng nhập để xem thông báo đơn hàng và ưu đãi dành riêng cho bạn.</p>
            <Button type="primary" className="bg-[#D16D2F] border-none font-bold rounded-xl h-9 px-8" onClick={() => navigate('/account/login')}>ĐĂNG NHẬP</Button>
          </div>
        ) : notifications.length > 0 ? (
          <div className="divide-y divide-gray-50">
            {notifications.map((item) => (
              <div 
                key={item._id} 
                onClick={() => handleOpenNoti(item)}
                className="p-4 flex gap-3 hover:bg-gray-50 transition-colors cursor-pointer group"
              >
                <div className="relative flex-shrink-0">
                  {item.image ? (
                    <img src={item.image} alt="" className="w-12 h-12 rounded-full object-cover border border-gray-100" />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                      <NotificationOutlined className="text-gray-400 text-lg" />
                    </div>
                  )}
                  {!item.isRead && <div className="absolute top-0 right-0 w-3 h-3 bg-[#D16D2F] rounded-full border-2 border-white"></div>}
                </div>
                <div className="flex-grow min-w-0">
                  <h4 className={`text-sm mb-0.5 truncate ${item.isRead ? 'text-gray-500 font-medium' : 'text-[#5C4033] font-bold'}`}>
                    {item.title}
                  </h4>
                  <p className="text-xs text-gray-500 line-clamp-2 mb-1 leading-relaxed">
                    {item.body}
                  </p>
                  <span className="text-[10px] text-gray-400 font-medium">
                    {formatDate(item.createdAt)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-10 text-center">
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Không có thông báo nào" />
          </div>
        )}
      </div>
      {isLoggedIn && notifications.length > 0 && (
        <div className="p-2 bg-gray-50 text-center border-t border-gray-100">
          <button 
            onClick={() => handleReadAll()}
            className="text-[11px] font-bold text-[#8B5E3C] hover:text-[#D16D2F] transition-colors">
            ĐÁNH DẤU ĐÃ ĐỌC TẤT CẢ
          </button>
        </div>
      )}
    </div>
  );

  const cartDropdownContent = (
    <div className="bg-white shadow-2xl rounded-2xl border border-gray-100 w-[360px] overflow-hidden">
      <div className="p-4 border-b border-gray-50 flex justify-between items-center bg-orange-50/30">
        <span className="font-black text-[#5C4033] uppercase text-xs tracking-widest">Giỏ hàng của bạn</span>
      </div>
      <div className="max-h-[300px] overflow-y-auto">
        {!isLoggedIn ? (
          <div className="py-12 px-6 text-center flex flex-col items-center">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
              <ShoppingOutlined className="text-gray-300 text-2xl" />
            </div>
            <p className="text-sm font-bold text-[#5C4033] mb-1">Giỏ hàng đang chờ bạn</p>
            <p className="text-xs text-gray-400 mb-6">Hãy đăng nhập để lưu giữ các món đặc sản bạn đã chọn nhé!</p>
            <Button type="primary" className="bg-[#D16D2F] border-none font-bold rounded-xl h-9 px-8" onClick={() => navigate('/account/login')}>ĐĂNG NHẬP NGAY</Button>
          </div>
        ) : items.length > 0 ? (
          <div className="divide-y divide-gray-50">
            {items.map((item) => (
              <div key={item._id} className="p-4 flex gap-3 hover:bg-gray-50 transition-colors cursor-pointer">
                <img src={item.product?.images} alt={item.product?.name} className="w-12 h-12 rounded-lg object-cover border border-gray-100" />
                <div className="flex-grow min-w-0">
                  <h4 className="text-sm font-bold text-[#5C4033] truncate mb-1">{item.product?.name}</h4>
                  <div className="flex justify-between items-center">
                    <span className="text-orange-600 font-black text-xs">{formatVND(item.product?.price || 0)}</span>
                    <span className="text-gray-400 text-[10px]">x{item.quantity}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-10">
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Giỏ hàng trống" />
          </div>
        )}
      </div>
      {isLoggedIn && (
        <div className="p-4 bg-gray-50 flex flex-col gap-2">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-400 text-xs font-medium">Tổng cộng:</span>
            <span className="text-lg font-black text-[#D16D2F]">
              {formatVND(items.reduce((sum, i) => sum + ((i.finalPrice || 0) * i.quantity), 0))}
            </span>
          </div>
          <Button 
            type="primary" 
            block 
            className="bg-[#D16D2F] hover:bg-[#b35a24] border-none font-bold h-10 rounded-xl"
            onClick={() => navigate('/cart')}
          >
            XEM GIỎ HÀNG
          </Button>
        </div>
      )}
    </div>
  );

  return (
    <header className="w-full bg-[#faece1] border-b border-[#e8c5a8] sticky top-0 z-50 shadow-sm">
      {contextHolder}

      <Modal
        open={isNotiModalOpen}
        onCancel={() => setIsNotiModalOpen(false)}
        centered
        footer={null}
        width={450}
        closeIcon={null}
        style={{ borderRadius: '24px' }}
        styles={{ 
          body: { padding: 0 }, 
          mask: { backdropFilter: 'blur(4px)' }
        }}
      >
        <div className="relative">
          <div className="bg-[#D16D2F] p-6 text-center">
             <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3 backdrop-blur-sm">
                <NotificationOutlined className="text-white text-3xl" />
             </div>
             <h3 className="text-white font-black uppercase tracking-widest text-sm m-0">Chi tiết thông báo</h3>
          </div>

          <div className="p-8 bg-white">
            <div className="flex items-center gap-2 mb-4">
              <Tag color="orange" className="border-none font-bold uppercase text-[10px] rounded-md">
                {selectedNoti?.data?.orderId ? 'Đơn hàng' : 'Hệ thống'}
              </Tag>
              <span className="text-gray-400 text-[11px] font-medium">{formatDate(selectedNoti?.createdAt)}</span>
            </div>

            <h2 className="text-[#5C4033] text-xl font-black leading-tight mb-4 italic">
              {selectedNoti?.title}
            </h2>
            
            <p className="text-gray-600 leading-relaxed text-sm mb-8">
              {selectedNoti?.body}
            </p>

            {selectedNoti?.data?.orderId && (
              <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 mb-8 flex justify-between items-center">
                <div>
                  <p className="text-[10px] text-gray-400 uppercase font-black mb-1">Mã đơn hàng</p>
                  <p className="text-[#D16D2F] font-bold text-sm m-0">#{selectedNoti?.data?.orderId?.slice(-10).toUpperCase()}</p>
                </div>
                <Button 
                  icon={<EyeOutlined />} 
                  type="text" 
                  className="text-[#8B5E3C] font-bold text-xs"
                  onClick={() => {
                    setIsNotiModalOpen(false);
                    navigate(`/order/detail/${selectedNoti?.data?.orderId}`);
                  }}
                >
                  XEM ĐƠN
                </Button>
              </div>
            )}

            <Button 
              block 
              size="large"
              className="bg-[#5C4033] hover:bg-[#D16D2F] text-white border-none font-black uppercase text-xs tracking-widest h-12 rounded-xl"
              onClick={() => setIsNotiModalOpen(false)}
            >
              ĐÃ HIỂU
            </Button>
          </div>
        </div>
      </Modal>
      
      <div className="max-w-7xl mx-auto px-4 md:px-10 h-20 flex items-center gap-4 md:gap-12">
        <NavLink to="/" className="min-w-fit">
          <div className="flex items-center gap-2 cursor-pointer">
            <div className="bg-[#D16D2F] p-2 rounded-lg shadow-md">
              <span className="text-white font-bold text-xl tracking-tighter">BẾP</span>
            </div>
            <span className="text-xl font-black text-[#5C4033] hidden lg:block tracking-widest">VIỆT</span>
          </div>
        </NavLink>

        <div className="flex-grow max-w-4xl mx-auto">
          <SearchBar />
        </div>

        <div className="flex items-center gap-2 md:gap-6 min-w-fit">
          <div className="flex items-center gap-4 border-r pr-4 md:pr-6 border-[#e8c5a8]">
            <Dropdown 
              popupRender={() => notificationDropdownContent} 
              placement="bottomRight" 
              arrow={{ pointAtCenter: true }}
              trigger={['hover']}
              open={notiDropdownOpen}
              onOpenChange={(open) => {
                if (!isNotiModalOpen) {
                  setNotiDropdownOpen(open);
                }
              }}
            >
              <div className="cursor-pointer group p-1">
                <Badge count={unreadCount} size="small" offset={[2, 2]} color="#D16D2F">
                  <BellOutlined className="text-2xl text-[#8B5E3C] group-hover:text-[#D16D2F] transition-colors" />
                </Badge>
              </div>
            </Dropdown>

            <Dropdown 
              popupRender={() => cartDropdownContent} 
              placement="bottomRight" 
              arrow={{ pointAtCenter: true }}
              trigger={['hover']}
            >
              <div className="cursor-pointer group p-1" onClick={() => isLoggedIn ? navigate('/cart') : navigate('/account/login')}>
                <Badge count={unreadCount > 0 ? 0 : items.length} size="small" offset={[2, 2]} color="#D16D2F">
                  <ShoppingOutlined className="text-2xl text-[#8B5E3C] group-hover:text-[#D16D2F] transition-colors" />
                </Badge>
              </div>
            </Dropdown>
          </div>

          {!userData ? (
            <div className="flex items-center gap-2 md:gap-4">
              <Link to="/account/login" className="text-[#8B5E3C] hover:text-[#D16D2F] font-bold text-[10px] md:text-xs uppercase transition-colors whitespace-nowrap">
                Đăng nhập
              </Link>
              <Link to="/account/register" className="hidden sm:block bg-[#D16D2F] text-white px-5 py-2 rounded-full font-black text-xs uppercase hover:bg-[#b35a24] transition-all shadow-md whitespace-nowrap">
                Đăng ký
              </Link>
            </div>
          ) : (
            <Dropdown menu={{ items: userMenuItems }} trigger={['click']} placement="bottomRight" arrow>
              <div className="flex items-center gap-3 cursor-pointer group">
                <div className="text-right hidden lg:block">
                  <p className="text-[9px] text-[#A88E7A] uppercase font-black leading-none">Thân mời,</p>
                  <p className="text-sm font-bold text-[#5C4033] leading-tight">
                    {userData?.name?.split(' ').pop()}
                  </p>
                </div>
                <Avatar 
                  size="large"
                  className="bg-[#f2dbc9] text-[#D16D2F] border-2 border-[#e8c5a8] group-hover:border-[#D16D2F] transition-all flex-shrink-0" 
                  icon={<UserOutlined />} 
                  src={userData?.avatar}
                />
              </div>
            </Dropdown>
          )}
        </div>
      </div>

      <div className="bg-[#f5e1d2]/50 border-t border-[#e8c5a8]/30 hidden md:block">
        <div className="max-w-7xl mx-auto px-10 h-10 flex items-center justify-center gap-10 text-[#8B5E3C] font-bold uppercase text-[11px] tracking-[0.2em]">
          <MenuNavLink to="/" label="Trang chủ" />
          <MenuNavLink to="/explore/product" label="Sản phẩm" />
          <MenuNavLink to="/explore/special" label="Đặc sản" />
          <MenuNavLink to="/explore/menu" label="Thực đơn" />
          <MenuNavLink to="/explore/recipe" label="Công thức" />
        </div>
      </div>
    </header>
  );
}

const MenuNavLink = ({ to, label }: { to: string, label: string }) => (
  <NavLink 
    to={to} 
    className={({ isActive }) => 
      `h-full flex items-center border-b-2 transition-all duration-300 ${
        isActive ? "text-[#D16D2F] border-[#D16D2F]" : "text-[#8B5E3C] border-transparent hover:text-[#D16D2F]"
      }`
    }
  >
    {label}
  </NavLink>
);