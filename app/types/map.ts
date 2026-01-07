export interface MunicipalityProperties {
  id: string;
  name: string;
  county: string;
  code: string;
  volunteerCount: number;
}

export interface MunicipalityFeature {
  type: 'Feature';
  properties: MunicipalityProperties;
  geometry: {
    type: 'Polygon' | 'MultiPolygon';
    coordinates: number[][][] | number[][][][];
  };
}

export interface MunicipalityGeoJSON {
  type: 'FeatureCollection';
  features: MunicipalityFeature[];
}

export interface Volunteer {
  id: number;
  name: string;
  municipality: string;
  county: string;
  lat: number;
  lng: number;
  age: number;
  interests: string[];
  languages: string[];
  availability: string;
  experience: string;
  verified: boolean;
}

export interface MapStyleConfig {
  fillColor: string;
  color: string;
  weight: number;
  fillOpacity: number;
}

export interface TooltipData {
  municipalityName: string;
  countyName: string;
  volunteerCount: number;
}
