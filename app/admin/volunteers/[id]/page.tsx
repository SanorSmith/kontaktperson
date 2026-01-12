'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Car,
  Globe,
  Heart,
  Clock,
  CheckCircle,
  XCircle,
  FileText,
  Shield,
  Activity
} from 'lucide-react';

interface Volunteer {
  id: string;
  name: string;
  email: string;
  phone: string;
  age: number;
  birthYear: number;
  municipality: string;
  address: string;
  hasDriversLicense: boolean;
  hasCar: boolean;
  languages: string[];
  interests: string[];
  experience: string;
  motivation: string;
  availability: string;
  status: 'pending' | 'approved' | 'rejected' | 'inactive';
  backgroundCheckStatus: 'pending' | 'in_progress' | 'completed' | 'failed';
  approvedBy?: string;
  approvedAt?: string;
  rejectedBy?: string;
  rejectedAt?: string;
  rejectionReason?: string;
  appliedDate: string;
  notes: { id: string; author: string; content: string; date: string }[];
}

// Mock data
const mockVolunteer: Volunteer = {
  id: '1',
  name: 'Anna Andersson',
  email: 'anna.andersson@gmail.com',
  phone: '+46 70 123 45 67',
  age: 34,
  birthYear: 1990,
  municipality: 'Stockholm',
  address: 'Storgatan 1, 111 22 Stockholm',
  hasDriversLicense: true,
  hasCar: true,
  languages: ['Svenska', 'Engelska', 'Arabiska'],
  interests: ['Sport & Friluftsliv', 'Matlagning', 'Musik'],
  experience: 'Arbetat som fritidsledare i 3 år. Har egen erfarenhet av att vara kontaktperson för en ungdom under 2 år.',
  motivation: 'Jag vill ge tillbaka till samhället och hjälpa barn som behöver extra stöd. Jag tror att jag kan göra skillnad genom att vara en stabil vuxen i ett barns liv.',
  availability: '2-4 träffar per månad',
  status: 'approved',
  backgroundCheckStatus: 'completed',
  approvedBy: 'Maria Lindberg',
  approvedAt: '2024-01-20',
  appliedDate: '2024-01-15',
  notes: [
    { id: '1', author: 'Maria Lindberg', content: 'Mycket engagerad och pålitlig. Bra med barn i alla åldrar.', date: '2024-01-20' },
    { id: '2', author: 'Anna Svensson', content: 'Intervjuad via telefon. Positiv upplevelse.', date: '2024-01-18' }
  ]
};

