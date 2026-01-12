'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Search,
  Filter,
  Download,
  CheckCircle,
  MapPin,
  Phone,
  Mail,
  Calendar,
  Languages,
  Eye
} from 'lucide-react';

// Mock approved volunteers
const mockVolunteers = [
  {
    id: '1',
    full_name: 'Anna Svensson',
    email: 'anna.svensson@email.se',
    phone: '070-123 45 67',
    age: 32,
    municipality: 'Stockholm',
    languages: ['Svenska', 'Engelska'],
    status: 'approved',
    approved_at: '2024-01-05T10:00:00Z',
    background_check_status: 'approved'
  },
  {
    id: '2',
    full_name: 'Erik Johansson',
    email: 'erik.j@email.se',
    phone: '070-234 56 78',
    age: 45,
    municipality: 'Stockholm',
    languages: ['Svenska', 'Arabiska', 'Engelska'],
    status: 'approved',
    approved_at: '2024-01-03T14:30:00Z',
    background_check_status: 'approved'
  },
  {
    id: '3',
    full_name: 'Maria Lindgren',
    email: 'maria.l@email.se',
    phone: '070-345 67 89',
    age: 28,
    municipality: 'Solna',
    languages: ['Svenska', 'Spanska'],
    status: 'approved',
    approved_at: '2023-12-20T09:15:00Z',
    background_check_status: 'approved'
  },
  {
    id: '4',
    full_name: 'Johan Berg',
    email: 'johan.berg@email.se',
    phone: '070-456 78 90',
    age: 55,
    municipality: 'Huddinge',
    languages: ['Svenska', 'Finska'],
    status: 'approved',
    approved_at: '2023-12-15T16:45:00Z',
    background_check_status: 'approved'
  }
];

export default function VolunteersPage() {
  const [volunteers] = useState(mockVolunteers);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredVolunteers = volunteers.filter(v => 
    v.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    v.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('sv-SE', { 
      day: 'numeric', 
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mina volontärer</h1>
          <p className="text-sm text-gray-500">
            {filteredVolunteers.length} godkända volontärer
          </p>
        </div>
        
        <button className="px-4 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors">
          <Download size={16} />
          Exportera lista
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Sök på namn eller e-post..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:border-[#006B7D] focus:ring-1 focus:ring-[#006B7D] outline-none"
          />
        </div>
      </div>

      {/* Volunteers grid */}
      <div className="grid md:grid-cols-2 gap-4">
        {filteredVolunteers.map((volunteer) => (
          <div
            key={volunteer.id}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-[#006B7D] flex items-center justify-center text-white font-bold text-xl">
                  {volunteer.full_name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{volunteer.full_name}</h3>
                  <p className="text-sm text-gray-500">{volunteer.age} år</p>
                </div>
              </div>
              <span className="px-2.5 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium flex items-center gap-1">
                <CheckCircle size={12} />
                Godkänd
              </span>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <MapPin size={14} className="text-gray-400" />
                {volunteer.municipality}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Mail size={14} className="text-gray-400" />
                {volunteer.email}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Phone size={14} className="text-gray-400" />
                {volunteer.phone}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar size={14} className="text-gray-400" />
                Godkänd {formatDate(volunteer.approved_at)}
              </div>
            </div>

            <div className="flex items-center gap-2 mb-4">
              <Languages size={14} className="text-gray-400" />
              <div className="flex flex-wrap gap-1">
                {volunteer.languages.map((lang) => (
                  <span key={lang} className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">
                    {lang}
                  </span>
                ))}
              </div>
            </div>

            <Link
              href={`/social-worker/volunteers/${volunteer.id}`}
              className="w-full px-4 py-2 bg-[#006B7D] hover:bg-[#005a6a] text-white text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <Eye size={16} />
              Visa profil
            </Link>
          </div>
        ))}
      </div>

      {filteredVolunteers.length === 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <Search size={48} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Inga volontärer hittade</h3>
          <p className="text-gray-500">
            Inga volontärer matchar din sökning.
          </p>
        </div>
      )}
    </div>
  );
}
