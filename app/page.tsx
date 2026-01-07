'use client';

import { useRouter } from 'next/navigation';
import { MapPin, Users, Shield, ArrowRight } from 'lucide-react';

export default function HomePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-deep-blue via-warm-teal to-deep-blue">
      <div className="min-h-screen bg-white/90 backdrop-blur-sm">
        {/* Header */}
        <header className="bg-deep-blue text-white py-4 border-b border-white/10">
          <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                <Users size={24} />
              </div>
              <span className="font-bold text-xl">Kontaktperson Platform</span>
            </div>
            <button
              onClick={() => router.push('/search')}
              className="bg-warm-orange text-white px-6 py-2 rounded-lg font-semibold hover:opacity-90 transition-opacity"
            >
              Sök Volontärer
            </button>
          </div>
        </header>

        {/* Hero Section */}
        <section className="py-20 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h1 className="text-5xl font-bold text-deep-blue mb-6 leading-tight">
                  Hitta rätt kontaktperson för dina klienter
                </h1>
                <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                  En interaktiv karta över hela Sverige som hjälper dig att hitta verifierade volontärer baserat på plats, intressen och tillgänglighet.
                </p>
                <button
                  onClick={() => router.push('/search')}
                  className="bg-deep-blue text-white px-8 py-4 rounded-lg font-semibold text-lg hover:opacity-90 transition-opacity flex items-center gap-2 shadow-lg"
                >
                  Utforska kartan
                  <ArrowRight size={20} />
                </button>
              </div>
              <div className="relative">
                <div className="bg-gradient-to-br from-soft-blue to-white rounded-2xl p-8 shadow-2xl border border-gray-200">
                  <div className="aspect-square bg-white rounded-xl p-6 flex items-center justify-center">
                    <MapPin size={120} className="text-warm-orange" />
                  </div>
                  <div className="mt-6 space-y-3">
                    <div className="flex items-center gap-3 bg-white rounded-lg p-3 shadow-sm">
                      <div className="w-10 h-10 rounded-full bg-success-green/20 flex items-center justify-center">
                        <Users size={20} className="text-success-green" />
                      </div>
                      <div>
                        <p className="font-semibold text-deep-blue">150+ Volontärer</p>
                        <p className="text-xs text-gray-500">Över hela Sverige</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 bg-white rounded-lg p-3 shadow-sm">
                      <div className="w-10 h-10 rounded-full bg-warm-orange/20 flex items-center justify-center">
                        <Shield size={20} className="text-warm-orange" />
                      </div>
                      <div>
                        <p className="font-semibold text-deep-blue">100% Verifierade</p>
                        <p className="text-xs text-gray-500">Säkra matchningar</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 px-6 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-deep-blue text-center mb-12">
              Funktioner
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white rounded-xl p-8 shadow-md hover:shadow-xl transition-shadow">
                <div className="w-14 h-14 rounded-lg bg-soft-blue flex items-center justify-center mb-4">
                  <MapPin size={28} className="text-warm-teal" />
                </div>
                <h3 className="text-xl font-semibold text-deep-blue mb-3">
                  Interaktiv Karta
                </h3>
                <p className="text-gray-600">
                  Klicka på kommuner för att filtrera volontärer. Hover för att se detaljer direkt på kartan.
                </p>
              </div>
              <div className="bg-white rounded-xl p-8 shadow-md hover:shadow-xl transition-shadow">
                <div className="w-14 h-14 rounded-lg bg-soft-blue flex items-center justify-center mb-4">
                  <Users size={28} className="text-warm-teal" />
                </div>
                <h3 className="text-xl font-semibold text-deep-blue mb-3">
                  Detaljerade Profiler
                </h3>
                <p className="text-gray-600">
                  Se intressen, språk, tillgänglighet och erfarenhet för varje volontär.
                </p>
              </div>
              <div className="bg-white rounded-xl p-8 shadow-md hover:shadow-xl transition-shadow">
                <div className="w-14 h-14 rounded-lg bg-soft-blue flex items-center justify-center mb-4">
                  <Shield size={28} className="text-warm-teal" />
                </div>
                <h3 className="text-xl font-semibold text-deep-blue mb-3">
                  Säker Matchning
                </h3>
                <p className="text-gray-600">
                  Alla volontärer är verifierade och granskade för trygg kontaktpersonskap.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-deep-blue mb-6">
              Redo att hitta rätt kontaktperson?
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Börja utforska kartan och hitta volontärer i din kommun idag.
            </p>
            <button
              onClick={() => router.push('/search')}
              className="bg-warm-orange text-white px-10 py-4 rounded-lg font-semibold text-lg hover:opacity-90 transition-opacity shadow-lg"
            >
              Kom igång nu
            </button>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-deep-blue text-white py-8 px-6">
          <div className="max-w-7xl mx-auto text-center">
            <p className="text-white/70">
              © 2026 Kontaktperson Platform. Alla rättigheter förbehållna.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
