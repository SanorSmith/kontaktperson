'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import {
  Search,
  Filter,
  X,
  MapPin,
  User,
  Phone,
  Mail,
  Languages,
  Calendar,
  Car,
  CheckCircle,
  Clock,
  ChevronDown,
  ChevronUp,
  List,
  Map as MapIcon,
  Download
} from 'lucide-react';

// Dynamically import the map component to avoid SSR issues
const SearchMap = dynamic(() => import('./SearchMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-gray-100 flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#006B7D]"></div>
    </div>
  )
});

// Mock volunteer data
const mockVolunteers = [
  {
    id: '1',
    full_name: 'Anna Svensson',
    email: 'anna.svensson@email.se',
    phone: '070-123 45 67',
    age: 32,
    municipality: 'Stockholm',
    languages: ['Svenska', 'Engelska'],
    interests: ['Sport', 'Musik'],
    availability: ['Vardagar', 'Kvällar'],
    available_for: ['Barn', 'Ungdomar'],
    experience_level: 'experienced',
    has_drivers_license: true,
    has_car: true,
    status: 'approved',
    background_check_status: 'approved',
    latitude: 59.3293,
    longitude: 18.0686
  },
  {
    id: '2',
    full_name: 'Erik Johansson',
    email: 'erik.j@email.se',
    phone: '070-234 56 78',
    age: 45,
    municipality: 'Stockholm',
    languages: ['Svenska', 'Arabiska', 'Engelska'],
    interests: ['Matlagning', 'Natur'],
    availability: ['Helger'],
    available_for: ['Vuxna', 'Alla åldrar'],
    experience_level: 'expert',
    has_drivers_license: true,
    has_car: false,
    status: 'approved',
    background_check_status: 'approved',
    latitude: 59.3417,
    longitude: 18.0549
  },
  {
    id: '3',
    full_name: 'Maria Lindgren',
    email: 'maria.l@email.se',
    phone: '070-345 67 89',
    age: 28,
    municipality: 'Solna',
    languages: ['Svenska', 'Spanska'],
    interests: ['Läsning', 'Film'],
    availability: ['Vardagar', 'Helger'],
    available_for: ['Ungdomar'],
    experience_level: 'beginner',
    has_drivers_license: false,
    has_car: false,
    status: 'approved',
    background_check_status: 'pending',
    latitude: 59.3600,
    longitude: 18.0000
  },
  {
    id: '4',
    full_name: 'Johan Berg',
    email: 'johan.berg@email.se',
    phone: '070-456 78 90',
    age: 55,
    municipality: 'Huddinge',
    languages: ['Svenska', 'Finska'],
    interests: ['Trädgård', 'Hantverk'],
    availability: ['Vardagar'],
    available_for: ['Alla åldrar'],
    experience_level: 'experienced',
    has_drivers_license: true,
    has_car: true,
    status: 'approved',
    background_check_status: 'approved',
    latitude: 59.2200,
    longitude: 17.9800
  },
  {
    id: '5',
    full_name: 'Sara Holm',
    email: 'sara.holm@email.se',
    phone: '070-567 89 01',
    age: 38,
    municipality: 'Stockholm',
    languages: ['Svenska', 'Persiska'],
    interests: ['Musik', 'Konst'],
    availability: ['Kvällar', 'Helger'],
    available_for: ['Barn', 'Ungdomar'],
    experience_level: 'experienced',
    has_drivers_license: true,
    has_car: true,
    status: 'pending',
    background_check_status: 'not_requested',
    latitude: 59.3100,
    longitude: 18.0900
  }
];

