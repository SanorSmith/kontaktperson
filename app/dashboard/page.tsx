'use client';

import { useState, useEffect } from 'react';
import { 
  Users, Search, Filter, MapPin, LogOut, Bell, FileCheck, 
  CheckCircle, XCircle, Clock, ChevronDown, ChevronUp, 
  User, Phone, Mail, Calendar, Globe, Heart, Car, 
  MessageSquare, Shield, AlertTriangle, Eye, X
} from 'lucide-react';
import Link from 'next/link';
import dynamic from 'next/dynamic';

// Dynamic import for map component
const DashboardMap = dynamic(
  () => import('../components/DashboardMap'),
  { ssr: false, loading: () => <div className="w-full h-full bg-gray-100 animate-pulse" /> }
);

// Mock volunteer data
const mockVolunteers = [
  {
    id: '1',
    name: 'Anna Andersson',
    email: 'anna.andersson@gmail.com',
    phone: '070-123 45 67',
    municipality: 'Stockholm',
    municipalityCode: '0180',
    age: 34,
    languages: ['Svenska', 'Engelska', 'Arabiska'],
    interests: ['Sport & Friluftsliv', 'Matlagning', 'Musik'],
    experience: 'Arbetat som fritidsledare i 3 år. Har egen erfarenhet av att vara kontaktperson.',
    motivation: 'Vill ge tillbaka till samhället och hjälpa barn som behöver extra stöd.',
    availability: '2-4 träffar per månad',
    hasDriversLicense: true,
    hasCar: true,
    status: 'approved',
    backgroundCheck: 'completed',
    appliedDate: '2024-01-15',
    notes: ['Mycket engagerad och pålitlig', 'Bra med barn i alla åldrar']
  },
  {
    id: '2',
    name: 'Erik Eriksson',
    email: 'erik.e@hotmail.com',
    phone: '073-456 78 90',
    municipality: 'Stockholm',
    municipalityCode: '0180',
    age: 28,
    languages: ['Svenska', 'Engelska'],
    interests: ['Spel & Gaming', 'Teknik', 'Film & Serier'],
    experience: 'Ingen formell erfarenhet men har yngre syskon.',
    motivation: 'Vill vara en positiv förebild för ungdomar.',
    availability: '1-2 träffar per månad',
    hasDriversLicense: true,
    hasCar: false,
    status: 'pending',
    backgroundCheck: 'pending',
    appliedDate: '2024-02-20',
    notes: []
  },
  {
    id: '3',
    name: 'Maria Johansson',
    email: 'maria.j@gmail.com',
    phone: '076-789 01 23',
    municipality: 'Göteborg',
    municipalityCode: '1480',
    age: 45,
    languages: ['Svenska', 'Spanska', 'Engelska'],
    interests: ['Konst & Hantverk', 'Natur', 'Läsning'],
    experience: 'Lärare i 15 år. Har arbetat med barn med särskilda behov.',
    motivation: 'Vill använda min erfarenhet för att hjälpa barn utanför skolan.',
    availability: '2-4 träffar per månad',
    hasDriversLicense: true,
    hasCar: true,
    status: 'approved',
    backgroundCheck: 'completed',
    appliedDate: '2024-01-05',
    notes: ['Utmärkt med barn med särskilda behov', 'Mycket tålmodig']
  },
  {
    id: '4',
    name: 'Ahmed Hassan',
    email: 'ahmed.h@outlook.com',
    phone: '070-234 56 78',
    municipality: 'Malmö',
    municipalityCode: '1280',
    age: 31,
    languages: ['Svenska', 'Arabiska', 'Engelska', 'Somaliska'],
    interests: ['Sport & Friluftsliv', 'Matlagning', 'Resor'],
    experience: 'Volontär på ungdomsgård i 2 år.',
    motivation: 'Vill hjälpa nyanlända barn att integreras i samhället.',
    availability: 'Flexibelt',
    hasDriversLicense: true,
    hasCar: true,
    status: 'pending',
    backgroundCheck: 'in_progress',
    appliedDate: '2024-02-10',
    notes: ['Väntar på belastningsregister']
  },
  {
    id: '5',
    name: 'Lisa Lindgren',
    email: 'lisa.lindgren@gmail.com',
    phone: '072-345 67 89',
    municipality: 'Uppsala',
    municipalityCode: '0380',
    age: 52,
    languages: ['Svenska', 'Finska', 'Engelska'],
    interests: ['Djur', 'Natur', 'Fotografi'],
    experience: 'Pensionerad sjuksköterska. Har fostrat tre egna barn.',
    motivation: 'Har tid och energi att ge till barn som behöver det.',
    availability: '4+ träffar per månad',
    hasDriversLicense: true,
    hasCar: true,
    status: 'approved',
    backgroundCheck: 'completed',
    appliedDate: '2023-12-01',
    notes: ['Mycket erfaren', 'Passar bra för yngre barn']
  },
  {
    id: '6',
    name: 'Johan Svensson',
    email: 'johan.s@gmail.com',
    phone: '070-456 78 90',
    municipality: 'Linköping',
    municipalityCode: '0580',
    age: 38,
    languages: ['Svenska', 'Engelska', 'Tyska'],
    interests: ['Sport & Friluftsliv', 'Musik', 'Teknik'],
    experience: 'Fotbollstränare för ungdomslag.',
    motivation: 'Vill hjälpa ungdomar att hitta rätt i livet.',
    availability: '2-4 träffar per månad',
    hasDriversLicense: true,
    hasCar: true,
    status: 'rejected',
    backgroundCheck: 'failed',
    appliedDate: '2024-01-25',
    notes: ['Avslag pga anmärkning i belastningsregister']
  }
];

