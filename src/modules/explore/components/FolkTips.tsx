import React from 'react';
import { Sparkles } from 'lucide-react';

const FolkTips = ({ data }) => {
  if (!data || data.length === 0) return null;

  return (
    <div className="bg-orange-50 rounded-[32px] p-8 border border-orange-100 shadow-sm overflow-hidden relative group">
      {/* Decorative element */}
      <div className="absolute -top-6 -right-6 w-24 h-24 bg-orange-100/50 rounded-full group-hover:scale-150 transition-transform duration-700" />
      
      <div className="flex items-center gap-3 mb-6 relative z-10">
        <div className="bg-[#E25822] p-2 rounded-xl text-white shadow-lg shadow-orange-200">
          <Sparkles size={18} />
        </div>
        <h3 className="text-lg font-black text-orange-900 uppercase tracking-tight">Mẹo dân gian</h3>
      </div>

      <div className="space-y-4 relative z-10">
        {data.map((tip, index) => (
          <div key={index} className="flex gap-3">
            <span className="text-[#E25822] font-black">•</span>
            <p className="text-orange-800/80 text-base font-medium leading-relaxed">
              {tip}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FolkTips;