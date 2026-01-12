'use client';

import { useState, useEffect } from 'react';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Building,
  Save,
  Shield,
  Clock
} from 'lucide-react';

export default function SocialWorkerProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [profile, setProfile] = useState({
    full_name: '',
    email: '',
    phone_work: '08-123 456',
    phone_mobile: '070-123 45 67',
    department: 'Socialtjänsten',
    title: 'Socialsekreterare',
    office_address: 'Stadshuset, Storgatan 1',
    municipality: 'Stockholm'
  });

  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      setUser(parsed);
      setProfile(prev => ({
        ...prev,
        full_name: parsed.name || '',
        email: parsed.email || '',
        municipality: parsed.municipality || 'Stockholm'
      }));
    }
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSaving(false);
    setIsEditing(false);
    alert('Profilen har sparats!');
  };

  const getAccessLevelLabel = (level: string) => {
    switch (level) {
      case 'admin':
        return { label: 'Administratör', description: 'Full åtkomst till alla funktioner i din kommun' };
      case 'approver':
        return { label: 'Godkännare', description: 'Kan granska, godkänna och avvisa ansökningar' };
      default:
        return { label: 'Granskare', description: 'Kan endast visa volontärer (läsläge)' };
    }
  };

  const accessLevel = getAccessLevelLabel(user?.access_level || 'viewer');

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

      {/* Access level card */}
      <div className="bg-[#006B7D]/5 border border-[#006B7D]/20 rounded-xl p-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-[#006B7D] rounded-lg flex items-center justify-center">
            <Shield size={24} className="text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{accessLevel.label}</h3>
            <p className="text-sm text-gray-600 mt-1">{accessLevel.description}</p>
            <p className="text-xs text-gray-500 mt-2">
              Kontakta din administratör om du behöver ändra din behörighetsnivå.
            </p>
          </div>
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
                <p className="text-gray-900">{profile.full_name || '-'}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">E-post</label>
              <p className="text-gray-900">{profile.email}</p>
              <p className="text-xs text-gray-500">E-post kan inte ändras</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Titel</label>
              {isEditing ? (
                <input
                  type="text"
                  value={profile.title}
                  onChange={(e) => setProfile({ ...profile, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-[#006B7D] focus:ring-1 focus:ring-[#006B7D] outline-none"
                />
              ) : (
                <p className="text-gray-900">{profile.title}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Avdelning</label>
              {isEditing ? (
                <input
                  type="text"
                  value={profile.department}
                  onChange={(e) => setProfile({ ...profile, department: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-[#006B7D] focus:ring-1 focus:ring-[#006B7D] outline-none"
                />
              ) : (
                <p className="text-gray-900">{profile.department}</p>
              )}
            </div>
          </div>
        </div>

        {/* Contact info */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Phone size={18} />
            Kontaktuppgifter
          </h2>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Arbetstelefon</label>
              {isEditing ? (
                <input
                  type="tel"
                  value={profile.phone_work}
                  onChange={(e) => setProfile({ ...profile, phone_work: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-[#006B7D] focus:ring-1 focus:ring-[#006B7D] outline-none"
                />
              ) : (
                <p className="text-gray-900">{profile.phone_work}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mobiltelefon</label>
              {isEditing ? (
                <input
                  type="tel"
                  value={profile.phone_mobile}
                  onChange={(e) => setProfile({ ...profile, phone_mobile: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-[#006B7D] focus:ring-1 focus:ring-[#006B7D] outline-none"
                />
              ) : (
                <p className="text-gray-900">{profile.phone_mobile}</p>
              )}
            </div>
          </div>
        </div>

        {/* Work location */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Building size={18} />
            Arbetsplats
          </h2>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Kommun</label>
              <p className="text-gray-900">{profile.municipality}</p>
              <p className="text-xs text-gray-500">Kontakta admin för att ändra kommun</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Kontorsadress</label>
              {isEditing ? (
                <input
                  type="text"
                  value={profile.office_address}
                  onChange={(e) => setProfile({ ...profile, office_address: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-[#006B7D] focus:ring-1 focus:ring-[#006B7D] outline-none"
                />
              ) : (
                <p className="text-gray-900">{profile.office_address}</p>
              )}
            </div>
          </div>
        </div>

        {/* Activity stats */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Clock size={18} />
            Aktivitet
          </h2>
          
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-2xl font-bold text-[#006B7D]">12</p>
              <p className="text-sm text-gray-600">Granskade ansökningar</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-2xl font-bold text-green-600">8</p>
              <p className="text-sm text-gray-600">Godkända</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-2xl font-bold text-red-600">2</p>
              <p className="text-sm text-gray-600">Avvisade</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
