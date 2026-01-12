'use client';

import { useState, useEffect } from 'react';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Languages,
  Heart,
  Calendar,
  Car,
  Save,
  AlertCircle
} from 'lucide-react';

const languageOptions = ['Svenska', 'Engelska', 'Arabiska', 'Persiska', 'Spanska', 'Finska', 'Somaliska', 'Tigrinja'];
const interestOptions = ['Sport & Friluftsliv', 'Musik', 'Konst & Hantverk', 'Matlagning', 'Spel & Gaming', 'Film & Serier', 'Läsning', 'Djur', 'Teknik', 'Natur'];
const availabilityOptions = ['Vardagar', 'Kvällar', 'Helger'];

export default function VolunteerProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [profile, setProfile] = useState({
    full_name: 'Anna Svensson',
    email: 'anna.svensson@email.se',
    phone: '070-123 45 67',
    birth_year: 1992,
    municipality: 'Stockholm',
    address: 'Storgatan 15',
    postal_code: '111 22',
    city: 'Stockholm',
    languages: ['Svenska', 'Engelska'],
    interests: ['Sport & Friluftsliv', 'Musik'],
    availability: ['Vardagar', 'Kvällar'],
    has_drivers_license: true,
    has_car: true,
    motivation: 'Jag vill hjälpa ungdomar som behöver en vuxen förebild i sitt liv.',
    experience: 'Jag har arbetat som fritidsledare i 3 år.'
  });

  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSaving(false);
    setIsEditing(false);
    alert('Profilen har sparats!');
  };

  const toggleLanguage = (lang: string) => {
    setProfile(prev => ({
      ...prev,
      languages: prev.languages.includes(lang)
        ? prev.languages.filter(l => l !== lang)
        : [...prev.languages, lang]
    }));
  };

  const toggleInterest = (interest: string) => {
    setProfile(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const toggleAvailability = (avail: string) => {
    setProfile(prev => ({
      ...prev,
      availability: prev.availability.includes(avail)
        ? prev.availability.filter(a => a !== avail)
        : [...prev.availability, avail]
    }));
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Min profil</h1>
          <p className="text-sm text-gray-500">Hantera din profilinformation</p>
        </div>
        
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 bg-[#006B7D] text-white rounded-lg hover:bg-[#005a6a] transition-colors"
          >
            Redigera profil
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Avbryt
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-4 py-2 bg-[#006B7D] text-white rounded-lg hover:bg-[#005a6a] transition-colors flex items-center gap-2"
            >
              {isSaving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Sparar...
                </>
              ) : (
                <>
                  <Save size={16} />
                  Spara ändringar
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Notice */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
        <AlertCircle size={20} className="text-blue-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm text-blue-900">
            Ändringar i din profil kan påverka din ansökan. Socialsekreteraren kommer att se uppdaterad information.
          </p>
        </div>
      </div>

      {/* Profile sections */}
      <div className="space-y-6">
        {/* Personal info */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <User size={18} />
            Personuppgifter
          </h2>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Namn</label>
              {isEditing ? (
                <input
                  type="text"
                  value={profile.full_name}
                  onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-[#006B7D] focus:ring-1 focus:ring-[#006B7D] outline-none"
                />
              ) : (
                <p className="text-gray-900">{profile.full_name}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">E-post</label>
              <p className="text-gray-900">{profile.email}</p>
              <p className="text-xs text-gray-500">E-post kan inte ändras</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Telefon</label>
              {isEditing ? (
                <input
                  type="tel"
                  value={profile.phone}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-[#006B7D] focus:ring-1 focus:ring-[#006B7D] outline-none"
                />
              ) : (
                <p className="text-gray-900">{profile.phone}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Födelseår</label>
              <p className="text-gray-900">{profile.birth_year}</p>
            </div>
          </div>
        </div>

        {/* Address */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <MapPin size={18} />
            Adress
          </h2>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Gatuadress</label>
              {isEditing ? (
                <input
                  type="text"
                  value={profile.address}
                  onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-[#006B7D] focus:ring-1 focus:ring-[#006B7D] outline-none"
                />
              ) : (
                <p className="text-gray-900">{profile.address}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Postnummer</label>
              {isEditing ? (
                <input
                  type="text"
                  value={profile.postal_code}
                  onChange={(e) => setProfile({ ...profile, postal_code: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-[#006B7D] focus:ring-1 focus:ring-[#006B7D] outline-none"
                />
              ) : (
                <p className="text-gray-900">{profile.postal_code}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ort</label>
              {isEditing ? (
                <input
                  type="text"
                  value={profile.city}
                  onChange={(e) => setProfile({ ...profile, city: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-[#006B7D] focus:ring-1 focus:ring-[#006B7D] outline-none"
                />
              ) : (
                <p className="text-gray-900">{profile.city}</p>
              )}
            </div>
          </div>
        </div>

        {/* Languages */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Languages size={18} />
            Språk
          </h2>
          
          <div className="flex flex-wrap gap-2">
            {languageOptions.map((lang) => (
              <button
                key={lang}
                onClick={() => isEditing && toggleLanguage(lang)}
                disabled={!isEditing}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  profile.languages.includes(lang)
                    ? 'bg-[#006B7D] text-white'
                    : isEditing
                    ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    : 'bg-gray-100 text-gray-400'
                }`}
              >
                {lang}
              </button>
            ))}
          </div>
        </div>

        {/* Interests */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Heart size={18} />
            Intressen
          </h2>
          
          <div className="flex flex-wrap gap-2">
            {interestOptions.map((interest) => (
              <button
                key={interest}
                onClick={() => isEditing && toggleInterest(interest)}
                disabled={!isEditing}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  profile.interests.includes(interest)
                    ? 'bg-[#F39C12] text-white'
                    : isEditing
                    ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    : 'bg-gray-100 text-gray-400'
                }`}
              >
                {interest}
              </button>
            ))}
          </div>
        </div>

        {/* Availability */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Calendar size={18} />
            Tillgänglighet
          </h2>
          
          <div className="flex flex-wrap gap-2">
            {availabilityOptions.map((avail) => (
              <button
                key={avail}
                onClick={() => isEditing && toggleAvailability(avail)}
                disabled={!isEditing}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  profile.availability.includes(avail)
                    ? 'bg-green-600 text-white'
                    : isEditing
                    ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    : 'bg-gray-100 text-gray-400'
                }`}
              >
                {avail}
              </button>
            ))}
          </div>
        </div>

        {/* Practical info */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Car size={18} />
            Praktisk information
          </h2>
          
          <div className="space-y-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={profile.has_drivers_license}
                onChange={(e) => isEditing && setProfile({ ...profile, has_drivers_license: e.target.checked })}
                disabled={!isEditing}
                className="w-5 h-5 text-[#006B7D] rounded"
              />
              <span className={isEditing ? 'text-gray-700' : 'text-gray-500'}>Jag har körkort</span>
            </label>
            
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={profile.has_car}
                onChange={(e) => isEditing && setProfile({ ...profile, has_car: e.target.checked })}
                disabled={!isEditing}
                className="w-5 h-5 text-[#006B7D] rounded"
              />
              <span className={isEditing ? 'text-gray-700' : 'text-gray-500'}>Jag har tillgång till bil</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
