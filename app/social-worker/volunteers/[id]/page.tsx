'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Languages,
  Car,
  Heart,
  CheckCircle,
  Shield,
  Clock
} from 'lucide-react';

// Mock volunteer data
const mockVolunteer = {
  id: '1',
  full_name: 'Anna Svensson',
  email: 'anna.svensson@email.se',
  phone: '070-123 45 67',
  birth_year: 1992,
  age: 32,
  gender: 'Kvinna',
  municipality: 'Stockholm',
  address: 'Storgatan 15',
  postal_code: '111 22',
  city: 'Stockholm',
  languages: ['Svenska', 'Engelska'],
  interests: ['Sport & Friluftsliv', 'Musik', 'Läsning'],
  availability: ['Vardagar', 'Kvällar'],
  available_for: ['Ungdomar 13-17', 'Vuxna 18+'],
  experience_level: 'experienced',
  has_drivers_license: true,
  has_car: true,
  max_distance_km: 15,
  motivation: 'Jag vill hjälpa ungdomar som behöver en vuxen förebild i sitt liv.',
  experience: 'Jag har arbetat som fritidsledare i 3 år och har erfarenhet av att arbeta med ungdomar.',
  status: 'approved',
  background_check_status: 'approved',
  approved_at: '2024-01-05T10:00:00Z',
  approved_by: 'Lisa Andersson'
};

export default function VolunteerDetailPage() {
  const params = useParams();
  const [volunteer] = useState(mockVolunteer);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('sv-SE', { 
      day: 'numeric', 
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/social-worker/volunteers"
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft size={20} className="text-gray-600" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{volunteer.full_name}</h1>
          <p className="text-sm text-gray-500">Godkänd volontär</p>
        </div>
      </div>

      {/* Status banner */}
      <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <CheckCircle size={24} className="text-green-600" />
          <div>
            <p className="font-medium text-green-900">Godkänd volontär</p>
            <p className="text-sm text-green-700">
              Godkänd av {volunteer.approved_by} den {formatDate(volunteer.approved_at)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Shield size={18} className="text-green-600" />
          <span className="text-sm font-medium text-green-700">Bakgrundskontroll OK</span>
        </div>
      </div>

      {/* Main content */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left column - Main info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal info */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <User size={18} />
              Personuppgifter
            </h2>
            
            <div className="flex items-start gap-4 mb-6">
              <div className="w-20 h-20 rounded-full bg-[#006B7D] flex items-center justify-center text-white font-bold text-2xl">
                {volunteer.full_name.charAt(0)}
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">{volunteer.full_name}</h3>
                <p className="text-gray-500">{volunteer.age} år, {volunteer.gender}</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 text-gray-600">
                <Mail size={18} className="text-gray-400" />
                <span>{volunteer.email}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-600">
                <Phone size={18} className="text-gray-400" />
                <span>{volunteer.phone}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-600">
                <MapPin size={18} className="text-gray-400" />
                <span>{volunteer.address}, {volunteer.postal_code} {volunteer.city}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-600">
                <Car size={18} className="text-gray-400" />
                <span>
                  {volunteer.has_drivers_license ? 'Har körkort' : 'Inget körkort'}
                  {volunteer.has_car && ' • Har bil'}
                </span>
              </div>
            </div>
          </div>

          {/* Languages & Interests */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Languages size={18} />
                  Språk
                </h3>
                <div className="flex flex-wrap gap-2">
                  {volunteer.languages.map((lang) => (
                    <span key={lang} className="px-3 py-1 bg-[#006B7D]/10 text-[#006B7D] rounded-full text-sm">
                      {lang}
                    </span>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Heart size={18} />
                  Intressen
                </h3>
                <div className="flex flex-wrap gap-2">
                  {volunteer.interests.map((interest) => (
                    <span key={interest} className="px-3 py-1 bg-[#F39C12]/10 text-[#F39C12] rounded-full text-sm">
                      {interest}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Motivation & Experience */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="font-semibold text-gray-900 mb-4">Om volontären</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-1">Motivation</h3>
                <p className="text-gray-600">{volunteer.motivation}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-1">Erfarenhet</h3>
                <p className="text-gray-600">{volunteer.experience}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right column - Sidebar */}
        <div className="space-y-6">
          {/* Availability */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Clock size={18} />
              Tillgänglighet
            </h3>
            
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500 mb-2">Tider</p>
                <div className="flex flex-wrap gap-2">
                  {volunteer.availability.map((avail) => (
                    <span key={avail} className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                      {avail}
                    </span>
                  ))}
                </div>
              </div>
              
              <div>
                <p className="text-sm text-gray-500 mb-2">Vill hjälpa</p>
                <div className="flex flex-wrap gap-2">
                  {volunteer.available_for.map((target) => (
                    <span key={target} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                      {target}
                    </span>
                  ))}
                </div>
              </div>
              
              <div>
                <p className="text-sm text-gray-500 mb-1">Max avstånd</p>
                <p className="text-gray-900">{volunteer.max_distance_km} km</p>
              </div>
            </div>
          </div>

          {/* Quick actions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Åtgärder</h3>
            
            <div className="space-y-2">
              <a
                href={`mailto:${volunteer.email}`}
                className="w-full px-4 py-2 bg-[#006B7D] hover:bg-[#005a6a] text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
              >
                <Mail size={16} />
                Skicka e-post
              </a>
              <a
                href={`tel:${volunteer.phone.replace(/[^0-9+]/g, '')}`}
                className="w-full px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
              >
                <Phone size={16} />
                Ring
              </a>
            </div>
          </div>

          {/* Experience level */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="font-semibold text-gray-900 mb-3">Erfarenhetsnivå</h3>
            <span className={`px-3 py-1.5 rounded-full text-sm font-medium ${
              volunteer.experience_level === 'expert' ? 'bg-purple-100 text-purple-700' :
              volunteer.experience_level === 'experienced' ? 'bg-blue-100 text-blue-700' :
              'bg-gray-100 text-gray-700'
            }`}>
              {volunteer.experience_level === 'expert' ? 'Expert' :
               volunteer.experience_level === 'experienced' ? 'Erfaren' : 'Nybörjare'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
