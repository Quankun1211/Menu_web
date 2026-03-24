import React from 'react';
import { UtensilsCrossed } from 'lucide-react';

const SuggestCard = ({ data }) => {
  if (!data || !data.dishes) return null;

  return (
    <div className="bg-[#F1F4F0] rounded-[32px] p-8 h-full border border-green-100/50 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-[#2D5A27] p-2 rounded-xl text-white">
          <UtensilsCrossed size={18} />
        </div>
        <h3 className="text-lg font-black text-[#2D5A27] uppercase tracking-tight">Gợi ý kết hợp</h3>
      </div>

      <div className="space-y-3 mb-6">
        {data.dishes.map((item, index) => (
          <div key={index} className="flex items-center gap-3 group">
            <div className="w-1.5 h-1.5 rounded-full bg-[#E25822] group-hover:scale-150 transition-transform" />
            <span className="text-[#333] font-bold text-base group-hover:text-[#E25822] transition-colors cursor-default">
              {item}
            </span>
          </div>
        ))}
      </div>

      {data.description && (
        <div className="pt-6 border-t border-gray-200/50">
          <p className="text-gray-500 text-sm italic leading-relaxed">
            {data.description}
          </p>
        </div>
      )}
    </div>
  );
};

export default SuggestCard;