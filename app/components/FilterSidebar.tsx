'use client';

import React from 'react';
import { Volunteer, MunicipalityProperties } from '../types/map';
import { X, MapPin, Users, Clock, Languages } from 'lucide-react';

interface FilterSidebarProps {
  volunteers: Volunteer[];
  selectedMunicipality: MunicipalityProperties | null;
  onClearFilter: () => void;
}

export default function FilterSidebar({ volunteers, selectedMunicipality, onClearFilter }: FilterSidebarProps) {
  return (
    <div className="h-full flex flex-col bg-white border-r border-gray-200">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-2xl font-bold text-deep-blue mb-2">Sök Volontärer</h2>
        <p className="text-sm text-gray-600">Hitta rätt kontaktperson för dina klienter</p>
      </div>

      {/* Filter Banner */}
      {selectedMunicipality && (
        <div className="p-4 bg-soft-blue border-b border-blue-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin size={16} className="text-warm-teal" />
              <span className="text-sm font-medium text-deep-blue">
                Filtrerar: {selectedMunicipality.name}
              </span>
            </div>
            <button
              onClick={onClearFilter}
              className="text-sm text-warm-orange hover:text-deep-blue flex items-center gap-1 font-medium"
            >
              <X size={16} />
              Rensa
            </button>
          </div>
        </div>
      )}

      {/* Volunteer Count */}
      <div className="p-4 bg-gray-50 border-b border-gray-200">
        <div className="flex items-center gap-2 text-sm text-gray-700">
          <Users size={16} className="text-warm-teal" />
          <span className="font-medium">{volunteers.length} volontärer hittade</span>
        </div>
      </div>

      {/* Volunteer List */}
      <div className="flex-1 overflow-y-auto p-4">
        {volunteers.length === 0 ? (
          <div className="text-center py-12">
            <Users size={48} className="text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-sm">Inga volontärer hittades</p>
            <p className="text-gray-400 text-xs mt-2">Prova att välja en annan kommun</p>
          </div>
        ) : (
          <div className="space-y-3">
            {volunteers.map((volunteer) => (
              <div
                key={volunteer.id}
                className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-deep-blue">{volunteer.name}</h3>
                  {volunteer.verified && (
                    <span className="text-xs bg-success-green text-white px-2 py-0.5 rounded">
                      ✓ Verifierad
                    </span>
                  )}
                </div>

                <div className="space-y-1.5 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <MapPin size={14} className="text-gray-400" />
                    <span>{volunteer.municipality}, {volunteer.county}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Clock size={14} className="text-gray-400" />
                    <span>{volunteer.availability}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Languages size={14} className="text-gray-400" />
                    <span>{volunteer.languages.join(', ')}</span>
                  </div>
                </div>

                <div className="mt-3 flex flex-wrap gap-1">
                  {volunteer.interests.slice(0, 3).map((interest, idx) => (
                    <span
                      key={idx}
                      className="text-xs bg-soft-blue text-warm-teal px-2 py-1 rounded"
                    >
                      {interest}
                    </span>
                  ))}
                </div>

                <button className="mt-3 w-full bg-deep-blue text-white py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity">
                  Visa profil
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
