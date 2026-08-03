import { Compass, Home, ReceiptText, ShoppingBasket, UserRound } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const items = [
  { to: '/', label: 'Trang chủ', icon: Home, end: true },
  { to: '/explore/product', label: 'Khám phá', icon: Compass },
  { to: '/cart', label: 'Giỏ hàng', icon: ShoppingBasket, primary: true },
  { to: '/order/list', label: 'Đơn hàng', icon: ReceiptText },
  { to: '/profile', label: 'Tài khoản', icon: UserRound },
];

export default function MobileBottomNavigation() {
  return (
    <nav
      aria-label="Điều hướng chính trên thiết bị di động"
      className="fixed inset-x-0 bottom-0 z-[60] grid h-[68px] grid-cols-5 border-t border-[#EEDCCF] bg-white/95 px-1 pb-[env(safe-area-inset-bottom)] shadow-[0_-5px_18px_rgba(92,64,51,0.10)] backdrop-blur md:hidden"
    >
      {items.map(({ to, label, icon: Icon, end, primary }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          aria-label={label}
          className={({ isActive }) =>
            `relative flex min-w-0 flex-col items-center justify-center gap-0.5 text-[10px] font-bold transition-colors ${
              primary
                ? 'text-[#D16D2F]'
                : isActive
                  ? 'text-[#D16D2F]'
                  : 'text-[#806D63]'
            }`
          }
        >
          {primary ? (
            <span className="absolute -top-4 flex h-13 w-13 items-center justify-center rounded-full border-4 border-[#FFFDF9] bg-[#D16D2F] text-white shadow-lg">
              <Icon size={25} strokeWidth={2.2} />
            </span>
          ) : (
            <Icon size={22} strokeWidth={2} />
          )}
          <span className={primary ? 'mt-8' : ''}>{label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
