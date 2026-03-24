import React from 'react';
import { Leaf } from 'lucide-react';

const NutritionCard = ({ data }) => {
  if (!data) return null;

  const stats = [
    { label: 'CALORIES', value: data.calories },
    { label: 'PROTEIN', value: `${data.protein}g` },
    { label: 'CHẤT BÉO', value: `${data.fat}g` },
    { label: 'CARBS', value: `${data.carbs}g` },
  ];

  return (
    <div className="bg-[#F1F4F0] rounded-[32px] p-8 h-full border border-green-100/50 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-[#2D5A27] p-2 rounded-xl text-white">
          <Leaf size={18} />
        </div>
        <h3 className="text-lg font-black text-[#2D5A27] uppercase tracking-tight">
          Dinh dưỡng <span className="text-[10px] text-gray-400 font-bold ml-1 tracking-widest">(MỖI KHẨU PHẦN)</span>
        </h3>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white rounded-2xl p-4 flex flex-col items-center justify-center shadow-sm hover:shadow-md transition-shadow">
            <span className="text-xl font-black text-[#333]">{stat.value}</span>
            <span className="text-[9px] font-black text-gray-400 mt-1 uppercase tracking-widest">{stat.label}</span>
          </div>
        ))}
      </div>

      {data.description && (
        <div className="relative">
          <p className="text-gray-500 text-sm italic leading-relaxed pl-4 border-l-2 border-[#2D5A27]/20">
            "{data.description}"
          </p>
        </div>
      )}
    </div>
  );
};

export default NutritionCard;