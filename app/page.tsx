'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { Users, Search, UserPlus, ArrowRight } from 'lucide-react';

const CleanSwedenMap = dynamic(
  () => import('./components/CleanSwedenMap'),
  { 
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex items-center justify-center bg-[#F8F9FA]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#003D5C] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#003D5C] font-medium">Laddar karta...</p>
        </div>
      </div>
    )
  }
);

export default function HomePage() {
  return (
    <div className="h-screen w-screen overflow-hidden bg-[#F8F9FA] flex flex-col">
      {/* Header */}
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
      
      {/* Main Map - Full Screen */}
      <div className="flex-1 relative">
        <CleanSwedenMap />
        
        {/* Centered Action Buttons - Responsive */}
        <div className="absolute bottom-4 md:bottom-8 left-1/2 transform -translate-x-1/2 z-[1001] flex flex-col sm:flex-row gap-3 md:gap-4 w-[90%] sm:w-auto max-w-lg">
          {/* Volunteer Button - Links to registration form */}
          <Link
            href="/registrera"
            className="flex-1 sm:flex-none bg-[#F39C12] hover:bg-[#E67E22] text-white px-4 md:px-6 py-3 md:py-4 rounded-xl shadow-lg transition transform hover:scale-105 hover:shadow-xl flex items-center justify-center gap-2 md:gap-3"
          >
            <UserPlus size={20} className="md:w-6 md:h-6" />
            <div className="text-left">
              <span className="block text-sm md:text-base font-bold">Bli kontaktperson</span>
              <span className="block text-xs opacity-90 hidden sm:block">Registrera dig som volontär</span>
            </div>
            <ArrowRight size={16} className="ml-1 hidden sm:block" />
          </Link>
          
          {/* Social Worker Login Button - Links to login */}
          <Link
            href="/login"
            className="flex-1 sm:flex-none bg-[#003D5C] hover:bg-[#004e75] text-white px-4 md:px-6 py-3 md:py-4 rounded-xl shadow-lg transition transform hover:scale-105 hover:shadow-xl flex items-center justify-center gap-2 md:gap-3"
          >
            <Search size={20} className="md:w-6 md:h-6" />
            <div className="text-left">
              <span className="block text-sm md:text-base font-bold">Sök volontärer</span>
              <span className="block text-xs opacity-80 hidden sm:block">Logga in som socialsekreterare</span>
            </div>
            <ArrowRight size={16} className="ml-1 hidden sm:block" />
          </Link>
        </div>
      </div>
    </div>
  );
}
