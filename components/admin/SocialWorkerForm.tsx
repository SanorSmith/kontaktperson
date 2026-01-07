// ============================================
// Admin Component: Add Social Worker Form
// ============================================

'use client';

import { useState } from 'react';
import { createSocialWorkerInvitation, validateWorkEmailDomain, type CreateInvitationInput } from '@/lib/auth/socialWorkerInvitation';

interface SocialWorkerFormProps {
  adminId: string;
  onSuccess?: (socialWorkerId: string) => void;
  onCancel?: () => void;
}

const SWEDISH_MUNICIPALITIES = [
  'stockholm', 'goteborg', 'malmo', 'uppsala', 'linkoping', 'orebro', 'vasteras',
  'helsingborg', 'norrkoping', 'jonkoping', 'umea', 'lund', 'boras', 'sundsvall', 'gavle'
];

const POSITIONS = [
  'Socialsekreterare',
  'Teamledare',
  'Enhetschef',
  'Chef',
  'Handläggare',
  'Biträdande chef'
];

export default function SocialWorkerForm({ adminId, onSuccess, onCancel }: SocialWorkerFormProps) {
  const [formData, setFormData] = useState<Partial<CreateInvitationInput>>({
    admin_id: adminId,
    access_level: 'viewer'
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
    
    // Real-time validation for work email
    if (name === 'work_email' && value) {
      if (!validateWorkEmailDomain(value)) {
        setErrors(prev => ({
          ...prev,
          work_email: 'Arbetsmail måste vara från en godkänd kommundomän'
        }));
      }
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name?.trim()) {
      newErrors.name = 'Namn är obligatoriskt';
    }
    
    if (!formData.email?.trim()) {
      newErrors.email = 'E-postadress är obligatorisk';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Ogiltig e-postadress';
    }
    
    if (!formData.work_email?.trim()) {
      newErrors.work_email = 'Arbetsmail är obligatoriskt';
    } else if (!validateWorkEmailDomain(formData.work_email)) {
      newErrors.work_email = 'Arbetsmail måste vara från en godkänd kommundomän (@kommun.se, @stockholm.se, etc.)';
    }
    
    if (!formData.phone?.trim()) {
      newErrors.phone = 'Telefonnummer är obligatoriskt';
    }
    
    if (!formData.municipality) {
      newErrors.municipality = 'Kommun är obligatorisk';
    }
    
    if (!formData.department?.trim()) {
      newErrors.department = 'Avdelning är obligatorisk';
    }
    
    if (!formData.position) {
      newErrors.position = 'Befattning är obligatorisk';
    }
    
    if (!formData.access_level) {
      newErrors.access_level = 'Behörighetsnivå är obligatorisk';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    setSubmitMessage(null);
    
    try {
      const result = await createSocialWorkerInvitation(formData as CreateInvitationInput);
      
      if (result.success && result.social_worker_id) {
        setSubmitMessage({
          type: 'success',
          text: `Inbjudan skickad till ${formData.name}! Ett mail har skickats till ${formData.work_email}.`
        });
        
        // Reset form
        setTimeout(() => {
          if (onSuccess) {
            onSuccess(result.social_worker_id!);
          }
        }, 2000);
      } else {
        setSubmitMessage({
          type: 'error',
          text: result.error || 'Kunde inte skapa inbjudan'
        });
      }
    } catch (error) {
      setSubmitMessage({
        type: 'error',
        text: 'Ett oväntat fel uppstod. Försök igen.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#003D5C] to-[#006B7D] px-8 py-6">
          <h1 className="text-2xl font-bold text-white">Lägg till socialsekreterare</h1>
          <p className="text-white/80 mt-2">Skicka en inbjudan till en ny socialsekreterare</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          {/* Success/Error Message */}
          {submitMessage && (
            <div className={`p-4 rounded-lg ${
              submitMessage.type === 'success' 
                ? 'bg-green-50 border border-green-200 text-green-800' 
                : 'bg-red-50 border border-red-200 text-red-800'
            }`}>
              <p className="font-medium">{submitMessage.text}</p>
            </div>
          )}

          {/* Personal Information */}
          <div>
            <h2 className="text-lg font-semibold text-[#003D5C] mb-4 flex items-center gap-2">
              <span>👤</span> Personuppgifter
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fullständigt namn <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name || ''}
                  onChange={handleChange}
                  className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 ${
                    errors.name 
                      ? 'border-red-300 focus:ring-red-500' 
                      : 'border-gray-300 focus:ring-[#006B7D]'
                  }`}
                  placeholder="Anna Andersson"
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  E-postadress <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email || ''}
                  onChange={handleChange}
                  className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 ${
                    errors.email 
                      ? 'border-red-300 focus:ring-red-500' 
                      : 'border-gray-300 focus:ring-[#006B7D]'
                  }`}
                  placeholder="anna@example.com"
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                <p className="text-xs text-gray-500 mt-1">Personlig e-post för kontakt</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Arbetsmail <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="work_email"
                  value={formData.work_email || ''}
                  onChange={handleChange}
                  className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 ${
                    errors.work_email 
                      ? 'border-red-300 focus:ring-red-500' 
                      : 'border-gray-300 focus:ring-[#006B7D]'
                  }`}
                  placeholder="anna.andersson@stockholm.se"
                />
                {errors.work_email && <p className="text-red-500 text-sm mt-1">{errors.work_email}</p>}
                <p className="text-xs text-gray-500 mt-1">Måste vara @kommun.se eller liknande</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Telefonnummer <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone || ''}
                  onChange={handleChange}
                  className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 ${
                    errors.phone 
                      ? 'border-red-300 focus:ring-red-500' 
                      : 'border-gray-300 focus:ring-[#006B7D]'
                  }`}
                  placeholder="+46701234567"
                />
                {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
              </div>
            </div>
          </div>

          {/* Work Information */}
          <div>
            <h2 className="text-lg font-semibold text-[#003D5C] mb-4 flex items-center gap-2">
              <span>🏢</span> Arbetsuppgifter
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kommun <span className="text-red-500">*</span>
                </label>
                <select
                  name="municipality"
                  value={formData.municipality || ''}
                  onChange={handleChange}
                  className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 ${
                    errors.municipality 
                      ? 'border-red-300 focus:ring-red-500' 
                      : 'border-gray-300 focus:ring-[#006B7D]'
                  }`}
                >
                  <option value="">Välj kommun</option>
                  {SWEDISH_MUNICIPALITIES.map(mun => (
                    <option key={mun} value={mun}>
                      {mun.charAt(0).toUpperCase() + mun.slice(1)}
                    </option>
                  ))}
                </select>
                {errors.municipality && <p className="text-red-500 text-sm mt-1">{errors.municipality}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Avdelning/Enhet <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="department"
                  value={formData.department || ''}
                  onChange={handleChange}
                  className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 ${
                    errors.department 
                      ? 'border-red-300 focus:ring-red-500' 
                      : 'border-gray-300 focus:ring-[#006B7D]'
                  }`}
                  placeholder="Socialförvaltning"
                />
                {errors.department && <p className="text-red-500 text-sm mt-1">{errors.department}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tjänstenummer
                </label>
                <input
                  type="text"
                  name="employee_id"
                  value={formData.employee_id || ''}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006B7D]"
                  placeholder="EMP001"
                />
                <p className="text-xs text-gray-500 mt-1">Valfritt - för verifiering</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Befattning <span className="text-red-500">*</span>
                </label>
                <select
                  name="position"
                  value={formData.position || ''}
                  onChange={handleChange}
                  className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 ${
                    errors.position 
                      ? 'border-red-300 focus:ring-red-500' 
                      : 'border-gray-300 focus:ring-[#006B7D]'
                  }`}
                >
                  <option value="">Välj befattning</option>
                  {POSITIONS.map(pos => (
                    <option key={pos} value={pos}>{pos}</option>
                  ))}
                </select>
                {errors.position && <p className="text-red-500 text-sm mt-1">{errors.position}</p>}
              </div>
            </div>
          </div>

          {/* Access Level */}
          <div>
            <h2 className="text-lg font-semibold text-[#003D5C] mb-4 flex items-center gap-2">
              <span>🔐</span> Behörighetsnivå
            </h2>
            <div className="space-y-3">
              <label className="flex items-start gap-3 p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-[#006B7D] transition">
                <input
                  type="radio"
                  name="access_level"
                  value="viewer"
                  checked={formData.access_level === 'viewer'}
                  onChange={handleChange}
                  className="mt-1"
                />
                <div>
                  <p className="font-medium text-gray-900">Läsare (Viewer)</p>
                  <p className="text-sm text-gray-600">Kan söka och visa godkända volontärer</p>
                </div>
              </label>

              <label className="flex items-start gap-3 p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-[#006B7D] transition">
                <input
                  type="radio"
                  name="access_level"
                  value="approver"
                  checked={formData.access_level === 'approver'}
                  onChange={handleChange}
                  className="mt-1"
                />
                <div>
                  <p className="font-medium text-gray-900">Godkännare (Approver)</p>
                  <p className="text-sm text-gray-600">Kan godkänna/avslå ansökningar och skapa uppdrag</p>
                </div>
              </label>

              <label className="flex items-start gap-3 p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-[#006B7D] transition">
                <input
                  type="radio"
                  name="access_level"
                  value="admin"
                  checked={formData.access_level === 'admin'}
                  onChange={handleChange}
                  className="mt-1"
                />
                <div>
                  <p className="font-medium text-gray-900">Administratör (Admin)</p>
                  <p className="text-sm text-gray-600">Full behörighet för kommunen</p>
                </div>
              </label>
            </div>
            {errors.access_level && <p className="text-red-500 text-sm mt-2">{errors.access_level}</p>}
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Interna anteckningar
            </label>
            <textarea
              name="notes"
              value={formData.notes || ''}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006B7D]"
              placeholder="Valfria anteckningar om denna användare..."
            />
            <p className="text-xs text-gray-500 mt-1">Endast synligt för administratörer</p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4 border-t border-gray-200">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-[#F39C12] text-white py-3 px-6 rounded-lg font-semibold hover:bg-[#E67E22] disabled:bg-gray-300 disabled:cursor-not-allowed transition shadow-md hover:shadow-lg"
            >
              {isSubmitting ? 'Skickar inbjudan...' : '📧 Skicka inbjudan'}
            </button>
            
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                disabled={isSubmitting}
                className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                Avbryt
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