const municipalities = ['Stockholm', 'Solna', 'Huddinge', 'Täby', 'Nacka', 'Sundbyberg'];
const languageOptions = ['Svenska', 'Engelska', 'Arabiska', 'Persiska', 'Spanska', 'Finska', 'Somaliska', 'Tigrinja'];
const availabilityOptions = ['Vardagar', 'Kvällar', 'Helger'];
const availableForOptions = ['Barn 0-12', 'Ungdomar 13-17', 'Vuxna 18+', 'Alla åldrar'];
const experienceLevels = [
  { value: 'all', label: 'Alla' },
  { value: 'beginner', label: 'Nybörjare' },
  { value: 'experienced', label: 'Erfaren' },
  { value: 'expert', label: 'Expert' }
];
const statusOptions = [
  { value: 'all', label: 'Alla' },
  { value: 'approved', label: 'Godkänd' },
  { value: 'pending', label: 'Väntar på granskning' }
];
const backgroundCheckOptions = [
  { value: 'all', label: 'Alla' },
  { value: 'approved', label: 'Godkänd' },
  { value: 'pending', label: 'Väntar' },
  { value: 'expired', label: 'Utgången' }
];

export default function SearchPage() {
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');
  const [showFilters, setShowFilters] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVolunteer, setSelectedVolunteer] = useState<any>(null);
  
  // Filter states
  const [filters, setFilters] = useState({
    municipality: '',
    languages: [] as string[],
    availability: [] as string[],
    availableFor: [] as string[],
    experienceLevel: 'all',
    status: 'approved',
    backgroundCheck: 'all',
    ageMin: 18,
    ageMax: 100,
    hasDriversLicense: false,
    hasCar: false
  });

  // Filter volunteers based on current filters
  const filteredVolunteers = useMemo(() => {
    return mockVolunteers.filter(v => {
      // Search query
      if (searchQuery && !v.full_name.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      
      // Municipality
      if (filters.municipality && v.municipality !== filters.municipality) {
        return false;
      }
      
      // Languages
      if (filters.languages.length > 0 && !filters.languages.some(l => v.languages.includes(l))) {
        return false;
      }
      
      // Availability
      if (filters.availability.length > 0 && !filters.availability.some(a => v.availability.includes(a))) {
        return false;
      }
      
      // Experience level
      if (filters.experienceLevel !== 'all' && v.experience_level !== filters.experienceLevel) {
        return false;
      }
      
      // Status
      if (filters.status !== 'all' && v.status !== filters.status) {
        return false;
      }
      
      // Background check
      if (filters.backgroundCheck !== 'all' && v.background_check_status !== filters.backgroundCheck) {
        return false;
      }
      
      // Age
      if (v.age < filters.ageMin || v.age > filters.ageMax) {
        return false;
      }
      
      // Driver's license
      if (filters.hasDriversLicense && !v.has_drivers_license) {
        return false;
      }
      
      // Car
      if (filters.hasCar && !v.has_car) {
        return false;
      }
      
      return true;
    });
  }, [filters, searchQuery]);

  const toggleLanguage = (lang: string) => {
    setFilters(prev => ({
      ...prev,
      languages: prev.languages.includes(lang)
        ? prev.languages.filter(l => l !== lang)
        : [...prev.languages, lang]
    }));
  };

  const toggleAvailability = (avail: string) => {
    setFilters(prev => ({
      ...prev,
      availability: prev.availability.includes(avail)
        ? prev.availability.filter(a => a !== avail)
        : [...prev.availability, avail]
    }));
  };

  const clearFilters = () => {
    setFilters({
      municipality: '',
      languages: [],
      availability: [],
      availableFor: [],
      experienceLevel: 'all',
      status: 'approved',
      backgroundCheck: 'all',
      ageMin: 18,
      ageMax: 100,
      hasDriversLicense: false,
      hasCar: false
    });
    setSearchQuery('');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <span className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded-full">Godkänd</span>;
      case 'pending':
        return <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-700 rounded-full">Väntar</span>;
      default:
        return null;
    }
  };

  const getBackgroundCheckBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <span className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded-full flex items-center gap-1"><CheckCircle size={12} /> Godkänd</span>;
      case 'pending':
        return <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-700 rounded-full flex items-center gap-1"><Clock size={12} /> Väntar</span>;
      case 'expired':
        return <span className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded-full">Utgången</span>;
      default:
        return <span className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-full">Ej begärd</span>;
    }
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Sök volontärer</h1>
          <p className="text-sm text-gray-500">
            {filteredVolunteers.length} volontärer hittade
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          {/* View toggle */}
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('map')}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors flex items-center gap-1 ${
                viewMode === 'map' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <MapIcon size={16} />
              Karta
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors flex items-center gap-1 ${
                viewMode === 'list' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <List size={16} />
              Lista
            </button>
          </div>
          
          {/* Filter toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors ${
              showFilters ? 'bg-[#006B7D] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Filter size={16} />
            Filter
            {(filters.languages.length > 0 || filters.municipality || filters.availability.length > 0) && (
              <span className="w-5 h-5 bg-[#F39C12] rounded-full text-white text-xs flex items-center justify-center">
                {filters.languages.length + (filters.municipality ? 1 : 0) + filters.availability.length}
              </span>
            )}
          </button>
          
          {/* Export button */}
          <button className="px-3 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors">
            <Download size={16} />
            Exportera
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex gap-4 min-h-0">
        {/* Filters sidebar */}
        {showFilters && (
          <div className="w-80 bg-white rounded-xl shadow-sm border border-gray-100 overflow-y-auto flex-shrink-0">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">Filter</h3>
              <button
                onClick={clearFilters}
                className="text-sm text-[#006B7D] hover:text-[#005a6a]"
              >
                Rensa alla
              </button>
            </div>
            
            <div className="p-4 space-y-6">
              {/* Search */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sök namn</label>
                <div className="relative">
                  <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Sök volontär..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:border-[#006B7D] focus:ring-1 focus:ring-[#006B7D] outline-none text-sm"
                  />
                </div>
              </div>

              {/* Municipality */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Kommun</label>
                <select
                  value={filters.municipality}
                  onChange={(e) => setFilters(prev => ({ ...prev, municipality: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-[#006B7D] focus:ring-1 focus:ring-[#006B7D] outline-none text-sm"
                >
                  <option value="">Alla kommuner</option>
                  {municipalities.map(m => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>

              {/* Languages */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Språk</label>
                <div className="flex flex-wrap gap-2">
                  {languageOptions.map(lang => (
                    <button
                      key={lang}
                      onClick={() => toggleLanguage(lang)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                        filters.languages.includes(lang)
                          ? 'bg-[#006B7D] text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {lang}
                    </button>
                  ))}
                </div>
              </div>

              {/* Availability */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tillgänglighet</label>
                <div className="flex flex-wrap gap-2">
                  {availabilityOptions.map(avail => (
                    <button
                      key={avail}
                      onClick={() => toggleAvailability(avail)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                        filters.availability.includes(avail)
                          ? 'bg-[#F39C12] text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {avail}
                    </button>
                  ))}
                </div>
              </div>

              {/* Experience level */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Erfarenhetsnivå</label>
                <div className="space-y-2">
                  {experienceLevels.map(level => (
                    <label key={level.value} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="experienceLevel"
                        value={level.value}
                        checked={filters.experienceLevel === level.value}
                        onChange={(e) => setFilters(prev => ({ ...prev, experienceLevel: e.target.value }))}
                        className="w-4 h-4 text-[#006B7D]"
                      />
                      <span className="text-sm text-gray-700">{level.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  value={filters.status}
                  onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-[#006B7D] focus:ring-1 focus:ring-[#006B7D] outline-none text-sm"
                >
                  {statusOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>

              {/* Background check */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Bakgrundskontroll</label>
                <select
                  value={filters.backgroundCheck}
                  onChange={(e) => setFilters(prev => ({ ...prev, backgroundCheck: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-[#006B7D] focus:ring-1 focus:ring-[#006B7D] outline-none text-sm"
                >
                  {backgroundCheckOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>

              {/* Age range */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ålder: {filters.ageMin} - {filters.ageMax} år
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="18"
                    max="100"
                    value={filters.ageMin}
                    onChange={(e) => setFilters(prev => ({ ...prev, ageMin: parseInt(e.target.value) || 18 }))}
                    className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                  />
                  <span className="text-gray-500">-</span>
                  <input
                    type="number"
                    min="18"
                    max="100"
                    value={filters.ageMax}
                    onChange={(e) => setFilters(prev => ({ ...prev, ageMax: parseInt(e.target.value) || 100 }))}
                    className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                  />
                </div>
              </div>

              {/* Checkboxes */}
              <div className="space-y-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.hasDriversLicense}
                    onChange={(e) => setFilters(prev => ({ ...prev, hasDriversLicense: e.target.checked }))}
                    className="w-4 h-4 text-[#006B7D] rounded"
                  />
                  <span className="text-sm text-gray-700">Har körkort</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.hasCar}
                    onChange={(e) => setFilters(prev => ({ ...prev, hasCar: e.target.checked }))}
                    className="w-4 h-4 text-[#006B7D] rounded"
                  />
                  <span className="text-sm text-gray-700">Har tillgång till bil</span>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Map or List view */}
        <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {viewMode === 'map' ? (
            <div className="h-full relative">
              <SearchMap
                volunteers={filteredVolunteers}
                selectedVolunteer={selectedVolunteer}
                onSelectVolunteer={setSelectedVolunteer}
              />
              
              {/* Selected volunteer card */}
              {selectedVolunteer && (
                <div className="absolute bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-80 bg-white rounded-xl shadow-lg border border-gray-200 p-4 z-[1000]">
                  <button
                    onClick={() => setSelectedVolunteer(null)}
                    className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
                  >
                    <X size={20} />
                  </button>
                  
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-12 h-12 rounded-full bg-[#006B7D] flex items-center justify-center text-white font-bold text-lg">
                      {selectedVolunteer.full_name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{selectedVolunteer.full_name}</h4>
                      <p className="text-sm text-gray-500">{selectedVolunteer.age} år, {selectedVolunteer.municipality}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Languages size={16} />
                      <span>{selectedVolunteer.languages.join(', ')}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar size={16} />
                      <span>{selectedVolunteer.availability.join(', ')}</span>
                    </div>
                    {selectedVolunteer.has_car && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Car size={16} />
                        <span>Har bil</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2 mb-4">
                    {getStatusBadge(selectedVolunteer.status)}
                    {getBackgroundCheckBadge(selectedVolunteer.background_check_status)}
                  </div>
                  
                  <Link
                    href={`/social-worker/volunteers/${selectedVolunteer.id}`}
                    className="block w-full text-center px-4 py-2 bg-[#006B7D] hover:bg-[#005a6a] text-white rounded-lg font-medium transition-colors"
                  >
                    Visa profil
                  </Link>
                </div>
              )}
            </div>
          ) : (
            <div className="h-full overflow-y-auto">
              <table className="w-full">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Volontär</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kommun</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Språk</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tillgänglighet</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Åtgärd</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredVolunteers.map((volunteer) => (
                    <tr key={volunteer.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-[#006B7D] flex items-center justify-center text-white font-bold">
                            {volunteer.full_name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{volunteer.full_name}</p>
                            <p className="text-sm text-gray-500">{volunteer.age} år</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-600">{volunteer.municipality}</td>
                      <td className="px-4 py-4">
                        <div className="flex flex-wrap gap-1">
                          {volunteer.languages.slice(0, 2).map(lang => (
                            <span key={lang} className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">
                              {lang}
                            </span>
                          ))}
                          {volunteer.languages.length > 2 && (
                            <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">
                              +{volunteer.languages.length - 2}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-600">
                        {volunteer.availability.join(', ')}
                      </td>
                      <td className="px-4 py-4">
                        {getStatusBadge(volunteer.status)}
                      </td>
                      <td className="px-4 py-4">
                        <Link
                          href={`/social-worker/volunteers/${volunteer.id}`}
                          className="text-[#006B7D] hover:text-[#005a6a] font-medium text-sm"
                        >
                          Visa profil
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {filteredVolunteers.length === 0 && (
                <div className="p-8 text-center">
                  <Search size={48} className="mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-600">Inga volontärer matchar dina filter</p>
                  <button
                    onClick={clearFilters}
                    className="mt-2 text-[#006B7D] hover:text-[#005a6a] font-medium"
                  >
                    Rensa filter
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
