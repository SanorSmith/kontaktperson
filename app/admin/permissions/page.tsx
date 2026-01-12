'use client';

import { useState } from 'react';
import {
  Shield,
  Users,
  Check,
  X,
  Edit,
  Plus,
  Trash2,
  Globe,
  AlertCircle
} from 'lucide-react';

interface AccessLevel {
  id: string;
  name: string;
  description: string;
  userCount: number;
  permissions: string[];
}

interface ApprovedDomain {
  id: string;
  domain: string;
  municipality?: string;
  isActive: boolean;
  addedBy: string;
  addedDate: string;
}

const allPermissions = [
  { key: 'can_search_volunteers', label: 'Kan söka volontärer' },
  { key: 'can_view_full_profiles', label: 'Kan se fullständiga profiler' },
  { key: 'can_approve_applications', label: 'Kan godkänna ansökningar' },
  { key: 'can_reject_applications', label: 'Kan avvisa ansökningar' },
  { key: 'can_edit_volunteer_profiles', label: 'Kan redigera volontärprofiler' },
  { key: 'can_add_notes', label: 'Kan lägga till anteckningar' },
  { key: 'can_export_data', label: 'Kan exportera data' },
  { key: 'can_manage_users', label: 'Kan hantera andra användare' },
  { key: 'can_view_statistics', label: 'Kan se systemstatistik' },
];

const mockAccessLevels: AccessLevel[] = [
  {
    id: 'viewer',
    name: 'Viewer',
    description: 'Grundläggande åtkomst för att söka och se volontärprofiler',
    userCount: 15,
    permissions: ['can_search_volunteers', 'can_view_full_profiles']
  },
  {
    id: 'approver',
    name: 'Approver',
    description: 'Kan granska och godkänna/avvisa volontäransökningar',
    userCount: 25,
    permissions: ['can_search_volunteers', 'can_view_full_profiles', 'can_approve_applications', 'can_reject_applications', 'can_edit_volunteer_profiles', 'can_add_notes', 'can_export_data']
  },
  {
    id: 'admin',
    name: 'Admin',
    description: 'Full åtkomst till alla funktioner inklusive användarhantering',
    userCount: 7,
    permissions: ['can_search_volunteers', 'can_view_full_profiles', 'can_approve_applications', 'can_reject_applications', 'can_edit_volunteer_profiles', 'can_add_notes', 'can_export_data', 'can_manage_users', 'can_view_statistics']
  }
];

const mockDomains: ApprovedDomain[] = [
  { id: '1', domain: 'stockholm.se', municipality: 'Stockholm', isActive: true, addedBy: 'Admin', addedDate: '2024-01-01' },
  { id: '2', domain: 'goteborg.se', municipality: 'Göteborg', isActive: true, addedBy: 'Admin', addedDate: '2024-01-01' },
  { id: '3', domain: 'malmo.se', municipality: 'Malmö', isActive: true, addedBy: 'Admin', addedDate: '2024-01-01' },
  { id: '4', domain: 'uppsala.se', municipality: 'Uppsala', isActive: true, addedBy: 'Admin', addedDate: '2024-01-01' },
  { id: '5', domain: 'linkoping.se', municipality: 'Linköping', isActive: true, addedBy: 'Admin', addedDate: '2024-01-01' },
  { id: '6', domain: 'kommun.se', isActive: true, addedBy: 'Admin', addedDate: '2024-01-01' },
];

