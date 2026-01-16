'use client';

import React, { useState, useRef, useEffect } from 'react';
import { MapContainer, GeoJSON, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { ZoomIn, ZoomOut, RotateCcw, X, User, MapPin, LogIn } from 'lucide-react';

// Swedish provinces (län) with volunteer counts
const provinces = [
  { id: 'stockholm', name: 'Stockholms län', volunteers: 245, color: '#4A7BA7', municipalities: 26 },
  { id: 'uppsala', name: 'Uppsala län', volunteers: 89, color: '#5B8DB8', municipalities: 8 },
  { id: 'sodermanland', name: 'Södermanlands län', volunteers: 67, color: '#6B9DC9', municipalities: 9 },
  { id: 'ostergotland', name: 'Östergötlands län', volunteers: 112, color: '#7BAED4', municipalities: 13 },
  { id: 'jonkoping', name: 'Jönköpings län', volunteers: 98, color: '#8BBEE0', municipalities: 13 },
  { id: 'kronoberg', name: 'Kronobergs län', volunteers: 54, color: '#5A7C9E', municipalities: 8 },
  { id: 'kalmar', name: 'Kalmar län', volunteers: 76, color: '#6A8CAF', municipalities: 12 },
  { id: 'gotland', name: 'Gotlands län', volunteers: 32, color: '#7A9CC0', municipalities: 1 },
  { id: 'blekinge', name: 'Blekinge län', volunteers: 45, color: '#8AACD1', municipalities: 5 },
  { id: 'skane', name: 'Skåne län', volunteers: 287, color: '#4E6B8A', municipalities: 33 },
  { id: 'halland', name: 'Hallands län', volunteers: 82, color: '#5E7B9B', municipalities: 6 },
  { id: 'vastra_gotaland', name: 'Västra Götalands län', volunteers: 312, color: '#6E8BAC', municipalities: 49 },
  { id: 'varmland', name: 'Värmlands län', volunteers: 91, color: '#7E9BBD', municipalities: 16 },
  { id: 'orebro', name: 'Örebro län', volunteers: 78, color: '#8EABCE', municipalities: 12 },
  { id: 'vastmanland', name: 'Västmanlands län', volunteers: 63, color: '#527394', municipalities: 10 },
  { id: 'dalarna', name: 'Dalarnas län', volunteers: 95, color: '#6283A5', municipalities: 15 },
  { id: 'gavleborg', name: 'Gävleborgs län', volunteers: 87, color: '#7293B6', municipalities: 10 },
  { id: 'vasternorrland', name: 'Västernorrlands län', volunteers: 71, color: '#82A3C7', municipalities: 7 },
  { id: 'jamtland', name: 'Jämtlands län', volunteers: 48, color: '#92B3D8', municipalities: 8 },
  { id: 'vasterbotten', name: 'Västerbottens län', volunteers: 94, color: '#567A9D', municipalities: 15 },
  { id: 'norrbotten', name: 'Norrbottens län', volunteers: 83, color: '#668AAE', municipalities: 14 },
];

interface Province {
  id: string;
  name: string;
  volunteers: number;
  color: string;
  municipalities: number;
}

interface ProvinceModalProps {
  province: Province;
  onClose: () => void;
  onLogin: () => void;
}

// Province Modal Component
function ProvinceModal({ province, onClose, onLogin }: ProvinceModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[2000] p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden relative">
        {/* Header */}
        <div className="text-white p-6 flex justify-between items-start" style={{ backgroundColor: province.color }}>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">{province.name}</h2>
            <p className="text-sm opacity-90 mt-1 flex items-center gap-2 text-gray-700">
              <MapPin size={14} />
              {province.municipalities} kommuner
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-800 hover:bg-white/20 rounded-lg p-2 transition"
          >
            <X size={24} />
          </button>
        </div>
        
        {/* Volunteer Count Badge */}
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: province.color }}>
                <User size={24} className="text-gray-800" />
              </div>
              <div>
                <p className="text-3xl font-bold text-gray-800">{province.volunteers}</p>
                <p className="text-sm text-gray-600">Tillgängliga volontärer</p>
              </div>
            </div>
            <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
              province.volunteers >= 200 
                ? 'bg-green-100 text-green-700' 
                : province.volunteers >= 100 
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-yellow-100 text-yellow-700'
            }`}>
              {province.volunteers >= 200 ? 'Hög tillgänglighet' : province.volunteers >= 100 ? 'Medel' : 'Låg'}
            </div>
          </div>
        </div>
        
        {/* Content */}
        <div className="p-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <LogIn size={32} className="text-gray-700" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Inloggning krävs</h3>
            <p className="text-gray-600 mb-6 text-sm">
              För att se volontärer i {province.name}, vänligen logga in med ditt arbetsmail.
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

// Map controls component
function MapControls() {
  const map = useMap();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleZoomIn = () => map.zoomIn();
  const handleZoomOut = () => map.zoomOut();
  const handleReset = () => {
    map.setView(isMobile ? [62.0, 15.5] : [62.5, 16.0], isMobile ? 4.0 : 4.25);
  };

  return (
    <div className="absolute top-20 left-6 z-[1000] flex flex-col gap-2">
      <button
        onClick={handleZoomIn}
        className="w-10 h-10 bg-white rounded-lg shadow-md hover:shadow-lg flex items-center justify-center border border-gray-200 transition-all hover:bg-gray-50"
        aria-label="Zoom in"
      >
        <ZoomIn size={20} className="text-gray-700" />
      </button>
      <button
        onClick={handleZoomOut}
        className="w-10 h-10 bg-white rounded-lg shadow-md hover:shadow-lg flex items-center justify-center border border-gray-200 transition-all hover:bg-gray-50"
        aria-label="Zoom out"
      >
        <ZoomOut size={20} className="text-gray-700" />
      </button>
      <button
        onClick={handleReset}
        className="w-10 h-10 bg-white rounded-lg shadow-md hover:shadow-lg flex items-center justify-center border border-gray-200 transition-all hover:bg-gray-50"
        aria-label="Reset view"
      >
        <RotateCcw size={20} className="text-gray-700" />
      </button>
    </div>
  );
}

interface ProvinceMapProps {
  isLoggedIn?: boolean;
  onMunicipalityClick?: (municipalityName: string) => void;
}

export default function ProvinceMap({ isLoggedIn = false, onMunicipalityClick }: ProvinceMapProps = {}) {
  const [selectedProvince, setSelectedProvince] = useState<Province | null>(null);
  const [geoJsonData, setGeoJsonData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const geoJsonRef = useRef<L.GeoJSON | null>(null);
  const selectedIdRef = useRef<string | null>(null);
  const tappedProvinceRef = useRef<string | null>(null);
  const tappedMunicipalityRef = useRef<string | null>(null);
  const [mapKey, setMapKey] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [tappedProvinceId, setTappedProvinceId] = useState<string | null>(null);
  const [tappedMunicipalityName, setTappedMunicipalityName] = useState<string | null>(null);

  // Detect mobile on mount
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Load and process GeoJSON data
  useEffect(() => {
    const loadGeoJsonData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/data/sweden-municipalities.geojson');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Store the raw data for municipality view
        setGeoJsonData(data);
        
        // For province view, we'll style municipalities by province but keep them separate
        // This avoids complex geometry merging issues
        const enhancedFeatures = data.features.map((feature: any) => {
          const countyCode = feature.properties.lan_code?.substring(0, 2);
          const provinceId = countyToProvince[countyCode];
          const province = provinces.find(p => p.id === provinceId);
          
          return {
            ...feature,
            properties: {
              ...feature.properties,
              provinceId,
              provinceName: province?.name,
              provinceColor: province?.color,
              provinceVolunteers: province?.volunteers,
              provinceMunicipalities: province?.municipalities
            }
          };
        });
        
        setProvinceGeoJSON({
          type: 'FeatureCollection',
          features: enhancedFeatures
        });
        
        setGeoJsonData(data);
        setError(null);
      } catch (err) {
        console.error('Failed to load GeoJSON:', err);
        setError(err instanceof Error ? err.message : 'Failed to load map data');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadGeoJsonData();
  }, []);

  const [zoomedProvince, setZoomedProvince] = useState<string | null>(null);
  const [provinceGeoJSON, setProvinceGeoJSON] = useState<any>(null);

  // County code to province mapping
  const countyToProvince: Record<string, string> = {
    '01': 'stockholm',
    '03': 'uppsala',
    '04': 'sodermanland',
    '05': 'ostergotland',
    '06': 'jonkoping',
    '07': 'kronoberg',
    '08': 'kalmar',
    '09': 'gotland',
    '10': 'blekinge',
    '12': 'skane',
    '13': 'halland',
    '14': 'vastra_gotaland',
    '17': 'varmland',
    '18': 'orebro',
    '19': 'vastmanland',
    '20': 'dalarna',
    '21': 'gavleborg',
    '22': 'vasternorrland',
    '23': 'jamtland',
    '24': 'vasterbotten',
    '25': 'norrbotten',
  };

  // Get province data by county code
  const getProvinceByCounty = (countyCode: string): Province | null => {
    const provinceId = countyToProvince[countyCode];
    return provinces.find(p => p.id === provinceId) || null;
  };

  // Handle province features (individual municipalities styled by province)
  const onEachProvince = (feature: any, layer: L.Layer) => {
    const props = feature.properties;
    const provinceId = props.provinceId;
    const province = provinces.find(p => p.id === provinceId);
    
    if (!province) return;

    // Store province data
    (layer as any)._province = province;
    (layer as any)._provinceId = provinceId;

    // Set initial style - no visible borders on province view
    if (layer instanceof L.Path) {
      layer.setStyle({
        fillColor: province.color,
        fillOpacity: 0.85,
        color: province.color,
        weight: 0,
        opacity: 0
      });
    }

    // Hover events - highlight entire province
    layer.on('mouseover', (e: any) => {
      if (selectedIdRef.current !== provinceId) {
        // Highlight all municipalities in this province
        if (geoJsonRef.current) {
          geoJsonRef.current.eachLayer((l: any) => {
            if (l._provinceId === provinceId && l instanceof L.Path) {
              l.setStyle({
                fillColor: province.color,
                fillOpacity: 0.95,
                color: province.color,
                weight: 0,
                opacity: 0
              });
              l.bringToFront();
            }
          });
        }
      }
    });

    layer.on('mouseout', (e: any) => {
      if (selectedIdRef.current !== provinceId) {
        // Reset all municipalities in this province
        if (geoJsonRef.current) {
          geoJsonRef.current.eachLayer((l: any) => {
            if (l._provinceId === provinceId && l instanceof L.Path) {
              l.setStyle({
                fillColor: province.color,
                fillOpacity: 0.85,
                color: province.color,
                weight: 0,
                opacity: 0
              });
            }
          });
        }
      }
    });

    // Click event - mobile-friendly tap interaction
    layer.on('click', (e: any) => {
      // On mobile: first tap shows info, second tap confirms and zooms
      if (window.innerWidth < 768) {
        if (tappedProvinceRef.current === provinceId) {
          // Second tap - confirm and zoom
          selectedIdRef.current = provinceId;
          setZoomedProvince(provinceId);
          tappedProvinceRef.current = null;
          setTappedProvinceId(null);

          // Calculate bounds for entire province
          const provinceBounds = L.latLngBounds([]);
          if (geoJsonRef.current) {
            geoJsonRef.current.eachLayer((l: any) => {
              if (l._provinceId === provinceId && l instanceof L.Path) {
                provinceBounds.extend((l as any).getBounds());
              }
            });
          }

          // Zoom to province bounds
          if (mapRef.current && provinceBounds.isValid()) {
            mapRef.current.fitBounds(provinceBounds, { 
              padding: [100, 100], 
              maxZoom: 7.5, 
              duration: 0,
              animate: false
            });
          }
        } else {
          // First tap - show info and highlight
          tappedProvinceRef.current = provinceId;
          setTappedProvinceId(provinceId);
          
          // Highlight the province
          if (geoJsonRef.current) {
            geoJsonRef.current.eachLayer((l: any) => {
              if (l._provinceId === provinceId && l instanceof L.Path) {
                l.setStyle({
                  fillColor: province.color,
                  fillOpacity: 0.95,
                  color: province.color,
                  weight: 0,
                  opacity: 0
                });
                l.bringToFront();
              }
            });
          }
        }
      } else {
        // Desktop - immediate zoom
        selectedIdRef.current = provinceId;
        setZoomedProvince(provinceId);

        // Calculate bounds for entire province
        const provinceBounds = L.latLngBounds([]);
        if (geoJsonRef.current) {
          geoJsonRef.current.eachLayer((l: any) => {
            if (l._provinceId === provinceId && l instanceof L.Path) {
              provinceBounds.extend((l as any).getBounds());
            }
          });
        }

        // Zoom to province bounds
        if (mapRef.current && provinceBounds.isValid()) {
          mapRef.current.fitBounds(provinceBounds, { 
            padding: [100, 100], 
            maxZoom: 7.5, 
            duration: 0,
            animate: false
          });
        }
      }
    });

    // Tooltip for province
    layer.bindTooltip(
      `<div class="font-semibold">${province.name}</div>
       <div class="text-xs text-gray-600">${province.volunteers} volontärer • ${province.municipalities} kommuner</div>`,
      {
        sticky: true,
        className: 'custom-map-tooltip',
        direction: 'top'
      }
    );
  };

  // Handle municipality features (detailed view when zoomed)
  const onEachMunicipality = (feature: any, layer: L.Layer) => {
    const props = feature.properties;
    const countyCode = props.lan_code?.substring(0, 2);
    const province = getProvinceByCounty(countyCode);
    const municipalityName = props.kom_namn || props.name || 'Okänd';
    
    if (!province) return;

    // Only show if this municipality belongs to zoomed province
    if (zoomedProvince !== province.id) {
      return;
    }

    // Set style for municipality
    if (layer instanceof L.Path) {
      layer.setStyle({
        fillColor: province.color,
        fillOpacity: 0.7,
        color: '#2d4a5e',
        weight: 0.8,
        opacity: 0.5
      });
    }

    // Hover
    layer.on('mouseover', (e: any) => {
      e.target.setStyle({
        fillColor: province.color,
        fillOpacity: 0.9,
        color: '#2d4a5e',
        weight: 0.8,
        opacity: 0.6
      });
    });

    layer.on('mouseout', (e: any) => {
      e.target.setStyle({
        fillColor: province.color,
        fillOpacity: 0.7,
        color: '#2d4a5e',
        weight: 0.8,
        opacity: 0.5
      });
    });

    // Click event - mobile-friendly tap interaction for municipalities
    layer.on('click', (e: any) => {
      // If logged in and callback provided, filter volunteers by kommun
      if (isLoggedIn && onMunicipalityClick) {
        onMunicipalityClick(municipalityName);
        return;
      }
      
      // On mobile: first tap shows info, second tap confirms and shows modal
      if (window.innerWidth < 768) {
        if (tappedMunicipalityRef.current === municipalityName) {
          // Second tap - confirm and show modal
          tappedMunicipalityRef.current = null;
          setTappedMunicipalityName(null);
          setSelectedProvince(province);
        } else {
          // First tap - show info and highlight
          tappedMunicipalityRef.current = municipalityName;
          setTappedMunicipalityName(municipalityName);
          
          // Highlight the municipality
          e.target.setStyle({
            fillColor: province.color,
            fillOpacity: 0.9,
            color: '#2d4a5e',
            weight: 0.8,
            opacity: 0.6
          });
        }
      } else {
        // Desktop - immediate modal
        setSelectedProvince(province);
      }
    });

    // Tooltip
    layer.bindTooltip(
      `<div class="font-semibold">${municipalityName}</div>
       <div class="text-xs text-gray-600">Kommun i ${province.name}</div>`,
      {
        sticky: true,
        className: 'custom-map-tooltip',
        direction: 'top'
      }
    );
  };

  // Close modal handler
  const handleCloseModal = () => {
    setSelectedProvince(null);
    selectedIdRef.current = null;
    setZoomedProvince(null);

    // Reset map view
    if (mapRef.current) {
      mapRef.current.setView([62.5, 16.0], 5);
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
          <div className="w-12 h-12 border-4 border-gray-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-700 font-medium">Laddar karta...</p>
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
        key={mapKey}
        center={isMobile ? [62.0, 15.5] : [62.5, 16.0]}
        zoom={isMobile ? 4.0 : 4.25}
        minZoom={isMobile ? 4.0 : 4.25}
        maxZoom={8}
        maxBounds={[[55, 10], [70, 25]]}
        maxBoundsViscosity={1.0}
        className="w-full h-full"
        zoomControl={false}
        scrollWheelZoom={true}
        dragging={true}
        doubleClickZoom={false}
        ref={mapRef}
        style={{ background: '#F8F9FA', height: '100%', width: '100%' }}
      >
        {/* Show province-level view when not zoomed */}
        {!zoomedProvince && provinceGeoJSON && (
          <GeoJSON
            key="provinces"
            data={provinceGeoJSON}
            onEachFeature={onEachProvince}
            ref={geoJsonRef}
          />
        )}
        
        {/* Show municipality-level view when zoomed into a province */}
        {zoomedProvince && geoJsonData && (
          <GeoJSON
            key={`municipalities-${zoomedProvince}`}
            data={{
              type: 'FeatureCollection',
              features: geoJsonData.features.filter((f: any) => {
                const countyCode = f.properties.lan_code?.substring(0, 2);
                const provinceId = countyToProvince[countyCode];
                return provinceId === zoomedProvince;
              })
            } as any}
            onEachFeature={onEachMunicipality}
          />
        )}
        
        <MapControls />
      </MapContainer>

      {/* Legend/Keys - Bottom right on desktop, top right on mobile */}
      <div className="absolute top-4 md:top-auto md:bottom-6 right-4 md:right-6 z-[1000] bg-white/95 rounded-lg shadow-lg px-4 py-3 border border-gray-200">
        {tappedMunicipalityName && isMobile ? (
          <p className="text-xs md:text-sm font-semibold text-[#F39C12]">Tryck igen för att se volontärer</p>
        ) : tappedProvinceId && isMobile ? (
          <p className="text-xs md:text-sm font-semibold text-[#F39C12]">Tryck igen för att bekräfta</p>
        ) : (
          <p className="text-xs md:text-sm font-semibold text-gray-800">Klicka på ett län för att se kommuner</p>
        )}
      </div>

      {/* Selected Province Modal */}
      {selectedProvince && (
        <ProvinceModal
          province={selectedProvince}
          onClose={handleCloseModal}
          onLogin={handleLogin}
        />
      )}
    </div>
  );
}
