import React from 'react';
import { Marker, Popup } from 'react-leaflet';
import { Icon, DivIcon } from 'leaflet';
import { Volunteer } from '../types/map';

interface VolunteerMarkerProps {
  volunteer: Volunteer;
}

export const VolunteerMarker: React.FC<VolunteerMarkerProps> = ({ volunteer }) => {
  const customIcon = new DivIcon({
    html: `
      <div style="
        background-color: #F39C12;
        width: 32px;
        height: 32px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: bold;
        font-size: 12px;
        border: 2px solid white;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
      ">
        1
      </div>
    `,
    className: 'custom-marker',
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });

  return (
    <Marker position={[volunteer.lat, volunteer.lng]} icon={customIcon}>
      <Popup>
        <div className="p-2">
          <h3 className="font-bold text-deep-blue mb-2">{volunteer.name}</h3>
          <div className="space-y-1 text-sm">
            <p><strong>Ålder:</strong> {volunteer.age} år</p>
            <p><strong>Kommun:</strong> {volunteer.municipality}</p>
            <p><strong>Intressen:</strong> {volunteer.interests.join(', ')}</p>
            <p><strong>Språk:</strong> {volunteer.languages.join(', ')}</p>
            <p><strong>Tillgänglighet:</strong> {volunteer.availability}</p>
            {volunteer.verified && (
              <span className="inline-block bg-success-green text-white text-xs px-2 py-1 rounded mt-2">
                ✓ Verifierad
              </span>
            )}
          </div>
        </div>
      </Popup>
    </Marker>
  );
};

export default VolunteerMarker;
