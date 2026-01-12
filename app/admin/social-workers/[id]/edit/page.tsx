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
  Shield,
  FileText,
  Check,
  AlertCircle
} from 'lucide-react';

interface FormData {
  fullName: string;
  email: string;
  workEmail: string;
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

export default function EditSocialWorkerPage() {
  const params = useParams();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    workEmail: '',
    phone: '',
    municipalityId: '',
    department: '',
    position: '',
    employeeNumber: '',
    accessLevel: 'viewer',
    internalNotes: ''
  });

  useEffect(() => {
    // Load existing data
    setTimeout(() => {
      setFormData({
        fullName: 'Anna Svensson',
        email: 'anna@gmail.com',
        workEmail: 'anna.svensson@stockholm.se',
        phone: '+46 70 123 45 67',
        municipalityId: '1',
        department: 'Socialtjänsten',
        position: 'Socialsekreterare',
        employeeNumber: 'EMP-2024-001',
        accessLevel: 'approver',
        internalNotes: 'Erfaren socialsekreterare med 5 års erfarenhet.'
      });
      setIsLoading(false);
    }, 500);
  }, [params.id]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Fullständigt namn krävs';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'E-postadress krävs';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Ogiltig e-postadress';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Telefonnummer krävs';
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
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Updating social worker:', formData);
      router.push(`/admin/social-workers/${params.id}?updated=true`);
    } catch (error) {
      console.error('Error updating social worker:', error);
      setErrors({ submit: 'Ett fel uppstod. Försök igen.' });
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-12 h-12 border-4 border-[#003D5C] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <Link
          href={`/admin/social-workers/${params.id}`}
          className="inline-flex items-center gap-2 text-gray-600 hover:text-[#003D5C] mb-4"
        >
          <ArrowLeft size={20} />
          Tillbaka till profil
        </Link>
        <h1 className="text-2xl font-bold text-[#003D5C]">Redigera socialsekreterare</h1>
        <p className="text-gray-600">Uppdatera uppgifterna för {formData.fullName}</p>
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
                E-postadress <span className="text-[#E74C3C]">*</span>
              </label>
              <div className="relative">
                <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:ring-1 focus:ring-[#003D5C] outline-none ${
                    errors.email ? 'border-[#E74C3C]' : 'border-gray-300 focus:border-[#003D5C]'
                  }`}
                />
              </div>
              {errors.email && (
                <p className="text-sm text-[#E74C3C] mt-1 flex items-center gap-1">
                  <AlertCircle size={14} />
                  {errors.email}
                </p>
              )}
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
                />
              </div>
              {errors.phone && (
                <p className="text-sm text-[#E74C3C] mt-1 flex items-center gap-1">
                  <AlertCircle size={14} />
                  {errors.phone}
                </p>
              )}
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
                Arbetsmail
              </label>
              <div className="relative">
                <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  value={formData.workEmail}
                  disabled
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">Arbetsmail kan inte ändras efter verifiering</p>
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
            href={`/admin/social-workers/${params.id}`}
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
                Sparar...
              </>
            ) : (
              <>
                <Check size={20} />
                Spara ändringar
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
