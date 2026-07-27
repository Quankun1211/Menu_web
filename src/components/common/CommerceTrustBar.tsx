import { BadgeCheck, RefreshCcw, ShieldCheck, Truck } from "lucide-react";

const benefits = [
  { icon: ShieldCheck, label: "Nguồn gốc rõ ràng" },
  { icon: Truck, label: "Giao hàng thuận tiện" },
  { icon: RefreshCcw, label: "Hỗ trợ đổi trả" },
  { icon: BadgeCheck, label: "Thanh toán an toàn" },
];

export default function CommerceTrustBar() {
  return (
    <aside aria-label="Cam kết mua hàng" className="border-b border-[#E8C5A8] bg-[#fffaf5]">
      <ul className="mx-auto grid max-w-7xl grid-cols-2 gap-2 px-4 py-3 md:grid-cols-4">
        {benefits.map(({ icon: Icon, label }) => (
          <li key={label} className="flex items-center justify-center gap-2 text-xs font-bold text-[#5C4033] md:text-sm">
            <Icon size={17} className="text-[#D16D2F]" aria-hidden="true" />
            {label}
          </li>
        ))}
      </ul>
    </aside>
  );
}
