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
const ProvinceMap = dynamic(() => import('../../components/ProvinceMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-gray-100 flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#006B7D]"></div>
    </div>
  )
});

const municipalities = ['Stockholm', 'Göteborg', 'Malmö', 'Uppsala', 'Linköping', 'Västerås', 'Örebro', 'Norrköping', 'Helsingborg', 'Jönköping', 'Umeå', 'Lund', 'Borås', 'Eskilstuna', 'Gävle'];
const languageOptions = ['Svenska', 'Engelska', 'Arabiska', 'Persiska', 'Spanska', 'Finska', 'Somaliska', 'Tigrinja', 'Tyska', 'Franska', 'Polska', 'Turkiska'];
const availabilityOptions = ['Vardagar', 'Kvällar', 'Helger', 'Flexibel'];
const availableForOptions = ['Barn', 'Ungdomar', 'Vuxna', 'Äldre', 'Alla åldrar'];
const statusOptions = [
  { value: 'all', label: 'Alla' },
  { value: 'approved', label: 'Godkänd' },
  { value: 'pending', label: 'Väntar på granskning' },
  { value: 'under_review', label: 'Under granskning' }
];

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVolunteer, setSelectedVolunteer] = useState<any>(null);
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [showFilters, setShowFilters] = useState(false);
  const [volunteers, setVolunteers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch volunteers from database
  useEffect(() => {
    async function fetchVolunteers() {
      try {
        setIsLoading(true);
        const response = await fetch('/api/social-worker/volunteers');
        const data = await response.json();
        
        if (response.ok && data.volunteers) {
          setVolunteers(data.volunteers);
        } else {
          setError('Failed to load volunteers');
        }
      } catch (err) {
        console.error('Error fetching volunteers:', err);
        setError('Failed to load volunteers');
      } finally {
        setIsLoading(false);
      }
    }
    fetchVolunteers();
  }, []);

  // Check for municipality parameter on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const municipality = params.get('municipality');
    if (municipality) {
      setFilters(prev => ({
        ...prev,
        municipality: municipality
      }));
      setViewMode('list');
    }
  }, []);
  
  // Filter states
  const [filters, setFilters] = useState({
    municipality: '',
    languages: [] as string[],
    availability: [] as string[],
    availableFor: [] as string[],
    status: 'all',
    ageMin: 18,
    ageMax: 100,
    hasDriversLicense: false,
    hasCar: false
  });

  // Filter volunteers based on current filters
  const filteredVolunteers = useMemo(() => {
    return volunteers.filter(v => {
      // Search query
      if (searchQuery && !v.full_name?.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      
      // Municipality
      if (filters.municipality && v.municipality !== filters.municipality) {
        return false;
      }
      
      // Languages
      if (filters.languages.length > 0 && v.languages && !filters.languages.some(l => v.languages.includes(l))) {
        return false;
      }
      
      // Status
      if (filters.status !== 'all' && v.status !== filters.status) {
        return false;
      }
      
      // Age
      if (v.age && (v.age < filters.ageMin || v.age > filters.ageMax)) {
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
  }, [volunteers, filters, searchQuery]);

  const toggleLanguage = (lang: string) => {
    setFilters(prev => ({
      ...prev,
      languages: prev.languages.includes(lang)
        ? prev.languages.filter(l => l !== lang)
        : [...prev.languages, lang]
    }));
  };

  const clearFilters = () => {
    setFilters({
      municipality: '',
      languages: [],
      availability: [],
      availableFor: [],
      status: 'all',
      ageMin: 18,
      ageMax: 100,
      hasDriversLicense: false,
      hasCar: false
    });
    setSearchQuery('');
  };

  const handleMunicipalityClick = (municipalityName: string) => {
    setFilters(prev => ({
      ...prev,
      municipality: municipalityName
    }));
    setViewMode('list');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <span className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded-full">Godkänd</span>;
      case 'pending':
        return <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-700 rounded-full">Väntar</span>;
      case 'under_review':
        return <span className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-full">Under granskning</span>;
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="h-[calc(100vh-8rem)] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#006B7D] mx-auto mb-4"></div>
          <p className="text-gray-600">Laddar volontärer...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-[calc(100vh-8rem)] flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-[#006B7D] text-white rounded-lg hover:bg-[#005a6a]"
          >
            Försök igen
          </button>
        </div>
      </div>
    );
  }

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
            {(filters.languages.length > 0 || filters.municipality) && (
              <span className="w-5 h-5 bg-[#F39C12] rounded-full text-white text-xs flex items-center justify-center">
                {filters.languages.length + (filters.municipality ? 1 : 0)}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Search bar */}
      <div className="mb-4">
        <div className="relative">
          <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Sök efter namn..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#006B7D] focus:border-transparent outline-none"
          />
        </div>
      </div>

      {/* Filters panel */}
      {showFilters && (
        <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Filter</h3>
            <button
              onClick={clearFilters}
              className="text-sm text-[#006B7D] hover:underline"
            >
              Rensa alla
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Municipality */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Kommun</label>
              <select
                value={filters.municipality}
                onChange={(e) => setFilters(prev => ({ ...prev, municipality: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#006B7D] outline-none"
              >
                <option value="">Alla kommuner</option>
                {municipalities.map(m => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                value={filters.status}
                onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#006B7D] outline-none"
              >
                {statusOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            {/* Languages */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Språk</label>
              <div className="flex flex-wrap gap-2">
                {languageOptions.slice(0, 6).map(lang => (
                  <button
                    key={lang}
                    onClick={() => toggleLanguage(lang)}
                    className={`px-3 py-1 text-sm rounded-full transition-colors ${
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
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 overflow-hidden">
        {viewMode === 'list' ? (
          <div className="h-full overflow-y-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredVolunteers.map(volunteer => (
                <Link
                  key={volunteer.id}
                  href={`/social-worker/volunteers/${volunteer.id}`}
                  className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-[#006B7D] rounded-full flex items-center justify-center text-white font-semibold">
                        {volunteer.full_name?.charAt(0) || '?'}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{volunteer.full_name}</h3>
                        <p className="text-sm text-gray-500 flex items-center gap-1">
                          <MapPin size={14} />
                          {volunteer.municipality}
                        </p>
                      </div>
                    </div>
                    {getStatusBadge(volunteer.status)}
                  </div>

                  <div className="space-y-2 text-sm text-gray-600">
                    {volunteer.email && (
                      <p className="flex items-center gap-2">
                        <Mail size={14} />
                        {volunteer.email}
                      </p>
                    )}
                    {volunteer.phone && (
                      <p className="flex items-center gap-2">
                        <Phone size={14} />
                        {volunteer.phone}
                      </p>
                    )}
                    {volunteer.age && (
                      <p className="flex items-center gap-2">
                        <User size={14} />
                        {volunteer.age} år
                      </p>
                    )}
                    {volunteer.languages && volunteer.languages.length > 0 && (
                      <p className="flex items-center gap-2">
                        <Languages size={14} />
                        {volunteer.languages.join(', ')}
                      </p>
                    )}
                    {volunteer.has_car && (
                      <p className="flex items-center gap-2 text-green-600">
                        <Car size={14} />
                        Har bil
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>

            {filteredVolunteers.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">Inga volontärer hittades med de valda filtren.</p>
              </div>
            )}
          </div>
        ) : (
          <div className="h-full">
            <ProvinceMap 
              isLoggedIn={true}
              onMunicipalityClick={handleMunicipalityClick}
            />
          </div>
        )}
      </div>
    </div>
  );
}
