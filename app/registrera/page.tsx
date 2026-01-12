'use client';

import { useState } from 'react';
import { Users, ArrowLeft, ArrowRight, CheckCircle, User, MapPin, Clock, Heart, FileText, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Initialize Supabase client only if credentials are available
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

let supabase: SupabaseClient | null = null;
if (supabaseUrl && supabaseAnonKey && supabaseUrl.startsWith('http')) {
  supabase = createClient(supabaseUrl, supabaseAnonKey);
}

const municipalities = [
  'Stockholm', 'Göteborg', 'Malmö', 'Uppsala', 'Linköping', 'Örebro', 'Västerås', 
  'Helsingborg', 'Norrköping', 'Jönköping', 'Umeå', 'Lund', 'Borås', 'Huddinge',
  'Eskilstuna', 'Gävle', 'Södertälje', 'Karlstad', 'Täby', 'Växjö'
];

const languages = [
  'Svenska', 'Engelska', 'Arabiska', 'Persiska/Dari', 'Somaliska', 'Tigrinja',
  'Spanska', 'Franska', 'Tyska', 'Polska', 'Ryska', 'Turkiska', 'Kurdiska', 'Finska'
];

const interests = [
  'Sport & Friluftsliv', 'Musik', 'Konst & Hantverk', 'Matlagning', 'Spel & Gaming',
  'Film & Serier', 'Läsning', 'Djur', 'Teknik', 'Natur', 'Resor', 'Fotografi'
];

export default function RegistreraPage() {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    birthYear: '',
    municipality: '',
    address: '',
    postalCode: '',
    languages: [] as string[],
    interests: [] as string[],
    experience: '',
    motivation: '',
    availability: [] as string[],
    hasDriversLicense: false,
    hasCar: false,
    acceptsBackgroundCheck: false,
    acceptsTerms: false
  });

  const updateField = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleArrayField = (field: 'languages' | 'interests', value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter(v => v !== value)
        : [...prev[field], value]
    }));
  };

  const nextStep = () => setStep(prev => Math.min(prev + 1, 5));
  const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError('');

    try {
      // Calculate age from birth year
      const currentYear = new Date().getFullYear();
      const age = currentYear - parseInt(formData.birthYear);

      // Check if Supabase is configured
      if (supabase) {
        // Insert volunteer application into Supabase
        const { data, error } = await supabase
          .from('volunteers')
          .insert({
            full_name: `${formData.firstName} ${formData.lastName}`,
            email: formData.email,
            phone: formData.phone,
            birth_year: parseInt(formData.birthYear),
            age: age,
            municipality: formData.municipality,
            address: formData.address,
            postal_code: formData.postalCode,
            languages: formData.languages,
            interests: formData.interests,
            experience: formData.experience,
            motivation: formData.motivation,
            availability: formData.availability,
            has_drivers_license: formData.hasDriversLicense,
            has_car: formData.hasCar,
            accepts_background_check: formData.acceptsBackgroundCheck,
            accepts_terms: formData.acceptsTerms,
            status: 'pending',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .select();

        if (error) {
          console.error('Supabase error:', error);
          throw new Error(error.message);
        }

        console.log('Volunteer application saved:', data);
      } else {
        // Demo mode - just log the data
        console.log('Demo mode - Application data:', {
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          municipality: formData.municipality
        });
      }

      setStep(6); // Success step
    } catch (error: any) {
      console.error('Error submitting application:', error);
      setSubmitError(error.message || 'Ett fel uppstod. Försök igen.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      {/* Header */}
      <header className="bg-[#003D5C] text-white py-4 px-6 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-3 hover:opacity-90 transition">
          <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
            <Users size={20} className="text-white" />
          </div>
          <span className="font-bold text-lg">Kontaktperson Platform</span>
        </Link>
        
        <Link 
          href="/for-volontarer"
          className="text-white/80 hover:text-white text-sm flex items-center gap-2 transition"
        >
          <ArrowLeft size={16} />
          Tillbaka till information
        </Link>
      </header>

      <div className="max-w-3xl mx-auto py-8 px-4">
        {/* Progress Steps */}
        {step < 6 && (
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              {[1, 2, 3, 4, 5].map((s) => (
                <div key={s} className="flex items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                    s < step ? 'bg-[#006B7D] text-white' :
                    s === step ? 'bg-[#F39C12] text-white' :
                    'bg-gray-200 text-gray-500'
                  }`}>
                    {s < step ? <CheckCircle size={20} /> : s}
                  </div>
                  {s < 5 && (
                    <div className={`w-12 md:w-24 h-1 mx-2 ${
                      s < step ? 'bg-[#006B7D]' : 'bg-gray-200'
                    }`} />
                  )}
                </div>
              ))}
            </div>
            <div className="text-center text-sm text-gray-600">
              Steg {step} av 5: {
                step === 1 ? 'Personuppgifter' :
                step === 2 ? 'Kontaktinformation' :
                step === 3 ? 'Språk & Intressen' :
                step === 4 ? 'Erfarenhet & Motivation' :
                'Bekräftelse'
              }
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Step 1: Personal Info */}
          {step === 1 && (
            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-[#F39C12]/10 rounded-full flex items-center justify-center">
                  <User size={24} className="text-[#F39C12]" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-[#003D5C]">Personuppgifter</h2>
                  <p className="text-gray-600">Berätta lite om dig själv</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Förnamn *</label>
                    <input
                      type="text"
                      required
                      value={formData.firstName}
                      onChange={(e) => updateField('firstName', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-[#006B7D] focus:ring-1 focus:ring-[#006B7D] outline-none"
                      placeholder="Ditt förnamn"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Efternamn *</label>
                    <input
                      type="text"
                      required
                      value={formData.lastName}
                      onChange={(e) => updateField('lastName', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-[#006B7D] focus:ring-1 focus:ring-[#006B7D] outline-none"
                      placeholder="Ditt efternamn"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Födelseår *</label>
                  <input
                    type="number"
                    required
                    min="1940"
                    max="2006"
                    value={formData.birthYear}
                    onChange={(e) => updateField('birthYear', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-[#006B7D] focus:ring-1 focus:ring-[#006B7D] outline-none"
                    placeholder="T.ex. 1985"
                  />
                  <p className="text-xs text-gray-500 mt-1">Du måste vara minst 18 år för att bli kontaktperson</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Kommun *</label>
                  <select
                    required
                    value={formData.municipality}
                    onChange={(e) => updateField('municipality', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-[#006B7D] focus:ring-1 focus:ring-[#006B7D] outline-none"
                  >
                    <option value="">Välj din kommun</option>
                    {municipalities.map(m => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mt-8 flex justify-end">
                <button
                  type="button"
                  onClick={nextStep}
                  className="bg-[#F39C12] hover:bg-[#E67E22] text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition"
                >
                  Nästa
                  <ArrowRight size={20} />
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Contact Info */}
          {step === 2 && (
            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-[#006B7D]/10 rounded-full flex items-center justify-center">
                  <MapPin size={24} className="text-[#006B7D]" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-[#003D5C]">Kontaktinformation</h2>
                  <p className="text-gray-600">Hur kan vi nå dig?</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">E-postadress *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => updateField('email', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-[#006B7D] focus:ring-1 focus:ring-[#006B7D] outline-none"
                    placeholder="din.email@exempel.se"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Telefonnummer *</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => updateField('phone', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-[#006B7D] focus:ring-1 focus:ring-[#006B7D] outline-none"
                    placeholder="070-123 45 67"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Adress</label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => updateField('address', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-[#006B7D] focus:ring-1 focus:ring-[#006B7D] outline-none"
                    placeholder="Gatuadress"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Postnummer</label>
                  <input
                    type="text"
                    value={formData.postalCode}
                    onChange={(e) => updateField('postalCode', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-[#006B7D] focus:ring-1 focus:ring-[#006B7D] outline-none"
                    placeholder="123 45"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4 pt-4">
                  <label className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="checkbox"
                      checked={formData.hasDriversLicense}
                      onChange={(e) => updateField('hasDriversLicense', e.target.checked)}
                      className="w-5 h-5 text-[#006B7D] rounded"
                    />
                    <span className="text-gray-700">Jag har körkort</span>
                  </label>
                  <label className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="checkbox"
                      checked={formData.hasCar}
                      onChange={(e) => updateField('hasCar', e.target.checked)}
                      className="w-5 h-5 text-[#006B7D] rounded"
                    />
                    <span className="text-gray-700">Jag har tillgång till bil</span>
                  </label>
                </div>
              </div>

              <div className="mt-8 flex justify-between">
                <button
                  type="button"
                  onClick={prevStep}
                  className="text-gray-600 hover:text-gray-800 px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition"
                >
                  <ArrowLeft size={20} />
                  Tillbaka
                </button>
                <button
                  type="button"
                  onClick={nextStep}
                  className="bg-[#F39C12] hover:bg-[#E67E22] text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition"
                >
                  Nästa
                  <ArrowRight size={20} />
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Languages & Interests */}
          {step === 3 && (
            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-[#F39C12]/10 rounded-full flex items-center justify-center">
                  <Heart size={24} className="text-[#F39C12]" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-[#003D5C]">Språk & Intressen</h2>
                  <p className="text-gray-600">Vad kan du och vad tycker du om?</p>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Vilka språk talar du? *</label>
                  <div className="flex flex-wrap gap-2">
                    {languages.map(lang => (
                      <button
                        key={lang}
                        type="button"
                        onClick={() => toggleArrayField('languages', lang)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                          formData.languages.includes(lang)
                            ? 'bg-[#006B7D] text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {lang}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Vilka intressen har du? *</label>
                  <div className="flex flex-wrap gap-2">
                    {interests.map(interest => (
                      <button
                        key={interest}
                        type="button"
                        onClick={() => toggleArrayField('interests', interest)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                          formData.interests.includes(interest)
                            ? 'bg-[#F39C12] text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {interest}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-8 flex justify-between">
                <button
                  type="button"
                  onClick={prevStep}
                  className="text-gray-600 hover:text-gray-800 px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition"
                >
                  <ArrowLeft size={20} />
                  Tillbaka
                </button>
                <button
                  type="button"
                  onClick={nextStep}
                  className="bg-[#F39C12] hover:bg-[#E67E22] text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition"
                >
                  Nästa
                  <ArrowRight size={20} />
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Experience & Motivation */}
          {step === 4 && (
            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-[#006B7D]/10 rounded-full flex items-center justify-center">
                  <FileText size={24} className="text-[#006B7D]" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-[#003D5C]">Erfarenhet & Motivation</h2>
                  <p className="text-gray-600">Berätta mer om dig</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Har du erfarenhet av att arbeta med barn/unga?
                  </label>
                  <textarea
                    value={formData.experience}
                    onChange={(e) => updateField('experience', e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-[#006B7D] focus:ring-1 focus:ring-[#006B7D] outline-none resize-none"
                    placeholder="Beskriv eventuell erfarenhet från arbete, studier eller privatliv..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Varför vill du bli kontaktperson? *
                  </label>
                  <textarea
                    required
                    value={formData.motivation}
                    onChange={(e) => updateField('motivation', e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-[#006B7D] focus:ring-1 focus:ring-[#006B7D] outline-none resize-none"
                    placeholder="Berätta vad som motiverar dig och vad du hoppas kunna bidra med..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    När är du tillgänglig? *
                  </label>
                  <div className="flex items-center gap-3 mb-3">
                    <Clock size={20} className="text-gray-400" />
                    <span className="text-sm text-gray-600">Välj alla tider som passar dig</span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {['Vardagar', 'Kvällar', 'Helger', 'Flexibelt'].map((time) => (
                      <label
                        key={time}
                        className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition ${
                          formData.availability.includes(time)
                            ? 'border-[#006B7D] bg-[#006B7D]/5'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={formData.availability.includes(time)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              updateField('availability', [...formData.availability, time]);
                            } else {
                              updateField('availability', formData.availability.filter((t: string) => t !== time));
                            }
                          }}
                          className="w-4 h-4 text-[#006B7D] rounded"
                        />
                        <span className="text-gray-700">{time}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-8 flex justify-between">
                <button
                  type="button"
                  onClick={prevStep}
                  className="text-gray-600 hover:text-gray-800 px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition"
                >
                  <ArrowLeft size={20} />
                  Tillbaka
                </button>
                <button
                  type="button"
                  onClick={nextStep}
                  className="bg-[#F39C12] hover:bg-[#E67E22] text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition"
                >
                  Nästa
                  <ArrowRight size={20} />
                </button>
              </div>
            </div>
          )}

          {/* Step 5: Confirmation */}
          {step === 5 && (
            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-[#006B7D]/10 rounded-full flex items-center justify-center">
                  <CheckCircle size={24} className="text-[#006B7D]" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-[#003D5C]">Bekräftelse</h2>
                  <p className="text-gray-600">Granska och skicka in din ansökan</p>
                </div>
              </div>

              <div className="bg-[#F8F9FA] rounded-lg p-6 mb-6">
                <h3 className="font-bold text-[#003D5C] mb-4">Sammanfattning</h3>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Namn:</span>
                    <span className="ml-2 text-gray-800">{formData.firstName} {formData.lastName}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Kommun:</span>
                    <span className="ml-2 text-gray-800">{formData.municipality}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">E-post:</span>
                    <span className="ml-2 text-gray-800">{formData.email}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Telefon:</span>
                    <span className="ml-2 text-gray-800">{formData.phone}</span>
                  </div>
                  <div className="md:col-span-2">
                    <span className="text-gray-500">Språk:</span>
                    <span className="ml-2 text-gray-800">{formData.languages.join(', ') || 'Ej angivet'}</span>
                  </div>
                  <div className="md:col-span-2">
                    <span className="text-gray-500">Intressen:</span>
                    <span className="ml-2 text-gray-800">{formData.interests.join(', ') || 'Ej angivet'}</span>
                  </div>
                  <div className="md:col-span-2">
                    <span className="text-gray-500">Tillgänglighet:</span>
                    <span className="ml-2 text-gray-800">{formData.availability.join(', ') || 'Ej angivet'}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <label className="flex items-start gap-3 p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="checkbox"
                    required
                    checked={formData.acceptsBackgroundCheck}
                    onChange={(e) => updateField('acceptsBackgroundCheck', e.target.checked)}
                    className="w-5 h-5 text-[#006B7D] rounded mt-0.5"
                  />
                  <span className="text-gray-700 text-sm">
                    Jag godkänner att socialtjänsten gör en bakgrundskontroll och begär utdrag ur belastningsregistret. *
                  </span>
                </label>

                <label className="flex items-start gap-3 p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="checkbox"
                    required
                    checked={formData.acceptsTerms}
                    onChange={(e) => updateField('acceptsTerms', e.target.checked)}
                    className="w-5 h-5 text-[#006B7D] rounded mt-0.5"
                  />
                  <span className="text-gray-700 text-sm">
                    Jag har läst och godkänner villkoren för att bli kontaktperson. Jag förstår att min ansökan 
                    kommer att granskas av socialtjänsten. *
                  </span>
                </label>
              </div>

              {submitError && (
                <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start gap-3">
                  <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
                  <span className="text-sm">{submitError}</span>
                </div>
              )}

              <div className="mt-8 flex justify-between">
                <button
                  type="button"
                  onClick={prevStep}
                  disabled={isSubmitting}
                  className="text-gray-600 hover:text-gray-800 px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition disabled:opacity-50"
                >
                  <ArrowLeft size={20} />
                  Tillbaka
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-[#006B7D] hover:bg-[#005a6a] disabled:bg-gray-400 text-white px-8 py-3 rounded-lg font-semibold flex items-center gap-2 transition"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Skickar...
                    </>
                  ) : (
                    <>
                      Skicka ansökan
                      <CheckCircle size={20} />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Step 6: Success */}
          {step === 6 && (
            <div className="bg-white rounded-xl shadow-lg p-8 text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle size={40} className="text-green-600" />
              </div>
              <h2 className="text-3xl font-bold text-[#003D5C] mb-4">Tack för din ansökan!</h2>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Vi har tagit emot din ansökan om att bli kontaktperson. En socialsekreterare 
                kommer att granska din ansökan och kontakta dig inom 2-3 veckor.
              </p>
              <div className="bg-[#E8F4F8] rounded-lg p-4 mb-8 max-w-md mx-auto">
                <p className="text-sm text-[#003D5C]">
                  <strong>Vad händer nu?</strong><br />
                  1. Din ansökan granskas<br />
                  2. Du blir kontaktad för intervju<br />
                  3. Bakgrundskontroll genomförs<br />
                  4. Du får utbildning<br />
                  5. Du matchas med ett barn
                </p>
              </div>
              <Link
                href="/"
                className="inline-flex items-center gap-2 bg-[#003D5C] hover:bg-[#004e75] text-white px-6 py-3 rounded-lg font-semibold transition"
              >
                Tillbaka till startsidan
              </Link>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
