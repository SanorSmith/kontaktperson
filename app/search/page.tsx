'use client';

import React, { useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { MunicipalityProperties } from '../types/map';
import { mockVolunteers, getVolunteersByMunicipality } from '../lib/municipalityData';
import FilterSidebar from '../components/FilterSidebar';

// Dynamically import map to avoid SSR issues with Leaflet
const SwedishMap = dynamic(() => import('../components/SwedishMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-deep-blue mx-auto mb-4"></div>
        <p className="text-gray-600">Laddar karta...</p>
      </div>
    </div>
  ),
});

export default function SearchPage() {
  const [selectedMunicipality, setSelectedMunicipality] = useState<MunicipalityProperties | null>(null);
  const [showMobileMap, setShowMobileMap] = useState(false);

  // Filter volunteers based on selected municipality
  const filteredVolunteers = useMemo(() => {
    if (!selectedMunicipality) {
      return mockVolunteers;
    }
    return getVolunteersByMunicipality(selectedMunicipality.name);
  }, [selectedMunicipality]);

  const handleMunicipalitySelect = (municipality: MunicipalityProperties | null) => {
    setSelectedMunicipality(municipality);
  };

  const handleClearFilter = () => {
    setSelectedMunicipality(null);
  };

  return (
    <div className="h-screen flex flex-col">
      {/* Mobile Tab Navigation */}
      <div className="md:hidden flex border-b border-gray-200 bg-white">
        <button
          onClick={() => setShowMobileMap(false)}
          className={`flex-1 py-3 text-sm font-medium ${
            !showMobileMap
              ? 'text-deep-blue border-b-2 border-deep-blue'
              : 'text-gray-500'
          }`}
        >
          Lista ({filteredVolunteers.length})
        </button>
        <button
          onClick={() => setShowMobileMap(true)}
          className={`flex-1 py-3 text-sm font-medium ${
            showMobileMap
              ? 'text-deep-blue border-b-2 border-deep-blue'
              : 'text-gray-500'
          }`}
        >
          Karta
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar - Desktop always visible, Mobile conditional */}
        <div
          className={`w-full md:w-2/5 lg:w-2/5 ${
            showMobileMap ? 'hidden md:block' : 'block'
          }`}
        >
          <FilterSidebar
            volunteers={filteredVolunteers}
            selectedMunicipality={selectedMunicipality}
            onClearFilter={handleClearFilter}
          />
        </div>

        {/* Map - Desktop always visible, Mobile conditional */}
        <div
          className={`w-full md:w-3/5 lg:w-3/5 ${
            !showMobileMap ? 'hidden md:block' : 'block'
          }`}
        >
          <SwedishMap
            onMunicipalitySelect={handleMunicipalitySelect}
            selectedMunicipality={selectedMunicipality}
          />
        </div>
      </div>
    </div>
  );
}
