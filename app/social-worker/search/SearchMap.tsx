'use client';

import { useEffect, useRef, useState } from 'react';
import { MapContainer, GeoJSON, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';

interface Volunteer {
  id: string;
  full_name: string;
  municipality: string;
  latitude: number;
  longitude: number;
  languages: string[];
  status: string;
}

interface SearchMapProps {
  volunteers: Volunteer[];
  selectedVolunteer: Volunteer | null;
  onSelectVolunteer: (volunteer: Volunteer | null) => void;
}

// Get volunteer count for a municipality
const getVolunteerCountByMunicipality = (volunteers: Volunteer[], municipalityName: string): number => {
  return volunteers.filter(v => v.municipality === municipalityName).length;
};

// Get color based on volunteer count
const getColorByCount = (count: number): string => {
  if (count >= 30) return '#003D5C'; // Dark blue - high
  if (count >= 15) return '#006B7D'; // Teal - medium-high
  if (count >= 5) return '#2C3E50';  // Dark grey-blue - medium
  if (count >= 1) return '#4A6572';  // Light grey-blue - low
  return '#6B7B8A';                  // Lightest - none/very low
};

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

// Map controls component
function MapControls() {
  const map = useMap();

  const handleZoomIn = () => map.zoomIn();
  const handleZoomOut = () => map.zoomOut();
  const handleReset = () => {
    map.setView([62.5, 16.0], 5);
  };

  return (
    <div className="absolute top-4 left-4 z-[1000] flex flex-col gap-2">
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

// Volunteer markers component
function VolunteerMarkers({ volunteers, selectedVolunteer, onSelectVolunteer }: { volunteers: Volunteer[]; selectedVolunteer: Volunteer | null; onSelectVolunteer: (v: Volunteer) => void }) {
  const map = useMap();

  useEffect(() => {
    const markers: L.Marker[] = [];

    volunteers.forEach((volunteer) => {
      if (!volunteer.latitude || !volunteer.longitude) return;

      const isSelected = selectedVolunteer?.id === volunteer.id;
      const color = volunteer.status === 'approved' ? '#006B7D' : '#F39C12';
      const size = isSelected ? 40 : 30;

      const icon = L.divIcon({
        className: 'custom-marker',
        html: `
          <div style="
            width: ${size}px;
            height: ${size}px;
            background-color: ${isSelected ? '#F39C12' : color};
            border: 3px solid white;
            border-radius: 50%;
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: bold;
            transform: translate(-50%, -50%);
          ">
            <svg width="${size * 0.5}" height="${size * 0.5}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </div>
        `,
        iconSize: [size, size],
        iconAnchor: [size / 2, size / 2],
      });

      const marker = L.marker([volunteer.latitude, volunteer.longitude], {
        icon,
        zIndexOffset: 1000
      });

      marker.bindPopup(`
        <div style="min-width: 150px;">
          <strong>${volunteer.full_name}</strong><br/>
          <span style="color: #666;">${volunteer.municipality}</span><br/>
          <span style="font-size: 12px;">${volunteer.languages.join(', ')}</span>
        </div>
      `);

      marker.on('click', () => {
        onSelectVolunteer(volunteer);
      });

      marker.addTo(map);
      markers.push(marker);
    });

    if (selectedVolunteer && selectedVolunteer.latitude && selectedVolunteer.longitude) {
      map.setView([selectedVolunteer.latitude, selectedVolunteer.longitude], 13);
    }

    return () => {
      markers.forEach(m => m.remove());
    };
  }, [volunteers, selectedVolunteer, onSelectVolunteer, map]);

  return null;
}

export default function SearchMap({ volunteers, selectedVolunteer, onSelectVolunteer }: SearchMapProps) {
  const geoJsonRef = useRef<L.GeoJSON | null>(null);
  const selectedMunicipalityRef = useRef<string | null>(null);
  const [geoJsonData, setGeoJsonData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load GeoJSON data
  useEffect(() => {
    const loadGeoJsonData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/data/sweden-municipalities.geojson');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setGeoJsonData(data);
      } catch (err) {
        console.error('Failed to load GeoJSON:', err);
      } finally {
        setIsLoading(false);
      }
    };
    loadGeoJsonData();
  }, []);

  // Handle each municipality feature
  const onEachMunicipality = (feature: any, layer: L.Layer) => {
    const props = feature.properties;
    const municipalityName = props.kom_namn || props.name || 'Okänd';
    const volunteerCount = getVolunteerCountByMunicipality(volunteers, municipalityName);
    
    // Store data in layer
    (layer as any)._volunteerCount = volunteerCount;
    (layer as any)._municipalityName = municipalityName;

    // Set initial style
    if (layer instanceof L.Path) {
      layer.setStyle(getDefaultStyle(volunteerCount));
    }

    // Hover events
    layer.on('mouseover', (e: any) => {
      if (selectedMunicipalityRef.current !== municipalityName) {
        e.target.setStyle(getHoverStyle(volunteerCount));
      }
      e.target.bringToFront();
    });

    layer.on('mouseout', (e: any) => {
      if (selectedMunicipalityRef.current !== municipalityName) {
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
      selectedMunicipalityRef.current = municipalityName;
      e.target.setStyle(selectedStyle);
    });

    // Tooltip
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

  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-[#F8F9FA]" style={{ minHeight: '400px' }}>
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#003D5C] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#003D5C] font-medium">Laddar karta...</p>
        </div>
      </div>
    );
  }

  if (!geoJsonData) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-[#F8F9FA]" style={{ minHeight: '400px' }}>
        <p className="text-red-600">Kunde inte ladda kartan</p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full" style={{ minHeight: '400px' }}>
      <MapContainer
        center={[62.5, 16.0]}
        zoom={5}
        minZoom={4}
        maxZoom={10}
        className="w-full h-full"
        zoomControl={false}
        style={{ background: '#F8F9FA', height: '100%', width: '100%' }}
      >
        <GeoJSON
          data={geoJsonData as any}
          onEachFeature={onEachMunicipality}
          ref={geoJsonRef}
        />
        <MapControls />
        <VolunteerMarkers 
          volunteers={volunteers} 
          selectedVolunteer={selectedVolunteer} 
          onSelectVolunteer={onSelectVolunteer}
        />
      </MapContainer>

      {/* Legend */}
      <div className="absolute bottom-4 right-4 z-[1000] bg-white rounded-lg shadow-lg p-3 border border-gray-200">
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
    </div>
  );
}
