import React from 'react';
import { TooltipData } from '../types/map';
import { formatVolunteerCount } from '../lib/mapUtils';
import { Users } from 'lucide-react';

interface MapTooltipProps {
  data: TooltipData;
}

export const MapTooltip: React.FC<MapTooltipProps> = ({ data }) => {
  return (
    <div className="bg-white border-2 border-soft-blue rounded-lg shadow-lg p-4 min-w-[200px]">
      <h3 className="font-bold text-base text-deep-blue mb-1">
        {data.municipalityName}
      </h3>
      <p className="text-sm text-gray-600 mb-2">
        {data.countyName}
      </p>
      <div className="flex items-center gap-2 text-sm text-gray-700 mb-2">
        <Users size={16} className="text-warm-orange" />
        <span>{formatVolunteerCount(data.volunteerCount)}</span>
      </div>
      <p className="text-xs italic text-gray-500">
        Klicka för att filtrera
      </p>
    </div>
  );
};

export default MapTooltip;
