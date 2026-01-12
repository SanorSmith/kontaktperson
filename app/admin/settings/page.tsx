'use client';

import { useState } from 'react';
import {
  Settings,
  Mail,
  Database,
  Shield,
  Users,
  Save,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Globe,
  Clock,
  Lock,
  Server,
  HardDrive,
  Plus,
  Edit,
  Trash2
} from 'lucide-react';

interface SystemSettings {
  platformName: string;
  supportEmail: string;
  maxFailedLoginAttempts: number;
  sessionTimeoutMinutes: number;
  allowNewRegistrations: boolean;
  maintenanceMode: boolean;
  defaultFromEmail: string;
  defaultFromName: string;
}

interface Municipality {
  id: string;
  name: string;
  county: string;
  region: string;
  code: string;
  isActive: boolean;
}

interface AdminUser {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

const mockSettings: SystemSettings = {
  platformName: 'Kontaktperson Platform',
  supportEmail: 'support@kontaktperson.se',
  maxFailedLoginAttempts: 5,
  sessionTimeoutMinutes: 120,
  allowNewRegistrations: true,
  maintenanceMode: false,
  defaultFromEmail: 'noreply@kontaktperson.se',
  defaultFromName: 'Kontaktperson Platform'
};

const mockMunicipalities: Municipality[] = [
  { id: '1', name: 'Stockholm', county: 'Stockholms län', region: 'Svealand', code: '0180', isActive: true },
  { id: '2', name: 'Göteborg', county: 'Västra Götalands län', region: 'Götaland', code: '1480', isActive: true },
  { id: '3', name: 'Malmö', county: 'Skåne län', region: 'Götaland', code: '1280', isActive: true },
  { id: '4', name: 'Uppsala', county: 'Uppsala län', region: 'Svealand', code: '0380', isActive: true },
  { id: '5', name: 'Linköping', county: 'Östergötlands län', region: 'Götaland', code: '0580', isActive: true },
  { id: '6', name: 'Örebro', county: 'Örebro län', region: 'Svealand', code: '1880', isActive: true },
];

const mockAdminUsers: AdminUser[] = [
  { id: '1', name: 'Admin', email: 'admin@kontaktperson.se', createdAt: '2024-01-01' },
  { id: '2', name: 'Super Admin', email: 'superadmin@kontaktperson.se', createdAt: '2024-01-01' },
];

const mockDbStats = {
  profiles: 203,
  socialWorkers: 47,
  volunteers: 156,
  auditLogs: 1542,
  municipalities: 290,
  dbSize: '45.2 MB',
  lastBackup: '2024-01-12 03:00',
  health: 'healthy'
};

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<'system' | 'email' | 'database' | 'municipalities' | 'admins'>('system');
  const [settings, setSettings] = useState(mockSettings);
  const [municipalities, setMunicipalities] = useState(mockMunicipalities);
  const [adminUsers, setAdminUsers] = useState(mockAdminUsers);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [showAddMunicipality, setShowAddMunicipality] = useState(false);
  const [newMunicipality, setNewMunicipality] = useState({ name: '', county: '', region: '', code: '' });

