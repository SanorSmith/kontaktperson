'use client';

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

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

export default function SearchMap({ volunteers, selectedVolunteer, onSelectVolunteer }: SearchMapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.LayerGroup | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    // Initialize map centered on Stockholm
    mapRef.current = L.map(containerRef.current, {
      center: [59.3293, 18.0686],
      zoom: 10,
      zoomControl: true,
    });

    // Add tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(mapRef.current);

    // Create markers layer group
    markersRef.current = L.layerGroup().addTo(mapRef.current);

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Update markers when volunteers change
  useEffect(() => {
    if (!mapRef.current || !markersRef.current) return;

    // Clear existing markers
    markersRef.current.clearLayers();

    // Create custom icon
    const createIcon = (isSelected: boolean, status: string) => {
      const color = status === 'approved' ? '#006B7D' : '#F39C12';
      const size = isSelected ? 40 : 30;
      
      return L.divIcon({
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
            font-size: ${isSelected ? '16px' : '12px'};
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
    };

    // Add markers for each volunteer
    volunteers.forEach((volunteer) => {
      if (!volunteer.latitude || !volunteer.longitude) return;

      const isSelected = selectedVolunteer?.id === volunteer.id;
      const marker = L.marker([volunteer.latitude, volunteer.longitude], {
        icon: createIcon(isSelected, volunteer.status)
      });

      // Add popup
      marker.bindPopup(`
        <div style="min-width: 150px;">
          <strong>${volunteer.full_name}</strong><br/>
          <span style="color: #666;">${volunteer.municipality}</span><br/>
          <span style="font-size: 12px;">${volunteer.languages.join(', ')}</span>
        </div>
      `);

      // Add click handler
      marker.on('click', () => {
        onSelectVolunteer(volunteer);
      });

      markersRef.current?.addLayer(marker);
    });

    // If a volunteer is selected, pan to their location
    if (selectedVolunteer && selectedVolunteer.latitude && selectedVolunteer.longitude) {
      mapRef.current.setView([selectedVolunteer.latitude, selectedVolunteer.longitude], 13);
    }
  }, [volunteers, selectedVolunteer, onSelectVolunteer]);

  return (
    <div ref={containerRef} className="w-full h-full" style={{ minHeight: '400px' }} />
  );
}
