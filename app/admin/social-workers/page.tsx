'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import {
  Search,
  Plus,
  Filter,
  ChevronDown,
  Edit,
  Eye,
  Mail,
  Trash2,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  UserX,
  RefreshCw,
  Loader2
} from 'lucide-react';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null;

interface SocialWorker {
  id: string;
  name: string;
  email: string;
  workEmail: string;
  municipality: string;
  department: string;
  position: string;
  accessLevel: 'viewer' | 'approver' | 'admin';
  status: 'verified' | 'pending' | 'inactive';
  createdAt: string;
}

const municipalities = ['Alla', 'Stockholm', 'Göteborg', 'Malmö', 'Uppsala', 'Linköping', 'Örebro', 'Västerås', 'Norrköping'];
const statusOptions = [
  { value: 'all', label: 'Alla' },
  { value: 'verified', label: 'Verifierad' },
  { value: 'pending', label: 'Väntande' },
  { value: 'inactive', label: 'Inaktiv' }
];
const accessLevels = [
  { value: 'all', label: 'Alla' },
  { value: 'viewer', label: 'Viewer' },
  { value: 'approver', label: 'Approver' },
  { value: 'admin', label: 'Admin' }
];

export default function SocialWorkersPage() {
  const searchParams = useSearchParams();
  const initialFilter = searchParams.get('filter') || 'all';
  
  const [socialWorkers, setSocialWorkers] = useState<SocialWorker[]>([]);
  const [filteredWorkers, setFilteredWorkers] = useState<SocialWorker[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMunicipality, setFilterMunicipality] = useState('Alla');
  const [filterStatus, setFilterStatus] = useState(initialFilter);
  const [filterAccessLevel, setFilterAccessLevel] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const pageSize = 20;

  // Fetch social workers from API
  useEffect(() => {
    async function fetchSocialWorkers() {
      try {
        // Use API route to fetch data (bypasses RLS)
        const response = await fetch('/api/admin/get-social-workers');
        const result = await response.json();

        if (!response.ok) {
          console.error('Error fetching social workers:', result.error);
          setIsLoading(false);
          return;
        }

        // Transform data to match our interface
        const workers: SocialWorker[] = (result.socialWorkers || []).map((sw: any) => ({
          id: sw.id,
          name: sw.name || 'Okänt namn',
          email: sw.email || '',
          workEmail: sw.email || '',
          municipality: sw.municipality || 'Okänd',
          department: sw.department || 'Socialtjänsten',
          position: sw.position || 'Socialsekreterare',
          accessLevel: sw.accessLevel || 'viewer',
          status: sw.status === 'active' ? 'verified' : (sw.status || 'pending'),
          createdAt: sw.createdAt || new Date().toISOString().split('T')[0]
        }));
        setSocialWorkers(workers);
        setFilteredWorkers(workers);
      } catch (err) {
        console.error('Error:', err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchSocialWorkers();
  }, []);

  // Filter effect
  useEffect(() => {
    let filtered = [...socialWorkers];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(w => 
        w.name.toLowerCase().includes(query) ||
        w.email.toLowerCase().includes(query) ||
        w.workEmail.toLowerCase().includes(query)
      );
    }

    if (filterMunicipality !== 'Alla') {
      filtered = filtered.filter(w => w.municipality === filterMunicipality);
    }

    if (filterStatus !== 'all') {
      filtered = filtered.filter(w => w.status === filterStatus);
    }

    if (filterAccessLevel !== 'all') {
      filtered = filtered.filter(w => w.accessLevel === filterAccessLevel);
    }

    setFilteredWorkers(filtered);
    setCurrentPage(1);
  }, [searchQuery, filterMunicipality, filterStatus, filterAccessLevel, socialWorkers]);

  const totalPages = Math.ceil(filteredWorkers.length / pageSize);
  const paginatedWorkers = filteredWorkers.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'verified':
        return <span className="px-2 py-1 bg-[#27AE60]/10 text-[#27AE60] rounded-full text-xs font-medium">Verifierad</span>;
      case 'pending':
        return <span className="px-2 py-1 bg-[#F39C12]/10 text-[#F39C12] rounded-full text-xs font-medium">Väntande</span>;
      case 'inactive':
        return <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">Inaktiv</span>;
      default:
        return null;
    }
  };

  const getAccessLevelBadge = (level: string) => {
    switch (level) {
      case 'admin':
        return <span className="px-2 py-1 bg-[#003D5C]/10 text-[#003D5C] rounded-full text-xs font-medium">Admin</span>;
      case 'approver':
        return <span className="px-2 py-1 bg-[#006B7D]/10 text-[#006B7D] rounded-full text-xs font-medium">Approver</span>;
      case 'viewer':
        return <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">Viewer</span>;
      default:
        return null;
    }
  };

  const handleResendInvitation = (id: string) => {
    console.log('Resend invitation to:', id);
    setActiveDropdown(null);
  };

  const handleDeactivate = (id: string) => {
    console.log('Deactivate:', id);
    setActiveDropdown(null);
  };

  const handleDelete = (id: string) => {
    if (confirm('Är du säker? Detta kan inte ångras.')) {
      setSocialWorkers(prev => prev.filter(w => w.id !== id));
    }
    setActiveDropdown(null);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#003D5C]">Socialsekreterare</h1>
          <p className="text-gray-600">Hantera socialsekreterare och deras behörigheter</p>
        </div>
        <Link
          href="/admin/social-workers/new"
          className="inline-flex items-center gap-2 bg-[#F39C12] hover:bg-[#E67E22] text-white px-4 py-2.5 rounded-lg font-medium transition"
        >
          <Plus size={20} />
          Lägg till socialsekreterare
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Sök på namn eller e-post..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:border-[#003D5C] focus:ring-1 focus:ring-[#003D5C] outline-none"
            />
          </div>

          {/* Filter Dropdowns */}
          <div className="flex flex-wrap gap-3">
            <select
              value={filterMunicipality}
              onChange={(e) => setFilterMunicipality(e.target.value)}
              className="px-4 py-2.5 border border-gray-300 rounded-lg focus:border-[#003D5C] outline-none bg-white"
            >
              {municipalities.map(m => (
                <option key={m} value={m}>{m === 'Alla' ? 'Alla kommuner' : m}</option>
              ))}
            </select>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2.5 border border-gray-300 rounded-lg focus:border-[#003D5C] outline-none bg-white"
            >
              {statusOptions.map(s => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>

            <select
              value={filterAccessLevel}
              onChange={(e) => setFilterAccessLevel(e.target.value)}
              className="px-4 py-2.5 border border-gray-300 rounded-lg focus:border-[#003D5C] outline-none bg-white"
            >
              {accessLevels.map(a => (
                <option key={a.value} value={a.value}>{a.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Results count */}
        <div className="mt-4 text-sm text-gray-600">
          Visar {filteredWorkers.length} av {socialWorkers.length} socialsekreterare
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 size={32} className="animate-spin text-[#003D5C]" />
            <span className="ml-3 text-gray-600">Laddar socialsekreterare...</span>
          </div>
        ) : socialWorkers.length === 0 ? (
          <div className="text-center py-12">
            <UserX size={48} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-600 mb-2">Inga socialsekreterare</h3>
            <p className="text-gray-500 mb-4">Det finns inga socialsekreterare i systemet ännu.</p>
            <Link
              href="/admin/social-workers/new"
              className="inline-flex items-center gap-2 bg-[#F39C12] hover:bg-[#E67E22] text-white px-4 py-2 rounded-lg font-medium transition"
            >
              <Plus size={18} />
              Lägg till första socialsekreteraren
            </Link>
          </div>
        ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 text-sm font-semibold text-[#003D5C]">Namn</th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-[#003D5C]">Arbetsmail</th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-[#003D5C] hidden md:table-cell">Kommun</th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-[#003D5C] hidden lg:table-cell">Avdelning</th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-[#003D5C]">Status</th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-[#003D5C] hidden sm:table-cell">Behörighet</th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-[#003D5C] hidden lg:table-cell">Skapad</th>
                <th className="text-right px-4 py-3 text-sm font-semibold text-[#003D5C]">Åtgärder</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {paginatedWorkers.map((worker: SocialWorker, index: number) => (
                <tr key={worker.id} className={`hover:bg-gray-50 ${index % 2 === 1 ? 'bg-gray-50/50' : ''}`}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-[#003D5C]/10 rounded-full flex items-center justify-center">
                        <span className="text-[#003D5C] font-medium text-sm">{worker.name.charAt(0)}</span>
                      </div>
                      <div>
                        <p className="font-medium text-[#003D5C]">{worker.name}</p>
                        <p className="text-xs text-gray-500 md:hidden">{worker.municipality}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{worker.workEmail}</td>
                  <td className="px-4 py-3 text-sm text-gray-600 hidden md:table-cell">{worker.municipality}</td>
                  <td className="px-4 py-3 text-sm text-gray-600 hidden lg:table-cell">{worker.department}</td>
                  <td className="px-4 py-3">{getStatusBadge(worker.status)}</td>
                  <td className="px-4 py-3 hidden sm:table-cell">{getAccessLevelBadge(worker.accessLevel)}</td>
                  <td className="px-4 py-3 text-sm text-gray-600 hidden lg:table-cell">{worker.createdAt}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <Link
                        href={`/admin/social-workers/${worker.id}`}
                        className="p-2 hover:bg-gray-100 rounded-lg transition"
                        title="Visa"
                      >
                        <Eye size={18} className="text-gray-500" />
                      </Link>
                      <Link
                        href={`/admin/social-workers/${worker.id}/edit`}
                        className="p-2 hover:bg-gray-100 rounded-lg transition"
                        title="Redigera"
                      >
                        <Edit size={18} className="text-gray-500" />
                      </Link>
                      <div className="relative">
                        <button
                          onClick={() => setActiveDropdown(activeDropdown === worker.id ? null : worker.id)}
                          className="p-2 hover:bg-gray-100 rounded-lg transition"
                        >
                          <MoreVertical size={18} className="text-gray-500" />
                        </button>
                        {activeDropdown === worker.id && (
                          <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                            {worker.status === 'pending' && (
                              <button
                                onClick={() => handleResendInvitation(worker.id)}
                                className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                              >
                                <RefreshCw size={16} />
                                Skicka inbjudan igen
                              </button>
                            )}
                            <button
                              onClick={() => handleDeactivate(worker.id)}
                              className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                            >
                              <UserX size={16} />
                              {worker.status === 'inactive' ? 'Aktivera' : 'Inaktivera'}
                            </button>
                            <button
                              onClick={() => handleDelete(worker.id)}
                              className="flex items-center gap-2 w-full px-4 py-2 text-sm text-[#E74C3C] hover:bg-red-50"
                            >
                              <Trash2 size={16} />
                              Ta bort
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        )}

        {/* Pagination */}
        {!isLoading && socialWorkers.length > 0 && totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              Sida {currentPage} av {totalPages}
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2 hover:bg-gray-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft size={20} />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-8 h-8 rounded-lg text-sm font-medium ${
                    currentPage === page 
                      ? 'bg-[#003D5C] text-white' 
                      : 'hover:bg-gray-100 text-gray-600'
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-2 hover:bg-gray-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        )}

        {/* Empty Search State */}
        {!isLoading && socialWorkers.length > 0 && filteredWorkers.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search size={24} className="text-gray-400" />
            </div>
            <p className="text-gray-600">Inga socialsekreterare hittades</p>
            <p className="text-sm text-gray-500 mt-1">Försök med andra sökkriterier</p>
          </div>
        )}
      </div>
    </div>
  );
}
