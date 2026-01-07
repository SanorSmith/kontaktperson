import { MunicipalityGeoJSON, Volunteer } from '../types/map';

// Simplified Sweden municipality GeoJSON data (sample municipalities)
// In production, load from https://github.com/deldersveld/topojson or SCB
export const swedenMunicipalitiesGeoJSON: MunicipalityGeoJSON = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: {
        id: '0180',
        name: 'Stockholm',
        county: 'Stockholm län',
        code: '0180',
        volunteerCount: 24
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [18.0686, 59.3293], [18.1686, 59.3293], [18.1686, 59.4293], 
          [18.0686, 59.4293], [18.0686, 59.3293]
        ]]
      }
    },
    {
      type: 'Feature',
      properties: {
        id: '1480',
        name: 'Göteborg',
        county: 'Västra Götalands län',
        code: '1480',
        volunteerCount: 18
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [11.9746, 57.7089], [12.0746, 57.7089], [12.0746, 57.8089], 
          [11.9746, 57.8089], [11.9746, 57.7089]
        ]]
      }
    },
    {
      type: 'Feature',
      properties: {
        id: '1280',
        name: 'Malmö',
        county: 'Skåne län',
        code: '1280',
        volunteerCount: 15
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [13.0038, 55.6050], [13.1038, 55.6050], [13.1038, 55.7050], 
          [13.0038, 55.7050], [13.0038, 55.6050]
        ]]
      }
    },
    {
      type: 'Feature',
      properties: {
        id: '0380',
        name: 'Uppsala',
        county: 'Uppsala län',
        code: '0380',
        volunteerCount: 12
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [17.6389, 59.8586], [17.7389, 59.8586], [17.7389, 59.9586], 
          [17.6389, 59.9586], [17.6389, 59.8586]
        ]]
      }
    },
    {
      type: 'Feature',
      properties: {
        id: '1980',
        name: 'Luleå',
        county: 'Norrbottens län',
        code: '1980',
        volunteerCount: 8
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [22.1567, 65.5848], [22.2567, 65.5848], [22.2567, 65.6848], 
          [22.1567, 65.6848], [22.1567, 65.5848]
        ]]
      }
    },
    {
      type: 'Feature',
      properties: {
        id: '0580',
        name: 'Linköping',
        county: 'Östergötlands län',
        code: '0580',
        volunteerCount: 10
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [15.6214, 58.4108], [15.7214, 58.4108], [15.7214, 58.5108], 
          [15.6214, 58.5108], [15.6214, 58.4108]
        ]]
      }
    },
    {
      type: 'Feature',
      properties: {
        id: '1480',
        name: 'Örebro',
        county: 'Örebro län',
        code: '1880',
        volunteerCount: 7
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [15.2134, 59.2753], [15.3134, 59.2753], [15.3134, 59.3753], 
          [15.2134, 59.3753], [15.2134, 59.2753]
        ]]
      }
    },
    {
      type: 'Feature',
      properties: {
        id: '2080',
        name: 'Umeå',
        county: 'Västerbottens län',
        code: '2080',
        volunteerCount: 9
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [20.2597, 63.8258], [20.3597, 63.8258], [20.3597, 63.9258], 
          [20.2597, 63.9258], [20.2597, 63.8258]
        ]]
      }
    },
    {
      type: 'Feature',
      properties: {
        id: '0780',
        name: 'Västerås',
        county: 'Västmanlands län',
        code: '0780',
        volunteerCount: 6
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [16.5448, 59.6099], [16.6448, 59.6099], [16.6448, 59.7099], 
          [16.5448, 59.7099], [16.5448, 59.6099]
        ]]
      }
    },
    {
      type: 'Feature',
      properties: {
        id: '1060',
        name: 'Jönköping',
        county: 'Jönköpings län',
        code: '1060',
        volunteerCount: 5
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [14.1618, 57.7826], [14.2618, 57.7826], [14.2618, 57.8826], 
          [14.1618, 57.8826], [14.1618, 57.7826]
        ]]
      }
    },
    {
      type: 'Feature',
      properties: {
        id: '0880',
        name: 'Gävle',
        county: 'Gävleborgs län',
        code: '0880',
        volunteerCount: 4
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [17.1410, 60.6749], [17.2410, 60.6749], [17.2410, 60.7749], 
          [17.1410, 60.7749], [17.1410, 60.6749]
        ]]
      }
    },
    {
      type: 'Feature',
      properties: {
        id: '1280',
        name: 'Helsingborg',
        county: 'Skåne län',
        code: '1283',
        volunteerCount: 11
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [12.6945, 56.0465], [12.7945, 56.0465], [12.7945, 56.1465], 
          [12.6945, 56.1465], [12.6945, 56.0465]
        ]]
      }
    },
    {
      type: 'Feature',
      properties: {
        id: '1480',
        name: 'Borås',
        county: 'Västra Götalands län',
        code: '1490',
        volunteerCount: 3
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [12.9401, 57.7210], [13.0401, 57.7210], [13.0401, 57.8210], 
          [12.9401, 57.8210], [12.9401, 57.7210]
        ]]
      }
    },
    {
      type: 'Feature',
      properties: {
        id: '2480',
        name: 'Kiruna',
        county: 'Norrbottens län',
        code: '2584',
        volunteerCount: 2
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [20.2253, 67.8558], [20.3253, 67.8558], [20.3253, 67.9558], 
          [20.2253, 67.9558], [20.2253, 67.8558]
        ]]
      }
    },
    {
      type: 'Feature',
      properties: {
        id: '0680',
        name: 'Karlstad',
        county: 'Värmlands län',
        code: '1780',
        volunteerCount: 6
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [13.5115, 59.3793], [13.6115, 59.3793], [13.6115, 59.4793], 
          [13.5115, 59.4793], [13.5115, 59.3793]
        ]]
      }
    }
  ]
};