export default function PermissionsPage() {
  const [accessLevels, setAccessLevels] = useState(mockAccessLevels);
  const [domains, setDomains] = useState(mockDomains);
  const [editingLevel, setEditingLevel] = useState<string | null>(null);
  const [editPermissions, setEditPermissions] = useState<string[]>([]);
  const [showAddDomain, setShowAddDomain] = useState(false);
  const [newDomain, setNewDomain] = useState({ domain: '', municipality: '', isActive: true });

  const handleEditLevel = (level: AccessLevel) => {
    setEditingLevel(level.id);
    setEditPermissions([...level.permissions]);
  };

  const handleSaveLevel = (levelId: string) => {
    setAccessLevels(prev => prev.map(level => 
      level.id === levelId ? { ...level, permissions: editPermissions } : level
    ));
    setEditingLevel(null);
  };

  const handleTogglePermission = (permKey: string) => {
    setEditPermissions(prev => 
      prev.includes(permKey) 
        ? prev.filter(p => p !== permKey)
        : [...prev, permKey]
    );
  };

  const handleToggleDomain = (domainId: string) => {
    setDomains(prev => prev.map(d => 
      d.id === domainId ? { ...d, isActive: !d.isActive } : d
    ));
  };

  const handleDeleteDomain = (domainId: string) => {
    if (confirm('Är du säker på att du vill ta bort denna domän?')) {
      setDomains(prev => prev.filter(d => d.id !== domainId));
    }
  };

  const handleAddDomain = () => {
    if (!newDomain.domain.trim()) return;
    
    const domain: ApprovedDomain = {
      id: Date.now().toString(),
      domain: newDomain.domain.toLowerCase(),
      municipality: newDomain.municipality || undefined,
      isActive: newDomain.isActive,
      addedBy: 'Admin',
      addedDate: new Date().toISOString().split('T')[0]
    };
    
    setDomains(prev => [...prev, domain]);
    setNewDomain({ domain: '', municipality: '', isActive: true });
    setShowAddDomain(false);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#003D5C]">Behörigheter</h1>
        <p className="text-gray-600">Hantera åtkomstnivåer och godkända e-postdomäner</p>
      </div>

      {/* Access Levels */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <h2 className="font-semibold text-[#003D5C] flex items-center gap-2">
            <Shield size={20} />
            Åtkomstnivåer
          </h2>
        </div>
        <div className="divide-y divide-gray-100">
          {accessLevels.map(level => (
            <div key={level.id} className="p-4">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="font-semibold text-[#003D5C]">{level.name}</h3>
                    <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs">
                      {level.userCount} användare
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{level.description}</p>
                </div>
                {editingLevel === level.id ? (
                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditingLevel(null)}
                      className="px-3 py-1.5 border border-gray-300 text-gray-700 rounded-lg text-sm hover:bg-gray-50"
                    >
                      Avbryt
                    </button>
                    <button
                      onClick={() => handleSaveLevel(level.id)}
                      className="px-3 py-1.5 bg-[#27AE60] text-white rounded-lg text-sm hover:bg-[#219a52]"
                    >
                      Spara
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => handleEditLevel(level)}
                    className="flex items-center gap-1 px-3 py-1.5 border border-gray-300 text-gray-700 rounded-lg text-sm hover:bg-gray-50"
                  >
                    <Edit size={16} />
                    Redigera
                  </button>
                )}
              </div>

              {/* Permissions Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                {allPermissions.map(perm => {
                  const isEnabled = editingLevel === level.id 
                    ? editPermissions.includes(perm.key)
                    : level.permissions.includes(perm.key);
                  
                  return (
                    <div
                      key={perm.key}
                      onClick={() => editingLevel === level.id && handleTogglePermission(perm.key)}
                      className={`flex items-center gap-2 p-2 rounded-lg ${
                        editingLevel === level.id ? 'cursor-pointer hover:bg-gray-50' : ''
                      } ${isEnabled ? 'bg-[#27AE60]/5' : 'bg-gray-50'}`}
                    >
                      {isEnabled ? (
                        <Check size={18} className="text-[#27AE60]" />
                      ) : (
                        <X size={18} className="text-gray-300" />
                      )}
                      <span className={`text-sm ${isEnabled ? 'text-[#003D5C]' : 'text-gray-400'}`}>
                        {perm.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Approved Email Domains */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="font-semibold text-[#003D5C] flex items-center gap-2">
            <Globe size={20} />
            Godkända e-postdomäner
          </h2>
          <button
            onClick={() => setShowAddDomain(true)}
            className="flex items-center gap-1 px-3 py-1.5 bg-[#F39C12] text-white rounded-lg text-sm hover:bg-[#E67E22]"
          >
            <Plus size={16} />
            Lägg till domän
          </button>
        </div>

        {/* Add Domain Form */}
        {showAddDomain && (
          <div className="p-4 bg-gray-50 border-b border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Domän <span className="text-[#E74C3C]">*</span>
                </label>
                <input
                  type="text"
                  value={newDomain.domain}
                  onChange={(e) => setNewDomain(prev => ({ ...prev, domain: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-[#003D5C] outline-none"
                  placeholder="exempel.se"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Kommun (valfritt)
                </label>
                <input
                  type="text"
                  value={newDomain.municipality}
                  onChange={(e) => setNewDomain(prev => ({ ...prev, municipality: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-[#003D5C] outline-none"
                  placeholder="Kommunnamn"
                />
              </div>
              <div className="flex items-end gap-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newDomain.isActive}
                    onChange={(e) => setNewDomain(prev => ({ ...prev, isActive: e.target.checked }))}
                    className="w-4 h-4 rounded"
                  />
                  <span className="text-sm text-gray-700">Aktiv</span>
                </label>
                <div className="flex-1" />
                <button
                  onClick={() => setShowAddDomain(false)}
                  className="px-3 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm hover:bg-gray-50"
                >
                  Avbryt
                </button>
                <button
                  onClick={handleAddDomain}
                  className="px-3 py-2 bg-[#27AE60] text-white rounded-lg text-sm hover:bg-[#219a52]"
                >
                  Lägg till
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Domains Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 text-sm font-semibold text-[#003D5C]">Domän</th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-[#003D5C]">Kommun</th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-[#003D5C]">Status</th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-[#003D5C]">Tillagd av</th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-[#003D5C]">Datum</th>
                <th className="text-right px-4 py-3 text-sm font-semibold text-[#003D5C]">Åtgärder</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {domains.map(domain => (
                <tr key={domain.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <span className="font-mono text-sm text-[#003D5C]">@{domain.domain}</span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {domain.municipality || <span className="text-gray-400">Alla</span>}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleToggleDomain(domain.id)}
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        domain.isActive 
                          ? 'bg-[#27AE60]/10 text-[#27AE60]' 
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {domain.isActive ? 'Aktiv' : 'Inaktiv'}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{domain.addedBy}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{domain.addedDate}</td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => handleDeleteDomain(domain.id)}
                      className="p-2 hover:bg-red-50 rounded-lg transition text-gray-400 hover:text-[#E74C3C]"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {domains.length === 0 && (
          <div className="text-center py-8">
            <Globe size={32} className="mx-auto text-gray-300 mb-2" />
            <p className="text-gray-500">Inga godkända domäner</p>
          </div>
        )}
      </div>

      {/* Info Box */}
      <div className="bg-[#003D5C]/5 border border-[#003D5C]/20 rounded-xl p-4 flex items-start gap-3">
        <AlertCircle size={20} className="text-[#003D5C] flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-medium text-[#003D5C]">Om behörigheter</p>
          <p className="text-sm text-gray-600 mt-1">
            Ändringar i behörighetsnivåer påverkar alla användare med den nivån omedelbart. 
            E-postdomäner används för att validera arbetsmail vid registrering av nya socialsekreterare.
          </p>
        </div>
      </div>
    </div>
  );
}
