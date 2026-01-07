import { MapStyleConfig } from '../types/map';

// Get style based on volunteer count
export const getStyleForCount = (count: number): MapStyleConfig => {
  if (count === 0) {
    return {
      fillColor: '#F3F4F6',
      color: '#E5E7EB',
      weight: 1,
      fillOpacity: 0.7
    };
  }
  if (count <= 5) {
    return {
      fillColor: '#99F6E4',
      color: '#5EEAD4',
      weight: 1,
      fillOpacity: 0.8
    };
  }
  if (count <= 15) {
    return {
      fillColor: '#2DD4BF',
      color: '#14B8A6',
      weight: 1,
      fillOpacity: 0.85
    };
  }
  return {
    fillColor: '#0D9488',
    color: '#0F766E',
    weight: 1,
    fillOpacity: 0.9
  };
};

// Get hover style
export const getHoverStyle = (): Partial<MapStyleConfig> => ({
  weight: 3,
  color: '#F39C12',
  fillOpacity: 1
});

// Get selected style
export const getSelectedStyle = (): MapStyleConfig => ({
  fillColor: '#003D5C',
  color: '#F39C12',
  weight: 3,
  fillOpacity: 1
});

// Darken color by percentage
export const darkenColor = (color: string, percent: number): string => {
  const num = parseInt(color.replace('#', ''), 16);
  const amt = Math.round(2.55 * percent);
  const R = (num >> 16) - amt;
  const G = (num >> 8 & 0x00FF) - amt;
  const B = (num & 0x0000FF) - amt;
  return '#' + (
    0x1000000 +
    (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
    (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
    (B < 255 ? (B < 1 ? 0 : B) : 255)
  ).toString(16).slice(1);
};

// Format volunteer count text
export const formatVolunteerCount = (count: number): string => {
  if (count === 0) return 'Inga volontärer';
  if (count === 1) return '1 volontär';
  return `${count} volontärer`;
};

// Get cluster size based on count
export const getClusterSize = (count: number): number => {
  if (count <= 10) return 40;
  if (count <= 50) return 50;
  return 60;
};

// Debounce function for performance
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout | null = null;
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};
