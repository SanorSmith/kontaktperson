'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import {
  Users,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  ArrowRight,
  TrendingUp,
  Calendar,
  MapPin,
  FileText,
  Search
} from 'lucide-react';

const ProvinceMap = dynamic(
  () => import('../../components/ProvinceMap'),
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

export default function SocialWorkerDashboard() {
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState({
    pendingApplications: 0,
    approvedVolunteers: 0,
    rejectedThisMonth: 0,
    activeMatches: 0
  });
  const [pendingApplications, setPendingApplications] = useState<any[]>([]);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Fetch real data from database
  useEffect(() => {
    async function fetchStats() {
      try {
        setIsLoading(true);
        const response = await fetch('/api/social-worker/stats');
        const data = await response.json();
        
        if (response.ok && data.success) {
          setStats(data.stats);
          setPendingApplications(data.pendingApplications);
          setRecentActivity(data.recentActivity);
        }
      } catch (error) {
        console.error('Error fetching social worker stats:', error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchStats();
  }, []);

  const handleMunicipalityClick = (municipalityName: string) => {
    // For now, just log the municipality name
    // In the future, this could navigate to search page with filter
    console.log('Municipality clicked:', municipalityName);
    window.location.href = `/social-worker/search?municipality=${encodeURIComponent(municipalityName)}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('sv-SE', { day: 'numeric', month: 'short' });
  };

  return (
    <div className="space-y-6">
      {/* Welcome header */}
      <div className="bg-gradient-to-r from-[#003D5C] to-[#006B7D] rounded-xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">
          Välkommen tillbaka, {user?.name || 'Socialsekreterare'}!
        </h1>
        <p className="text-white/80">
          Du har <span className="font-semibold text-[#F39C12]">{stats.pendingApplications} nya ansökningar</span> att granska i {user?.municipality || 'din kommun'}.
        </p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Clock size={24} className="text-yellow-600" />
            </div>
            <span className="text-xs text-yellow-600 bg-yellow-50 px-2 py-1 rounded-full">Väntar</span>
          </div>
          <p className="text-3xl font-bold text-gray-900">{stats.pendingApplications}</p>
          <p className="text-sm text-gray-500">Väntande ansökningar</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle size={24} className="text-green-600" />
            </div>
            <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full flex items-center gap-1">
              <TrendingUp size={12} /> +5
            </span>
          </div>
          <p className="text-3xl font-bold text-gray-900">{stats.approvedVolunteers}</p>
          <p className="text-sm text-gray-500">Godkända volontärer</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <XCircle size={24} className="text-red-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900">{stats.rejectedThisMonth}</p>
          <p className="text-sm text-gray-500">Avvisade denna månad</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users size={24} className="text-blue-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900">{stats.activeMatches}</p>
          <p className="text-sm text-gray-500">Aktiva matchningar</p>
        </div>
      </div>

      {/* Map Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">Volontärer i Sverige</h2>
          <p className="text-sm text-gray-500">Klicka på ett län för att se kommuner och volontärer</p>
        </div>
        <div className="relative w-full h-[calc(100vh-24rem)] min-h-[400px]">
          <ProvinceMap 
            isLoggedIn={true}
            onMunicipalityClick={handleMunicipalityClick}
          />
        </div>
      </div>

      {/* Main content grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Pending applications */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Väntande ansökningar</h2>
              <p className="text-sm text-gray-500">Ansökningar som behöver granskas</p>
            </div>
            <Link
              href="/social-worker/applications"
              className="text-[#006B7D] hover:text-[#005a6a] text-sm font-medium flex items-center gap-1"
            >
              Visa alla <ArrowRight size={16} />
            </Link>
          </div>
          
          <div className="divide-y divide-gray-100">
            {pendingApplications.map((app) => (
              <div key={app.id} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-[#006B7D] flex items-center justify-center text-white font-bold">
                      {app.full_name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{app.full_name}</p>
                      <div className="flex items-center gap-3 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <MapPin size={14} />
                          {app.municipality}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar size={14} />
                          {formatDate(app.created_at)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="hidden sm:flex flex-wrap gap-1">
                      {app.languages.slice(0, 2).map((lang) => (
                        <span key={lang} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                          {lang}
                        </span>
                      ))}
                    </div>
                    <Link
                      href={`/social-worker/applications/${app.id}`}
                      className="px-4 py-2 bg-[#006B7D] hover:bg-[#005a6a] text-white text-sm font-medium rounded-lg transition-colors"
                    >
                      Granska
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {pendingApplications.length === 0 && (
            <div className="p-8 text-center">
              <CheckCircle size={48} className="mx-auto text-green-500 mb-4" />
              <p className="text-gray-600">Inga väntande ansökningar just nu!</p>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick actions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Snabbåtgärder</h3>
            <div className="space-y-3">
              <Link
                href="/social-worker/search"
                className="flex items-center gap-3 p-3 bg-[#006B7D]/5 hover:bg-[#006B7D]/10 rounded-lg transition-colors"
              >
                <div className="w-10 h-10 bg-[#006B7D] rounded-lg flex items-center justify-center">
                  <Search size={20} className="text-white" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Sök volontärer</p>
                  <p className="text-xs text-gray-500">Hitta volontärer på kartan</p>
                </div>
              </Link>
              
              <Link
                href="/social-worker/applications"
                className="flex items-center gap-3 p-3 bg-[#F39C12]/5 hover:bg-[#F39C12]/10 rounded-lg transition-colors"
              >
                <div className="w-10 h-10 bg-[#F39C12] rounded-lg flex items-center justify-center">
                  <FileText size={20} className="text-white" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Granska ansökningar</p>
                  <p className="text-xs text-gray-500">{stats.pendingApplications} väntar</p>
                </div>
              </Link>
              
              <Link
                href="/social-worker/volunteers"
                className="flex items-center gap-3 p-3 bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
              >
                <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                  <Users size={20} className="text-white" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Mina volontärer</p>
                  <p className="text-xs text-gray-500">{stats.approvedVolunteers} godkända</p>
                </div>
              </Link>
            </div>
          </div>

          {/* Recent activity */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Senaste aktivitet</h3>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3">
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    activity.action.includes('Godkände') ? 'bg-green-500' :
                    activity.action.includes('Avvisade') ? 'bg-red-500' :
                    'bg-blue-500'
                  }`} />
                  <div>
                    <p className="text-sm text-gray-900">
                      <span className="font-medium">{activity.action}</span>
                      {' '}för {activity.volunteer}
                    </p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Access level info */}
          <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
            <div className="flex items-start gap-3">
              <AlertCircle size={20} className="text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-blue-900">Din behörighetsnivå</p>
                <p className="text-xs text-blue-700 mt-1">
                  {user?.access_level === 'admin' ? 
                    'Administratör - Full åtkomst till alla funktioner' :
                   user?.access_level === 'approver' ?
                    'Godkännare - Kan granska och godkänna ansökningar' :
                    'Granskare - Kan endast visa volontärer (läsläge)'
                  }
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
