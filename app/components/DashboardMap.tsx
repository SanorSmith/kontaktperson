'use client';

import React, { useState, useRef, useEffect } from 'react';
import { MapContainer, GeoJSON, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';

interface Volunteer {
  id: string;
  name: string;
  municipality: string;
  municipalityCode: string;
  status: string;
  languages: string[];
}

interface DashboardMapProps {
  volunteers: Volunteer[];
  onSelectVolunteer: (volunteer: Volunteer) => void;
}

interface GeoJSONData {
  type: string;
  features: any[];
}

// Map controls component
function MapControls() {
  const map = useMap();

  return (
    <div className="absolute top-4 left-4 z-[1000] flex flex-col gap-2">
      <button
        onClick={() => map.zoomIn()}
        className="w-10 h-10 bg-white rounded-lg shadow-md hover:shadow-lg flex items-center justify-center border border-gray-200 transition-all hover:bg-gray-50"
      >
        <ZoomIn size={20} className="text-[#003D5C]" />
      </button>
      <button
        onClick={() => map.zoomOut()}
        className="w-10 h-10 bg-white rounded-lg shadow-md hover:shadow-lg flex items-center justify-center border border-gray-200 transition-all hover:bg-gray-50"
      >
        <ZoomOut size={20} className="text-[#003D5C]" />
      </button>
      <button
        onClick={() => map.setView([62.5, 16.0], 5)}
        className="w-10 h-10 bg-white rounded-lg shadow-md hover:shadow-lg flex items-center justify-center border border-gray-200 transition-all hover:bg-gray-50"
      >
        <RotateCcw size={20} className="text-[#003D5C]" />
      </button>
    </div>
  );
}

// Get volunteer count for a municipality
const getVolunteerCountByMunicipality = (volunteers: Volunteer[], municipalityCode: string, municipalityName: string) => {
  return volunteers.filter(v => 
    v.municipalityCode === municipalityCode || 
    v.municipality.toLowerCase() === municipalityName.toLowerCase()
  ).length;
};

// Get color based on volunteer count
const getColorByCount = (count: number): string => {
  if (count >= 3) return '#003D5C';
  if (count >= 2) return '#006B7D';
  if (count >= 1) return '#2C3E50';
  return '#6B7B8A';
};

export default function DashboardMap({ volunteers, onSelectVolunteer }: DashboardMapProps) {
  const [geoJsonData, setGeoJsonData] = useState<GeoJSONData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMunicipality, setSelectedMunicipality] = useState<string | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const geoJsonRef = useRef<L.GeoJSON | null>(null);

  useEffect(() => {
    const loadGeoJsonData = async () => {
      try {
        const response = await fetch('/data/sweden-municipalities.geojson');
        if (!response.ok) throw new Error('Failed to load GeoJSON');
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

  const getStyle = (count: number, isSelected: boolean): L.PathOptions => ({
    fillColor: getColorByCount(count),
    fillOpacity: isSelected ? 1 : 0.8,
    color: isSelected ? '#F39C12' : '#1A252F',
    weight: isSelected ? 3 : 0.5,
    opacity: 1
  });

  const onEachMunicipality = (feature: any, layer: L.Layer) => {
    const props = feature.properties;
    const municipalityId = props.id || '';
    const municipalityName = props.kom_namn || props.name || 'Okänd';
    const count = getVolunteerCountByMunicipality(volunteers, municipalityId, municipalityName);
    const municipalityVolunteers = volunteers.filter(v => 
      v.municipalityCode === municipalityId || 
      v.municipality.toLowerCase() === municipalityName.toLowerCase()
    );

    if (layer instanceof L.Path) {
      layer.setStyle(getStyle(count, false));
    }

    layer.on('mouseover', (e: any) => {
      if (selectedMunicipality !== municipalityId) {
        e.target.setStyle({
          ...getStyle(count, false),
          color: '#F39C12',
          weight: 2
        });
      }
      e.target.bringToFront();
    });

    layer.on('mouseout', (e: any) => {
      if (selectedMunicipality !== municipalityId) {
        e.target.setStyle(getStyle(count, false));
      }
    });

    layer.on('click', (e: any) => {
      // Reset all styles
      if (geoJsonRef.current) {
        geoJsonRef.current.eachLayer((l: any) => {
          if (l instanceof L.Path) {
            const lProps = (l as any).feature?.properties;
            const lId = lProps?.id || '';
            const lName = lProps?.kom_namn || '';
            const lCount = getVolunteerCountByMunicipality(volunteers, lId, lName);
            l.setStyle(getStyle(lCount, false));
          }
        });
      }

      setSelectedMunicipality(municipalityId);
      e.target.setStyle(getStyle(count, true));

      // If there's exactly one volunteer, select them
      if (municipalityVolunteers.length === 1) {
        onSelectVolunteer(municipalityVolunteers[0]);
      }

      // Zoom to municipality
      if (mapRef.current && layer instanceof L.Polygon) {
        const bounds = layer.getBounds();
        mapRef.current.fitBounds(bounds, { padding: [50, 50], maxZoom: 8 });
      }
    });

    // Tooltip with volunteer info
    const tooltipContent = `
      <div class="font-semibold">${municipalityName}</div>
      <div class="text-xs text-gray-600">${count} volontär${count !== 1 ? 'er' : ''}</div>
      ${municipalityVolunteers.length > 0 ? `
        <div class="text-xs mt-1 border-t pt-1">
          ${municipalityVolunteers.slice(0, 3).map(v => v.name).join('<br>')}
          ${municipalityVolunteers.length > 3 ? `<br>+${municipalityVolunteers.length - 3} till` : ''}
        </div>
      ` : ''}
    `;

    layer.bindTooltip(tooltipContent, {
      sticky: true,
      className: 'custom-map-tooltip',
      direction: 'top'
    });
  };

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

  if (!geoJsonData) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-[#F8F9FA]">
        <p className="text-red-600">Kunde inte ladda kartan</p>
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
      <div className="absolute bottom-4 right-4 z-[1000] bg-white rounded-lg shadow-lg p-3 border border-gray-200">
        <h4 className="text-xs font-semibold text-[#003D5C] mb-2">Volontärer</h4>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: '#003D5C' }}></div>
            <span className="text-xs text-gray-600">3+ volontärer</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: '#006B7D' }}></div>
            <span className="text-xs text-gray-600">2 volontärer</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: '#2C3E50' }}></div>
            <span className="text-xs text-gray-600">1 volontär</span>
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