export default function VolunteerDetailPage() {
  const params = useParams();
  const [volunteer, setVolunteer] = useState<Volunteer | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'history' | 'audit'>('overview');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setVolunteer(mockVolunteer);
      setIsLoading(false);
    }, 500);
  }, [params.id]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <span className="px-3 py-1 bg-[#27AE60]/10 text-[#27AE60] rounded-full text-sm font-medium flex items-center gap-1"><CheckCircle size={16} /> Godkänd</span>;
      case 'pending':
        return <span className="px-3 py-1 bg-[#F39C12]/10 text-[#F39C12] rounded-full text-sm font-medium flex items-center gap-1"><Clock size={16} /> Väntande</span>;
      case 'rejected':
        return <span className="px-3 py-1 bg-[#E74C3C]/10 text-[#E74C3C] rounded-full text-sm font-medium flex items-center gap-1"><XCircle size={16} /> Avvisad</span>;
      case 'inactive':
        return <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm font-medium">Inaktiv</span>;
      default:
        return null;
    }
  };

  const getBackgroundCheckBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <span className="flex items-center gap-1 text-[#27AE60] text-sm"><Shield size={16} /> Godkänd</span>;
      case 'in_progress':
        return <span className="flex items-center gap-1 text-[#F39C12] text-sm"><Clock size={16} /> Pågår</span>;
      case 'pending':
        return <span className="flex items-center gap-1 text-gray-500 text-sm"><Clock size={16} /> Väntar</span>;
      case 'failed':
        return <span className="flex items-center gap-1 text-[#E74C3C] text-sm"><XCircle size={16} /> Anmärkning</span>;
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-12 h-12 border-4 border-[#003D5C] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!volunteer) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Volontär hittades inte</p>
        <Link href="/admin/volunteers" className="text-[#F39C12] hover:underline mt-2 inline-block">
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
            href="/admin/volunteers"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-[#003D5C] mb-4"
          >
            <ArrowLeft size={20} />
            Tillbaka till lista
          </Link>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-[#006B7D]/10 rounded-full flex items-center justify-center">
              <span className="text-2xl font-bold text-[#006B7D]">{volunteer.name.charAt(0)}</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[#003D5C]">{volunteer.name}</h1>
              <p className="text-gray-600">{volunteer.age} år • {volunteer.municipality}</p>
              <div className="flex items-center gap-2 mt-2">
                {getStatusBadge(volunteer.status)}
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-2">
          {volunteer.status === 'rejected' && (
            <button className="inline-flex items-center gap-2 px-4 py-2 bg-[#F39C12] hover:bg-[#E67E22] text-white rounded-lg font-medium transition">
              <Clock size={18} />
              Återställ till väntande
            </button>
          )}
          {volunteer.status !== 'inactive' && (
            <button className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition">
              Inaktivera
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex gap-1">
          {[
            { id: 'overview', label: 'Översikt', icon: <User size={18} /> },
            { id: 'history', label: 'Granskningshistorik', icon: <Activity size={18} /> },
            { id: 'audit', label: 'Granskningsloggar', icon: <FileText size={18} /> },
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
                  <a href={`mailto:${volunteer.email}`} className="text-[#006B7D] hover:underline">{volunteer.email}</a>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone size={18} className="text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Telefon</p>
                  <a href={`tel:${volunteer.phone}`} className="text-[#006B7D] hover:underline">{volunteer.phone}</a>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <MapPin size={18} className="text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Adress</p>
                  <p className="text-[#003D5C]">{volunteer.address}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Personal Info */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="font-semibold text-[#003D5C] mb-4">Personuppgifter</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Calendar size={18} className="text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Födelseår</p>
                  <p className="text-[#003D5C]">{volunteer.birthYear} ({volunteer.age} år)</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Car size={18} className="text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Körkort & Bil</p>
                  <p className="text-[#003D5C]">
                    {volunteer.hasDriversLicense ? 'Har körkort' : 'Inget körkort'}
                    {volunteer.hasCar && ' • Har bil'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Clock size={18} className="text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Tillgänglighet</p>
                  <p className="text-[#003D5C]">{volunteer.availability}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Status Info */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="font-semibold text-[#003D5C] mb-4">Statusuppgifter</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Calendar size={18} className="text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Ansökt</p>
                  <p className="text-[#003D5C]">{volunteer.appliedDate}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Shield size={18} className="text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Bakgrundskontroll</p>
                  {getBackgroundCheckBadge(volunteer.backgroundCheckStatus)}
                </div>
              </div>
              {volunteer.approvedBy && (
                <div className="flex items-center gap-3">
                  <CheckCircle size={18} className="text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Godkänd av</p>
                    <p className="text-[#003D5C]">{volunteer.approvedBy} • {volunteer.approvedAt}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Languages */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="font-semibold text-[#003D5C] mb-4 flex items-center gap-2">
              <Globe size={18} />
              Språk
            </h3>
            <div className="flex flex-wrap gap-2">
              {volunteer.languages.map(lang => (
                <span key={lang} className="px-3 py-1 bg-[#006B7D]/10 text-[#006B7D] rounded-full text-sm">
                  {lang}
                </span>
              ))}
            </div>
          </div>

          {/* Interests */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="font-semibold text-[#003D5C] mb-4 flex items-center gap-2">
              <Heart size={18} />
              Intressen
            </h3>
            <div className="flex flex-wrap gap-2">
              {volunteer.interests.map(interest => (
                <span key={interest} className="px-3 py-1 bg-[#F39C12]/10 text-[#E67E22] rounded-full text-sm">
                  {interest}
                </span>
              ))}
            </div>
          </div>

          {/* Experience */}
          <div className="lg:col-span-3 bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="font-semibold text-[#003D5C] mb-4">Erfarenhet</h3>
            <p className="text-gray-600">{volunteer.experience}</p>
          </div>

          {/* Motivation */}
          <div className="lg:col-span-3 bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="font-semibold text-[#003D5C] mb-4">Motivation</h3>
            <p className="text-gray-600">{volunteer.motivation}</p>
          </div>

          {/* Notes */}
          <div className="lg:col-span-3 bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="font-semibold text-[#003D5C] mb-4">Interna anteckningar</h3>
            <div className="space-y-3">
              {volunteer.notes.map(note => (
                <div key={note.id} className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg">
                  <p className="text-gray-700">{note.content}</p>
                  <p className="text-sm text-gray-500 mt-2">{note.author} • {note.date}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'history' && (
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <h3 className="font-semibold text-[#003D5C]">Granskningshistorik</h3>
          </div>
          <div className="divide-y divide-gray-100">
            <div className="p-4 flex items-start gap-4">
              <div className="w-10 h-10 bg-[#27AE60]/10 rounded-full flex items-center justify-center flex-shrink-0">
                <CheckCircle size={18} className="text-[#27AE60]" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-[#003D5C]">Ansökan godkänd</p>
                <p className="text-sm text-gray-500">Av: {volunteer.approvedBy} • {volunteer.approvedAt}</p>
              </div>
            </div>
            <div className="p-4 flex items-start gap-4">
              <div className="w-10 h-10 bg-[#27AE60]/10 rounded-full flex items-center justify-center flex-shrink-0">
                <Shield size={18} className="text-[#27AE60]" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-[#003D5C]">Bakgrundskontroll godkänd</p>
                <p className="text-sm text-gray-500">2024-01-19</p>
              </div>
            </div>
            <div className="p-4 flex items-start gap-4">
              <div className="w-10 h-10 bg-[#F39C12]/10 rounded-full flex items-center justify-center flex-shrink-0">
                <Clock size={18} className="text-[#F39C12]" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-[#003D5C]">Bakgrundskontroll påbörjad</p>
                <p className="text-sm text-gray-500">2024-01-16</p>
              </div>
            </div>
            <div className="p-4 flex items-start gap-4">
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                <FileText size={18} className="text-gray-500" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-[#003D5C]">Ansökan mottagen</p>
                <p className="text-sm text-gray-500">{volunteer.appliedDate}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'audit' && (
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <h3 className="font-semibold text-[#003D5C]">Granskningsloggar</h3>
          </div>
          <div className="divide-y divide-gray-100">
            {[
              { action: 'Ansökan godkänd', by: volunteer.approvedBy, date: volunteer.approvedAt },
              { action: 'Anteckning tillagd', by: 'Maria Lindberg', date: '2024-01-20' },
              { action: 'Bakgrundskontroll slutförd', by: 'System', date: '2024-01-19' },
              { action: 'Anteckning tillagd', by: 'Anna Svensson', date: '2024-01-18' },
              { action: 'Bakgrundskontroll påbörjad', by: 'System', date: '2024-01-16' },
              { action: 'Ansökan registrerad', by: 'System', date: volunteer.appliedDate },
            ].map((log, index) => (
              <div key={index} className="p-4 flex items-start gap-4">
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <FileText size={18} className="text-gray-500" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-[#003D5C]">{log.action}</p>
                  <p className="text-sm text-gray-500">Av: {log.by} • {log.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
