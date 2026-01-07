import React from 'react';

export const MapLegend: React.FC = () => {
  return (
    <div className="absolute bottom-6 right-6 bg-white rounded-xl shadow-lg p-4 border border-gray-200 z-[1000]">
      <h3 className="font-semibold text-sm text-deep-blue mb-3">
        Volontärdensitet
      </h3>
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 rounded bg-gray-200 border border-gray-300"></div>
          <span className="text-xs text-gray-700">0 volontärer</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 rounded bg-[#99F6E4] border border-[#5EEAD4]"></div>
          <span className="text-xs text-gray-700">1-5 volontärer</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 rounded bg-[#2DD4BF] border border-[#14B8A6]"></div>
          <span className="text-xs text-gray-700">6-15 volontärer</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 rounded bg-[#0D9488] border border-[#0F766E]"></div>
          <span className="text-xs text-gray-700">16+ volontärer</span>
        </div>
      </div>
    </div>
  );
};

export default MapLegend;
