'use client';

import React, { useState, useRef, useMemo, useCallback } from 'react';
import { MapContainer, TileLayer, GeoJSON, useMap } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MunicipalityProperties, Volunteer } from '../types/map';
import { swedenMunicipalitiesGeoJSON, mockVolunteers } from '../lib/municipalityData';
import { getStyleForCount, getHoverStyle, getSelectedStyle } from '../lib/mapUtils';
import MapLegend from './MapLegend';
import VolunteerMarker from './VolunteerMarker';
import { ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';

interface SwedishMapProps {
  onMunicipalitySelect?: (municipality: MunicipalityProperties | null) => void;
  selectedMunicipality?: MunicipalityProperties | null;
}

// Map controls component
function MapControls() {
  const map = useMap();

  const handleZoomIn = () => map.zoomIn();
  const handleZoomOut = () => map.zoomOut();
  const handleReset = () => {
    map.setView([62.0, 15.0], 5);
  };

  return (
    <div className="absolute top-6 left-6 z-[1000] flex flex-col gap-2">
      <button
        onClick={handleZoomIn}
        className="w-10 h-10 bg-white rounded-lg shadow-md hover:shadow-lg flex items-center justify-center border border-gray-200 transition-all"
        aria-label="Zoom in"
      >
        <ZoomIn size={20} className="text-deep-blue" />
      </button>
      <button
        onClick={handleZoomOut}
        className="w-10 h-10 bg-white rounded-lg shadow-md hover:shadow-lg flex items-center justify-center border border-gray-200 transition-all"
        aria-label="Zoom out"
      >
        <ZoomOut size={20} className="text-deep-blue" />
      </button>
      <button
        onClick={handleReset}
        className="w-10 h-10 bg-white rounded-lg shadow-md hover:shadow-lg flex items-center justify-center border border-gray-200 transition-all"
        aria-label="Reset view"
      >
        <RotateCcw size={20} className="text-deep-blue" />
      </button>
    </div>
  );
}

export default function SwedishMap({ onMunicipalitySelect, selectedMunicipality }: SwedishMapProps) {
  const [hoveredMunicipality, setHoveredMunicipality] = useState<MunicipalityProperties | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const geoJsonLayerRef = useRef<L.GeoJSON | null>(null);

  // Handle municipality interactions
  const onEachMunicipality = useCallback((feature: any, layer: L.Layer) => {
    const properties = feature.properties as MunicipalityProperties;
    const volunteerCount = properties.volunteerCount || 0;

    // Set initial style
    if (layer instanceof L.Path) {
      layer.setStyle(getStyleForCount(volunteerCount));
    }

    // Hover events
    layer.on('mouseover', (e) => {
      setHoveredMunicipality(properties);
      if (e.target instanceof L.Path) {
        e.target.setStyle({
          ...getHoverStyle(),
          fillColor: e.target.options.fillColor,
        });
      }
    });

    layer.on('mouseout', (e) => {
      setHoveredMunicipality(null);
      if (e.target instanceof L.Path) {
        if (selectedMunicipality?.id !== properties.id) {
          e.target.setStyle(getStyleForCount(volunteerCount));
        }
      }
    });

    // Click event
    layer.on('click', (e) => {
      if (onMunicipalitySelect) {
        onMunicipalitySelect(properties);
      }
      
      // Zoom to municipality
      if (e.target instanceof L.Path && mapRef.current) {
        const bounds = e.target.getBounds();
        mapRef.current.fitBounds(bounds, { padding: [50, 50] });
      }
    });

    // Bind tooltip
    const tooltipContent = `
      <div class="p-2">
        <h3 class="font-bold text-sm">${properties.name}</h3>
        <p class="text-xs text-gray-600">${properties.county}</p>
        <p class="text-xs mt-1">${volunteerCount} volontärer</p>
      </div>
    `;
    
    layer.bindTooltip(tooltipContent, {
      sticky: true,
      className: 'custom-tooltip',
      direction: 'top'
    });
  }, [onMunicipalitySelect, selectedMunicipality]);

  // Update styles when selection changes
  React.useEffect(() => {
    if (geoJsonLayerRef.current) {
      geoJsonLayerRef.current.eachLayer((layer) => {
        if (layer instanceof L.Path && layer.feature) {
          const properties = layer.feature.properties as MunicipalityProperties;
          if (selectedMunicipality?.id === properties.id) {
            layer.setStyle(getSelectedStyle());
          } else {
            layer.setStyle(getStyleForCount(properties.volunteerCount || 0));
          }
        }
      });
    }
  }, [selectedMunicipality]);

  return (
    <div className="relative w-full h-full">
      <MapContainer
        center={[62.0, 15.0]}
        zoom={5}
        minZoom={4}
        maxZoom={10}
        className="w-full h-full"
        zoomControl={false}
        ref={mapRef}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />

        <GeoJSON
          data={swedenMunicipalitiesGeoJSON}
          onEachFeature={onEachMunicipality}
          ref={geoJsonLayerRef}
        />

        <MarkerClusterGroup
          chunkedLoading
          maxClusterRadius={50}
          iconCreateFunction={(cluster) => {
            const count = cluster.getChildCount();
            let size = 40;
            if (count > 10) size = 50;
            if (count > 50) size = 60;

            return L.divIcon({
              html: `<div style="
                background-color: #F39C12;
                width: ${size}px;
                height: ${size}px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-weight: bold;
                font-size: 14px;
                border: 3px solid white;
                box-shadow: 0 2px 8px rgba(0,0,0,0.3);
              ">${count}</div>`,
              className: 'custom-cluster-icon',
              iconSize: L.point(size, size),
            });
          }}
        >
          {mockVolunteers.map((volunteer) => (
            <VolunteerMarker key={volunteer.id} volunteer={volunteer} />
          ))}
        </MarkerClusterGroup>

        <MapControls />
      </MapContainer>

      <MapLegend />
    </div>
  );
}
