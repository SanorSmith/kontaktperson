'use client';

import { Users, Search, Shield, FileCheck, MapPin, Filter, Bell, CheckCircle, ArrowRight, Lock } from 'lucide-react';
import Link from 'next/link';

export default function ForSocialsekreterarePage() {
  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      {/* Header */}
      <header className="bg-[#003D5C] text-white py-3 px-4 md:py-4 md:px-6 flex justify-between items-center sticky top-0 z-50">
        <Link href="/" className="flex items-center gap-2 md:gap-3 hover:opacity-90 transition">
          <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-white/10 flex items-center justify-center">
            <Users size={18} className="text-white md:hidden" />
            <Users size={20} className="text-white hidden md:block" />
          </div>
          <span className="font-bold text-base md:text-lg">Kontaktperson Platform</span>
        </Link>
        
        <nav className="hidden md:flex gap-6 text-sm font-medium text-white/90">
          <Link href="/" className="hover:text-white transition">Karta</Link>
          <Link href="/for-volontarer" className="hover:text-white transition">För Volontärer</Link>
          <Link href="/for-socialsekreterare" className="text-white border-b-2 border-[#F39C12]">För Socialsekreterare</Link>
        </nav>

        <div className="flex gap-2 md:gap-3">
          <Link 
            href="/login"
            className="bg-white text-[#003D5C] px-3 py-1.5 md:px-4 md:py-2 rounded-lg text-xs md:text-sm font-semibold hover:shadow-lg transition"
          >
            Logga in
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#003D5C] to-[#006B7D] text-white py-12 md:py-24 px-4 md:px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 md:w-16 md:h-16 bg-white/10 backdrop-blur-sm rounded-2xl mb-4 md:mb-6">
            <Shield size={20} className="text-white md:hidden" strokeWidth={1.5} />
            <Shield size={24} className="text-white hidden md:block" strokeWidth={1.5} />
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6 tracking-tight px-2">För Socialsekreterare</h1>
          <p className="text-base md:text-lg text-white/80 mb-6 md:mb-10 max-w-2xl mx-auto leading-relaxed px-2">
            Hitta rätt kontaktperson för dina klienter. Vår plattform ger dig tillgång till 
            granskade volontärer i hela Sverige med kraftfulla sök- och filtreringsverktyg.
          </p>
          <Link 
            href="/login"
            className="inline-flex items-center gap-2 bg-white text-[#003D5C] px-6 py-3 md:px-8 md:py-3.5 rounded-xl text-sm md:text-base font-semibold transition hover:shadow-xl"
          >
            <Search size={16} strokeWidth={2} className="md:hidden" />
            <Search size={18} strokeWidth={2} className="hidden md:block" />
            Sök volontärer
            <ArrowRight size={14} strokeWidth={2} className="md:hidden" />
            <ArrowRight size={16} strokeWidth={2} className="hidden md:block" />
          </Link>
        </div>
      </section>

      {/* What We Offer */}
      <section className="py-12 md:py-16 px-4 md:px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-[#003D5C] mb-6 md:mb-8 text-center">Vad erbjuder plattformen?</h2>
          
          <div className="prose prose-lg max-w-none text-gray-700">
            <p className="text-lg leading-relaxed mb-6">
              Kontaktperson Platform är ett digitalt verktyg utvecklat specifikt för socialsekreterare 
              som arbetar med att matcha barn och unga med lämpliga kontaktpersoner. Plattformen 
              samlar alla registrerade volontärer på ett ställe och ger dig möjlighet att snabbt 
              hitta rätt person för varje unikt behov.
            </p>
            
            <p className="text-lg leading-relaxed mb-6">
              Endast verifierade socialsekreterare med kommunal e-postadress har tillgång till 
              plattformens sökfunktioner och volontärprofiler. Detta säkerställer att känslig 
              information hanteras på ett säkert och professionellt sätt.
            </p>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-12 md:py-16 px-4 md:px-6 bg-[#F8F9FA]">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-[#003D5C] mb-8 md:mb-12 text-center">Funktioner i dashboarden</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="bg-white rounded-2xl p-8 border border-gray-100 hover:border-gray-200 transition">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-[#006B7D]/5 rounded-xl mb-5">
                <MapPin size={20} className="text-[#006B7D]" strokeWidth={1.5} />
              </div>
              <h3 className="text-lg font-semibold text-[#003D5C] mb-3">Interaktiv Sverigekarta</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Sök volontärer direkt på kartan. Klicka på en kommun för att se tillgängliga 
                kontaktpersoner i området. Visualisera täckning och hitta volontärer nära dina klienter.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white rounded-2xl p-8 border border-gray-100 hover:border-gray-200 transition">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-[#F39C12]/5 rounded-xl mb-5">
                <Filter size={20} className="text-[#F39C12]" strokeWidth={1.5} />
              </div>
              <h3 className="text-xl font-bold text-[#003D5C] mb-3">Avancerad filtrering</h3>
              <p className="text-gray-600">
                Filtrera volontärer efter kommun, språkkunskaper, erfarenhet, tillgänglighet, 
                intressen och mer. Hitta exakt rätt matchning för varje barns behov.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition">
              <div className="w-14 h-14 bg-[#003D5C]/10 rounded-full flex items-center justify-center mb-4">
                <FileCheck size={28} className="text-[#003D5C]" />
              </div>
              <h3 className="text-xl font-bold text-[#003D5C] mb-3">Granska ansökningar</h3>
              <p className="text-gray-600">
                Se alla inkomna volontäransökningar. Granska profiler, bakgrundsinformation 
                och referenser. Godkänn eller avslå ansökningar direkt i systemet.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition">
              <div className="w-14 h-14 bg-[#006B7D]/10 rounded-full flex items-center justify-center mb-4">
                <Shield size={28} className="text-[#006B7D]" />
              </div>
              <h3 className="text-xl font-bold text-[#003D5C] mb-3">Bakgrundskontroller</h3>
              <p className="text-gray-600">
                Spåra status för bakgrundskontroller och belastningsregisterutdrag. 
                Markera när kontroller är genomförda och godkända.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition">
              <div className="w-14 h-14 bg-[#F39C12]/10 rounded-full flex items-center justify-center mb-4">
                <Bell size={28} className="text-[#F39C12]" />
              </div>
              <h3 className="text-xl font-bold text-[#003D5C] mb-3">Notifikationer</h3>
              <p className="text-gray-600">
                Få automatiska notifikationer när nya volontärer registrerar sig i din kommun, 
                när ansökningar behöver granskas eller när åtgärder krävs.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition">
              <div className="w-14 h-14 bg-[#003D5C]/10 rounded-full flex items-center justify-center mb-4">
                <CheckCircle size={28} className="text-[#003D5C]" />
              </div>
              <h3 className="text-xl font-bold text-[#003D5C] mb-3">Interna anteckningar</h3>
              <p className="text-gray-600">
                Lägg till interna anteckningar på volontärprofiler. Dokumentera intervjuer, 
                observationer och annan relevant information som bara syns för behöriga.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How to Access */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-[#003D5C] mb-8 text-center">Hur får jag tillgång?</h2>
          
          <div className="bg-gradient-to-r from-[#003D5C] to-[#006B7D] rounded-2xl p-8 text-white">
            <div className="flex items-start gap-4 mb-6">
              <Lock size={32} className="text-[#F39C12] flex-shrink-0" />
              <div>
                <h3 className="text-xl font-bold mb-2">Säker inloggning för kommunanställda</h3>
                <p className="text-white/90">
                  Plattformen är endast tillgänglig för socialsekreterare och andra behöriga 
                  inom kommunens socialtjänst. Du loggar in med din kommunala e-postadress.
                </p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex gap-4 items-start">
                <div className="w-8 h-8 bg-[#F39C12] rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                  1
                </div>
                <div>
                  <h4 className="font-bold">Registrera dig med din arbetsmail</h4>
                  <p className="text-white/80 text-sm">
                    Använd din kommunala e-postadress (t.ex. namn@kommun.se) för att skapa ett konto.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="w-8 h-8 bg-[#F39C12] rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                  2
                </div>
                <div>
                  <h4 className="font-bold">Verifiera din identitet</h4>
                  <p className="text-white/80 text-sm">
                    Du får en verifieringslänk till din e-post. Klicka på länken för att aktivera ditt konto.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="w-8 h-8 bg-[#F39C12] rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                  3
                </div>
                <div>
                  <h4 className="font-bold">Få tillgång till dashboarden</h4>
                  <p className="text-white/80 text-sm">
                    Efter verifiering har du full tillgång till sökfunktioner, volontärprofiler och alla verktyg.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Workflow */}
      <section className="py-16 px-6 bg-[#F8F9FA]">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-[#003D5C] mb-12 text-center">Arbetsflöde i plattformen</h2>
          
          <div className="space-y-6">
            <div className="flex gap-6 items-start">
              <div className="w-12 h-12 bg-[#006B7D] rounded-full flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
                1
              </div>
              <div className="bg-white rounded-xl p-6 shadow-md flex-1">
                <h3 className="text-xl font-bold text-[#003D5C] mb-2">Sök efter volontärer</h3>
                <p className="text-gray-600">
                  Använd kartan eller sökfiltren för att hitta lämpliga kontaktpersoner. 
                  Filtrera på kommun, språk, erfarenhet, tillgänglighet och intressen.
                </p>
              </div>
            </div>

            <div className="flex gap-6 items-start">
              <div className="w-12 h-12 bg-[#006B7D] rounded-full flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
                2
              </div>
              <div className="bg-white rounded-xl p-6 shadow-md flex-1">
                <h3 className="text-xl font-bold text-[#003D5C] mb-2">Granska profiler</h3>
                <p className="text-gray-600">
                  Se detaljerad information om varje volontär: bakgrund, erfarenhet, 
                  motivation, tillgänglighet och eventuella interna anteckningar.
                </p>
              </div>
            </div>

            <div className="flex gap-6 items-start">
              <div className="w-12 h-12 bg-[#006B7D] rounded-full flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
                3
              </div>
              <div className="bg-white rounded-xl p-6 shadow-md flex-1">
                <h3 className="text-xl font-bold text-[#003D5C] mb-2">Kontakta och intervjua</h3>
                <p className="text-gray-600">
                  Kontakta intressanta kandidater direkt via plattformen. Boka intervjuer 
                  och dokumentera dina observationer i interna anteckningar.
                </p>
              </div>
            </div>

            <div className="flex gap-6 items-start">
              <div className="w-12 h-12 bg-[#006B7D] rounded-full flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
                4
              </div>
              <div className="bg-white rounded-xl p-6 shadow-md flex-1">
                <h3 className="text-xl font-bold text-[#003D5C] mb-2">Godkänn och matcha</h3>
                <p className="text-gray-600">
                  När bakgrundskontroller är klara, godkänn volontären i systemet. 
                  Matcha sedan volontären med ett barn som passar deras profil.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Security */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-[#003D5C] mb-8 text-center">Säkerhet och sekretess</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-[#E8F4F8] rounded-xl p-6">
              <h3 className="text-xl font-bold text-[#003D5C] mb-4">Dataskydd</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-2">
                  <CheckCircle size={20} className="text-[#006B7D] flex-shrink-0 mt-0.5" />
                  <span>GDPR-kompatibel datahantering</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle size={20} className="text-[#006B7D] flex-shrink-0 mt-0.5" />
                  <span>Krypterad dataöverföring (SSL/TLS)</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle size={20} className="text-[#006B7D] flex-shrink-0 mt-0.5" />
                  <span>Säker lagring på svenska servrar</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle size={20} className="text-[#006B7D] flex-shrink-0 mt-0.5" />
                  <span>Regelbundna säkerhetsgranskningar</span>
                </li>
              </ul>
            </div>

            <div className="bg-[#FFF8E8] rounded-xl p-6">
              <h3 className="text-xl font-bold text-[#003D5C] mb-4">Åtkomstkontroll</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-2">
                  <CheckCircle size={20} className="text-[#F39C12] flex-shrink-0 mt-0.5" />
                  <span>Endast verifierade kommunanställda</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle size={20} className="text-[#F39C12] flex-shrink-0 mt-0.5" />
                  <span>Tvåfaktorsautentisering tillgänglig</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle size={20} className="text-[#F39C12] flex-shrink-0 mt-0.5" />
                  <span>Loggning av alla åtgärder</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle size={20} className="text-[#F39C12] flex-shrink-0 mt-0.5" />
                  <span>Automatisk utloggning vid inaktivitet</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-br from-[#003D5C] to-[#006B7D] text-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Börja söka volontärer idag</h2>
          <p className="text-xl text-white/90 mb-8">
            Logga in med din kommunala e-postadress för att få tillgång till vår databas 
            med granskade kontaktpersoner. Hitta rätt matchning för dina klienter snabbare.
          </p>
          <Link 
            href="/login"
            className="inline-flex items-center gap-3 bg-[#F39C12] hover:bg-[#E67E22] text-white px-10 py-5 rounded-xl text-xl font-bold transition transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            <Search size={28} />
            Sök volontärer nu
            <ArrowRight size={24} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#003D5C] text-white py-8 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-white/70 text-sm">
            © 2024 Kontaktperson Platform. En tjänst för att koppla samman volontärer med barn som behöver stöd.
          </p>
        </div>
      </footer>
    </div>
  );
}
