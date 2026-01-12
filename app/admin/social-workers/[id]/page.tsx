'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  Building,
  MapPin,
  Shield,
  Clock,
  CheckCircle,
  XCircle,
  Edit,
  RefreshCw,
  UserX,
  Trash2,
  Key,
  FileText,
  Activity,
  Calendar
} from 'lucide-react';

interface SocialWorker {
  id: string;
  name: string;
  email: string;
  workEmail: string;
  phone: string;
  municipality: string;
  department: string;
  position: string;
  employeeNumber?: string;
  accessLevel: 'viewer' | 'approver' | 'admin';
  status: 'verified' | 'pending' | 'inactive';
  verified: boolean;
  verifiedAt?: string;
  invitationSentAt?: string;
  internalNotes?: string;
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
}

interface AuditLog {
  id: string;
  action: string;
  performedBy: string;
  details: string;
  createdAt: string;
}

// Mock data
const mockSocialWorker: SocialWorker = {
  id: '1',
  name: 'Anna Svensson',
  email: 'anna@gmail.com',
  workEmail: 'anna.svensson@stockholm.se',
  phone: '+46 70 123 45 67',
  municipality: 'Stockholm',
  department: 'Socialtjänsten',
  position: 'Socialsekreterare',
  employeeNumber: 'EMP-2024-001',
  accessLevel: 'approver',
  status: 'verified',
  verified: true,
  verifiedAt: '2024-01-10',
  invitationSentAt: '2024-01-05',
  internalNotes: 'Erfaren socialsekreterare med 5 års erfarenhet.',
  createdAt: '2024-01-05',
  updatedAt: '2024-01-12',
  lastLoginAt: '2024-01-12 09:30'
};

const mockAuditLogs: AuditLog[] = [
  { id: '1', action: 'login_success', performedBy: 'Anna Svensson', details: 'Lyckad inloggning', createdAt: '2024-01-12 09:30' },
  { id: '2', action: 'volunteer_approved', performedBy: 'Anna Svensson', details: 'Godkände volontär Erik Johansson', createdAt: '2024-01-11 14:22' },
  { id: '3', action: 'profile_updated', performedBy: 'Admin', details: 'Uppdaterade behörighetsnivå till Approver', createdAt: '2024-01-10 11:00' },
  { id: '4', action: 'invitation_accepted', performedBy: 'Anna Svensson', details: 'Accepterade inbjudan och skapade konto', createdAt: '2024-01-10 10:15' },
  { id: '5', action: 'invitation_created', performedBy: 'Admin', details: 'Skickade inbjudan till anna.svensson@stockholm.se', createdAt: '2024-01-05 09:00' },
];

