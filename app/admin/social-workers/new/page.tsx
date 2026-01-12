'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  Building,
  Briefcase,
  Shield,
  FileText,
  Check,
  AlertCircle,
  Loader2
} from 'lucide-react';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null;

interface FormData {
  fullName: string;
  privateEmail: string; // Personal email for receiving login info
  phone: string;
  municipalityId: string;
  department: string;
  position: string;
  employeeNumber: string;
  accessLevel: 'viewer' | 'approver' | 'admin';
  internalNotes: string;
}

const municipalities = [
  { id: '1', name: 'Stockholm' },
  { id: '2', name: 'Göteborg' },
  { id: '3', name: 'Malmö' },
  { id: '4', name: 'Uppsala' },
  { id: '5', name: 'Linköping' },
  { id: '6', name: 'Örebro' },
  { id: '7', name: 'Västerås' },
  { id: '8', name: 'Norrköping' },
];

const positions = ['Socialsekreterare', 'Teamledare', 'Enhetschef', 'Chef'];

const approvedDomains = ['stockholm.se', 'goteborg.se', 'malmo.se', 'uppsala.se', 'linkoping.se', 'orebro.se', 'vasteras.se', 'norrkoping.se', 'kommun.se'];

export default function NewSocialWorkerPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    privateEmail: '',
    phone: '',
    municipalityId: '',
    department: '',
    position: '',
    employeeNumber: '',
    accessLevel: 'viewer',
    internalNotes: ''
  });

  // Auto-generate work email from name and municipality
  const generateWorkEmail = (): string => {
    if (!formData.fullName || !formData.municipalityId) return '';
    
    const municipality = municipalities.find(m => m.id === formData.municipalityId);
    if (!municipality) return '';
    
    // Convert name to email format: "John Doe" -> "john.doe"
    const emailName = formData.fullName
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '.')
      .replace(/[^a-z.]/g, '');
    
    // Convert municipality name: "Stockholm" -> "stockholm"
    const municipalityName = municipality.name.toLowerCase().replace(/[åä]/g, 'a').replace(/ö/g, 'o');
    
    return `${emailName}@${municipalityName}.se`;
  };

  const workEmail = generateWorkEmail();

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Fullständigt namn krävs';
    }

    if (!formData.privateEmail.trim()) {
      newErrors.privateEmail = 'Privat e-postadress krävs (för att ta emot inloggningsuppgifter)';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.privateEmail)) {
      newErrors.privateEmail = 'Ogiltig e-postadress';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Telefonnummer krävs';
    } else if (!/^(\+46|0)[0-9\s-]{8,}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Ogiltigt svenskt telefonnummer';
    }

    if (!formData.municipalityId) {
      newErrors.municipalityId = 'Kommun krävs';
    }

    if (!formData.department.trim()) {
      newErrors.department = 'Avdelning krävs';
    }

    if (!formData.position) {
      newErrors.position = 'Befattning krävs';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      // Generate a temporary password
      const tempPassword = Math.random().toString(36).slice(-8) + 'A1!';
      
      // Use API route to create user (uses service role key and sends email)
      const response = await fetch('/api/admin/create-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: workEmail, // Work email for login
          privateEmail: formData.privateEmail, // Private email for receiving login info
          password: tempPassword,
          fullName: formData.fullName,
          role: 'social_worker',
          municipality: municipalities.find(m => m.id === formData.municipalityId)?.name || '',
          department: formData.department,
          accessLevel: formData.accessLevel,
          employeeId: formData.employeeNumber || null,
          phone: formData.phone || null
        })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Kunde inte skapa användare.');
      }

      // Show success message with email status
      const emailStatus = result.emailSent 
        ? `\n\n✅ Inloggningsuppgifter har skickats till: ${formData.privateEmail}`
        : '\n\n⚠️ Användaren skapades men e-postmeddelandet kunde inte skickas. Spara lösenordet nedan.';
      
      alert(`Användare skapad!${emailStatus}\n\nArbetsmail (för inloggning): ${workEmail}\nTillfälligt lösenord: ${tempPassword}\n\nSpara detta lösenord för säkerhets skull.`);
      
      // Redirect to list with success message
      router.push('/admin/social-workers?success=created');
    } catch (error: any) {
      console.error('Error creating social worker:', error);
      setErrors({ submit: error.message || 'Ett fel uppstod. Försök igen.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <Link
          href="/admin/social-workers"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-[#003D5C] mb-4"
        >
          <ArrowLeft size={20} />
          Tillbaka till lista
        </Link>
        <h1 className="text-2xl font-bold text-[#003D5C]">Lägg till socialsekreterare</h1>
        <p className="text-gray-600">Fyll i uppgifterna för att skicka en inbjudan</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Personal Information */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-[#003D5C] mb-4 flex items-center gap-2">
            <User size={20} />
            Personuppgifter
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fullständigt namn <span className="text-[#E74C3C]">*</span>
              </label>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => handleChange('fullName', e.target.value)}
                className={`w-full px-4 py-2.5 border rounded-lg focus:ring-1 focus:ring-[#003D5C] outline-none ${
                  errors.fullName ? 'border-[#E74C3C]' : 'border-gray-300 focus:border-[#003D5C]'
                }`}
                placeholder="Anna Svensson"
              />
              {errors.fullName && (
                <p className="text-sm text-[#E74C3C] mt-1 flex items-center gap-1">
                  <AlertCircle size={14} />
                  {errors.fullName}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Privat e-post <span className="text-[#E74C3C]">*</span>
              </label>
              <div className="relative">
                <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  value={formData.privateEmail}
                  onChange={(e) => handleChange('privateEmail', e.target.value)}
                  className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:ring-1 focus:ring-[#003D5C] outline-none ${
                    errors.privateEmail ? 'border-[#E74C3C]' : 'border-gray-300 focus:border-[#003D5C]'
                  }`}
                  placeholder="anna@gmail.com"
                />
              </div>
              {errors.privateEmail && (
                <p className="text-sm text-[#E74C3C] mt-1 flex items-center gap-1">
                  <AlertCircle size={14} />
                  {errors.privateEmail}
                </p>
              )}
              <p className="text-xs text-gray-500 mt-1">För att ta emot inloggningsuppgifter</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Telefonnummer <span className="text-[#E74C3C]">*</span>
              </label>
              <div className="relative">
                <Phone size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:ring-1 focus:ring-[#003D5C] outline-none ${
                    errors.phone ? 'border-[#E74C3C]' : 'border-gray-300 focus:border-[#003D5C]'
                  }`}
                  placeholder="+46 70 123 45 67"
                />
              </div>
              {errors.phone && (
                <p className="text-sm text-[#E74C3C] mt-1 flex items-center gap-1">
                  <AlertCircle size={14} />
                  {errors.phone}
                </p>
              )}
              <p className="text-xs text-gray-500 mt-1">Format: +46XXXXXXXXX eller 07XXXXXXXX</p>
            </div>
          </div>
        </div>

        {/* Work Information */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-[#003D5C] mb-4 flex items-center gap-2">
            <Building size={20} />
            Arbetsuppgifter
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Arbetsmail (genereras automatiskt)
              </label>
              <div className="relative">
                <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  value={workEmail}
                  readOnly
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                  placeholder="Fylls i automatiskt baserat på namn och kommun"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">Skapas automatiskt som: namn@kommun.se (används för inloggning)</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Kommun <span className="text-[#E74C3C]">*</span>
              </label>
              <select
                value={formData.municipalityId}
                onChange={(e) => handleChange('municipalityId', e.target.value)}
                className={`w-full px-4 py-2.5 border rounded-lg focus:ring-1 focus:ring-[#003D5C] outline-none bg-white ${
                  errors.municipalityId ? 'border-[#E74C3C]' : 'border-gray-300 focus:border-[#003D5C]'
                }`}
              >
                <option value="">Välj kommun</option>
                {municipalities.map(m => (
                  <option key={m.id} value={m.id}>{m.name}</option>
                ))}
              </select>
              {errors.municipalityId && (
                <p className="text-sm text-[#E74C3C] mt-1 flex items-center gap-1">
                  <AlertCircle size={14} />
                  {errors.municipalityId}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Avdelning/Enhet <span className="text-[#E74C3C]">*</span>
              </label>
              <input
                type="text"
                value={formData.department}
                onChange={(e) => handleChange('department', e.target.value)}
                className={`w-full px-4 py-2.5 border rounded-lg focus:ring-1 focus:ring-[#003D5C] outline-none ${
                  errors.department ? 'border-[#E74C3C]' : 'border-gray-300 focus:border-[#003D5C]'
                }`}
                placeholder="Socialtjänsten"
              />
              {errors.department && (
                <p className="text-sm text-[#E74C3C] mt-1 flex items-center gap-1">
                  <AlertCircle size={14} />
                  {errors.department}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Befattning <span className="text-[#E74C3C]">*</span>
              </label>
              <select
                value={formData.position}
                onChange={(e) => handleChange('position', e.target.value)}
                className={`w-full px-4 py-2.5 border rounded-lg focus:ring-1 focus:ring-[#003D5C] outline-none bg-white ${
                  errors.position ? 'border-[#E74C3C]' : 'border-gray-300 focus:border-[#003D5C]'
                }`}
              >
                <option value="">Välj befattning</option>
                {positions.map(p => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
              {errors.position && (
                <p className="text-sm text-[#E74C3C] mt-1 flex items-center gap-1">
                  <AlertCircle size={14} />
                  {errors.position}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tjänstenummer
              </label>
              <input
                type="text"
                value={formData.employeeNumber}
                onChange={(e) => handleChange('employeeNumber', e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:border-[#003D5C] focus:ring-1 focus:ring-[#003D5C] outline-none"
                placeholder="Valfritt"
              />
            </div>
          </div>
        </div>

        {/* Access Level */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-[#003D5C] mb-4 flex items-center gap-2">
            <Shield size={20} />
            Behörighetsnivå
          </h2>
          
          <div className="space-y-3">
            {[
              { value: 'viewer', label: 'Viewer', description: 'Kan söka och se volontärprofiler' },
              { value: 'approver', label: 'Approver', description: 'Kan godkänna/avvisa ansökningar och lägga till anteckningar' },
              { value: 'admin', label: 'Admin', description: 'Full åtkomst inklusive användarhantering och statistik' }
            ].map(level => (
              <label
                key={level.value}
                className={`flex items-start gap-3 p-4 border rounded-lg cursor-pointer transition ${
                  formData.accessLevel === level.value 
                    ? 'border-[#003D5C] bg-[#003D5C]/5' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <input
                  type="radio"
                  name="accessLevel"
                  value={level.value}
                  checked={formData.accessLevel === level.value}
                  onChange={(e) => handleChange('accessLevel', e.target.value as any)}
                  className="mt-1"
                />
                <div>
                  <p className="font-medium text-[#003D5C]">{level.label}</p>
                  <p className="text-sm text-gray-600">{level.description}</p>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Internal Notes */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-[#003D5C] mb-4 flex items-center gap-2">
            <FileText size={20} />
            Interna anteckningar
          </h2>
          
          <textarea
            value={formData.internalNotes}
            onChange={(e) => handleChange('internalNotes', e.target.value)}
            rows={4}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:border-[#003D5C] focus:ring-1 focus:ring-[#003D5C] outline-none resize-none"
            placeholder="Valfria anteckningar som endast syns för administratörer..."
          />
        </div>

        {/* Submit Error */}
        {errors.submit && (
          <div className="bg-[#E74C3C]/10 border border-[#E74C3C] text-[#E74C3C] px-4 py-3 rounded-lg flex items-center gap-2">
            <AlertCircle size={20} />
            {errors.submit}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-end gap-3">
          <Link
            href="/admin/social-workers"
            className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
          >
            Avbryt
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2.5 bg-[#F39C12] hover:bg-[#E67E22] text-white rounded-lg transition font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Skickar inbjudan...
              </>
            ) : (
              <>
                <Check size={20} />
                Skicka inbjudan
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
