'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Search,
  Filter,
  Download,
  Eye,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  XCircle,
  Clock,
  UserX,
  MoreVertical
} from 'lucide-react';

interface Volunteer {
  id: string;
  name: string;
  email: string;
  age: number;
  municipality: string;
  status: 'pending' | 'approved' | 'rejected' | 'inactive';
  appliedDate: string;
  approvedBy?: string;
  languages: string[];
}

// Mock data
const mockVolunteers: Volunteer[] = [
  { id: '1', name: 'Anna Andersson', email: 'anna.a@gmail.com', age: 34, municipality: 'Stockholm', status: 'approved', appliedDate: '2024-01-15', approvedBy: 'Maria Lindberg', languages: ['Svenska', 'Engelska', 'Arabiska'] },
  { id: '2', name: 'Erik Eriksson', email: 'erik.e@hotmail.com', age: 28, municipality: 'Stockholm', status: 'pending', appliedDate: '2024-02-20', languages: ['Svenska', 'Engelska'] },
  { id: '3', name: 'Maria Johansson', email: 'maria.j@gmail.com', age: 45, municipality: 'Göteborg', status: 'approved', appliedDate: '2024-01-05', approvedBy: 'Johan Andersson', languages: ['Svenska', 'Spanska', 'Engelska'] },
  { id: '4', name: 'Ahmed Hassan', email: 'ahmed.h@outlook.com', age: 31, municipality: 'Malmö', status: 'pending', appliedDate: '2024-02-10', languages: ['Svenska', 'Arabiska', 'Engelska', 'Somaliska'] },
  { id: '5', name: 'Lisa Lindgren', email: 'lisa.l@gmail.com', age: 52, municipality: 'Uppsala', status: 'approved', appliedDate: '2023-12-01', approvedBy: 'Anna Svensson', languages: ['Svenska', 'Finska', 'Engelska'] },
  { id: '6', name: 'Johan Svensson', email: 'johan.s@gmail.com', age: 38, municipality: 'Linköping', status: 'rejected', appliedDate: '2024-01-25', languages: ['Svenska', 'Engelska', 'Tyska'] },
  { id: '7', name: 'Sara Berg', email: 'sara.b@yahoo.com', age: 29, municipality: 'Örebro', status: 'approved', appliedDate: '2024-01-18', approvedBy: 'Erik Johansson', languages: ['Svenska', 'Engelska'] },
  { id: '8', name: 'Peter Nilsson', email: 'peter.n@gmail.com', age: 41, municipality: 'Västerås', status: 'inactive', appliedDate: '2023-11-15', languages: ['Svenska', 'Engelska', 'Franska'] },
  { id: '9', name: 'Emma Karlsson', email: 'emma.k@hotmail.com', age: 26, municipality: 'Stockholm', status: 'pending', appliedDate: '2024-02-22', languages: ['Svenska', 'Engelska', 'Kinesiska'] },
  { id: '10', name: 'Oscar Larsson', email: 'oscar.l@gmail.com', age: 33, municipality: 'Göteborg', status: 'approved', appliedDate: '2024-01-08', approvedBy: 'Maria Lindberg', languages: ['Svenska', 'Engelska'] },
];

const municipalities = ['Alla', 'Stockholm', 'Göteborg', 'Malmö', 'Uppsala', 'Linköping', 'Örebro', 'Västerås'];
const statusOptions = [
  { value: 'all', label: 'Alla' },
  { value: 'pending', label: 'Väntande' },
  { value: 'approved', label: 'Godkänd' },
  { value: 'rejected', label: 'Avvisad' },
  { value: 'inactive', label: 'Inaktiv' }
];