export default function SocialWorkerDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [worker, setWorker] = useState<SocialWorker | null>(null);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'activity' | 'audit' | 'permissions'>('overview');
  const [isLoading, setIsLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDeactivateModal, setShowDeactivateModal] = useState(false);
  const [deactivateReason, setDeactivateReason] = useState('');

  useEffect(() => {
    // Simulate loading data
    setTimeout(() => {
      setWorker(mockSocialWorker);
      setAuditLogs(mockAuditLogs);
      setIsLoading(false);
    }, 500);
  }, [params.id]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'verified':
        return <span className="px-3 py-1 bg-[#27AE60]/10 text-[#27AE60] rounded-full text-sm font-medium flex items-center gap-1"><CheckCircle size={16} /> Verifierad</span>;
      case 'pending':
        return <span className="px-3 py-1 bg-[#F39C12]/10 text-[#F39C12] rounded-full text-sm font-medium flex items-center gap-1"><Clock size={16} /> Väntande</span>;
      case 'inactive':
        return <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm font-medium flex items-center gap-1"><XCircle size={16} /> Inaktiv</span>;
      default:
        return null;
    }
  };

  const getAccessLevelBadge = (level: string) => {
    switch (level) {
      case 'admin':
        return <span className="px-3 py-1 bg-[#003D5C]/10 text-[#003D5C] rounded-full text-sm font-medium">Admin</span>;
      case 'approver':
        return <span className="px-3 py-1 bg-[#006B7D]/10 text-[#006B7D] rounded-full text-sm font-medium">Approver</span>;
      case 'viewer':
        return <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm font-medium">Viewer</span>;
      default:
        return null;
    }
  };

  const handleResendInvitation = async () => {
    console.log('Resending invitation...');
    // Call resend_social_worker_invitation function
  };

  const handleDeactivate = async () => {
    console.log('Deactivating with reason:', deactivateReason);
    setShowDeactivateModal(false);
    // Update status in database
  };

  const handleDelete = async () => {
    console.log('Deleting social worker...');
    setShowDeleteModal(false);
    router.push('/admin/social-workers?deleted=true');
  };

  const handleResetPassword = async () => {
    console.log('Resetting password...');
    // Send password reset email
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-12 h-12 border-4 border-[#003D5C] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!worker) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Socialsekreterare hittades inte</p>
        <Link href="/admin/social-workers" className="text-[#F39C12] hover:underline mt-2 inline-block">
          Tillbaka till lista
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
        <div>
          <Link
            href="/admin/social-workers"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-[#003D5C] mb-4"
          >
            <ArrowLeft size={20} />
            Tillbaka till lista
          </Link>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-[#003D5C]/10 rounded-full flex items-center justify-center">
              <span className="text-2xl font-bold text-[#003D5C]">{worker.name.charAt(0)}</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[#003D5C]">{worker.name}</h1>
              <p className="text-gray-600">{worker.position} • {worker.municipality}</p>
              <div className="flex items-center gap-2 mt-2">
                {getStatusBadge(worker.status)}
                {getAccessLevelBadge(worker.accessLevel)}
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-2">
          <Link
            href={`/admin/social-workers/${worker.id}/edit`}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#F39C12] hover:bg-[#E67E22] text-white rounded-lg font-medium transition"
          >
            <Edit size={18} />
            Redigera
          </Link>
          {worker.status === 'pending' && (
            <button
              onClick={handleResendInvitation}
              className="inline-flex items-center gap-2 px-4 py-2 border border-[#003D5C] text-[#003D5C] rounded-lg font-medium hover:bg-gray-50 transition"
            >
              <RefreshCw size={18} />
              Skicka inbjudan igen
            </button>
          )}
          <button
            onClick={() => setShowDeactivateModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition"
          >
            <UserX size={18} />
            {worker.status === 'inactive' ? 'Aktivera' : 'Inaktivera'}
          </button>
          <button
            onClick={handleResetPassword}
            className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition"
          >
            <Key size={18} />
            Återställ lösenord
          </button>
          <button
            onClick={() => setShowDeleteModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#E74C3C] hover:bg-[#C0392B] text-white rounded-lg font-medium transition"
          >
            <Trash2 size={18} />
            Ta bort
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex gap-1">
          {[
            { id: 'overview', label: 'Översikt', icon: <User size={18} /> },
            { id: 'activity', label: 'Aktivitetshistorik', icon: <Activity size={18} /> },
            { id: 'audit', label: 'Granskningsloggar', icon: <FileText size={18} /> },
            { id: 'permissions', label: 'Behörigheter', icon: <Shield size={18} /> },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-3 border-b-2 font-medium text-sm transition ${
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

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Contact Info */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="font-semibold text-[#003D5C] mb-4">Kontaktuppgifter</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Mail size={18} className="text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">E-post</p>
                  <a href={`mailto:${worker.email}`} className="text-[#006B7D] hover:underline">{worker.email}</a>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Mail size={18} className="text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Arbetsmail</p>
                  <a href={`mailto:${worker.workEmail}`} className="text-[#006B7D] hover:underline">{worker.workEmail}</a>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone size={18} className="text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Telefon</p>
                  <a href={`tel:${worker.phone}`} className="text-[#006B7D] hover:underline">{worker.phone}</a>
                </div>
              </div>
            </div>
          </div>

          {/* Work Info */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="font-semibold text-[#003D5C] mb-4">Arbetsuppgifter</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <MapPin size={18} className="text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Kommun</p>
                  <p className="text-[#003D5C]">{worker.municipality}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Building size={18} className="text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Avdelning</p>
                  <p className="text-[#003D5C]">{worker.department}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <User size={18} className="text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Befattning</p>
                  <p className="text-[#003D5C]">{worker.position}</p>
                </div>
              </div>
              {worker.employeeNumber && (
                <div className="flex items-center gap-3">
                  <FileText size={18} className="text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Tjänstenummer</p>
                    <p className="text-[#003D5C]">{worker.employeeNumber}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Account Info */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="font-semibold text-[#003D5C] mb-4">Kontoinformation</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Calendar size={18} className="text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Skapad</p>
                  <p className="text-[#003D5C]">{worker.createdAt}</p>
                </div>
              </div>
              {worker.verifiedAt && (
                <div className="flex items-center gap-3">
                  <CheckCircle size={18} className="text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Verifierad</p>
                    <p className="text-[#003D5C]">{worker.verifiedAt}</p>
                  </div>
                </div>
              )}
              {worker.lastLoginAt && (
                <div className="flex items-center gap-3">
                  <Clock size={18} className="text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Senaste inloggning</p>
                    <p className="text-[#003D5C]">{worker.lastLoginAt}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Internal Notes */}
          {worker.internalNotes && (
            <div className="lg:col-span-3 bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="font-semibold text-[#003D5C] mb-4 flex items-center gap-2">
                <FileText size={18} />
                Interna anteckningar
              </h3>
              <p className="text-gray-600">{worker.internalNotes}</p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'activity' && (
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <h3 className="font-semibold text-[#003D5C]">Aktivitetshistorik</h3>
          </div>
          <div className="divide-y divide-gray-100">
            {auditLogs.filter(log => log.performedBy === worker.name).map(log => (
              <div key={log.id} className="p-4 flex items-start gap-4">
                <div className="w-10 h-10 bg-[#003D5C]/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <Activity size={18} className="text-[#003D5C]" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-[#003D5C]">{log.details}</p>
                  <p className="text-sm text-gray-500">{log.createdAt}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'audit' && (
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <h3 className="font-semibold text-[#003D5C]">Granskningsloggar</h3>
          </div>
          <div className="divide-y divide-gray-100">
            {auditLogs.map(log => (
              <div key={log.id} className="p-4 flex items-start gap-4">
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <FileText size={18} className="text-gray-500" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-[#003D5C]">{log.details}</p>
                  <p className="text-sm text-gray-500">Av: {log.performedBy} • {log.createdAt}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'permissions' && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="font-semibold text-[#003D5C] mb-4">Behörigheter för {worker.accessLevel}</h3>
          <div className="space-y-3">
            {[
              { key: 'can_search_volunteers', label: 'Kan söka volontärer', enabled: true },
              { key: 'can_view_full_profiles', label: 'Kan se fullständiga profiler', enabled: true },
              { key: 'can_approve_applications', label: 'Kan godkänna ansökningar', enabled: worker.accessLevel !== 'viewer' },
              { key: 'can_reject_applications', label: 'Kan avvisa ansökningar', enabled: worker.accessLevel !== 'viewer' },
              { key: 'can_edit_volunteer_profiles', label: 'Kan redigera volontärprofiler', enabled: worker.accessLevel !== 'viewer' },
              { key: 'can_add_notes', label: 'Kan lägga till anteckningar', enabled: worker.accessLevel !== 'viewer' },
              { key: 'can_export_data', label: 'Kan exportera data', enabled: worker.accessLevel !== 'viewer' },
              { key: 'can_manage_users', label: 'Kan hantera andra användare', enabled: worker.accessLevel === 'admin' },
              { key: 'can_view_statistics', label: 'Kan se systemstatistik', enabled: worker.accessLevel === 'admin' },
            ].map(perm => (
              <div key={perm.key} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                {perm.enabled ? (
                  <CheckCircle size={20} className="text-[#27AE60]" />
                ) : (
                  <XCircle size={20} className="text-gray-300" />
                )}
                <span className={perm.enabled ? 'text-[#003D5C]' : 'text-gray-400'}>{perm.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-[#003D5C] mb-2">Ta bort socialsekreterare</h3>
            <p className="text-gray-600 mb-6">
              Är du säker på att du vill ta bort <strong>{worker.name}</strong>? Detta kan inte ångras.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
              >
                Avbryt
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 px-4 py-2 bg-[#E74C3C] hover:bg-[#C0392B] text-white rounded-lg transition"
              >
                Ta bort
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Deactivate Modal */}
      {showDeactivateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-[#003D5C] mb-2">
              {worker.status === 'inactive' ? 'Aktivera' : 'Inaktivera'} konto
            </h3>
            <p className="text-gray-600 mb-4">
              {worker.status === 'inactive' 
                ? `Vill du aktivera kontot för ${worker.name}?`
                : `Ange anledning till att inaktivera ${worker.name}:`
              }
            </p>
            {worker.status !== 'inactive' && (
              <textarea
                value={deactivateReason}
                onChange={(e) => setDeactivateReason(e.target.value)}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-[#003D5C] outline-none mb-4"
                placeholder="Anledning..."
              />
            )}
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeactivateModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
              >
                Avbryt
              </button>
              <button
                onClick={handleDeactivate}
                className="flex-1 px-4 py-2 bg-[#F39C12] hover:bg-[#E67E22] text-white rounded-lg transition"
              >
                {worker.status === 'inactive' ? 'Aktivera' : 'Inaktivera'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
