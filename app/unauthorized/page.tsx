'use client';

import Link from 'next/link';
import { ShieldOff, ArrowLeft, Home } from 'lucide-react';

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="w-20 h-20 bg-[#E74C3C]/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShieldOff size={40} className="text-[#E74C3C]" />
          </div>
          
          <h1 className="text-2xl font-bold text-[#003D5C] mb-2">
            Åtkomst nekad
          </h1>
          
          <p className="text-gray-600 mb-6">
            Du har inte behörighet att se denna sida. Endast administratörer har tillgång till adminpanelen.
          </p>
          
          <div className="space-y-3">
            <Link
              href="/"
              className="flex items-center justify-center gap-2 w-full bg-[#003D5C] hover:bg-[#004e75] text-white py-3 rounded-lg font-semibold transition"
            >
              <Home size={20} />
              Gå till startsidan
            </Link>
            
            <button
              onClick={() => window.history.back()}
              className="flex items-center justify-center gap-2 w-full bg-white border border-[#003D5C] text-[#003D5C] py-3 rounded-lg font-semibold hover:bg-gray-50 transition"
            >
              <ArrowLeft size={20} />
              Gå tillbaka
            </button>
          </div>
          
          <p className="text-sm text-gray-500 mt-6">
            Om du tror att detta är ett fel, kontakta systemadministratören.
          </p>
        </div>
      </div>
    </div>
  );
}