  const handleSaveSettings = async () => {
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSaving(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleTestEmail = async () => {
    alert('Test-e-post skickad till ' + settings.supportEmail);
  };

  const handleBackup = async () => {
    alert('Backup påbörjad...');
  };

  const handleAddMunicipality = () => {
    if (!newMunicipality.name || !newMunicipality.code) return;
    
    const municipality: Municipality = {
      id: Date.now().toString(),
      ...newMunicipality,
      isActive: true
    };
    
    setMunicipalities(prev => [...prev, municipality]);
    setNewMunicipality({ name: '', county: '', region: '', code: '' });
    setShowAddMunicipality(false);
  };

  const handleToggleMunicipality = (id: string) => {
    setMunicipalities(prev => prev.map(m => 
      m.id === id ? { ...m, isActive: !m.isActive } : m
    ));
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#003D5C]">Inställningar</h1>
          <p className="text-gray-600">Hantera systemkonfiguration och inställningar</p>
        </div>
        {saveSuccess && (
          <div className="flex items-center gap-2 text-[#27AE60]">
            <CheckCircle size={20} />
            <span>Inställningar sparade!</span>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex gap-1 overflow-x-auto">
          {[
            { id: 'system', label: 'System', icon: <Settings size={18} /> },
            { id: 'email', label: 'E-post', icon: <Mail size={18} /> },
            { id: 'database', label: 'Databas', icon: <Database size={18} /> },
            { id: 'municipalities', label: 'Kommuner', icon: <Globe size={18} /> },
            { id: 'admins', label: 'Administratörer', icon: <Shield size={18} /> },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-3 border-b-2 font-medium text-sm whitespace-nowrap transition ${
                activeTab === tab.id
                  ? 'border-[#F39C12] text-[#003D5C]'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* System Settings */}
      {activeTab === 'system' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="font-semibold text-[#003D5C] mb-4 flex items-center gap-2">
              <Settings size={20} />
              Systemkonfiguration
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Plattformsnamn
                </label>
                <input
                  type="text"
                  value={settings.platformName}
                  onChange={(e) => setSettings(prev => ({ ...prev, platformName: e.target.value }))}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:border-[#003D5C] outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Support-e-post
                </label>
                <input
                  type="email"
                  value={settings.supportEmail}
                  onChange={(e) => setSettings(prev => ({ ...prev, supportEmail: e.target.value }))}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:border-[#003D5C] outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Max misslyckade inloggningsförsök
                </label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={settings.maxFailedLoginAttempts}
                  onChange={(e) => setSettings(prev => ({ ...prev, maxFailedLoginAttempts: parseInt(e.target.value) }))}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:border-[#003D5C] outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sessionstimeout (minuter)
                </label>
                <select
                  value={settings.sessionTimeoutMinutes}
                  onChange={(e) => setSettings(prev => ({ ...prev, sessionTimeoutMinutes: parseInt(e.target.value) }))}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:border-[#003D5C] outline-none bg-white"
                >
                  <option value={30}>30 minuter</option>
                  <option value={60}>1 timme</option>
                  <option value={120}>2 timmar</option>
                  <option value={240}>4 timmar</option>
                  <option value={480}>8 timmar</option>
                </select>
              </div>

              <div className="md:col-span-2 space-y-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.allowNewRegistrations}
                    onChange={(e) => setSettings(prev => ({ ...prev, allowNewRegistrations: e.target.checked }))}
                    className="w-5 h-5 rounded"
                  />
                  <div>
                    <span className="font-medium text-[#003D5C]">Tillåt nya registreringar</span>
                    <p className="text-sm text-gray-500">Nya socialsekreterare kan registrera sig via inbjudan</p>
                  </div>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.maintenanceMode}
                    onChange={(e) => setSettings(prev => ({ ...prev, maintenanceMode: e.target.checked }))}
                    className="w-5 h-5 rounded"
                  />
                  <div>
                    <span className="font-medium text-[#003D5C]">Underhållsläge</span>
                    <p className="text-sm text-gray-500">Endast administratörer kan logga in</p>
                  </div>
                </label>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleSaveSettings}
              disabled={isSaving}
              className="flex items-center gap-2 px-6 py-2.5 bg-[#F39C12] hover:bg-[#E67E22] text-white rounded-lg font-medium transition disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <RefreshCw size={20} className="animate-spin" />
                  Sparar...
                </>
              ) : (
                <>
                  <Save size={20} />
                  Spara inställningar
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Email Settings */}
      {activeTab === 'email' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="font-semibold text-[#003D5C] mb-4 flex items-center gap-2">
              <Mail size={20} />
              E-postinställningar
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Avsändaradress
                </label>
                <input
                  type="email"
                  value={settings.defaultFromEmail}
                  onChange={(e) => setSettings(prev => ({ ...prev, defaultFromEmail: e.target.value }))}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:border-[#003D5C] outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Avsändarnamn
                </label>
                <input
                  type="text"
                  value={settings.defaultFromName}
                  onChange={(e) => setSettings(prev => ({ ...prev, defaultFromName: e.target.value }))}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:border-[#003D5C] outline-none"
                />
              </div>
            </div>

            <div className="mt-6 p-4 bg-[#27AE60]/10 rounded-lg flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CheckCircle size={24} className="text-[#27AE60]" />
                <div>
                  <p className="font-medium text-[#003D5C]">E-posttjänst konfigurerad</p>
                  <p className="text-sm text-gray-600">Resend API är aktivt och fungerar</p>
                </div>
              </div>
              <button
                onClick={handleTestEmail}
                className="px-4 py-2 border border-[#003D5C] text-[#003D5C] rounded-lg hover:bg-gray-50 transition"
              >
                Skicka test-e-post
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="font-semibold text-[#003D5C] mb-4">E-postmallar</h3>
            <div className="space-y-3">
              {[
                { name: 'Inbjudan', description: 'Skickas till nya socialsekreterare' },
                { name: 'Välkomstmail', description: 'Skickas efter aktivering av konto' },
                { name: 'Lösenordsåterställning', description: 'Skickas vid glömt lösenord' },
                { name: 'Kontoaktivering', description: 'Bekräftelse av aktiverat konto' },
              ].map(template => (
                <div key={template.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-[#003D5C]">{template.name}</p>
                    <p className="text-sm text-gray-500">{template.description}</p>
                  </div>
                  <button className="text-[#006B7D] hover:underline text-sm">
                    Förhandsgranska
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Database Settings */}
      {activeTab === 'database' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="flex items-center gap-3 mb-2">
                <Users size={20} className="text-[#003D5C]" />
                <span className="text-sm text-gray-600">Profiler</span>
              </div>
              <p className="text-2xl font-bold text-[#003D5C]">{mockDbStats.profiles}</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="flex items-center gap-3 mb-2">
                <Users size={20} className="text-[#006B7D]" />
                <span className="text-sm text-gray-600">Socialsekreterare</span>
              </div>
              <p className="text-2xl font-bold text-[#003D5C]">{mockDbStats.socialWorkers}</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="flex items-center gap-3 mb-2">
                <Users size={20} className="text-[#F39C12]" />
                <span className="text-sm text-gray-600">Volontärer</span>
              </div>
              <p className="text-2xl font-bold text-[#003D5C]">{mockDbStats.volunteers}</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="flex items-center gap-3 mb-2">
                <Database size={20} className="text-gray-500" />
                <span className="text-sm text-gray-600">Granskningsloggar</span>
              </div>
              <p className="text-2xl font-bold text-[#003D5C]">{mockDbStats.auditLogs}</p>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="font-semibold text-[#003D5C] mb-4 flex items-center gap-2">
              <Server size={20} />
              Databasstatus
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <HardDrive size={18} className="text-gray-500" />
                  <span className="text-sm text-gray-600">Databasstorlek</span>
                </div>
                <p className="text-xl font-bold text-[#003D5C]">{mockDbStats.dbSize}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Clock size={18} className="text-gray-500" />
                  <span className="text-sm text-gray-600">Senaste backup</span>
                </div>
                <p className="text-xl font-bold text-[#003D5C]">{mockDbStats.lastBackup}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle size={18} className="text-[#27AE60]" />
                  <span className="text-sm text-gray-600">Hälsostatus</span>
                </div>
                <p className="text-xl font-bold text-[#27AE60] capitalize">{mockDbStats.health}</p>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={handleBackup}
                className="flex items-center gap-2 px-4 py-2 bg-[#003D5C] text-white rounded-lg hover:bg-[#004e75] transition"
              >
                <Database size={18} />
                Skapa backup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Municipalities */}
      {activeTab === 'municipalities' && (
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="font-semibold text-[#003D5C] flex items-center gap-2">
              <Globe size={20} />
              Kommuner
            </h2>
            <button
              onClick={() => setShowAddMunicipality(true)}
              className="flex items-center gap-1 px-3 py-1.5 bg-[#F39C12] text-white rounded-lg text-sm hover:bg-[#E67E22]"
            >
              <Plus size={16} />
              Lägg till kommun
            </button>
          </div>

          {showAddMunicipality && (
            <div className="p-4 bg-gray-50 border-b border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <input
                  type="text"
                  value={newMunicipality.name}
                  onChange={(e) => setNewMunicipality(prev => ({ ...prev, name: e.target.value }))}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:border-[#003D5C] outline-none"
                  placeholder="Kommunnamn *"
                />
                <input
                  type="text"
                  value={newMunicipality.county}
                  onChange={(e) => setNewMunicipality(prev => ({ ...prev, county: e.target.value }))}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:border-[#003D5C] outline-none"
                  placeholder="Län"
                />
                <input
                  type="text"
                  value={newMunicipality.code}
                  onChange={(e) => setNewMunicipality(prev => ({ ...prev, code: e.target.value }))}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:border-[#003D5C] outline-none"
                  placeholder="Kommunkod *"
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowAddMunicipality(false)}
                    className="flex-1 px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    Avbryt
                  </button>
                  <button
                    onClick={handleAddMunicipality}
                    className="flex-1 px-3 py-2 bg-[#27AE60] text-white rounded-lg hover:bg-[#219a52]"
                  >
                    Lägg till
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-4 py-3 text-sm font-semibold text-[#003D5C]">Namn</th>
                  <th className="text-left px-4 py-3 text-sm font-semibold text-[#003D5C]">Län</th>
                  <th className="text-left px-4 py-3 text-sm font-semibold text-[#003D5C]">Kod</th>
                  <th className="text-left px-4 py-3 text-sm font-semibold text-[#003D5C]">Status</th>
                  <th className="text-right px-4 py-3 text-sm font-semibold text-[#003D5C]">Åtgärder</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {municipalities.map(municipality => (
                  <tr key={municipality.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-[#003D5C]">{municipality.name}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{municipality.county}</td>
                    <td className="px-4 py-3 text-sm font-mono text-gray-600">{municipality.code}</td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleToggleMunicipality(municipality.id)}
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          municipality.isActive 
                            ? 'bg-[#27AE60]/10 text-[#27AE60]' 
                            : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {municipality.isActive ? 'Aktiv' : 'Inaktiv'}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button className="p-2 hover:bg-gray-100 rounded-lg transition">
                        <Edit size={16} className="text-gray-500" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Admin Users */}
      {activeTab === 'admins' && (
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="font-semibold text-[#003D5C] flex items-center gap-2">
              <Shield size={20} />
              Administratörer
            </h2>
            <button className="flex items-center gap-1 px-3 py-1.5 bg-[#F39C12] text-white rounded-lg text-sm hover:bg-[#E67E22]">
              <Plus size={16} />
              Lägg till admin
            </button>
          </div>

          <div className="divide-y divide-gray-100">
            {adminUsers.map(admin => (
              <div key={admin.id} className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#003D5C] rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">{admin.name.charAt(0)}</span>
                  </div>
                  <div>
                    <p className="font-medium text-[#003D5C]">{admin.name}</p>
                    <p className="text-sm text-gray-500">{admin.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">Sedan {admin.createdAt}</span>
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition">
                    <Lock size={16} className="text-gray-500" />
                  </button>
                  <button className="p-2 hover:bg-red-50 rounded-lg transition">
                    <Trash2 size={16} className="text-gray-400 hover:text-[#E74C3C]" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 bg-[#F39C12]/10 border-t border-[#F39C12]/20">
            <div className="flex items-start gap-3">
              <AlertCircle size={20} className="text-[#F39C12] flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-[#003D5C]">Varning</p>
                <p className="text-sm text-gray-600">
                  Att ta bort en administratör kan inte ångras. Se till att det finns minst en aktiv administratör.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
