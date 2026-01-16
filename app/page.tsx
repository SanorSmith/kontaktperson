'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { Users, Search, UserPlus, ArrowRight } from 'lucide-react';

const ProvinceMap = dynamic(
  () => import('./components/ProvinceMap'),
  { 
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex items-center justify-center bg-[#F8F9FA]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-gray-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-700 font-medium">Laddar karta...</p>
        </div>
      </div>
    )
  }
);

export default function HomePage() {
  return (
    <div className="h-screen w-screen overflow-hidden bg-[#F8F9FA] flex flex-col">
      <header className="bg-[#003D5C] text-white py-3 px-4 md:px-6 z-[1001] flex justify-between items-center">
        <Link 
          href="/"
          className="flex items-center gap-2 md:gap-3 cursor-pointer hover:opacity-90 transition"
        >
          <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
            <Users size={18} className="text-white" />
          </div>
          <span className="font-semibold text-base md:text-lg">Kontaktperson Platform</span>
        </Link>
        
        <nav className="hidden md:flex gap-6 text-sm font-medium text-white/90">
          <Link href="/" className="hover:text-white transition">Karta</Link>
          <Link href="/for-volontarer" className="hover:text-white transition">För Volontärer</Link>
          <Link href="/for-socialsekreterare" className="hover:text-white transition">För Socialsekreterare</Link>
        </nav>

        <div className="flex gap-2 md:gap-3">
          <Link 
            href="/login"
            className="bg-white text-[#003D5C] px-3 md:px-4 py-2 rounded-lg text-xs md:text-sm font-semibold hover:shadow-lg transition"
          >
            Logga in
          </Link>
          <Link 
            href="/registrera"
            className="bg-[#F39C12] text-white px-3 md:px-4 py-2 rounded-lg text-xs md:text-sm font-semibold hover:bg-[#E67E22] transition hidden sm:block"
          >
            Bli kontaktperson
          </Link>
        </div>
      </header>
      
      {/* Desktop: Sidebar + Map Layout | Mobile: Stacked Layout */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Left Sidebar - Desktop Only */}
        <aside className="hidden md:flex md:flex-col md:w-80 lg:w-96 bg-white border-r border-gray-200 p-6 gap-4 overflow-y-auto">
          <div className="flex flex-col gap-4">
            <Link
              href="/registrera"
              className="bg-[#F39C12] hover:bg-[#E67E22] text-white px-6 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center gap-3 group"
            >
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center group-hover:bg-white/30 transition-all">
                <UserPlus size={24} />
              </div>
              <div className="flex-1 text-left">
                <span className="block text-base font-bold">Bli kontaktperson</span>
                <span className="block text-sm opacity-90">Registrera dig som volontär</span>
              </div>
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            
            <Link
              href="/login"
              className="bg-[#003D5C] hover:bg-[#004e75] text-white px-6 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center gap-3 group"
            >
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center group-hover:bg-white/30 transition-all">
                <Search size={24} />
              </div>
              <div className="flex-1 text-left">
                <span className="block text-base font-bold">Sök volontärer</span>
                <span className="block text-sm opacity-80">Logga in som socialsekreterare</span>
              </div>
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </aside>

        {/* Map Container - Full screen responsive */}
        <div className="flex-1 relative w-full h-full">
          <ProvinceMap />
        </div>
      </div>
      
      {/* Mobile Buttons - Bottom Fixed */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-[1001] flex flex-col gap-2 w-full p-3 bg-gradient-to-t from-[#F8F9FA] via-[#F8F9FA]/80 to-transparent pt-4">
        <Link
          href="/registrera"
          className="bg-[#F39C12] hover:bg-[#E67E22] text-white px-2 py-2 rounded-lg shadow-lg flex items-center justify-center gap-1"
        >
          <UserPlus size={14} />
          <span className="text-xs font-bold">Bli kontaktperson</span>
        </Link>
        
        <Link
          href="/login"
          className="bg-[#003D5C] hover:bg-[#004e75] text-white px-2 py-2 rounded-lg shadow-lg flex items-center justify-center gap-1"
        >
          <Search size={14} />
          <span className="text-xs font-bold">Sök volontärer</span>
        </Link>
      </div>
    </div>
  );
}
