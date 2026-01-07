// ============================================
// Admin Component: Social Workers List
// ============================================

'use client';

import { useState, useEffect } from 'react';
import { getAllSocialWorkers, resendInvitation, deactivateSocialWorker } from '@/lib/auth/socialWorkerInvitation';

interface SocialWorker {
  id: string;
  profile: {
    full_name: string;
    email: string;
  };
  work_email: string;
  municipality_id: string;
  municipality: {
    name: string;
  };
  department: string;
  position: string;
  access_level: string;
  verified: boolean;
  is_active: boolean;
  created_at: string;
  invitation_sent_at?: string;
  invitation_expires_at?: string;
}

interface SocialWorkersListProps {
  adminId: string;
  onAddNew?: () => void;
}

export default function SocialWorkersList({ adminId, onAddNew }: SocialWorkersListProps) {
  const [socialWorkers, setSocialWorkers] = useState<SocialWorker[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    municipality: '',
    status: '',
    access_level: '',
    search: ''
  });
  const [sortBy, setSortBy] = useState<'name' | 'created' | 'status'>('created');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  useEffect(() => {
    loadSocialWorkers();
  }, [filters]);

  const loadSocialWorkers = async () => {
    setLoading(true);
    const { data, error } = await getAllSocialWorkers({
      municipality: filters.municipality || undefined,
      status: filters.status as any || undefined,
      access_level: filters.access_level || undefined,
      search: filters.search || undefined
    });

    if (data) {
      setSocialWorkers(data);
    }
    setLoading(false);
  };

  const handleResendInvitation = async (socialWorkerId: string) => {
    if (!confirm('Skicka om inbjudan till denna socialsekreterare?')) {
      return;
    }

    const result = await resendInvitation(socialWorkerId, adminId);
    if (result.success) {
      alert('Inbjudan skickad!');
      loadSocialWorkers();
    } else {
      alert('Kunde inte skicka inbjudan: ' + result.error);
    }
  };

  const handleDeactivate = async (socialWorkerId: string, name: string) => {
    const reason = prompt(`Ange anledning för att inaktivera ${name}:`);
    if (!reason) return;

    const result = await deactivateSocialWorker(socialWorkerId, adminId, reason);
    if (result.success) {
      alert('Användare inaktiverad');
      loadSocialWorkers();
    } else {
      alert('Kunde inte inaktivera: ' + result.error);
    }
  };

  const getStatusBadge = (sw: SocialWorker) => {
    if (!sw.is_active) {
      return <span className="px-2 py-1 text-xs font-medium bg-gray-200 text-gray-700 rounded-full">Inaktiv</span>;
    }
    if (sw.verified) {
      return <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-full">✓ Verifierad</span>;
    }
    return <span className="px-2 py-1 text-xs font-medium bg-orange-100 text-orange-700 rounded-full">⏳ Väntande</span>;
  };

  const getAccessLevelBadge = (level: string) => {
    const styles = {
      viewer: 'bg-blue-100 text-blue-700',
      approver: 'bg-purple-100 text-purple-700',
      admin: 'bg-red-100 text-red-700'
    };
    const labels = {
      viewer: 'Läsare',
      approver: 'Godkännare',
      admin: 'Admin'
    };
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${styles[level as keyof typeof styles]}`}>
        {labels[level as keyof typeof labels]}
      </span>
    );
  };

  const sortedWorkers = [...socialWorkers].sort((a, b) => {
    if (sortBy === 'name') {
      return a.profile.full_name.localeCompare(b.profile.full_name);
    } else if (sortBy === 'created') {
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    } else {
      return (b.verified ? 1 : 0) - (a.verified ? 1 : 0);
    }
  });

  const paginatedWorkers = sortedWorkers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(sortedWorkers.length / itemsPerPage);

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-[#003D5C]">Socialsekreterare</h1>
          <p className="text-gray-600 mt-1">Hantera socialsekreterare och deras behörigheter</p>
        </div>
        {onAddNew && (
          <button
            onClick={onAddNew}
            className="bg-[#F39C12] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#E67E22] transition shadow-md hover:shadow-lg flex items-center gap-2"
          >
            <span>➕</span> Lägg till socialsekreterare
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Sök</label>
            <input
              type="text"
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              placeholder="Namn eller e-post..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006B7D]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006B7D]"
            >
              <option value="">Alla</option>
              <option value="verified">Verifierad</option>
              <option value="pending">Väntande</option>
              <option value="inactive">Inaktiv</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Behörighet</label>
            <select
              value={filters.access_level}
              onChange={(e) => setFilters({ ...filters, access_level: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006B7D]"
            >
              <option value="">Alla</option>
              <option value="viewer">Läsare</option>
              <option value="approver">Godkännare</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Sortera efter</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006B7D]"
            >
              <option value="created">Senast skapad</option>
              <option value="name">Namn (A-Ö)</option>
              <option value="status">Status</option>
            </select>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <p className="text-sm text-gray-600">Totalt</p>
          <p className="text-2xl font-bold text-[#003D5C]">{socialWorkers.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <p className="text-sm text-gray-600">Verifierade</p>
          <p className="text-2xl font-bold text-green-600">
            {socialWorkers.filter(sw => sw.verified && sw.is_active).length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <p className="text-sm text-gray-600">Väntande</p>
          <p className="text-2xl font-bold text-orange-600">
            {socialWorkers.filter(sw => !sw.verified).length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <p className="text-sm text-gray-600">Inaktiva</p>
          <p className="text-2xl font-bold text-gray-600">
            {socialWorkers.filter(sw => !sw.is_active).length}
          </p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-500">
            <div className="animate-spin w-8 h-8 border-4 border-[#006B7D] border-t-transparent rounded-full mx-auto mb-4"></div>
            Laddar...
          </div>
        ) : paginatedWorkers.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            Inga socialsekreterare hittades
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Namn
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Arbetsmail
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Kommun
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Avdelning
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Behörighet
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Åtgärder
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paginatedWorkers.map((sw) => (
                    <tr key={sw.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <p className="font-medium text-gray-900">{sw.profile.full_name}</p>
                          <p className="text-sm text-gray-500">{sw.position}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {sw.work_email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {sw.municipality.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {sw.department}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(sw)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getAccessLevelBadge(sw.access_level)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex gap-2">
                          {!sw.verified && (
                            <button
                              onClick={() => handleResendInvitation(sw.id)}
                              className="text-[#006B7D] hover:text-[#003D5C] font-medium"
                              title="Skicka om inbjudan"
                            >
                              📧
                            </button>
                          )}
                          {sw.is_active && (
                            <button
                              onClick={() => handleDeactivate(sw.id, sw.profile.full_name)}
                              className="text-red-600 hover:text-red-800 font-medium"
                              title="Inaktivera"
                            >
                              🚫
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                <p className="text-sm text-gray-600">
                  Visar {(currentPage - 1) * itemsPerPage + 1}-{Math.min(currentPage * itemsPerPage, sortedWorkers.length)} av {sortedWorkers.length}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Föregående
                  </button>
                  <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Nästa
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
