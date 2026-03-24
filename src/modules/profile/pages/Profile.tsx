import React, { useState } from 'react';
import { 
  Ticket, 
  Heart, 
  Book, 
  LogOut, 
  Leaf, 
  HelpCircle, 
  Gift, 
  X, 
  Copy, 
  Trophy, 
  CheckCircle2, 
  ChevronRight,
  ShieldCheck,
  CircleSlash,
  Layout
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useGetMe from '../../../hooks/useGetMe';
import useLogout from '../../../hooks/useLogOut';
import useGetWallet from '../hooks/useGetWallet';
import useConfirmVoucher from '../hooks/useConfirmVoucher';
import useGetMyCoupons from '../hooks/useGetMyCoupons';
// import toast from 'react-hot-toast';
import UserAvatar from '../../../components/common/Avatar';

export default function ProfileScreen() {
  const navigate = useNavigate();
  const { data: meData, isPending } = useGetMe(false);
  console.log(meData);
  
  const { mutate: logoutMutation } = useLogout();
  
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showRewardModal, setShowRewardModal] = useState(false);
  const [showCouponsModal, setShowCouponsModal] = useState(false); 
  const [showRulesModal, setShowRulesModal] = useState(false);
  const [claimedCode, setClaimedCode] = useState<string | null>(null);
  
  const isLoggedIn = !!meData?.data;

  const { data: walletData, isPending: isWalletLoading, refetch: refetchWallet } = useGetWallet(isLoggedIn);
  const { mutate: confirmReward, isPending: isConfirming } = useConfirmVoucher();
  const { data: couponsData, refetch: refetchCoupons } = useGetMyCoupons(isLoggedIn);
  
  const wallet = walletData?.data;
  const coupons = Array.isArray(couponsData?.data) ? couponsData.data : [];

  const handleClaimReward = () => {
    confirmReward(undefined, {
      onSuccess: (response: any) => {
        setClaimedCode(response?.data?.code);
        refetchWallet();
        refetchCoupons(); 
      },
      onError: (err: any) => {
        alert(err?.response?.data?.message || "Không thể nhận quà lúc này");
      }
    });
  };

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    // toast.success(`Đã sao chép mã: ${code}`);
  };

  const menuItems = [
    { id: 'coupons', title: 'Voucher của tôi', icon: <Ticket size={22} />, iconColor: '#FFB039', onPress: () => setShowCouponsModal(true) }, 
    { id: 'favourite', title: 'Yêu thích', icon: <Heart size={22} />, iconColor: '#FFB039', onPress: () => navigate('/profile/wishlist') },
    { id: 'recipes', title: 'Sổ tay công thức', icon: <Book size={22} />, iconColor: '#FFB039', onPress: () => navigate('/profile/recipe-handbook') },
  ];

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans pb-10">
      <div className="max-w-2xl mx-auto px-4 pt-8">
        <div className="flex flex-col items-center mb-8">
          <div className="relative p-1 rounded-full border-2 border-orange-100 mb-4">
            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-sm">
              <UserAvatar avatarUrl={isLoggedIn ? meData?.data?.avatar : 'https://cdn-icons-png.flaticon.com/512/149/149071.png'} />
            </div>
          </div>

          {isLoggedIn ? (
            <>
              <h1 className="text-xl font-bold text-gray-800">{meData?.data.name}</h1>
              <div className="flex items-center gap-1.5 bg-orange-500 px-3 py-1 rounded-full mt-2 shadow-sm">
                <ShieldCheck size={14} className="text-white" />
                <span className="text-white text-xs font-bold font-mono">Cấp độ {wallet?.level || 1}</span>
              </div>
            </>
          ) : (
            <div className="mt-4 flex flex-col items-center">
              <h2 className="text-lg font-bold mb-4">Chào mừng bạn!</h2>
              <div className="flex gap-3">
                <button onClick={() => navigate('/login')} className="bg-[#E25822] text-white px-6 py-2 rounded-full font-bold hover:opacity-90 transition-opacity">
                  Đăng nhập
                </button>
                <button onClick={() => navigate('/register')} className="border border-[#E25822] text-[#E25822] px-6 py-2 rounded-full font-bold hover:bg-orange-50 transition-colors">
                  Đăng ký
                </button>
              </div>
            </div>
          )}
        </div>

        {isLoggedIn && (
          <div className="bg-white rounded-3xl p-6 shadow-xl border border-gray-50 mb-8">
            <div className="flex justify-between items-start mb-6">
              <div>
                <div className="flex items-center gap-1 text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">
                  <span>Số dư Hạt Vàng</span>
                  <button onClick={() => setShowRulesModal(true)}>
                    <HelpCircle size={18} className="text-[#FFB039]" />
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  {isWalletLoading ? (
                    <div className="w-12 h-8 bg-gray-100 animate-pulse rounded" />
                  ) : (
                    <span className="text-3xl font-black text-gray-800 tracking-tight">
                      {wallet?.goldSeeds?.toLocaleString() || 0}
                    </span>
                  )}
                  <Leaf size={24} className="text-[#FFB039] fill-[#FFB039]" />
                </div>
              </div>
              
              <button 
                onClick={() => wallet?.hasUnclaimedReward ? setShowRewardModal(true) : null}
                className="relative w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center text-[#FFB039] hover:scale-110 transition-transform shadow-inner"
              >
                <Gift size={24} />
                {wallet?.hasUnclaimedReward && (
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white animate-bounce" />
                )}
              </button>
            </div>

            <div className="space-y-3">
              <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[#FFB039] transition-all duration-1000 ease-out"
                  style={{ width: `${wallet?.progressPercentage || 0}%` }}
                />
              </div>
              <p className="text-xs text-gray-400 font-medium">
                {wallet?.seedsToNextLevel === 0 ? "Bạn đã đạt cấp độ tối đa!" : `Còn ${wallet?.seedsToNextLevel?.toLocaleString()} Hạt Vàng để nâng Cấp ${(wallet?.level || 0) + 1}`}
              </p>
            </div>
          </div>
        )}

        <div className="space-y-3">
          {isLoggedIn && menuItems.map((item) => (
            <button 
              key={item.id} 
              onClick={item.onPress}
              className="w-full flex items-center justify-between p-4 bg-white rounded-2xl border border-gray-100 hover:border-orange-100 hover:bg-orange-50/30 transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className="p-2.5 rounded-xl bg-[#FFB039]/10 text-[#FFB039]">
                  {item.icon}
                </div>
                <span className="font-bold text-gray-700">{item.title}</span>
              </div>
              <div className="flex items-center gap-2">
                {item.id === 'coupons' && coupons.length > 0 && (
                  <span className="bg-[#E25822] text-white text-[10px] font-black px-2 py-0.5 rounded-full">
                    {coupons.length}
                  </span>
                )}
                <ChevronRight size={20} className="text-gray-300 group-hover:text-orange-400 transition-colors" />
              </div>
            </button>
          ))}

          {isLoggedIn && (
            <button 
              onClick={() => setShowLogoutModal(true)}
              className="w-full flex items-center gap-4 p-4 text-[#E25822] font-bold hover:bg-red-50 rounded-2xl transition-colors mt-4"
            >
              <div className="p-2.5 rounded-xl bg-red-50">
                <LogOut size={22} />
              </div>
              <span>Đăng xuất</span>
            </button>
          )}
        </div>
      </div>

      {/* Rules Modal */}
      {showRulesModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-lg rounded-t-[32px] sm:rounded-[32px] overflow-hidden shadow-2xl animate-in slide-in-from-bottom duration-300">
            <div className="p-6 border-b flex justify-between items-center">
              <h3 className="text-lg font-black text-gray-800">Quy tắc Hạt Vàng & Cấp độ</h3>
              <button onClick={() => setShowRulesModal(false)}><X size={24} className="text-gray-400" /></button>
            </div>
            <div className="p-6 max-h-[70vh] overflow-y-auto space-y-6">
              <div className="flex gap-4">
                <div className="p-3 bg-orange-50 rounded-2xl h-fit text-[#FFB039]"><Layout size={20}/></div>
                <div>
                  <h4 className="font-bold text-gray-800">Tích lũy đơn hàng</h4>
                  <p className="text-sm text-gray-500 mt-1">Tỷ lệ tích lũy dựa trên giá trị đơn hàng:</p>
                  <div className="mt-3 bg-gray-50 p-4 rounded-2xl space-y-1 text-sm">
                    <p>• Dưới 500k: <span className="font-bold text-[#E25822]">Tích 1%</span></p>
                    <p>• Từ 500k - 2 triệu: <span className="font-bold text-[#E25822]">Tích 2%</span></p>
                    <p>• Trên 2 triệu: <span className="font-bold text-[#E25822]">Tích 3%</span></p>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setShowRulesModal(false)}
                className="w-full py-4 bg-gray-900 text-white rounded-2xl font-bold shadow-lg shadow-gray-200 mt-4"
              >
                Đã hiểu
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Coupons Modal */}
      {showCouponsModal && (
        <div className="fixed inset-0 z-50 flex items-end bg-black/40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-2xl mx-auto rounded-t-[40px] p-8 min-h-[60vh] shadow-2xl animate-in slide-in-from-bottom duration-300 flex flex-col">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-xl font-black text-gray-800 uppercase tracking-tight">Kho Voucher của tôi</h3>
                <p className="text-sm text-gray-400 font-medium">Bạn đang có {coupons.length} mã giảm giá</p>
              </div>
              <button onClick={() => setShowCouponsModal(false)}><X size={28} className="text-gray-300 hover:text-gray-600 transition-colors" /></button>
            </div>
            
            <div className="flex-1 overflow-y-auto space-y-4 pr-2">
              {coupons.length > 0 ? coupons.map((item: any) => (
                <div key={item._id} className="relative flex border border-orange-100 rounded-3xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-24 bg-[#FFB039] flex flex-col items-center justify-center text-white">
                    <Ticket size={32} strokeWidth={2.5} />
                    <div className="mt-2 flex flex-col gap-1">
                      {[1, 2, 3].map(i => <div key={i} className="w-1 h-1 bg-white/40 rounded-full" />)}
                    </div>
                  </div>
                  <div className="flex-1 p-5">
                    <p className="font-black text-lg text-gray-800">Giảm {item.couponId?.value?.toLocaleString()}đ</p>
                    <div className="inline-block bg-orange-50 text-[#E25822] px-3 py-1 rounded-lg mt-2 font-mono font-black text-sm uppercase">
                      {item.couponId?.code}
                    </div>
                    <p className="text-[10px] text-gray-400 mt-3 font-bold uppercase tracking-tighter italic">HSD: {new Date(item.couponId?.endDate).toLocaleDateString('vi-VN')}</p>
                  </div>
                  <button 
                    onClick={() => copyToClipboard(item.couponId?.code)}
                    className="px-6 flex flex-col items-center justify-center gap-1 border-l border-gray-50 hover:bg-orange-50 transition-colors"
                  >
                    <Copy size={20} className="text-[#E25822]" />
                    <span className="text-[10px] font-black text-[#E25822] uppercase tracking-widest">Copy</span>
                  </button>
                </div>
              )) : (
                <div className="flex flex-col items-center justify-center h-full py-10 text-gray-300">
                  <CircleSlash size={80} strokeWidth={1} />
                  <p className="mt-4 font-bold">Chưa có voucher khả dụng</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Reward Modal */}
      {showRewardModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-md p-6">
          <div className="bg-white w-full max-w-sm rounded-[40px] p-8 text-center relative shadow-2xl animate-in zoom-in duration-300">
            <button className="absolute top-6 right-6 text-gray-300" onClick={() => { setShowRewardModal(false); setClaimedCode(null); }}>
              <X size={24} />
            </button>
            
            {!claimedCode ? (
              <>
                <div className="w-20 h-20 bg-orange-50 rounded-3xl flex items-center justify-center mx-auto mb-6 transform -rotate-12">
                  <Trophy size={40} className="text-[#FFB039]" />
                </div>
                <h3 className="text-2xl font-black text-gray-800 italic">Chúc mừng cấp {wallet?.level}!</h3>
                <p className="text-sm text-gray-500 mt-2 mb-8 leading-relaxed px-4">{wallet?.milestoneReward?.description}</p>
                <div className="bg-gray-50 border border-dashed border-gray-200 p-4 rounded-2xl mb-8">
                  <p className="text-[#E25822] font-black text-lg">🎁 Voucher {wallet?.milestoneReward?.bonusBalance.toLocaleString()}đ</p>
                </div>
                <button 
                  onClick={handleClaimReward}
                  disabled={isConfirming}
                  className="w-full py-4 bg-[#E25822] text-white rounded-2xl font-black shadow-lg shadow-orange-100 active:scale-95 transition-all disabled:opacity-50"
                >
                  {isConfirming ? "ĐANG XỬ LÝ..." : "NHẬN VOUCHER NGAY"}
                </button>
              </>
            ) : (
              <>
                <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 size={40} className="text-green-500" />
                </div>
                <h3 className="text-2xl font-black text-gray-800">Đã nhận thành công!</h3>
                <div className="flex items-center justify-between bg-gray-900 p-4 rounded-2xl my-8">
                  <span className="font-mono font-black text-lg text-white tracking-widest">{claimedCode}</span>
                  <button onClick={() => copyToClipboard(claimedCode!)}><Copy size={20} className="text-orange-400"/></button>
                </div>
                <button 
                  className="w-full py-4 bg-gray-900 text-white rounded-2xl font-black active:scale-95 transition-all"
                  onClick={() => { setShowRewardModal(false); setClaimedCode(null); }}
                >
                  TUYỆT VỜI
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Logout Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-6">
          <div className="bg-white w-full max-w-sm rounded-[40px] p-8 text-center shadow-2xl animate-in zoom-in duration-200">
            <div className="w-20 h-20 bg-red-50 rounded-3xl flex items-center justify-center mx-auto mb-6 transform rotate-12">
              <LogOut size={40} className="text-[#E25822]" />
            </div>
            <h3 className="font-black text-2xl text-gray-800 uppercase tracking-tighter">Xác nhận đăng xuất</h3>
            <p className="text-sm text-gray-400 mt-2 mb-8 font-medium">Bạn có chắc chắn muốn rời khỏi ứng dụng không?</p>
            <div className="flex gap-4">
              <button onClick={() => setShowLogoutModal(false)} className="flex-1 py-4 bg-gray-100 rounded-2xl font-black text-gray-500 hover:bg-gray-200 transition-colors uppercase text-xs tracking-widest">Hủy</button>
              <button 
                onClick={() => { setShowLogoutModal(false); logoutMutation(); }}
                className="flex-1 py-4 bg-[#E25822] text-white rounded-2xl font-black shadow-lg shadow-orange-100 hover:opacity-90 transition-opacity uppercase text-xs tracking-widest"
              >
                Đăng xuất
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}