export default function VolunteersPage() {
  const [volunteers, setVolunteers] = useState(mockVolunteers);
  const [filteredVolunteers, setFilteredVolunteers] = useState(mockVolunteers);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMunicipality, setFilterMunicipality] = useState('Alla');
  const [filterStatus, setFilterStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const pageSize = 20;

  useEffect(() => {
    let filtered = [...volunteers];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(v => 
        v.name.toLowerCase().includes(query) ||
        v.email.toLowerCase().includes(query)
      );
    }

    if (filterMunicipality !== 'Alla') {
      filtered = filtered.filter(v => v.municipality === filterMunicipality);
    }

    if (filterStatus !== 'all') {
      filtered = filtered.filter(v => v.status === filterStatus);
    }

    setFilteredVolunteers(filtered);
    setCurrentPage(1);
  }, [searchQuery, filterMunicipality, filterStatus, volunteers]);

  const totalPages = Math.ceil(filteredVolunteers.length / pageSize);
  const paginatedVolunteers = filteredVolunteers.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <span className="px-2 py-1 bg-[#27AE60]/10 text-[#27AE60] rounded-full text-xs font-medium flex items-center gap-1"><CheckCircle size={14} /> Godkänd</span>;
      case 'pending':
        return <span className="px-2 py-1 bg-[#F39C12]/10 text-[#F39C12] rounded-full text-xs font-medium flex items-center gap-1"><Clock size={14} /> Väntande</span>;
      case 'rejected':
        return <span className="px-2 py-1 bg-[#E74C3C]/10 text-[#E74C3C] rounded-full text-xs font-medium flex items-center gap-1"><XCircle size={14} /> Avvisad</span>;
      case 'inactive':
        return <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium flex items-center gap-1"><UserX size={14} /> Inaktiv</span>;
      default:
        return null;
    }
  };

  const handleSelectAll = () => {
    if (selectedIds.length === paginatedVolunteers.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(paginatedVolunteers.map(v => v.id));
    }
  };

  const handleSelect = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleExport = () => {
    const dataToExport = selectedIds.length > 0 
      ? volunteers.filter(v => selectedIds.includes(v.id))
      : filteredVolunteers;
    
    console.log('Exporting:', dataToExport);
    // In real implementation, generate CSV/Excel file
    alert(`Exporterar ${dataToExport.length} volontärer...`);
  };

  const handleOverrideStatus = (id: string) => {
    setVolunteers(prev => prev.map(v => 
      v.id === id ? { ...v, status: 'pending' as const } : v
    ));
    setActiveDropdown(null);
  };

  const handleDeactivate = (id: string) => {
    setVolunteers(prev => prev.map(v => 
      v.id === id ? { ...v, status: 'inactive' as const } : v
    ));
    setActiveDropdown(null);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#003D5C]">Volontärer</h1>
          <p className="text-gray-600">Översikt över alla registrerade volontärer</p>
        </div>
        <button
          onClick={handleExport}
          className="inline-flex items-center gap-2 bg-[#003D5C] hover:bg-[#004e75] text-white px-4 py-2.5 rounded-lg font-medium transition"
        >
          <Download size={20} />
          Exportera {selectedIds.length > 0 ? `(${selectedIds.length})` : ''}
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-2xl font-bold text-[#003D5C]">{volunteers.length}</p>
          <p className="text-sm text-gray-600">Totalt</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-2xl font-bold text-[#F39C12]">{volunteers.filter(v => v.status === 'pending').length}</p>
          <p className="text-sm text-gray-600">Väntande</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-2xl font-bold text-[#27AE60]">{volunteers.filter(v => v.status === 'approved').length}</p>
          <p className="text-sm text-gray-600">Godkända</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-2xl font-bold text-[#E74C3C]">{volunteers.filter(v => v.status === 'rejected').length}</p>
          <p className="text-sm text-gray-600">Avvisade</p>
        </div>
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
          </div>
        </div>

        {/* Results count */}
        <div className="mt-4 text-sm text-gray-600">
          Visar {filteredVolunteers.length} av {volunteers.length} volontärer
          {selectedIds.length > 0 && (
            <span className="ml-2 text-[#F39C12]">• {selectedIds.length} valda</span>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 w-12">
                  <input
                    type="checkbox"
                    checked={selectedIds.length === paginatedVolunteers.length && paginatedVolunteers.length > 0}
                    onChange={handleSelectAll}
                    className="w-4 h-4 rounded"
                  />
                </th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-[#003D5C]">Namn</th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-[#003D5C] hidden md:table-cell">Ålder</th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-[#003D5C] hidden md:table-cell">Kommun</th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-[#003D5C]">Status</th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-[#003D5C] hidden lg:table-cell">Ansökt</th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-[#003D5C] hidden lg:table-cell">Godkänd av</th>
                <th className="text-right px-4 py-3 text-sm font-semibold text-[#003D5C]">Åtgärder</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {paginatedVolunteers.map((volunteer, index) => (
                <tr key={volunteer.id} className={`hover:bg-gray-50 ${index % 2 === 1 ? 'bg-gray-50/50' : ''}`}>
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(volunteer.id)}
                      onChange={() => handleSelect(volunteer.id)}
                      className="w-4 h-4 rounded"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-[#006B7D]/10 rounded-full flex items-center justify-center">
                        <span className="text-[#006B7D] font-medium text-sm">{volunteer.name.charAt(0)}</span>
                      </div>
                      <div>
                        <p className="font-medium text-[#003D5C]">{volunteer.name}</p>
                        <p className="text-xs text-gray-500">{volunteer.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600 hidden md:table-cell">{volunteer.age} år</td>
                  <td className="px-4 py-3 text-sm text-gray-600 hidden md:table-cell">{volunteer.municipality}</td>
                  <td className="px-4 py-3">{getStatusBadge(volunteer.status)}</td>
                  <td className="px-4 py-3 text-sm text-gray-600 hidden lg:table-cell">{volunteer.appliedDate}</td>
                  <td className="px-4 py-3 text-sm text-gray-600 hidden lg:table-cell">{volunteer.approvedBy || '-'}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <Link
                        href={`/admin/volunteers/${volunteer.id}`}
                        className="p-2 hover:bg-gray-100 rounded-lg transition"
                        title="Visa"
                      >
                        <Eye size={18} className="text-gray-500" />
                      </Link>
                      <div className="relative">
                        <button
                          onClick={() => setActiveDropdown(activeDropdown === volunteer.id ? null : volunteer.id)}
                          className="p-2 hover:bg-gray-100 rounded-lg transition"
                        >
                          <MoreVertical size={18} className="text-gray-500" />
                        </button>
                        {activeDropdown === volunteer.id && (
                          <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                            {volunteer.status === 'rejected' && (
                              <button
                                onClick={() => handleOverrideStatus(volunteer.id)}
                                className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                              >
                                <Clock size={16} />
                                Återställ till väntande
                              </button>
                            )}
                            {volunteer.status !== 'inactive' && (
                              <button
                                onClick={() => handleDeactivate(volunteer.id)}
                                className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                              >
                                <UserX size={16} />
                                Inaktivera
                              </button>
                            )}
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

        {/* Pagination */}
        {totalPages > 1 && (
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

        {/* Empty State */}
        {filteredVolunteers.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search size={24} className="text-gray-400" />
            </div>
            <p className="text-gray-600">Inga volontärer hittades</p>
            <p className="text-sm text-gray-500 mt-1">Försök med andra sökkriterier</p>
          </div>
        )}
      </div>
    </div>
  );
}
