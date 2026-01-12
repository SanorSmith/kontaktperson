'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Search,
  Filter,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  Calendar,
  MapPin,
  Languages,
  ChevronDown,
  AlertCircle
} from 'lucide-react';

// Mock pending applications
const mockApplications = [
  {
    id: '1',
    full_name: 'Anna Svensson',
    email: 'anna.svensson@email.se',
    phone: '070-123 45 67',
    age: 32,
    municipality: 'Stockholm',
    languages: ['Svenska', 'Engelska'],
    motivation: 'Jag vill hjälpa ungdomar som behöver en vuxen förebild...',
    status: 'pending',
    background_check_status: 'not_requested',
    created_at: '2024-01-10T10:00:00Z',
    updated_at: '2024-01-10T10:00:00Z'
  },
  {
    id: '2',
    full_name: 'Erik Johansson',
    email: 'erik.j@email.se',
    phone: '070-234 56 78',
    age: 45,
    municipality: 'Stockholm',
    languages: ['Svenska', 'Arabiska', 'Engelska'],
    motivation: 'Som tidigare lärare har jag erfarenhet av att arbeta med barn...',
    status: 'under_review',
    background_check_status: 'pending',
    created_at: '2024-01-09T14:30:00Z',
    updated_at: '2024-01-11T09:00:00Z'
  },
  {
    id: '3',
    full_name: 'Maria Lindgren',
    email: 'maria.l@email.se',
    phone: '070-345 67 89',
    age: 28,
    municipality: 'Stockholm',
    languages: ['Svenska', 'Spanska', 'Engelska'],
    motivation: 'Jag har själv haft en kontaktperson som ung och vet hur viktigt det är...',
    status: 'pending',
    background_check_status: 'not_requested',
    created_at: '2024-01-08T09:15:00Z',
    updated_at: '2024-01-08T09:15:00Z'
  },
  {
    id: '4',
    full_name: 'Johan Berg',
    email: 'johan.berg@email.se',
    phone: '070-456 78 90',
    age: 55,
    municipality: 'Huddinge',
    languages: ['Svenska', 'Finska'],
    motivation: 'Nu när mina egna barn är vuxna vill jag ge tillbaka till samhället...',
    status: 'pending',
    background_check_status: 'not_requested',
    created_at: '2024-01-07T16:45:00Z',
    updated_at: '2024-01-07T16:45:00Z'
  },
  {
    id: '5',
    full_name: 'Sara Holm',
    email: 'sara.holm@email.se',
    phone: '070-567 89 01',
    age: 38,
    municipality: 'Stockholm',
    languages: ['Svenska', 'Persiska'],
    motivation: 'Jag arbetar som socionom och vill bidra även på min fritid...',
    status: 'under_review',
    background_check_status: 'approved',
    created_at: '2024-01-05T11:20:00Z',
    updated_at: '2024-01-12T14:00:00Z'
  }
];

export default function ApplicationsPage() {
  const [applications, setApplications] = useState(mockApplications);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const filteredApplications = applications
    .filter(app => {
      if (searchQuery && !app.full_name.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      if (statusFilter !== 'all' && app.status !== statusFilter) {
        return false;
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
      if (sortBy === 'oldest') {
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      }
      return 0;
    });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('sv-SE', { 
      day: 'numeric', 
      month: 'short',
      year: 'numeric'
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium bg-yellow-100 text-yellow-700 rounded-full">
            <Clock size={12} />
            Väntar på granskning
          </span>
        );
      case 'under_review':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded-full">
            <Eye size={12} />
            Under granskning
          </span>
        );
      default:
        return null;
    }
  };

  const getBackgroundCheckBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs bg-green-100 text-green-700 rounded">
            <CheckCircle size={10} />
            Bakgrundskontroll OK
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs bg-yellow-100 text-yellow-700 rounded">
            <Clock size={10} />
            Bakgrundskontroll väntar
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded">
            Ej begärd
          </span>
        );
    }
  };

  const canApprove = user?.access_level === 'approver' || user?.access_level === 'admin';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Ansökningar</h1>
          <p className="text-sm text-gray-500">
            {filteredApplications.length} ansökningar att granska
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Sök på namn..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:border-[#006B7D] focus:ring-1 focus:ring-[#006B7D] outline-none"
              />
            </div>
          </div>

          {/* Status filter */}
          <div className="sm:w-48">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-[#006B7D] focus:ring-1 focus:ring-[#006B7D] outline-none"
            >
              <option value="all">Alla status</option>
              <option value="pending">Väntar på granskning</option>
              <option value="under_review">Under granskning</option>
            </select>
          </div>

          {/* Sort */}
          <div className="sm:w-40">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-[#006B7D] focus:ring-1 focus:ring-[#006B7D] outline-none"
            >
              <option value="newest">Nyast först</option>
              <option value="oldest">Äldst först</option>
            </select>
          </div>
        </div>
      </div>

      {/* Permission notice for viewers */}
      {!canApprove && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle size={20} className="text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-blue-900">Läsläge</p>
            <p className="text-sm text-blue-700">
              Du har Viewer-behörighet och kan endast granska ansökningar. Kontakta din administratör för att få Approver-behörighet.
            </p>
          </div>
        </div>
      )}

      {/* Applications list */}
      <div className="space-y-4">
        {filteredApplications.map((app) => (
          <div
            key={app.id}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
              {/* Main info */}
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-full bg-[#006B7D] flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
                  {app.full_name.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-lg font-semibold text-gray-900">{app.full_name}</h3>
                    {getStatusBadge(app.status)}
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500 mb-3">
                    <span className="flex items-center gap-1">
                      <MapPin size={14} />
                      {app.municipality}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar size={14} />
                      {formatDate(app.created_at)}
                    </span>
                    <span>{app.age} år</span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <Languages size={14} className="text-gray-400" />
                    {app.languages.map((lang) => (
                      <span key={lang} className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">
                        {lang}
                      </span>
                    ))}
                  </div>

                  <p className="text-sm text-gray-600 line-clamp-2 max-w-2xl">
                    "{app.motivation}"
                  </p>

                  <div className="mt-3">
                    {getBackgroundCheckBadge(app.background_check_status)}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-2 lg:items-end">
                <Link
                  href={`/social-worker/applications/${app.id}`}
                  className="px-4 py-2 bg-[#006B7D] hover:bg-[#005a6a] text-white text-sm font-medium rounded-lg transition-colors text-center"
                >
                  Granska ansökan
                </Link>
                
                {canApprove && (
                  <div className="flex gap-2">
                    <button
                      className="px-3 py-1.5 bg-green-100 hover:bg-green-200 text-green-700 text-sm font-medium rounded-lg transition-colors"
                      title="Snabbgodkänn"
                    >
                      <CheckCircle size={16} />
                    </button>
                    <button
                      className="px-3 py-1.5 bg-red-100 hover:bg-red-200 text-red-700 text-sm font-medium rounded-lg transition-colors"
                      title="Snabbavvisa"
                    >
                      <XCircle size={16} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}

        {filteredApplications.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
            <CheckCircle size={48} className="mx-auto text-green-500 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Inga ansökningar</h3>
            <p className="text-gray-500">
              {statusFilter !== 'all' 
                ? 'Inga ansökningar matchar dina filter.'
                : 'Det finns inga väntande ansökningar just nu.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