// Mock volunteer data
export const mockVolunteers: Volunteer[] = [
  {
    id: 1,
    name: "Anna Andersson",
    municipality: "Stockholm",
    county: "Stockholm län",
    lat: 59.3293,
    lng: 18.0686,
    age: 28,
    interests: ["Läsning", "Promenader", "Matlagning"],
    languages: ["Svenska", "Engelska"],
    availability: "Vardagar eftermiddag",
    experience: "3 år som volontär",
    verified: true
  },
  {
    id: 2,
    name: "Erik Eriksson",
    municipality: "Göteborg",
    county: "Västra Götalands län",
    lat: 57.7089,
    lng: 11.9746,
    age: 35,
    interests: ["Sport", "Musik", "Resor"],
    languages: ["Svenska", "Engelska", "Tyska"],
    availability: "Helger",
    experience: "5 år som kontaktperson",
    verified: true
  },
  {
    id: 3,
    name: "Maria Johansson",
    municipality: "Malmö",
    county: "Skåne län",
    lat: 55.6050,
    lng: 13.0038,
    age: 42,
    interests: ["Trädgårdsarbete", "Konst", "Bakning"],
    languages: ["Svenska", "Engelska"],
    availability: "Flexibel",
    experience: "2 år som volontär",
    verified: true
  },
  {
    id: 4,
    name: "Lars Larsson",
    municipality: "Uppsala",
    county: "Uppsala län",
    lat: 59.8586,
    lng: 17.6389,
    age: 31,
    interests: ["Fotboll", "Film", "Spel"],
    languages: ["Svenska"],
    availability: "Kvällar",
    experience: "1 år som kontaktperson",
    verified: true
  },
  {
    id: 5,
    name: "Sofia Svensson",
    municipality: "Luleå",
    county: "Norrbottens län",
    lat: 65.5848,
    lng: 22.1567,
    age: 26,
    interests: ["Skidåkning", "Fotografering", "Vandring"],
    languages: ["Svenska", "Engelska", "Finska"],
    availability: "Helger",
    experience: "4 år som volontär",
    verified: true
  },
  {
    id: 6,
    name: "Johan Nilsson",
    municipality: "Linköping",
    county: "Östergötlands län",
    lat: 58.4108,
    lng: 15.6214,
    age: 39,
    interests: ["Cykling", "Historia", "Matlagning"],
    languages: ["Svenska", "Engelska"],
    availability: "Vardagar",
    experience: "6 år som kontaktperson",
    verified: true
  },
  {
    id: 7,
    name: "Emma Karlsson",
    municipality: "Stockholm",
    county: "Stockholm län",
    lat: 59.3393,
    lng: 18.0786,
    age: 29,
    interests: ["Yoga", "Läsning", "Kaffe"],
    languages: ["Svenska", "Engelska", "Spanska"],
    availability: "Eftermiddagar",
    experience: "2 år som volontär",
    verified: true
  },
  {
    id: 8,
    name: "Oscar Berg",
    municipality: "Göteborg",
    county: "Västra Götalands län",
    lat: 57.7189,
    lng: 11.9846,
    age: 33,
    interests: ["Segling", "Musik", "Matlagning"],
    languages: ["Svenska", "Engelska"],
    availability: "Helger",
    experience: "3 år som kontaktperson",
    verified: true
  },
  {
    id: 9,
    name: "Lisa Pettersson",
    municipality: "Umeå",
    county: "Västerbottens län",
    lat: 63.8258,
    lng: 20.2597,
    age: 27,
    interests: ["Dans", "Teater", "Resor"],
    languages: ["Svenska", "Engelska"],
    availability: "Kvällar",
    experience: "1 år som volontär",
    verified: true
  },
  {
    id: 10,
    name: "Anders Gustafsson",
    municipality: "Malmö",
    county: "Skåne län",
    lat: 55.6150,
    lng: 13.0138,
    age: 45,
    interests: ["Golf", "Läsning", "Trädgård"],
    languages: ["Svenska", "Engelska", "Danska"],
    availability: "Flexibel",
    experience: "7 år som kontaktperson",
    verified: true
  }
];

// Helper function to get volunteers by municipality
export const getVolunteersByMunicipality = (municipalityName: string): Volunteer[] => {
  return mockVolunteers.filter(v => v.municipality === municipalityName);
};

// Helper function to get volunteer count by municipality
export const getVolunteerCountByMunicipality = (municipalityName: string): number => {
  return mockVolunteers.filter(v => v.municipality === municipalityName).length;
};
