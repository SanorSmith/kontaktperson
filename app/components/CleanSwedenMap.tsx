'use client';

import React, { useState, useRef, useEffect } from 'react';
import { MapContainer, GeoJSON, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { ZoomIn, ZoomOut, RotateCcw, X, User, MapPin, LogIn } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Municipality {
  id: string;
  name: string;
  county: string;
  volunteerCount: number;
}

interface GeoJSONData {
  type: string;
  features: any[];
}

// Simulated volunteer counts per municipality (in real app, this would come from database)
const volunteerCounts: Record<string, number> = {
  '0180': 45, // Stockholm
  '1480': 32, // Göteborg
  '1280': 28, // Malmö
  '0380': 18, // Uppsala
  '0580': 15, // Linköping
  '0680': 12, // Jönköping
  '1080': 14, // Karlskrona
  '1880': 11, // Örebro
  '2180': 9,  // Gävle
  '2480': 7,  // Umeå
  '2580': 5,  // Luleå
  '0184': 8,  // Solna
  '0162': 6,  // Danderyd
  '0138': 4,  // Tyresö
  '0192': 5,  // Nynäshamn
  '1486': 3,  // Strömstad
  '1763': 2,  // Forshaga
  '2081': 4,  // Borlänge
  '2462': 3,  // Vilhelmina
  '2584': 2,  // Kiruna
};

// Get volunteer count for a municipality
const getVolunteerCount = (id: string): number => {
  return volunteerCounts[id] || Math.floor(Math.random() * 10); // Random fallback for demo
};

// Get color based on volunteer count
const getColorByCount = (count: number): string => {
  if (count >= 30) return '#003D5C'; // Dark blue - high
  if (count >= 15) return '#006B7D'; // Teal - medium-high
  if (count >= 5) return '#2C3E50';  // Dark grey-blue - medium
  if (count >= 1) return '#4A6572';  // Light grey-blue - low
  return '#6B7B8A';                  // Lightest - none/very low
};

// Map controls component
function MapControls() {
  const map = useMap();

  const handleZoomIn = () => map.zoomIn();
  const handleZoomOut = () => map.zoomOut();
  const handleReset = () => {
    map.setView([62.5, 16.0], 5);
  };

  return (
    <div className="absolute top-20 left-6 z-[1000] flex flex-col gap-2">
      <button
        onClick={handleZoomIn}
        className="w-10 h-10 bg-white rounded-lg shadow-md hover:shadow-lg flex items-center justify-center border border-gray-200 transition-all hover:bg-gray-50"
        aria-label="Zoom in"
      >
        <ZoomIn size={20} className="text-[#003D5C]" />
      </button>
      <button
        onClick={handleZoomOut}
        className="w-10 h-10 bg-white rounded-lg shadow-md hover:shadow-lg flex items-center justify-center border border-gray-200 transition-all hover:bg-gray-50"
        aria-label="Zoom out"
      >
        <ZoomOut size={20} className="text-[#003D5C]" />
      </button>
      <button
        onClick={handleReset}
        className="w-10 h-10 bg-white rounded-lg shadow-md hover:shadow-lg flex items-center justify-center border border-gray-200 transition-all hover:bg-gray-50"
        aria-label="Reset view"
      >
        <RotateCcw size={20} className="text-[#003D5C]" />
      </button>
    </div>
  );
}

// Municipality Modal Component
function MunicipalityModal({ municipality, onClose, onLogin }: { municipality: Municipality; onClose: () => void; onLogin: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[2000] p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden relative">
        {/* Header */}
        <div className="bg-[#003D5C] text-white p-6 flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold">{municipality.name}</h2>
            <p className="text-sm opacity-90 mt-1 flex items-center gap-2">
              <MapPin size={14} />
              {municipality.county || 'Sverige'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/20 rounded-lg p-2 transition"
          >
            <X size={24} />
          </button>
        </div>
        
        {/* Volunteer Count Badge */}
        <div className="bg-[#E8F4F8] px-6 py-4 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-[#003D5C] rounded-full flex items-center justify-center">
                <User size={24} className="text-white" />
              </div>
              <div>
                <p className="text-3xl font-bold text-[#003D5C]">{municipality.volunteerCount}</p>
                <p className="text-sm text-gray-600">Tillgängliga volontärer</p>
              </div>
            </div>
            <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
              municipality.volunteerCount >= 10 
                ? 'bg-green-100 text-green-700' 
                : municipality.volunteerCount >= 5 
                  ? 'bg-yellow-100 text-yellow-700'
                  : 'bg-red-100 text-red-700'
            }`}>
              {municipality.volunteerCount >= 10 ? 'Hög tillgänglighet' : municipality.volunteerCount >= 5 ? 'Medel' : 'Låg'}
            </div>
          </div>
        </div>
        
        {/* Content */}
        <div className="p-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-[#E8F4F8] rounded-full flex items-center justify-center mx-auto mb-4">
              <LogIn size={32} className="text-[#003D5C]" />
            </div>
            <h3 className="text-xl font-bold text-[#003D5C] mb-2">Inloggning krävs</h3>
            <p className="text-gray-600 mb-6 text-sm">
              För att se volontärer i {municipality.name}, vänligen logga in med ditt arbetsmail.
            </p>
            <button 
              onClick={onLogin}
              className="w-full bg-[#F39C12] hover:bg-[#E67E22] text-white font-semibold py-3 rounded-lg transition flex items-center justify-center gap-2"
            >
              <LogIn size={20} />
              Gå till inloggning
            </button>
            <button
              onClick={onClose}
              className="mt-4 text-sm text-gray-500 hover:text-gray-700"
            >
              ← Stäng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Style functions based on volunteer count
const getDefaultStyle = (count: number): L.PathOptions => ({
  fillColor: getColorByCount(count),
  fillOpacity: 0.9,
  color: '#1A252F',
  weight: 0.5,
  opacity: 1
});

const getHoverStyle = (count: number): L.PathOptions => ({
  fillColor: getColorByCount(count),
  fillOpacity: 1,
  color: '#F39C12',
  weight: 2,
  opacity: 1
});

const selectedStyle: L.PathOptions = {
  fillColor: '#F39C12',
  fillOpacity: 0.9,
  color: '#003D5C',
  weight: 3,
  opacity: 1
};

export default function CleanSwedenMap() {
  const [selectedMunicipality, setSelectedMunicipality] = useState<Municipality | null>(null);
  const [geoJsonData, setGeoJsonData] = useState<GeoJSONData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const geoJsonRef = useRef<L.GeoJSON | null>(null);
  const selectedIdRef = useRef<string | null>(null);

  // Load GeoJSON data
  useEffect(() => {
    const loadGeoJsonData = async () => {
      try {
        setIsLoading(true);
        console.log('Loading Sweden GeoJSON...');
        
        const response = await fetch('/data/sweden-municipalities.geojson');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (!data.features || data.features.length === 0) {
          throw new Error('Invalid GeoJSON: no features found');
        }
        
        console.log('✅ GeoJSON loaded:', data.features.length, 'municipalities');
        setGeoJsonData(data);
        setError(null);
      } catch (err) {
        console.error('❌ Failed to load GeoJSON:', err);
        setError(err instanceof Error ? err.message : 'Failed to load map data');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadGeoJsonData();
  }, []);

  // Handle each municipality feature
  const onEachMunicipality = (feature: any, layer: L.Layer) => {
    const props = feature.properties;
    const municipalityId = props.id || props.kom_namn;
    const municipalityName = props.kom_namn || props.name || 'Okänd';
    const volunteerCount = getVolunteerCount(municipalityId);
    
    // Store count in layer for later use
    (layer as any)._volunteerCount = volunteerCount;
    (layer as any)._municipalityId = municipalityId;

    // Set initial style based on volunteer count
    if (layer instanceof L.Path) {
      layer.setStyle(getDefaultStyle(volunteerCount));
    }

    // Hover events
    layer.on('mouseover', (e: any) => {
      if (selectedIdRef.current !== municipalityId) {
        e.target.setStyle(getHoverStyle(volunteerCount));
      }
      e.target.bringToFront();
    });

    layer.on('mouseout', (e: any) => {
      if (selectedIdRef.current !== municipalityId) {
        e.target.setStyle(getDefaultStyle(volunteerCount));
      }
    });

    // Click event
    layer.on('click', (e: any) => {
      // Reset previous selection
      if (geoJsonRef.current) {
        geoJsonRef.current.eachLayer((l: any) => {
          if (l instanceof L.Path) {
            const count = (l as any)._volunteerCount || 0;
            l.setStyle(getDefaultStyle(count));
          }
        });
      }

      // Set new selection
      selectedIdRef.current = municipalityId;
      e.target.setStyle(selectedStyle);
      
      setSelectedMunicipality({
        id: municipalityId,
        name: municipalityName,
        county: props.lan_code ? `Län ${props.lan_code}` : '',
        volunteerCount: volunteerCount
      });

      // Zoom to municipality
      if (mapRef.current && layer instanceof L.Polygon) {
        const bounds = layer.getBounds();
        mapRef.current.fitBounds(bounds, { padding: [50, 50], maxZoom: 8 });
      }
    });

    // Tooltip with volunteer count
    layer.bindTooltip(
      `<div class="font-semibold">${municipalityName}</div>
       <div class="text-xs text-gray-600">${volunteerCount} volontärer</div>`,
      {
        sticky: true,
        className: 'custom-map-tooltip',
        direction: 'top'
      }
    );
  };

  // Close modal handler
  const handleCloseModal = () => {
    setSelectedMunicipality(null);
    selectedIdRef.current = null;
    
    // Reset all styles
    if (geoJsonRef.current) {
      geoJsonRef.current.eachLayer((layer: any) => {
        if (layer instanceof L.Path) {
          const count = (layer as any)._volunteerCount || 0;
          layer.setStyle(getDefaultStyle(count));
        }
      });
    }
  };

  // Handle login navigation
  const handleLogin = () => {
    window.location.href = '/login?redirect=/social-worker/search';
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-[#F8F9FA]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#003D5C] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#003D5C] font-medium">Laddar karta...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !geoJsonData) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-[#F8F9FA]">
        <div className="text-center p-8">
          <p className="text-red-600 font-medium mb-2">Kunde inte ladda kartan</p>
          <p className="text-gray-500 text-sm">{error || 'Okänt fel'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full bg-[#F8F9FA]">
      <MapContainer
        center={[62.5, 16.0]}
        zoom={5}
        minZoom={4}
        maxZoom={10}
        className="w-full h-full"
        zoomControl={false}
        ref={mapRef}
        style={{ background: '#F8F9FA', height: '100%', width: '100%' }}
      >
        <GeoJSON
          data={geoJsonData as any}
          onEachFeature={onEachMunicipality}
          ref={geoJsonRef}
        />
        <MapControls />
      </MapContainer>

      {/* Legend */}
      <div className="absolute bottom-4 right-4 md:bottom-6 md:right-6 z-[1000] bg-white rounded-lg shadow-lg p-3 md:p-4 border border-gray-200">
        <h4 className="text-xs font-semibold text-[#003D5C] mb-2">Volontärer per kommun</h4>
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: '#003D5C' }}></div>
            <span className="text-xs text-gray-600">30+ volontärer</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: '#006B7D' }}></div>
            <span className="text-xs text-gray-600">15-29 volontärer</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: '#2C3E50' }}></div>
            <span className="text-xs text-gray-600">5-14 volontärer</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: '#4A6572' }}></div>
            <span className="text-xs text-gray-600">1-4 volontärer</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: '#6B7B8A' }}></div>
            <span className="text-xs text-gray-600">0 volontärer</span>
          </div>
        </div>
      </div>

      {/* Selected Municipality Modal */}
      {selectedMunicipality && (
        <MunicipalityModal
          municipality={selectedMunicipality}
          onClose={handleCloseModal}
          onLogin={handleLogin}
        />
      )}
    </div>
  );
}
