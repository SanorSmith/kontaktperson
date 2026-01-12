'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  FileText,
  Calendar,
  ArrowRight,
  User,
  Shield,
  MessageSquare
} from 'lucide-react';

// Mock application data
const mockApplication = {
  id: '1',
  status: 'pending', // pending, under_review, approved, rejected
  created_at: '2024-01-10T10:00:00Z',
  updated_at: '2024-01-10T10:00:00Z',
  background_check_status: 'not_requested',
  timeline: [
    { date: '2024-01-10', event: 'Ansökan skickad', description: 'Din ansökan har tagits emot.' },
    { date: '2024-01-11', event: 'Granskning påbörjad', description: 'En socialsekreterare har börjat granska din ansökan.' },
  ],
  notes_for_volunteer: [] // Notes marked as visible to volunteer
};

export default function VolunteerDashboard() {
  const [user, setUser] = useState<any>(null);
  const [application, setApplication] = useState(mockApplication);

  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('sv-SE', { 
      day: 'numeric', 
      month: 'long',
      year: 'numeric'
    });
  };

  const getStatusInfo = () => {
    switch (application.status) {
      case 'pending':
        return {
          icon: Clock,
          color: 'yellow',
          title: 'Väntar på granskning',
          description: 'Din ansökan har tagits emot och väntar på att granskas av en socialsekreterare.',
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-200',
          iconColor: 'text-yellow-600'
        };
      case 'under_review':
        return {
          icon: AlertCircle,
          color: 'blue',
          title: 'Under granskning',
          description: 'En socialsekreterare granskar just nu din ansökan. Du kan bli kontaktad för mer information.',
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200',
          iconColor: 'text-blue-600'
        };
      case 'approved':
        return {
          icon: CheckCircle,
          color: 'green',
          title: 'Godkänd!',
          description: 'Grattis! Din ansökan har godkänts. Du kommer snart att matchas med ett barn eller ungdom.',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          iconColor: 'text-green-600'
        };
      case 'rejected':
        return {
          icon: XCircle,
          color: 'red',
          title: 'Avvisad',
          description: 'Tyvärr har din ansökan inte godkänts. Se nedan för mer information.',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          iconColor: 'text-red-600'
        };
      default:
        return {
          icon: Clock,
          color: 'gray',
          title: 'Okänd status',
          description: '',
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-200',
          iconColor: 'text-gray-600'
        };
    }
  };

  const statusInfo = getStatusInfo();
  const StatusIcon = statusInfo.icon;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Welcome header */}
      <div className="bg-gradient-to-r from-[#006B7D] to-[#008B9E] rounded-xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">
          Välkommen, {user?.name || 'Volontär'}!
        </h1>
        <p className="text-white/80">
          Här kan du följa din ansökan och se din status som kontaktperson.
        </p>
      </div>

      {/* Status card */}
      <div className={`${statusInfo.bgColor} ${statusInfo.borderColor} border rounded-xl p-6`}>
        <div className="flex items-start gap-4">
          <div className={`w-12 h-12 rounded-full ${statusInfo.bgColor} flex items-center justify-center`}>
            <StatusIcon size={24} className={statusInfo.iconColor} />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-gray-900 mb-1">{statusInfo.title}</h2>
            <p className="text-gray-600">{statusInfo.description}</p>
            
            {application.status === 'pending' && (
              <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
                <Calendar size={16} />
                <span>Ansökan skickad: {formatDate(application.created_at)}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main content grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Timeline */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Clock size={18} />
            Tidslinje
          </h3>
          
          <div className="space-y-4">
            {application.timeline.map((item, index) => (
              <div key={index} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-3 h-3 bg-[#006B7D] rounded-full"></div>
                  {index < application.timeline.length - 1 && (
                    <div className="w-0.5 h-full bg-gray-200 mt-1"></div>
                  )}
                </div>
                <div className="pb-4">
                  <p className="text-sm text-gray-500">{formatDate(item.date)}</p>
                  <p className="font-medium text-gray-900">{item.event}</p>
                  <p className="text-sm text-gray-600">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick actions */}
        <div className="space-y-6">
          {/* Profile card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <User size={18} />
              Din profil
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Håll din profil uppdaterad så att socialsekreteraren har rätt information.
            </p>
            <Link
              href="/volunteer/profile"
              className="inline-flex items-center gap-2 text-[#006B7D] hover:text-[#005a6a] font-medium text-sm"
            >
              Visa och redigera profil
              <ArrowRight size={16} />
            </Link>
          </div>

          {/* Documents card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <FileText size={18} />
              Dokument
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Ladda upp eventuella dokument som kan stödja din ansökan.
            </p>
            <Link
              href="/volunteer/documents"
              className="inline-flex items-center gap-2 text-[#006B7D] hover:text-[#005a6a] font-medium text-sm"
            >
              Hantera dokument
              <ArrowRight size={16} />
            </Link>
          </div>

          {/* Background check status */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Shield size={18} />
              Bakgrundskontroll
            </h3>
            
            {application.background_check_status === 'not_requested' && (
              <div className="flex items-center gap-2 text-gray-500">
                <Clock size={16} />
                <span className="text-sm">Ej påbörjad</span>
              </div>
            )}
            {application.background_check_status === 'pending' && (
              <div className="flex items-center gap-2 text-yellow-600">
                <Clock size={16} />
                <span className="text-sm">Väntar på resultat</span>
              </div>
            )}
            {application.background_check_status === 'approved' && (
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle size={16} />
                <span className="text-sm">Godkänd</span>
              </div>
            )}
            
            <p className="text-xs text-gray-500 mt-2">
              Bakgrundskontrollen begärs av socialsekreteraren när din ansökan granskas.
            </p>
          </div>
        </div>
      </div>

      {/* Messages from social worker */}
      {application.notes_for_volunteer.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <MessageSquare size={18} />
            Meddelanden från socialsekreteraren
          </h3>
          
          <div className="space-y-4">
            {application.notes_for_volunteer.map((note: any, index: number) => (
              <div key={index} className="p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-gray-700">{note.content}</p>
                <p className="text-xs text-gray-500 mt-2">{formatDate(note.created_at)}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Help section */}
      <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
        <h3 className="font-semibold text-gray-900 mb-2">Behöver du hjälp?</h3>
        <p className="text-sm text-gray-600 mb-4">
          Om du har frågor om din ansökan eller processen, kontakta oss gärna.
        </p>
        <div className="flex flex-wrap gap-4 text-sm">
          <a href="mailto:support@kontaktperson.se" className="text-[#006B7D] hover:underline">
            support@kontaktperson.se
          </a>
          <span className="text-gray-400">|</span>
          <a href="tel:08-123456" className="text-[#006B7D] hover:underline">
            08-123 456
          </a>
        </div>
      </div>
    </div>
  );
}
