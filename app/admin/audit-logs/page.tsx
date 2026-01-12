'use client';

import { useState } from 'react';
import {
  Search,
  Filter,
  Download,
  Calendar,
  ChevronLeft,
  ChevronRight,
  FileText,
  User,
  Clock,
  ChevronDown,
  X
} from 'lucide-react';

interface AuditLog {
  id: string;
  action: string;
  actionLabel: string;
  performedBy: string;
  performedByEmail: string;
  targetName?: string;
  targetType?: string;
  details: Record<string, any>;
  ipAddress: string;
  userAgent: string;
  createdAt: string;
}

const mockAuditLogs: AuditLog[] = [
  { id: '1', action: 'login_success', actionLabel: 'Lyckad inloggning', performedBy: 'Anna Svensson', performedByEmail: 'anna.svensson@stockholm.se', ipAddress: '192.168.1.1', userAgent: 'Chrome/120.0', createdAt: '2024-01-12 09:30:15', details: { method: 'password' } },
  { id: '2', action: 'volunteer_approved', actionLabel: 'Volontär godkänd', performedBy: 'Anna Svensson', performedByEmail: 'anna.svensson@stockholm.se', targetName: 'Erik Eriksson', targetType: 'volunteer', ipAddress: '192.168.1.1', userAgent: 'Chrome/120.0', createdAt: '2024-01-12 09:15:22', details: { volunteer_id: '123', previous_status: 'pending' } },
  { id: '3', action: 'invitation_created', actionLabel: 'Inbjudan skapad', performedBy: 'Admin', performedByEmail: 'admin@kontaktperson.se', targetName: 'Maria Lindberg', targetType: 'social_worker', ipAddress: '192.168.1.100', userAgent: 'Firefox/121.0', createdAt: '2024-01-12 08:45:00', details: { email: 'maria.l@malmo.se', access_level: 'approver' } },
  { id: '4', action: 'profile_updated', actionLabel: 'Profil uppdaterad', performedBy: 'Admin', performedByEmail: 'admin@kontaktperson.se', targetName: 'Johan Andersson', targetType: 'social_worker', ipAddress: '192.168.1.100', userAgent: 'Firefox/121.0', createdAt: '2024-01-11 16:30:00', details: { changed_fields: ['department', 'position'] } },
  { id: '5', action: 'account_deactivated', actionLabel: 'Konto inaktiverat', performedBy: 'Admin', performedByEmail: 'admin@kontaktperson.se', targetName: 'Lisa Karlsson', targetType: 'social_worker', ipAddress: '192.168.1.100', userAgent: 'Firefox/121.0', createdAt: '2024-01-11 14:20:00', details: { reason: 'Avslutad anställning' } },
  { id: '6', action: 'volunteer_rejected', actionLabel: 'Volontär avvisad', performedBy: 'Erik Johansson', performedByEmail: 'erik.j@goteborg.se', targetName: 'Johan Svensson', targetType: 'volunteer', ipAddress: '192.168.1.50', userAgent: 'Safari/17.0', createdAt: '2024-01-11 11:00:00', details: { reason: 'Anmärkning i belastningsregister' } },
  { id: '7', action: 'invitation_accepted', actionLabel: 'Inbjudan accepterad', performedBy: 'Sara Berg', performedByEmail: 'sara.b@orebro.se', ipAddress: '192.168.2.10', userAgent: 'Chrome/120.0', createdAt: '2024-01-10 10:15:00', details: { invitation_token: 'abc123' } },
  { id: '8', action: 'password_reset', actionLabel: 'Lösenord återställt', performedBy: 'Admin', performedByEmail: 'admin@kontaktperson.se', targetName: 'Peter Nilsson', targetType: 'social_worker', ipAddress: '192.168.1.100', userAgent: 'Firefox/121.0', createdAt: '2024-01-10 09:00:00', details: {} },
  { id: '9', action: 'domain_added', actionLabel: 'Domän tillagd', performedBy: 'Admin', performedByEmail: 'admin@kontaktperson.se', ipAddress: '192.168.1.100', userAgent: 'Firefox/121.0', createdAt: '2024-01-09 15:30:00', details: { domain: 'vasteras.se', municipality: 'Västerås' } },
  { id: '10', action: 'settings_changed', actionLabel: 'Inställningar ändrade', performedBy: 'Admin', performedByEmail: 'admin@kontaktperson.se', ipAddress: '192.168.1.100', userAgent: 'Firefox/121.0', createdAt: '2024-01-09 14:00:00', details: { changed: ['session_timeout', 'max_login_attempts'] } },
];

