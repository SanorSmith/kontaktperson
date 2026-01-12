'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
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
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Plus,
  Send,
  Upload,
  MessageSquare,
  Shield,
  UserCheck,
  History,
  X
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
  skills: ['Kommunikation', 'Tålamod'],
  experience: 'Jag har arbetat som fritidsledare i 3 år och har erfarenhet av att arbeta med ungdomar i olika åldrar. Jag har också varit mentor för nyanlända.',
  motivation: 'Jag vill hjälpa ungdomar som behöver en vuxen förebild i sitt liv. Jag tror att jag kan göra skillnad genom att vara en stabil och pålitlig person som de kan lita på.',
  availability: ['Vardagar', 'Kvällar'],
  available_for: ['Ungdomar 13-17', 'Vuxna 18+'],
  experience_level: 'experienced',
  has_drivers_license: true,
  has_car: true,
  max_distance_km: 15,
  reference_name_1: 'Maria Karlsson',
  reference_phone_1: '070-111 22 33',
  reference_relation_1: 'Tidigare chef',
  reference_name_2: 'Erik Lindberg',
  reference_phone_2: '070-222 33 44',
  reference_relation_2: 'Kollega',
  accepts_background_check: true,
  accepts_terms: true,
  status: 'pending',
  background_check_status: 'not_requested',
  created_at: '2024-01-10T10:00:00Z',
  updated_at: '2024-01-10T10:00:00Z'
};

// Mock vetting notes
const mockNotes = [
  {
    id: '1',
    author: 'Lisa Andersson',
    note_type: 'general',
    content: 'Första granskning påbörjad. Ansökan ser komplett ut.',
    created_at: '2024-01-11T09:00:00Z'
  },
  {
    id: '2',
    author: 'Lisa Andersson',
    note_type: 'reference_check',
    content: 'Kontaktade referens 1 (Maria Karlsson). Mycket positiv feedback. Beskriver sökanden som pålitlig och engagerad.',
    created_at: '2024-01-11T14:30:00Z'
  }
];

const noteTypes = [
  { value: 'general', label: 'Allmän anteckning', color: 'gray' },
  { value: 'interview', label: 'Intervju', color: 'blue' },
  { value: 'reference_check', label: 'Referenskontroll', color: 'purple' },
  { value: 'background_check', label: 'Bakgrundskontroll', color: 'orange' },
  { value: 'status_change', label: 'Statusändring', color: 'green' }
];

