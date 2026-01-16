'use client';

import { Users, Heart, Clock, Shield, CheckCircle, ArrowRight, MapPin, UserPlus } from 'lucide-react';
import Link from 'next/link';

export default function ForVolontarerPage() {
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
          <Link href="/for-volontarer" className="text-white border-b-2 border-[#F39C12]">För Volontärer</Link>
          <Link href="/for-socialsekreterare" className="hover:text-white transition">För Socialsekreterare</Link>
        </nav>

        <div className="flex gap-2 md:gap-3">
          <Link 
            href="/login"
            className="bg-white text-[#003D5C] px-3 py-1.5 md:px-4 md:py-2 rounded-lg text-xs md:text-sm font-semibold hover:shadow-lg transition"
          >
            Logga in
          </Link>
          <Link 
            href="/registrera"
            className="bg-[#F39C12] text-white px-3 py-1.5 md:px-4 md:py-2 rounded-lg text-xs md:text-sm font-semibold hover:bg-[#E67E22] transition hidden sm:block"
          >
            Bli kontaktperson
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative text-white py-12 md:py-24 px-4 md:px-6 overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: 'url(/social.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        />
        {/* Dark Overlay for Text Readability */}
        <div className="absolute inset-0 bg-black/50 z-10" />
        
        {/* Content */}
        <div className="max-w-4xl mx-auto text-center relative z-20">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6 tracking-tight px-2 drop-shadow-lg">Bli en Kontaktperson</h1>
          <p className="text-base md:text-lg text-white/95 mb-6 md:mb-10 max-w-2xl mx-auto leading-relaxed px-2 drop-shadow-md">
            Gör skillnad i ett barns liv. Som kontaktperson blir du en trygg vuxen som ger stöd, 
            gemenskap och nya upplevelser till barn och unga som behöver det.
          </p>
          <Link 
            href="/registrera"
            className="inline-flex items-center gap-2 bg-white text-[#003D5C] px-6 py-3 md:px-8 md:py-3.5 rounded-xl text-sm md:text-base font-semibold transition hover:shadow-xl hover:scale-105"
          >
            <UserPlus size={16} strokeWidth={2} className="md:hidden" />
            <UserPlus size={18} strokeWidth={2} className="hidden md:block" />
            Ansök nu
            <ArrowRight size={14} strokeWidth={2} className="md:hidden" />
            <ArrowRight size={16} strokeWidth={2} className="hidden md:block" />
          </Link>
        </div>
      </section>

      {/* What is a Kontaktperson */}
      <section className="py-12 md:py-16 px-4 md:px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-[#003D5C] mb-6 md:mb-8 text-center">Vad är en Kontaktperson?</h2>
          
          <div className="prose prose-lg max-w-none text-gray-700">
            <p className="text-lg leading-relaxed mb-6">
              En kontaktperson är en frivillig vuxen som regelbundet träffar ett barn eller en ungdom 
              som behöver extra stöd i sin vardag. Du blir en stabil och trygg person i barnets liv – 
              någon att prata med, göra aktiviteter tillsammans med och som finns där över tid.
            </p>
            
            <p className="text-lg leading-relaxed mb-6">
              Uppdraget som kontaktperson är en insats enligt Socialtjänstlagen (SoL) och innebär att 
              du får ett arvode för ditt engagemang. Du matchas med ett barn baserat på intressen, 
              personlighet och geografisk närhet.
            </p>

            <div className="bg-[#E8F4F8] rounded-xl p-6 my-8">
              <h3 className="text-xl font-bold text-[#003D5C] mb-4">Typiska aktiviteter som kontaktperson:</h3>
              <ul className="grid md:grid-cols-2 gap-3">
                <li className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-[#006B7D] flex-shrink-0" strokeWidth={2} />
                  <span className="text-sm">Fika och umgås</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle size={20} className="text-[#006B7D] flex-shrink-0" />
                  <span>Sport och friluftsliv</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle size={20} className="text-[#006B7D] flex-shrink-0" />
                  <span>Bio, museum eller konsert</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle size={20} className="text-[#006B7D] flex-shrink-0" />
                  <span>Hjälpa med läxor</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle size={20} className="text-[#006B7D] flex-shrink-0" />
                  <span>Laga mat tillsammans</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle size={20} className="text-[#006B7D] flex-shrink-0" />
                  <span>Spela spel eller titta på film</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle size={20} className="text-[#006B7D] flex-shrink-0" />
                  <span>Vara ett bollplank och lyssna</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle size={20} className="text-[#006B7D] flex-shrink-0" />
                  <span>Utflykter och äventyr</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Why Become a Kontaktperson */}
      <section className="py-12 md:py-16 px-4 md:px-6 bg-[#F8F9FA]">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-[#003D5C] mb-8 md:mb-12 text-center">Varför bli Kontaktperson?</h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl p-8 border border-gray-100 hover:border-gray-200 transition">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-[#F39C12]/5 rounded-xl mb-5">
                <Heart size={20} className="text-[#F39C12]" strokeWidth={1.5} />
              </div>
              <h3 className="text-lg font-semibold text-[#003D5C] mb-3">Gör verklig skillnad</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Du kan bli den trygga vuxna som ett barn saknar. Din tid och ditt engagemang 
                kan förändra ett barns framtid och ge dem hopp och möjligheter.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 border border-gray-100 hover:border-gray-200 transition">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-[#006B7D]/5 rounded-xl mb-5">
                <Users size={20} className="text-[#006B7D]" strokeWidth={1.5} />
              </div>
              <h3 className="text-lg font-semibold text-[#003D5C] mb-3">Personlig utveckling</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Som kontaktperson utvecklas du som människa. Du får nya perspektiv, 
                lär dig kommunicera bättre och bygger meningsfulla relationer.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 border border-gray-100 hover:border-gray-200 transition">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-[#003D5C]/5 rounded-xl mb-5">
                <Shield size={20} className="text-[#003D5C]" strokeWidth={1.5} />
              </div>
              <h3 className="text-lg font-semibold text-[#003D5C] mb-3">Stöd och utbildning</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Du får utbildning, handledning och kontinuerligt stöd från socialtjänsten. 
                Du är aldrig ensam i ditt uppdrag.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Requirements */}
      <section className="py-12 md:py-16 px-4 md:px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-[#003D5C] mb-6 md:mb-8 text-center">Vem kan bli Kontaktperson?</h2>
          
          <div className="bg-gradient-to-r from-[#003D5C] to-[#006B7D] rounded-2xl p-8 text-white">
            <p className="text-lg mb-6">
              Du behöver inte ha någon speciell utbildning – det viktigaste är att du är en 
              stabil, engagerad och pålitlig person som har tid och vilja att finnas där för ett barn.
            </p>
            
            <h3 className="text-xl font-bold mb-4">Grundläggande krav:</h3>
            <ul className="space-y-3 mb-8">
              <li className="flex items-start gap-3">
                <CheckCircle size={24} className="text-[#F39C12] flex-shrink-0 mt-0.5" />
                <span><strong>Ålder:</strong> Du ska vara minst 18 år gammal</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle size={24} className="text-[#F39C12] flex-shrink-0 mt-0.5" />
                <span><strong>Tid:</strong> Du kan avsätta regelbunden tid, vanligtvis några timmar per vecka</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle size={24} className="text-[#F39C12] flex-shrink-0 mt-0.5" />
                <span><strong>Stabilitet:</strong> Du har en stabil livssituation och kan förbinda dig på längre sikt (minst 1 år)</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle size={24} className="text-[#F39C12] flex-shrink-0 mt-0.5" />
                <span><strong>Bakgrundskontroll:</strong> Du godkänner utdrag ur belastningsregistret</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle size={24} className="text-[#F39C12] flex-shrink-0 mt-0.5" />
                <span><strong>Referenser:</strong> Du kan uppge referenser som socialtjänsten kan kontakta</span>
              </li>
            </ul>

            <div className="bg-white/10 rounded-xl p-4">
              <p className="text-sm">
                <strong>Bonus:</strong> Det är meriterande om du har erfarenhet av att arbeta med barn, 
                talar flera språk, har körkort, eller har specifika intressen som du kan dela med barnet.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-12 md:py-16 px-4 md:px-6 bg-[#F8F9FA]">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-[#003D5C] mb-8 md:mb-12 text-center">Hur går det till?</h2>
          
          <div className="space-y-5">
            <div className="flex gap-5 items-start">
              <div className="w-10 h-10 bg-[#F39C12] rounded-xl flex items-center justify-center text-white font-semibold text-base flex-shrink-0">
                1
              </div>
              <div className="bg-white rounded-2xl p-6 border border-gray-100 flex-1">
                <h3 className="text-lg font-semibold text-[#003D5C] mb-2">Ansök online</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Fyll i ansökningsformuläret med information om dig själv, dina intressen, 
                  tillgänglighet och varför du vill bli kontaktperson. Det tar cirka 15-20 minuter.
                </p>
              </div>
            </div>

            <div className="flex gap-5 items-start">
              <div className="w-10 h-10 bg-[#F39C12] rounded-xl flex items-center justify-center text-white font-semibold text-base flex-shrink-0">
                2
              </div>
              <div className="bg-white rounded-2xl p-6 border border-gray-100 flex-1">
                <h3 className="text-lg font-semibold text-[#003D5C] mb-2">Intervju och bakgrundskontroll</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  En socialsekreterare kontaktar dig för en personlig intervju. Vi gör även 
                  en bakgrundskontroll och kontaktar dina referenser. Detta är för barnets säkerhet.
                </p>
              </div>
            </div>

            <div className="flex gap-5 items-start">
              <div className="w-10 h-10 bg-[#F39C12] rounded-xl flex items-center justify-center text-white font-semibold text-base flex-shrink-0">
                3
              </div>
              <div className="bg-white rounded-2xl p-6 border border-gray-100 flex-1">
                <h3 className="text-lg font-semibold text-[#003D5C] mb-2">Utbildning</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Du får en grundutbildning om uppdraget, barnets rättigheter, hur du hanterar 
                  olika situationer och vad som förväntas av dig som kontaktperson.
                </p>
              </div>
            </div>

            <div className="flex gap-5 items-start">
              <div className="w-10 h-10 bg-[#F39C12] rounded-xl flex items-center justify-center text-white font-semibold text-base flex-shrink-0">
                4
              </div>
              <div className="bg-white rounded-2xl p-6 border border-gray-100 flex-1">
                <h3 className="text-lg font-semibold text-[#003D5C] mb-2">Matchning</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Vi matchar dig med ett barn baserat på era gemensamma intressen, personligheter 
                  och geografisk närhet. Du får träffa barnet och dess familj innan uppdraget börjar.
                </p>
              </div>
            </div>

            <div className="flex gap-5 items-start">
              <div className="w-10 h-10 bg-[#006B7D] rounded-xl flex items-center justify-center text-white font-semibold text-base flex-shrink-0">
                5
              </div>
              <div className="bg-white rounded-2xl p-6 border border-gray-100 flex-1">
                <h3 className="text-lg font-semibold text-[#003D5C] mb-2">Uppdraget börjar</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Nu börjar det roliga! Du träffar barnet regelbundet och bygger en relation. 
                  Du får kontinuerlig handledning och stöd från socialtjänsten under hela uppdraget.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Compensation */}
      <section className="py-12 md:py-16 px-4 md:px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-[#003D5C] mb-6 md:mb-8 text-center">Ersättning och villkor</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl p-8 border border-gray-100">
              <div className="flex items-center gap-3 mb-5">
                <div className="inline-flex items-center justify-center w-10 h-10 bg-[#006B7D]/5 rounded-xl">
                  <Clock size={18} className="text-[#006B7D]" strokeWidth={1.5} />
                </div>
                <h3 className="text-lg font-semibold text-[#003D5C]">Tidsåtagande</h3>
              </div>
              <ul className="space-y-2 text-gray-600 text-sm">
                <li>• Vanligtvis 2-4 träffar per månad</li>
                <li>• Varje träff är cirka 2-4 timmar</li>
                <li>• Flexibelt schema som passar dig</li>
                <li>• Minst 1 års åtagande rekommenderas</li>
              </ul>
            </div>

            <div className="bg-white rounded-2xl p-8 border border-gray-100">
              <div className="flex items-center gap-3 mb-5">
                <div className="inline-flex items-center justify-center w-10 h-10 bg-[#F39C12]/5 rounded-xl">
                  <MapPin size={18} className="text-[#F39C12]" strokeWidth={1.5} />
                </div>
                <h3 className="text-lg font-semibold text-[#003D5C]">Arvode</h3>
              </div>
              <ul className="space-y-2 text-gray-600 text-sm">
                <li>• Arvodet varierar mellan kommuner</li>
                <li>• Vanligtvis ca 1 000-1 500 kr/månad</li>
                <li>• Omkostnadsersättning för aktiviteter</li>
                <li>• Skattefritt upp till viss gräns</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-20 px-4 md:px-6 bg-gradient-to-br from-[#F39C12] to-[#E67E22] text-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 md:mb-6 tracking-tight">Redo att göra skillnad?</h2>
          <p className="text-base md:text-lg text-white/90 mb-8 md:mb-10 leading-relaxed px-2">
            Tusentals barn i Sverige väntar på en kontaktperson. Din tid och ditt engagemang 
            kan förändra ett barns liv. Ansök idag och bli en del av något meningsfullt.
          </p>
          <Link 
            href="/registrera"
            className="inline-flex items-center gap-2 bg-white text-[#E67E22] px-8 py-3.5 rounded-xl text-base font-semibold transition hover:shadow-xl"
          >
            <UserPlus size={18} strokeWidth={2} />
            Bli kontaktperson nu
            <ArrowRight size={16} strokeWidth={2} />
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
