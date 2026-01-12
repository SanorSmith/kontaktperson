'use client';

import { Users, Heart, Clock, Shield, CheckCircle, ArrowRight, MapPin, UserPlus } from 'lucide-react';
import Link from 'next/link';

export default function ForVolontarerPage() {
  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      {/* Header */}
      <header className="bg-[#003D5C] text-white py-4 px-6 flex justify-between items-center sticky top-0 z-50">
        <Link href="/" className="flex items-center gap-3 hover:opacity-90 transition">
          <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
            <Users size={20} className="text-white" />
          </div>
          <span className="font-bold text-lg">Kontaktperson Platform</span>
        </Link>
        
        <nav className="hidden md:flex gap-6 text-sm font-medium text-white/90">
          <Link href="/" className="hover:text-white transition">Karta</Link>
          <Link href="/for-volontarer" className="text-white border-b-2 border-[#F39C12]">För Volontärer</Link>
          <Link href="/for-socialsekreterare" className="hover:text-white transition">För Socialsekreterare</Link>
        </nav>

        <div className="flex gap-3">
          <Link 
            href="/login"
            className="bg-white text-[#003D5C] px-4 py-2 rounded-lg text-sm font-semibold hover:shadow-lg transition"
          >
            Logga in
          </Link>
          <Link 
            href="/registrera"
            className="bg-[#F39C12] text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#E67E22] transition"
          >
            Bli kontaktperson
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#003D5C] to-[#006B7D] text-white py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="w-20 h-20 bg-[#F39C12] rounded-full flex items-center justify-center mx-auto mb-6">
            <Heart size={40} className="text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Bli en Kontaktperson</h1>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Gör skillnad i ett barns liv. Som kontaktperson blir du en trygg vuxen som ger stöd, 
            gemenskap och nya upplevelser till barn och unga som behöver det.
          </p>
          <Link 
            href="/registrera"
            className="inline-flex items-center gap-2 bg-[#F39C12] hover:bg-[#E67E22] text-white px-8 py-4 rounded-xl text-lg font-bold transition transform hover:scale-105 shadow-lg"
          >
            <UserPlus size={24} />
            Ansök nu
            <ArrowRight size={20} />
          </Link>
        </div>
      </section>

      {/* What is a Kontaktperson */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-[#003D5C] mb-8 text-center">Vad är en Kontaktperson?</h2>
          
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
                  <CheckCircle size={20} className="text-[#006B7D] flex-shrink-0" />
                  <span>Fika och umgås</span>
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
      <section className="py-16 px-6 bg-[#F8F9FA]">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-[#003D5C] mb-12 text-center">Varför bli Kontaktperson?</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition">
              <div className="w-14 h-14 bg-[#F39C12]/10 rounded-full flex items-center justify-center mb-4">
                <Heart size={28} className="text-[#F39C12]" />
              </div>
              <h3 className="text-xl font-bold text-[#003D5C] mb-3">Gör verklig skillnad</h3>
              <p className="text-gray-600">
                Du kan bli den trygga vuxna som ett barn saknar. Din tid och ditt engagemang 
                kan förändra ett barns framtid och ge dem hopp och möjligheter.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition">
              <div className="w-14 h-14 bg-[#006B7D]/10 rounded-full flex items-center justify-center mb-4">
                <Users size={28} className="text-[#006B7D]" />
              </div>
              <h3 className="text-xl font-bold text-[#003D5C] mb-3">Personlig utveckling</h3>
              <p className="text-gray-600">
                Som kontaktperson utvecklas du som människa. Du får nya perspektiv, 
                lär dig kommunicera bättre och bygger meningsfulla relationer.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition">
              <div className="w-14 h-14 bg-[#003D5C]/10 rounded-full flex items-center justify-center mb-4">
                <Shield size={28} className="text-[#003D5C]" />
              </div>
              <h3 className="text-xl font-bold text-[#003D5C] mb-3">Stöd och utbildning</h3>
              <p className="text-gray-600">
                Du får utbildning, handledning och kontinuerligt stöd från socialtjänsten. 
                Du är aldrig ensam i ditt uppdrag.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Requirements */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-[#003D5C] mb-8 text-center">Vem kan bli Kontaktperson?</h2>
          
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
      <section className="py-16 px-6 bg-[#F8F9FA]">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-[#003D5C] mb-12 text-center">Hur går det till?</h2>
          
          <div className="space-y-6">
            <div className="flex gap-6 items-start">
              <div className="w-12 h-12 bg-[#F39C12] rounded-full flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
                1
              </div>
              <div className="bg-white rounded-xl p-6 shadow-md flex-1">
                <h3 className="text-xl font-bold text-[#003D5C] mb-2">Ansök online</h3>
                <p className="text-gray-600">
                  Fyll i ansökningsformuläret med information om dig själv, dina intressen, 
                  tillgänglighet och varför du vill bli kontaktperson. Det tar cirka 15-20 minuter.
                </p>
              </div>
            </div>

            <div className="flex gap-6 items-start">
              <div className="w-12 h-12 bg-[#F39C12] rounded-full flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
                2
              </div>
              <div className="bg-white rounded-xl p-6 shadow-md flex-1">
                <h3 className="text-xl font-bold text-[#003D5C] mb-2">Intervju och bakgrundskontroll</h3>
                <p className="text-gray-600">
                  En socialsekreterare kontaktar dig för en personlig intervju. Vi gör även 
                  en bakgrundskontroll och kontaktar dina referenser. Detta är för barnets säkerhet.
                </p>
              </div>
            </div>

            <div className="flex gap-6 items-start">
              <div className="w-12 h-12 bg-[#F39C12] rounded-full flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
                3
              </div>
              <div className="bg-white rounded-xl p-6 shadow-md flex-1">
                <h3 className="text-xl font-bold text-[#003D5C] mb-2">Utbildning</h3>
                <p className="text-gray-600">
                  Du får en grundutbildning om uppdraget, barnets rättigheter, hur du hanterar 
                  olika situationer och vad som förväntas av dig som kontaktperson.
                </p>
              </div>
            </div>

            <div className="flex gap-6 items-start">
              <div className="w-12 h-12 bg-[#F39C12] rounded-full flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
                4
              </div>
              <div className="bg-white rounded-xl p-6 shadow-md flex-1">
                <h3 className="text-xl font-bold text-[#003D5C] mb-2">Matchning</h3>
                <p className="text-gray-600">
                  Vi matchar dig med ett barn baserat på era gemensamma intressen, personligheter 
                  och geografisk närhet. Du får träffa barnet och dess familj innan uppdraget börjar.
                </p>
              </div>
            </div>

            <div className="flex gap-6 items-start">
              <div className="w-12 h-12 bg-[#006B7D] rounded-full flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
                5
              </div>
              <div className="bg-white rounded-xl p-6 shadow-md flex-1">
                <h3 className="text-xl font-bold text-[#003D5C] mb-2">Uppdraget börjar</h3>
                <p className="text-gray-600">
                  Nu börjar det roliga! Du träffar barnet regelbundet och bygger en relation. 
                  Du får kontinuerlig handledning och stöd från socialtjänsten under hela uppdraget.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Compensation */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-[#003D5C] mb-8 text-center">Ersättning och villkor</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-[#E8F4F8] rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <Clock size={28} className="text-[#006B7D]" />
                <h3 className="text-xl font-bold text-[#003D5C]">Tidsåtagande</h3>
              </div>
              <ul className="space-y-2 text-gray-700">
                <li>• Vanligtvis 2-4 träffar per månad</li>
                <li>• Varje träff är cirka 2-4 timmar</li>
                <li>• Flexibelt schema som passar dig</li>
                <li>• Minst 1 års åtagande rekommenderas</li>
              </ul>
            </div>

            <div className="bg-[#FFF8E8] rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <MapPin size={28} className="text-[#F39C12]" />
                <h3 className="text-xl font-bold text-[#003D5C]">Arvode</h3>
              </div>
              <ul className="space-y-2 text-gray-700">
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
      <section className="py-20 px-6 bg-gradient-to-br from-[#F39C12] to-[#E67E22] text-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Redo att göra skillnad?</h2>
          <p className="text-xl text-white/90 mb-8">
            Tusentals barn i Sverige väntar på en kontaktperson. Din tid och ditt engagemang 
            kan förändra ett barns liv. Ansök idag och bli en del av något meningsfullt.
          </p>
          <Link 
            href="/registrera"
            className="inline-flex items-center gap-3 bg-white text-[#E67E22] px-10 py-5 rounded-xl text-xl font-bold transition transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            <UserPlus size={28} />
            Bli kontaktperson nu
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