const actionTypes = [
  { value: 'all', label: 'Alla åtgärder' },
  { value: 'login_success', label: 'Lyckad inloggning' },
  { value: 'login_failed', label: 'Misslyckad inloggning' },
  { value: 'invitation_created', label: 'Inbjudan skapad' },
  { value: 'invitation_accepted', label: 'Inbjudan accepterad' },
  { value: 'invitation_resent', label: 'Inbjudan skickad igen' },
  { value: 'account_activated', label: 'Konto aktiverat' },
  { value: 'account_deactivated', label: 'Konto inaktiverat' },
  { value: 'account_deleted', label: 'Konto borttaget' },
  { value: 'profile_updated', label: 'Profil uppdaterad' },
  { value: 'password_reset', label: 'Lösenord återställt' },
  { value: 'volunteer_approved', label: 'Volontär godkänd' },
  { value: 'volunteer_rejected', label: 'Volontär avvisad' },
  { value: 'permission_changed', label: 'Behörighet ändrad' },
  { value: 'domain_added', label: 'Domän tillagd' },
  { value: 'domain_removed', label: 'Domän borttagen' },
  { value: 'settings_changed', label: 'Inställningar ändrade' },
];

export default function AuditLogsPage() {
  const [logs, setLogs] = useState(mockAuditLogs);
  const [filteredLogs, setFilteredLogs] = useState(mockAuditLogs);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterAction, setFilterAction] = useState('all');
  const [filterDateFrom, setFilterDateFrom] = useState('');
  const [filterDateTo, setFilterDateTo] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);
  const pageSize = 50;

  const handleFilter = () => {
    let filtered = [...logs];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(log => 
        log.performedBy.toLowerCase().includes(query) ||
        log.performedByEmail.toLowerCase().includes(query) ||
        log.targetName?.toLowerCase().includes(query) ||
        log.actionLabel.toLowerCase().includes(query)
      );
    }

    if (filterAction !== 'all') {
      filtered = filtered.filter(log => log.action === filterAction);
    }

    if (filterDateFrom) {
      filtered = filtered.filter(log => log.createdAt >= filterDateFrom);
    }

    if (filterDateTo) {
      filtered = filtered.filter(log => log.createdAt <= filterDateTo + ' 23:59:59');
    }

    setFilteredLogs(filtered);
    setCurrentPage(1);
  };

  const handleExport = () => {
    const csvContent = [
      ['Tidpunkt', 'Åtgärd', 'Utförd av', 'E-post', 'Mål', 'IP-adress', 'Detaljer'].join(','),
      ...filteredLogs.map(log => [
        log.createdAt,
        log.actionLabel,
        log.performedBy,
        log.performedByEmail,
        log.targetName || '-',
        log.ipAddress,
        JSON.stringify(log.details)
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit-logs-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const totalPages = Math.ceil(filteredLogs.length / pageSize);
  const paginatedLogs = filteredLogs.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const getActionColor = (action: string) => {
    if (action.includes('approved') || action.includes('accepted') || action.includes('activated')) {
      return 'bg-[#27AE60]/10 text-[#27AE60]';
    }
    if (action.includes('rejected') || action.includes('deactivated') || action.includes('deleted') || action.includes('failed')) {
      return 'bg-[#E74C3C]/10 text-[#E74C3C]';
    }
    if (action.includes('created') || action.includes('added')) {
      return 'bg-[#F39C12]/10 text-[#F39C12]';
    }
    return 'bg-[#003D5C]/10 text-[#003D5C]';
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#003D5C]">Granskningsloggar</h1>
          <p className="text-gray-600">Spåra alla åtgärder i systemet</p>
        </div>
        <button
          onClick={handleExport}
          className="inline-flex items-center gap-2 bg-[#003D5C] hover:bg-[#004e75] text-white px-4 py-2.5 rounded-lg font-medium transition"
        >
          <Download size={20} />
          Exportera CSV
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Search */}
          <div className="lg:col-span-2 relative">
            <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Sök på namn, e-post eller åtgärd..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:border-[#003D5C] focus:ring-1 focus:ring-[#003D5C] outline-none"
            />
          </div>

          {/* Action Type */}
          <select
            value={filterAction}
            onChange={(e) => setFilterAction(e.target.value)}
            className="px-4 py-2.5 border border-gray-300 rounded-lg focus:border-[#003D5C] outline-none bg-white"
          >
            {actionTypes.map(type => (
              <option key={type.value} value={type.value}>{type.label}</option>
            ))}
          </select>

          {/* Date From */}
          <div className="relative">
            <Calendar size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="date"
              value={filterDateFrom}
              onChange={(e) => setFilterDateFrom(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:border-[#003D5C] outline-none"
              placeholder="Från datum"
            />
          </div>

          {/* Date To */}
          <div className="relative">
            <Calendar size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="date"
              value={filterDateTo}
              onChange={(e) => setFilterDateTo(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:border-[#003D5C] outline-none"
              placeholder="Till datum"
            />
          </div>
        </div>

        <div className="flex items-center justify-between mt-4">
          <p className="text-sm text-gray-600">
            Visar {filteredLogs.length} loggar
          </p>
          <button
            onClick={handleFilter}
            className="px-4 py-2 bg-[#F39C12] hover:bg-[#E67E22] text-white rounded-lg text-sm font-medium transition"
          >
            Filtrera
          </button>
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200 sticky top-0">
              <tr>
                <th className="text-left px-4 py-3 text-sm font-semibold text-[#003D5C]">Tidpunkt</th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-[#003D5C]">Åtgärd</th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-[#003D5C]">Utförd av</th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-[#003D5C] hidden md:table-cell">Mål</th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-[#003D5C] hidden lg:table-cell">IP-adress</th>
                <th className="text-right px-4 py-3 text-sm font-semibold text-[#003D5C]">Detaljer</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {paginatedLogs.map((log, index) => (
                <tr key={log.id} className={`hover:bg-gray-50 ${index % 2 === 1 ? 'bg-gray-50/50' : ''}`}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2 text-sm">
                      <Clock size={14} className="text-gray-400" />
                      <span className="text-gray-600">{log.createdAt}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getActionColor(log.action)}`}>
                      {log.actionLabel}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-medium text-[#003D5C] text-sm">{log.performedBy}</p>
                      <p className="text-xs text-gray-500">{log.performedByEmail}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    {log.targetName ? (
                      <div>
                        <p className="text-sm text-[#003D5C]">{log.targetName}</p>
                        <p className="text-xs text-gray-500 capitalize">{log.targetType}</p>
                      </div>
                    ) : (
                      <span className="text-gray-400 text-sm">-</span>
                    )}
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell">
                    <span className="text-sm text-gray-600 font-mono">{log.ipAddress}</span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => setSelectedLog(log)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition"
                    >
                      <ChevronDown size={18} className="text-gray-500" />
                    </button>
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
        {filteredLogs.length === 0 && (
          <div className="text-center py-12">
            <FileText size={32} className="mx-auto text-gray-300 mb-2" />
            <p className="text-gray-500">Inga loggar hittades</p>
          </div>
        )}
      </div>

      {/* Log Detail Modal */}
      {selectedLog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="font-semibold text-[#003D5C]">Loggdetaljer</h3>
              <button
                onClick={() => setSelectedLog(null)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X size={20} className="text-gray-500" />
              </button>
            </div>
            <div className="p-4 overflow-y-auto max-h-[60vh]">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Tidpunkt</p>
                    <p className="font-medium text-[#003D5C]">{selectedLog.createdAt}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Åtgärd</p>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getActionColor(selectedLog.action)}`}>
                      {selectedLog.actionLabel}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Utförd av</p>
                    <p className="font-medium text-[#003D5C]">{selectedLog.performedBy}</p>
                    <p className="text-sm text-gray-600">{selectedLog.performedByEmail}</p>
                  </div>
                  {selectedLog.targetName && (
                    <div>
                      <p className="text-sm text-gray-500">Mål</p>
                      <p className="font-medium text-[#003D5C]">{selectedLog.targetName}</p>
                      <p className="text-sm text-gray-600 capitalize">{selectedLog.targetType}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-sm text-gray-500">IP-adress</p>
                    <p className="font-mono text-[#003D5C]">{selectedLog.ipAddress}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">User Agent</p>
                    <p className="text-sm text-[#003D5C]">{selectedLog.userAgent}</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-500 mb-2">Detaljer (JSON)</p>
                  <pre className="bg-gray-50 p-4 rounded-lg text-sm overflow-x-auto">
                    {JSON.stringify(selectedLog.details, null, 2)}
                  </pre>
                </div>
              </div>
            </div>
            <div className="p-4 border-t border-gray-200 flex justify-end">
              <button
                onClick={() => setSelectedLog(null)}
                className="px-4 py-2 bg-[#003D5C] text-white rounded-lg hover:bg-[#004e75] transition"
              >
                Stäng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
