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
  Languages,
  Car,
  Heart,
  CheckCircle,
  Shield,
  Clock
} from 'lucide-react';

export default function VolunteerDetailPage() {
  const params = useParams();
  const [volunteer, setVolunteer] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch volunteer data from database
  useEffect(() => {
    async function fetchVolunteer() {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/social-worker/volunteers/${params.id}`);
        const data = await response.json();
        
        if (response.ok && data.volunteer) {
          setVolunteer(data.volunteer);
        } else {
          setError('Kunde inte hitta volontär');
        }
      } catch (err) {
        console.error('Error fetching volunteer:', err);
        setError('Kunde inte ladda volontärdata');
      } finally {
        setIsLoading(false);
      }
    }
    
    if (params.id) {
      fetchVolunteer();
    }
  }, [params.id]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('sv-SE', { 
      day: 'numeric', 
      month: 'long',
      year: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#006B7D] mx-auto mb-4"></div>
          <p className="text-gray-600">Laddar volontärdata...</p>
        </div>
      </div>
    );
  }

  if (error || !volunteer) {
    return (
      <div className="max-w-4xl mx-auto flex items-center justify-center py-12">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || 'Volontär hittades inte'}</p>
          <Link
            href="/social-worker/search"
            className="px-4 py-2 bg-[#006B7D] text-white rounded-lg hover:bg-[#005a6a]"
          >
            Tillbaka till sökning
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/social-worker/search"
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft size={20} className="text-gray-600" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{volunteer.full_name}</h1>
          <p className="text-sm text-gray-500">
            {volunteer.status === 'approved' ? 'Godkänd volontär' : 
             volunteer.status === 'pending' ? 'Väntar på granskning' : 
             volunteer.status === 'under_review' ? 'Under granskning' : 'Volontär'}
          </p>
        </div>
      </div>

      {/* Status banner */}
      {volunteer.status === 'approved' && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CheckCircle size={24} className="text-green-600" />
            <div>
              <p className="font-medium text-green-900">Godkänd volontär</p>
              {volunteer.approved_at && (
                <p className="text-sm text-green-700">
                  Godkänd {volunteer.approved_by && `av ${volunteer.approved_by}`} den {formatDate(volunteer.approved_at)}
                </p>
              )}
            </div>
          </div>
          {volunteer.background_check_status === 'approved' && (
            <div className="flex items-center gap-2">
              <Shield size={18} className="text-green-600" />
              <span className="text-sm font-medium text-green-700">Bakgrundskontroll OK</span>
            </div>
          )}
        </div>
      )}
      
      {volunteer.status === 'pending' && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex items-center gap-3">
          <Clock size={24} className="text-yellow-600" />
          <div>
            <p className="font-medium text-yellow-900">Väntar på granskning</p>
            <p className="text-sm text-yellow-700">Ansökan har tagits emot och väntar på att granskas.</p>
          </div>
        </div>
      )}
      
      {volunteer.status === 'under_review' && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-center gap-3">
          <Clock size={24} className="text-blue-600" />
          <div>
            <p className="font-medium text-blue-900">Under granskning</p>
            <p className="text-sm text-blue-700">Ansökan granskas för närvarande.</p>
          </div>
        </div>
      )}

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
                <span>
                  {volunteer.address && `${volunteer.address}, `}
                  {volunteer.postal_code && `${volunteer.postal_code} `}
                  {volunteer.municipality || volunteer.city || ''}
                </span>
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
                  {volunteer.languages && Array.isArray(volunteer.languages) ? volunteer.languages.map((lang: string) => (
                    <span key={lang} className="px-3 py-1 bg-[#006B7D]/10 text-[#006B7D] rounded-full text-sm">
                      {lang}
                    </span>
                  )) : <span className="text-gray-500 text-sm">Inga språk angivna</span>}
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Heart size={18} />
                  Intressen
                </h3>
                <div className="flex flex-wrap gap-2">
                  {volunteer.interests && Array.isArray(volunteer.interests) ? volunteer.interests.map((interest: string) => (
                    <span key={interest} className="px-3 py-1 bg-[#F39C12]/10 text-[#F39C12] rounded-full text-sm">
                      {interest}
                    </span>
                  )) : <span className="text-gray-500 text-sm">Inga intressen angivna</span>}
                </div>
              </div>
            </div>
          </div>

          {/* Motivation & Experience */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="font-semibold text-gray-900 mb-4">Om volontären</h2>
            
            <div className="space-y-4">
              {volunteer.motivation && (
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-1">Motivation</h3>
                  <p className="text-gray-600">{volunteer.motivation}</p>
                </div>
              )}
              
              {volunteer.experience && (
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-1">Erfarenhet</h3>
                  <p className="text-gray-600">{volunteer.experience}</p>
                </div>
              )}
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
              {volunteer.availability && Array.isArray(volunteer.availability) && volunteer.availability.length > 0 && (
                <div>
                  <p className="text-sm text-gray-500 mb-2">Tider</p>
                  <div className="flex flex-wrap gap-2">
                    {volunteer.availability.map((avail: string) => (
                      <span key={avail} className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                        {avail}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {volunteer.available_for && Array.isArray(volunteer.available_for) && volunteer.available_for.length > 0 && (
                <div>
                  <p className="text-sm text-gray-500 mb-2">Vill hjälpa</p>
                  <div className="flex flex-wrap gap-2">
                    {volunteer.available_for.map((target: string) => (
                      <span key={target} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                        {target}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {volunteer.max_distance_km && (
                <div>
                  <p className="text-sm text-gray-500 mb-1">Max avstånd</p>
                  <p className="text-gray-900">{volunteer.max_distance_km} km</p>
                </div>
              )}
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
          {volunteer.experience_level && (
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
          )}
        </div>
      </div>
    </div>
  );
}
