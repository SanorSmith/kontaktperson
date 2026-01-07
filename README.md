# Interactive Sweden Map - Kontaktperson Platform

An interactive map application built with Next.js 14, React Leaflet, and Tailwind CSS for finding volunteers across Sweden.

## Features

- **Interactive Map**: Click on municipalities to filter volunteers, hover for quick details
- **Municipality Boundaries**: All 290 Swedish municipalities with color-coded volunteer density
- **Volunteer Markers**: Clustered markers showing volunteer locations
- **Responsive Design**: Desktop and mobile-optimized with tabbed interface
- **Real-time Filtering**: Filter volunteers by municipality selection
- **Detailed Profiles**: View volunteer information including interests, languages, and availability
- **Custom Styling**: Swedish Trust & Stability color palette throughout

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Mapping**: React Leaflet + Leaflet
- **Clustering**: React Leaflet Cluster
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Language**: TypeScript

## Getting Started

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

### Development

Open [http://localhost:3000](http://localhost:3000) to view the application.

- Home page: `/`
- Map search page: `/search`

## Project Structure

```
app/
├── search/
│   └── page.tsx              # Main search page with map
├── components/
│   ├── SwedishMap.tsx        # Main map component
│   ├── MapLegend.tsx         # Legend showing volunteer density
│   ├── MapTooltip.tsx        # Hover tooltip component
│   ├── VolunteerMarker.tsx   # Custom volunteer markers
│   └── FilterSidebar.tsx     # Sidebar with volunteer list
├── lib/
│   ├── mapUtils.ts           # Map utility functions
│   └── municipalityData.ts   # GeoJSON and mock data
├── types/
│   └── map.ts                # TypeScript type definitions
├── layout.tsx                # Root layout
├── page.tsx                  # Home page
└── globals.css               # Global styles
```

## Map Features

### Municipality Styling

- **No volunteers**: Light gray (#F3F4F6)
- **1-5 volunteers**: Light teal (#99F6E4)
- **6-15 volunteers**: Medium teal (#2DD4BF)
- **16+ volunteers**: Deep teal (#0D9488)
- **Hover**: Orange border (#F39C12)
- **Selected**: Deep blue fill (#003D5C)

### Interactions

- **Hover**: Shows tooltip with municipality name, county, and volunteer count
- **Click**: Filters volunteer list and zooms to municipality
- **Markers**: Click to view volunteer details in popup
- **Clustering**: Markers automatically cluster when close together

### Controls

- **Zoom In/Out**: Top-left controls
- **Reset View**: Return to full Sweden view
- **Legend**: Bottom-right showing volunteer density
- **Mobile Tabs**: Switch between list and map views

## Color Palette

- Deep Blue: `#003D5C` - Primary, selected municipalities
- Warm Teal: `#006B7D` - Municipalities with volunteers
- Soft Blue: `#E8F4F8` - Background, tooltips
- Warm Orange: `#F39C12` - Hover state, volunteer markers
- Success Green: `#27AE60` - Active/verified status
- Light Gray: `#F8F9FA` - Municipalities with no volunteers

## Data Structure

### Municipality GeoJSON

```typescript
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
    coordinates: [...]
  }
}
```

### Volunteer Data

```typescript
{
  id: 1,
  name: 'Anna Andersson',
  municipality: 'Stockholm',
  county: 'Stockholm län',
  lat: 59.3293,
  lng: 18.0686,
  age: 28,
  interests: ['Läsning', 'Promenader', 'Matlagning'],
  languages: ['Svenska', 'Engelska'],
  availability: 'Vardagar eftermiddag',
  experience: '3 år som volontär',
  verified: true
}
```

## Customization

### Adding Real GeoJSON Data

Replace the mock data in `app/lib/municipalityData.ts` with real Sweden municipality boundaries from:

- [TopoJSON Sweden Data](https://github.com/deldersveld/topojson/blob/master/countries/sweden/)
- [SCB (Statistics Sweden)](https://www.scb.se/)
- [Lantmäteriet Open Data](https://www.lantmateriet.se/)

### Updating Volunteer Data

Replace `mockVolunteers` array in `app/lib/municipalityData.ts` with your actual volunteer database.

## Performance Optimization

- Dynamic import of map component (avoids SSR issues)
- Marker clustering reduces DOM nodes
- Memoized style calculations
- Debounced hover events
- Simplified GeoJSON polygons

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## License

MIT

## Contact

For questions or support, contact the Kontaktperson Platform team.
