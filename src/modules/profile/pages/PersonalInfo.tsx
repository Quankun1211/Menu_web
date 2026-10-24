import { ArrowLeft, CalendarDays, Mail, Phone, ShieldCheck, UserRound } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PageMeta from '../../../components/common/PageMeta';
import useGetMe from '../../../hooks/useGetMe';

export default function PersonalInfo() {
  const navigate = useNavigate();
  const { data, isPending, isError } = useGetMe();
  const user = data?.data;
  const fields = [
    { label: 'Họ và tên', value: user?.name, icon: UserRound },
    { label: 'Tên đăng nhập', value: user?.username, icon: ShieldCheck },
    { label: 'Email', value: user?.email || 'Chưa có email đã xác thực', icon: Mail },
    { label: 'Ngày tham gia', value: user?.createdAt ? new Date(user.createdAt).toLocaleDateString('vi-VN') : '—', icon: CalendarDays },
  ];
  return <main className="min-h-[70vh] bg-[#F9F7F5] px-4 py-10"><PageMeta title="Thông tin cá nhân - Bếp Việt" indexable={false} />
    <section className="mx-auto max-w-2xl rounded-3xl bg-white p-6 shadow-sm sm:p-9">
      <button onClick={() => navigate('/profile')} className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-orange-600"><ArrowLeft size={18}/>Tài khoản</button>
      <h1 className="text-2xl font-black text-[#5C4033]">Thông tin cá nhân</h1>
      <p className="mt-2 text-sm text-gray-500">Thông tin tài khoản đang sử dụng.</p>
      {isPending ? <p className="py-10 text-center text-gray-500">Đang tải thông tin…</p> : isError || !user ? <p className="py-10 text-center text-gray-500">Không tải được thông tin. Vui lòng đăng nhập lại.</p> :
        <div className="mt-7 divide-y divide-gray-100">{fields.map(({ label, value, icon: Icon }) => <div key={label} className="flex items-center gap-4 py-4"><span className="rounded-xl bg-orange-50 p-3 text-orange-600"><Icon size={20}/></span><div><p className="text-xs font-semibold uppercase tracking-wide text-gray-400">{label}</p><p className="mt-1 font-semibold text-gray-800">{value}</p></div></div>)}</div>}
    </section>
  </main>;
}