const municipalities = ['Alla', 'Stockholm', 'Göteborg', 'Malmö', 'Uppsala', 'Linköping', 'Örebro'];
const allLanguages = ['Svenska', 'Engelska', 'Arabiska', 'Persiska/Dari', 'Somaliska', 'Spanska', 'Finska', 'Tyska'];
const statusOptions = ['Alla', 'Godkänd', 'Väntar', 'Avslag'];

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'search' | 'applications' | 'map'>('search');
  const [volunteers, setVolunteers] = useState(mockVolunteers);
  const [filteredVolunteers, setFilteredVolunteers] = useState(mockVolunteers);
  const [selectedVolunteer, setSelectedVolunteer] = useState<any>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [newNote, setNewNote] = useState('');
  
  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMunicipality, setFilterMunicipality] = useState('Alla');
  const [filterLanguage, setFilterLanguage] = useState('Alla');
  const [filterStatus, setFilterStatus] = useState('Alla');
  const [filterHasCar, setFilterHasCar] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem('socialWorkerUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    // Apply filters
    let filtered = [...volunteers];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(v => 
        v.name.toLowerCase().includes(query) ||
        v.email.toLowerCase().includes(query) ||
        v.municipality.toLowerCase().includes(query)
      );
    }

    if (filterMunicipality !== 'Alla') {
      filtered = filtered.filter(v => v.municipality === filterMunicipality);
    }

    if (filterLanguage !== 'Alla') {
      filtered = filtered.filter(v => v.languages.includes(filterLanguage));
    }

    if (filterStatus !== 'Alla') {
      const statusMap: Record<string, string> = {
        'Godkänd': 'approved',
        'Väntar': 'pending',
        'Avslag': 'rejected'
      };
      filtered = filtered.filter(v => v.status === statusMap[filterStatus]);
    }

    if (filterHasCar) {
      filtered = filtered.filter(v => v.hasCar);
    }

    setFilteredVolunteers(filtered);
  }, [searchQuery, filterMunicipality, filterLanguage, filterStatus, filterHasCar, volunteers]);

  const handleLogout = () => {
    localStorage.removeItem('socialWorkerUser');
    window.location.href = '/';
  };

  const handleStatusChange = (volunteerId: string, newStatus: string) => {
    setVolunteers(prev => prev.map(v => 
      v.id === volunteerId ? { ...v, status: newStatus } : v
    ));
    if (selectedVolunteer?.id === volunteerId) {
      setSelectedVolunteer((prev: any) => ({ ...prev, status: newStatus }));
    }
  };

  const handleAddNote = (volunteerId: string) => {
    if (!newNote.trim()) return;
    
    setVolunteers(prev => prev.map(v => 
      v.id === volunteerId ? { ...v, notes: [...v.notes, newNote] } : v
    ));
    if (selectedVolunteer?.id === volunteerId) {
      setSelectedVolunteer((prev: any) => ({ ...prev, notes: [...prev.notes, newNote] }));
    }
    setNewNote('');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">Godkänd</span>;
      case 'pending':
        return <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">Väntar</span>;
      case 'rejected':
        return <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">Avslag</span>;
      default:
        return null;
    }
  };

  const getBackgroundCheckBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <span className="flex items-center gap-1 text-green-600 text-xs"><Shield size={14} /> Godkänd</span>;
      case 'in_progress':
        return <span className="flex items-center gap-1 text-yellow-600 text-xs"><Clock size={14} /> Pågår</span>;
      case 'pending':
        return <span className="flex items-center gap-1 text-gray-500 text-xs"><Clock size={14} /> Väntar</span>;
      case 'failed':
        return <span className="flex items-center gap-1 text-red-600 text-xs"><AlertTriangle size={14} /> Anmärkning</span>;
      default:
        return null;
    }
  };

  const pendingCount = volunteers.filter(v => v.status === 'pending').length;

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col">
      {/* Header */}
      <header className="bg-[#003D5C] text-white py-3 px-6 flex justify-between items-center sticky top-0 z-50">
        <Link href="/" className="flex items-center gap-3 hover:opacity-90 transition">
          <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
            <Users size={20} className="text-white" />
          </div>
          <span className="font-bold text-lg">Kontaktperson Platform</span>
        </Link>

        <div className="flex items-center gap-4">
          {/* Notifications */}
          <button className="relative p-2 hover:bg-white/10 rounded-lg transition">
            <Bell size={20} />
            {pendingCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#F39C12] rounded-full text-xs flex items-center justify-center">
                {pendingCount}
              </span>
            )}
          </button>

          {/* User info */}
          <div className="hidden md:flex items-center gap-3 px-3 py-1.5 bg-white/10 rounded-lg">
            <User size={18} />
            <span className="text-sm">{user?.email || 'Socialsekreterare'}</span>
          </div>

          {/* Logout */}
          <button 
            onClick={handleLogout}
            className="p-2 hover:bg-white/10 rounded-lg transition"
            title="Logga ut"
          >
            <LogOut size={20} />
          </button>
        </div>
      </header>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200 px-6">
        <div className="flex gap-1">
          <button
            onClick={() => setActiveTab('search')}
            className={`px-6 py-4 font-medium text-sm border-b-2 transition ${
              activeTab === 'search' 
                ? 'border-[#F39C12] text-[#003D5C]' 
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Search size={18} className="inline mr-2" />
            Sök volontärer
          </button>
          <button
            onClick={() => setActiveTab('applications')}
            className={`px-6 py-4 font-medium text-sm border-b-2 transition flex items-center gap-2 ${
              activeTab === 'applications' 
                ? 'border-[#F39C12] text-[#003D5C]' 
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <FileCheck size={18} />
            Ansökningar
            {pendingCount > 0 && (
              <span className="px-2 py-0.5 bg-[#F39C12] text-white rounded-full text-xs">
                {pendingCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('map')}
            className={`px-6 py-4 font-medium text-sm border-b-2 transition ${
              activeTab === 'map' 
                ? 'border-[#F39C12] text-[#003D5C]' 
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <MapPin size={18} className="inline mr-2" />
            Karta
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Sidebar / Filters */}
        <aside className="w-80 bg-white border-r border-gray-200 p-4 hidden lg:block">
          <div className="mb-6">
            <div className="relative">
              <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Sök volontärer..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:border-[#006B7D] focus:ring-1 focus:ring-[#006B7D] outline-none"
              />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-[#003D5C] flex items-center gap-2">
              <Filter size={18} />
              Filter
            </h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Kommun</label>
              <select
                value={filterMunicipality}
                onChange={(e) => setFilterMunicipality(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-[#006B7D] outline-none"
              >
                {municipalities.map(m => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Språk</label>
              <select
                value={filterLanguage}
                onChange={(e) => setFilterLanguage(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-[#006B7D] outline-none"
              >
                <option value="Alla">Alla språk</option>
                {allLanguages.map(l => (
                  <option key={l} value={l}>{l}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-[#006B7D] outline-none"
              >
                {statusOptions.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filterHasCar}
                onChange={(e) => setFilterHasCar(e.target.checked)}
                className="w-4 h-4 text-[#006B7D] rounded"
              />
              <span className="text-sm text-gray-700">Har tillgång till bil</span>
            </label>

            <button
              onClick={() => {
                setSearchQuery('');
                setFilterMunicipality('Alla');
                setFilterLanguage('Alla');
                setFilterStatus('Alla');
                setFilterHasCar(false);
              }}
              className="w-full text-sm text-[#006B7D] hover:underline"
            >
              Rensa filter
            </button>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="text-sm text-gray-600">
              <strong>{filteredVolunteers.length}</strong> volontärer hittade
            </div>
          </div>
        </aside>

        {/* Main Area */}
        <main className="flex-1 p-6 overflow-auto">
          {activeTab === 'map' ? (
            <div className="h-[calc(100vh-180px)] rounded-xl overflow-hidden shadow-lg">
              <DashboardMap 
                volunteers={filteredVolunteers}
                onSelectVolunteer={setSelectedVolunteer}
              />
            </div>
          ) : (
            <div className="grid gap-4">
              {filteredVolunteers
                .filter(v => activeTab === 'applications' ? v.status === 'pending' : true)
                .map(volunteer => (
                <div 
                  key={volunteer.id}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 hover:shadow-md transition cursor-pointer"
                  onClick={() => setSelectedVolunteer(volunteer)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-[#E8F4F8] rounded-full flex items-center justify-center">
                        <User size={24} className="text-[#003D5C]" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-[#003D5C]">{volunteer.name}</h3>
                          {getStatusBadge(volunteer.status)}
                        </div>
                        <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <MapPin size={14} />
                            {volunteer.municipality}
                          </span>
                          <span className="flex items-center gap-1">
                            <Globe size={14} />
                            {volunteer.languages.slice(0, 2).join(', ')}
                            {volunteer.languages.length > 2 && ` +${volunteer.languages.length - 2}`}
                          </span>
                          {volunteer.hasCar && (
                            <span className="flex items-center gap-1">
                              <Car size={14} />
                              Bil
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                          <span>Bakgrundskontroll: {getBackgroundCheckBadge(volunteer.backgroundCheck)}</span>
                          <span>Ansökt: {volunteer.appliedDate}</span>
                        </div>
                      </div>
                    </div>
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition">
                      <Eye size={20} className="text-gray-400" />
                    </button>
                  </div>
                </div>
              ))}

              {filteredVolunteers.filter(v => activeTab === 'applications' ? v.status === 'pending' : true).length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  <Users size={48} className="mx-auto mb-4 opacity-50" />
                  <p>Inga volontärer hittades med valda filter</p>
                </div>
              )}
            </div>
          )}
        </main>

        {/* Volunteer Detail Panel */}
        {selectedVolunteer && (
          <aside className="w-96 bg-white border-l border-gray-200 overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex justify-between items-center">
              <h2 className="font-bold text-[#003D5C]">Volontärprofil</h2>
              <button 
                onClick={() => setSelectedVolunteer(null)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X size={20} className="text-gray-500" />
              </button>
            </div>

            <div className="p-4 space-y-6">
              {/* Header */}
              <div className="text-center">
                <div className="w-20 h-20 bg-[#E8F4F8] rounded-full flex items-center justify-center mx-auto mb-3">
                  <User size={40} className="text-[#003D5C]" />
                </div>
                <h3 className="text-xl font-bold text-[#003D5C]">{selectedVolunteer.name}</h3>
                <p className="text-gray-600">{selectedVolunteer.age} år • {selectedVolunteer.municipality}</p>
                <div className="mt-2">{getStatusBadge(selectedVolunteer.status)}</div>
              </div>

              {/* Contact Info */}
              <div className="bg-[#F8F9FA] rounded-lg p-4">
                <h4 className="font-semibold text-[#003D5C] mb-3">Kontaktuppgifter</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Mail size={16} className="text-gray-400" />
                    <a href={`mailto:${selectedVolunteer.email}`} className="text-[#006B7D] hover:underline">
                      {selectedVolunteer.email}
                    </a>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone size={16} className="text-gray-400" />
                    <a href={`tel:${selectedVolunteer.phone}`} className="text-[#006B7D] hover:underline">
                      {selectedVolunteer.phone}
                    </a>
                  </div>
                </div>
              </div>

              {/* Languages & Interests */}
              <div>
                <h4 className="font-semibold text-[#003D5C] mb-2">Språk</h4>
                <div className="flex flex-wrap gap-1">
                  {selectedVolunteer.languages.map((lang: string) => (
                    <span key={lang} className="px-2 py-1 bg-[#006B7D]/10 text-[#006B7D] rounded text-xs">
                      {lang}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-[#003D5C] mb-2">Intressen</h4>
                <div className="flex flex-wrap gap-1">
                  {selectedVolunteer.interests.map((interest: string) => (
                    <span key={interest} className="px-2 py-1 bg-[#F39C12]/10 text-[#E67E22] rounded text-xs">
                      {interest}
                    </span>
                  ))}
                </div>
              </div>

              {/* Experience & Motivation */}
              <div>
                <h4 className="font-semibold text-[#003D5C] mb-2">Erfarenhet</h4>
                <p className="text-sm text-gray-600">{selectedVolunteer.experience}</p>
              </div>

              <div>
                <h4 className="font-semibold text-[#003D5C] mb-2">Motivation</h4>
                <p className="text-sm text-gray-600">{selectedVolunteer.motivation}</p>
              </div>

              {/* Availability & Transport */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#F8F9FA] rounded-lg p-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Clock size={16} className="text-gray-400" />
                    <span className="text-gray-700">{selectedVolunteer.availability}</span>
                  </div>
                </div>
                <div className="bg-[#F8F9FA] rounded-lg p-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Car size={16} className="text-gray-400" />
                    <span className="text-gray-700">
                      {selectedVolunteer.hasCar ? 'Har bil' : 'Ingen bil'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Background Check */}
              <div className="bg-[#F8F9FA] rounded-lg p-4">
                <h4 className="font-semibold text-[#003D5C] mb-2">Bakgrundskontroll</h4>
                <div className="flex items-center justify-between">
                  {getBackgroundCheckBadge(selectedVolunteer.backgroundCheck)}
                  <span className="text-xs text-gray-500">Ansökt: {selectedVolunteer.appliedDate}</span>
                </div>
              </div>

              {/* Internal Notes */}
              <div>
                <h4 className="font-semibold text-[#003D5C] mb-2 flex items-center gap-2">
                  <MessageSquare size={16} />
                  Interna anteckningar
                </h4>
                <div className="space-y-2 mb-3">
                  {selectedVolunteer.notes.length === 0 ? (
                    <p className="text-sm text-gray-500 italic">Inga anteckningar ännu</p>
                  ) : (
                    selectedVolunteer.notes.map((note: string, i: number) => (
                      <div key={i} className="bg-yellow-50 border-l-2 border-yellow-400 p-2 text-sm text-gray-700">
                        {note}
                      </div>
                    ))
                  )}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    placeholder="Lägg till anteckning..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:border-[#006B7D] outline-none"
                    onKeyDown={(e) => e.key === 'Enter' && handleAddNote(selectedVolunteer.id)}
                  />
                  <button
                    onClick={() => handleAddNote(selectedVolunteer.id)}
                    className="px-3 py-2 bg-[#006B7D] text-white rounded-lg text-sm hover:bg-[#005a6a] transition"
                  >
                    Lägg till
                  </button>
                </div>
              </div>

              {/* Actions */}
              {selectedVolunteer.status === 'pending' && (
                <div className="border-t border-gray-200 pt-4">
                  <h4 className="font-semibold text-[#003D5C] mb-3">Åtgärder</h4>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleStatusChange(selectedVolunteer.id, 'approved')}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                    >
                      <CheckCircle size={18} />
                      Godkänn
                    </button>
                    <button
                      onClick={() => handleStatusChange(selectedVolunteer.id, 'rejected')}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                    >
                      <XCircle size={18} />
                      Avslå
                    </button>
                  </div>
                </div>
              )}
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}