export default function ApplicationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [volunteer, setVolunteer] = useState(mockVolunteer);
  const [notes, setNotes] = useState(mockNotes);
  const [activeTab, setActiveTab] = useState('profile');
  const [user, setUser] = useState<any>(null);
  
  // Modal states
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showRequestInfoModal, setShowRequestInfoModal] = useState(false);
  
  // Form states
  const [newNote, setNewNote] = useState({ type: 'general', content: '' });
  const [approvalComment, setApprovalComment] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [requestInfoMessage, setRequestInfoMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const canApprove = user?.access_level === 'approver' || user?.access_level === 'admin';

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('sv-SE', { 
      day: 'numeric', 
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleAddNote = () => {
    if (!newNote.content.trim()) return;
    
    const note = {
      id: Date.now().toString(),
      author: user?.name || 'Okänd',
      note_type: newNote.type,
      content: newNote.content,
      created_at: new Date().toISOString()
    };
    
    setNotes([note, ...notes]);
    setNewNote({ type: 'general', content: '' });
    setShowNoteModal(false);
  };

  const handleApprove = async () => {
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Add status change note
    const note = {
      id: Date.now().toString(),
      author: user?.name || 'Okänd',
      note_type: 'status_change',
      content: `Ansökan godkänd. ${approvalComment ? `Kommentar: ${approvalComment}` : ''}`,
      created_at: new Date().toISOString()
    };
    
    setNotes([note, ...notes]);
    setVolunteer({ ...volunteer, status: 'approved' });
    setShowApproveModal(false);
    setApprovalComment('');
    setIsSubmitting(false);
    
    // Show success message and redirect
    alert('Ansökan har godkänts! Ett e-postmeddelande har skickats till volontären.');
    router.push('/social-worker/applications');
  };

  const handleReject = async () => {
    if (rejectionReason.length < 50) {
      alert('Ange en mer detaljerad anledning (minst 50 tecken)');
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Add status change note
    const note = {
      id: Date.now().toString(),
      author: user?.name || 'Okänd',
      note_type: 'status_change',
      content: `Ansökan avvisad. Anledning: ${rejectionReason}`,
      created_at: new Date().toISOString()
    };
    
    setNotes([note, ...notes]);
    setVolunteer({ ...volunteer, status: 'rejected' });
    setShowRejectModal(false);
    setRejectionReason('');
    setIsSubmitting(false);
    
    // Show success message and redirect
    alert('Ansökan har avvisats. Ett e-postmeddelande har skickats till volontären.');
    router.push('/social-worker/applications');
  };

  const handleRequestBackgroundCheck = () => {
    setVolunteer({ ...volunteer, background_check_status: 'pending' });
    
    const note = {
      id: Date.now().toString(),
      author: user?.name || 'Okänd',
      note_type: 'background_check',
      content: 'Bakgrundskontroll har begärts.',
      created_at: new Date().toISOString()
    };
    
    setNotes([note, ...notes]);
    alert('Bakgrundskontroll har begärts.');
  };

  const getNoteTypeColor = (type: string) => {
    const noteType = noteTypes.find(t => t.value === type);
    switch (noteType?.color) {
      case 'blue': return 'bg-blue-100 text-blue-700';
      case 'purple': return 'bg-purple-100 text-purple-700';
      case 'orange': return 'bg-orange-100 text-orange-700';
      case 'green': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/social-worker/applications"
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} className="text-gray-600" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Granska ansökan</h1>
            <p className="text-sm text-gray-500">
              Ansökan från {volunteer.full_name}
            </p>
          </div>
        </div>
        
        {/* Status badge */}
        <div className="flex items-center gap-2">
          {volunteer.status === 'pending' && (
            <span className="px-3 py-1.5 bg-yellow-100 text-yellow-700 rounded-full text-sm font-medium flex items-center gap-1">
              <Clock size={14} />
              Väntar på granskning
            </span>
          )}
          {volunteer.status === 'approved' && (
            <span className="px-3 py-1.5 bg-green-100 text-green-700 rounded-full text-sm font-medium flex items-center gap-1">
              <CheckCircle size={14} />
              Godkänd
            </span>
          )}
          {volunteer.status === 'rejected' && (
            <span className="px-3 py-1.5 bg-red-100 text-red-700 rounded-full text-sm font-medium flex items-center gap-1">
              <XCircle size={14} />
              Avvisad
            </span>
          )}
        </div>
      </div>

      {/* Main content */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left column - Volunteer profile */}
        <div className="lg:col-span-2 space-y-6">
          {/* Tabs */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="border-b border-gray-100">
              <nav className="flex">
                {[
                  { id: 'profile', label: 'Profil', icon: User },
                  { id: 'motivation', label: 'Motivation', icon: Heart },
                  { id: 'references', label: 'Referenser', icon: UserCheck },
                  { id: 'history', label: 'Historik', icon: History }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                      activeTab === tab.id
                        ? 'border-[#006B7D] text-[#006B7D]'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <tab.icon size={16} />
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>

            <div className="p-6">
              {/* Profile tab */}
              {activeTab === 'profile' && (
                <div className="space-y-6">
                  {/* Basic info */}
                  <div className="flex items-start gap-4">
                    <div className="w-20 h-20 rounded-full bg-[#006B7D] flex items-center justify-center text-white font-bold text-2xl">
                      {volunteer.full_name.charAt(0)}
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">{volunteer.full_name}</h2>
                      <p className="text-gray-500">{volunteer.age} år, {volunteer.gender}</p>
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <Mail size={14} />
                          {volunteer.email}
                        </span>
                        <span className="flex items-center gap-1">
                          <Phone size={14} />
                          {volunteer.phone}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Contact & Location */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900 mb-3">Kontaktuppgifter</h3>
                      <div className="space-y-2 text-sm">
                        <p className="flex items-center gap-2 text-gray-600">
                          <MapPin size={16} className="text-gray-400" />
                          {volunteer.address}, {volunteer.postal_code} {volunteer.city}
                        </p>
                        <p className="flex items-center gap-2 text-gray-600">
                          <Calendar size={16} className="text-gray-400" />
                          Ansökte {formatDate(volunteer.created_at)}
                        </p>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900 mb-3">Praktisk information</h3>
                      <div className="space-y-2 text-sm">
                        <p className="flex items-center gap-2 text-gray-600">
                          <Car size={16} className="text-gray-400" />
                          {volunteer.has_drivers_license ? 'Har körkort' : 'Inget körkort'}
                          {volunteer.has_car && ' • Har bil'}
                        </p>
                        <p className="text-gray-600">
                          Max avstånd: {volunteer.max_distance_km} km
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Languages */}
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-3">Språk</h3>
                    <div className="flex flex-wrap gap-2">
                      {volunteer.languages.map((lang) => (
                        <span key={lang} className="px-3 py-1 bg-[#006B7D]/10 text-[#006B7D] rounded-full text-sm">
                          {lang}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Interests */}
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-3">Intressen</h3>
                    <div className="flex flex-wrap gap-2">
                      {volunteer.interests.map((interest) => (
                        <span key={interest} className="px-3 py-1 bg-[#F39C12]/10 text-[#F39C12] rounded-full text-sm">
                          {interest}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Availability */}
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-3">Tillgänglighet</h3>
                    <div className="flex flex-wrap gap-2">
                      {volunteer.availability.map((avail) => (
                        <span key={avail} className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                          {avail}
                        </span>
                      ))}
                    </div>
                    <p className="text-sm text-gray-600 mt-2">
                      Vill hjälpa: {volunteer.available_for.join(', ')}
                    </p>
                  </div>
                </div>
              )}

              {/* Motivation tab */}
              {activeTab === 'motivation' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-3">Motivation</h3>
                    <p className="text-gray-700 whitespace-pre-wrap">{volunteer.motivation}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-3">Erfarenhet</h3>
                    <p className="text-gray-700 whitespace-pre-wrap">{volunteer.experience}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-3">Erfarenhetsnivå</h3>
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      volunteer.experience_level === 'expert' ? 'bg-purple-100 text-purple-700' :
                      volunteer.experience_level === 'experienced' ? 'bg-blue-100 text-blue-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {volunteer.experience_level === 'expert' ? 'Expert' :
                       volunteer.experience_level === 'experienced' ? 'Erfaren' : 'Nybörjare'}
                    </span>
                  </div>
                </div>
              )}

              {/* References tab */}
              {activeTab === 'references' && (
                <div className="space-y-6">
                  {/* Reference 1 */}
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-semibold text-gray-900 mb-2">Referens 1</h3>
                    <div className="space-y-1 text-sm">
                      <p><strong>Namn:</strong> {volunteer.reference_name_1}</p>
                      <p><strong>Telefon:</strong> {volunteer.reference_phone_1}</p>
                      <p><strong>Relation:</strong> {volunteer.reference_relation_1}</p>
                    </div>
                    {canApprove && (
                      <button className="mt-3 px-3 py-1.5 bg-[#006B7D] text-white text-sm rounded-lg hover:bg-[#005a6a] transition-colors">
                        Kontakta referens
                      </button>
                    )}
                  </div>
                  
                  {/* Reference 2 */}
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-semibold text-gray-900 mb-2">Referens 2</h3>
                    <div className="space-y-1 text-sm">
                      <p><strong>Namn:</strong> {volunteer.reference_name_2}</p>
                      <p><strong>Telefon:</strong> {volunteer.reference_phone_2}</p>
                      <p><strong>Relation:</strong> {volunteer.reference_relation_2}</p>
                    </div>
                    {canApprove && (
                      <button className="mt-3 px-3 py-1.5 bg-[#006B7D] text-white text-sm rounded-lg hover:bg-[#005a6a] transition-colors">
                        Kontakta referens
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* History tab */}
              {activeTab === 'history' && (
                <div className="space-y-4">
                  {notes.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">Inga anteckningar ännu</p>
                  ) : (
                    notes.map((note) => (
                      <div key={note.id} className="p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-0.5 text-xs rounded ${getNoteTypeColor(note.note_type)}`}>
                              {noteTypes.find(t => t.value === note.note_type)?.label}
                            </span>
                            <span className="text-sm font-medium text-gray-900">{note.author}</span>
                          </div>
                          <span className="text-xs text-gray-500">{formatDate(note.created_at)}</span>
                        </div>
                        <p className="text-sm text-gray-700">{note.content}</p>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right column - Actions panel */}
        <div className="space-y-6">
          {/* Background check */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Shield size={18} />
              Bakgrundskontroll
            </h3>
            
            <div className="mb-4">
              {volunteer.background_check_status === 'not_requested' && (
                <span className="px-3 py-1.5 bg-gray-100 text-gray-600 rounded-full text-sm">
                  Ej begärd
                </span>
              )}
              {volunteer.background_check_status === 'pending' && (
                <span className="px-3 py-1.5 bg-yellow-100 text-yellow-700 rounded-full text-sm flex items-center gap-1 w-fit">
                  <Clock size={14} />
                  Väntar på svar
                </span>
              )}
              {volunteer.background_check_status === 'approved' && (
                <span className="px-3 py-1.5 bg-green-100 text-green-700 rounded-full text-sm flex items-center gap-1 w-fit">
                  <CheckCircle size={14} />
                  Godkänd
                </span>
              )}
            </div>
            
            {canApprove && volunteer.background_check_status === 'not_requested' && (
              <button
                onClick={handleRequestBackgroundCheck}
                className="w-full px-4 py-2 bg-[#006B7D] text-white rounded-lg hover:bg-[#005a6a] transition-colors text-sm font-medium"
              >
                Begär bakgrundskontroll
              </button>
            )}
            
            {canApprove && volunteer.background_check_status === 'pending' && (
              <button className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium flex items-center justify-center gap-2">
                <Upload size={16} />
                Ladda upp resultat
              </button>
            )}
          </div>

          {/* Add note */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <MessageSquare size={18} />
              Anteckningar
            </h3>
            
            {canApprove ? (
              <button
                onClick={() => setShowNoteModal(true)}
                className="w-full px-4 py-2 border-2 border-dashed border-gray-300 text-gray-600 rounded-lg hover:border-[#006B7D] hover:text-[#006B7D] transition-colors text-sm font-medium flex items-center justify-center gap-2"
              >
                <Plus size={16} />
                Lägg till anteckning
              </button>
            ) : (
              <p className="text-sm text-gray-500">
                Du behöver Approver-behörighet för att lägga till anteckningar.
              </p>
            )}
          </div>

          {/* Decision buttons */}
          {volunteer.status === 'pending' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Beslut</h3>
              
              {canApprove ? (
                <div className="space-y-3">
                  <button
                    onClick={() => setShowApproveModal(true)}
                    className="w-full px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                  >
                    <CheckCircle size={18} />
                    Godkänn ansökan
                  </button>
                  
                  <button
                    onClick={() => setShowRequestInfoModal(true)}
                    className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                  >
                    <Send size={18} />
                    Begär mer information
                  </button>
                  
                  <button
                    onClick={() => setShowRejectModal(true)}
                    className="w-full px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                  >
                    <XCircle size={18} />
                    Avvisa ansökan
                  </button>
                </div>
              ) : (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle size={20} className="text-yellow-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-yellow-900">Begränsad behörighet</p>
                      <p className="text-sm text-yellow-700 mt-1">
                        Du behöver Approver-behörighet för att godkänna eller avvisa ansökningar.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Add Note Modal */}
      {showNoteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Lägg till anteckning</h3>
              <button onClick={() => setShowNoteModal(false)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Typ av anteckning</label>
                <select
                  value={newNote.type}
                  onChange={(e) => setNewNote({ ...newNote, type: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-[#006B7D] focus:ring-1 focus:ring-[#006B7D] outline-none"
                >
                  {noteTypes.map((type) => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Anteckning</label>
                <textarea
                  value={newNote.content}
                  onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-[#006B7D] focus:ring-1 focus:ring-[#006B7D] outline-none resize-none"
                  placeholder="Skriv din anteckning här..."
                />
              </div>
            </div>
            
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowNoteModal(false)}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Avbryt
              </button>
              <button
                onClick={handleAddNote}
                className="px-4 py-2 bg-[#006B7D] text-white rounded-lg hover:bg-[#005a6a] transition-colors"
              >
                Spara anteckning
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Approve Modal */}
      {showApproveModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Godkänn ansökan</h3>
              <button onClick={() => setShowApproveModal(false)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>
            
            <p className="text-gray-600 mb-4">
              Är du säker att du vill godkänna ansökan från <strong>{volunteer.full_name}</strong>?
            </p>
            
            <p className="text-sm text-gray-500 mb-4">
              Ett e-postmeddelande kommer att skickas till volontären med information om att ansökan har godkänts.
            </p>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Kommentar (valfritt)</label>
              <textarea
                value={approvalComment}
                onChange={(e) => setApprovalComment(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-[#006B7D] focus:ring-1 focus:ring-[#006B7D] outline-none resize-none"
                placeholder="Lägg till en kommentar..."
              />
            </div>
            
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowApproveModal(false)}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                disabled={isSubmitting}
              >
                Avbryt
              </button>
              <button
                onClick={handleApprove}
                disabled={isSubmitting}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Godkänner...
                  </>
                ) : (
                  <>
                    <CheckCircle size={18} />
                    Godkänn
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Avvisa ansökan</h3>
              <button onClick={() => setShowRejectModal(false)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>
            
            <p className="text-gray-600 mb-4">
              Varför avvisas ansökan från <strong>{volunteer.full_name}</strong>?
            </p>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Anledning <span className="text-red-500">*</span>
              </label>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-[#006B7D] focus:ring-1 focus:ring-[#006B7D] outline-none resize-none"
                placeholder="Ange en detaljerad anledning (minst 50 tecken)..."
              />
              <p className="text-xs text-gray-500 mt-1">
                {rejectionReason.length}/50 tecken (minimum)
              </p>
            </div>
            
            <p className="text-sm text-gray-500 mb-4">
              Ett e-postmeddelande kommer att skickas till volontären med anledningen till avvisningen.
            </p>
            
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowRejectModal(false)}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                disabled={isSubmitting}
              >
                Avbryt
              </button>
              <button
                onClick={handleReject}
                disabled={isSubmitting || rejectionReason.length < 50}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:bg-gray-300 flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Avvisar...
                  </>
                ) : (
                  <>
                    <XCircle size={18} />
                    Avvisa
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
