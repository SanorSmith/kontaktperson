'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Users,
  UserCheck,
  Clock,
  CheckCircle,
  TrendingUp,
  TrendingDown,
  ArrowRight,
  Plus,
  Eye,
  BarChart3
} from 'lucide-react';

interface StatCard {
  title: string;
  value: number;
  change?: number;
  changeLabel?: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  href?: string;
}

interface RecentActivity {
  id: string;
  name: string;
  email: string;
  municipality: string;
  status: 'pending' | 'verified' | 'inactive';
  date: string;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalSocialWorkers: 0,
    pendingVerification: 0,
    activeAccounts: 0,
    totalVolunteers: 0
  });
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [municipalityData, setMunicipalityData] = useState<{name: string, count: number}[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch real data from database
  useEffect(() => {
    async function fetchStats() {
      try {
        setIsLoading(true);
        const response = await fetch('/api/admin/stats');
        const data = await response.json();
        
        if (response.ok && data.success) {
          setStats(data.stats);
          setRecentActivity(data.recentActivity);
          setMunicipalityData(data.municipalityData);
        }
      } catch (error) {
        console.error('Error fetching admin stats:', error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchStats();
  }, []);

  const statCards: StatCard[] = [
    {
      title: 'Total Socialsekreterare',
      value: stats.totalSocialWorkers,
      change: 12,
      changeLabel: 'denna månad',
      icon: <Users size={24} />,
      color: 'text-[#003D5C]',
      bgColor: 'bg-[#003D5C]/10',
      href: '/admin/social-workers'
    },
    {
      title: 'Väntande Verifiering',
      value: stats.pendingVerification,
      icon: <Clock size={24} />,
      color: 'text-[#F39C12]',
      bgColor: 'bg-[#F39C12]/10',
      href: '/admin/social-workers?filter=pending'
    },
    {
      title: 'Aktiva Konton',
      value: stats.activeAccounts,
      change: 8,
      changeLabel: 'denna vecka',
      icon: <CheckCircle size={24} />,
      color: 'text-[#27AE60]',
      bgColor: 'bg-[#27AE60]/10',
      href: '/admin/social-workers?filter=active'
    },
    {
      title: 'Totalt Volontärer',
      value: stats.totalVolunteers,
      change: 23,
      changeLabel: 'denna månad',
      icon: <UserCheck size={24} />,
      color: 'text-[#006B7D]',
      bgColor: 'bg-[#006B7D]/10',
      href: '/admin/volunteers'
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'verified':
        return <span className="px-2 py-1 bg-[#27AE60]/10 text-[#27AE60] rounded-full text-xs font-medium">Verifierad</span>;
      case 'pending':
        return <span className="px-2 py-1 bg-[#F39C12]/10 text-[#F39C12] rounded-full text-xs font-medium">Väntande</span>;
      case 'inactive':
        return <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">Inaktiv</span>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#003D5C]">Dashboard</h1>
          <p className="text-gray-600">Översikt över plattformens aktivitet</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, index) => (
          <Link
            key={index}
            href={card.href || '#'}
            className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition group"
          >
            <div className="flex items-start justify-between">
              <div className={`w-12 h-12 ${card.bgColor} rounded-lg flex items-center justify-center ${card.color}`}>
                {card.icon}
              </div>
              <ArrowRight size={20} className="text-gray-300 group-hover:text-[#F39C12] transition" />
            </div>
            <div className="mt-4">
              <p className="text-3xl font-bold text-[#003D5C]">{card.value}</p>
              <p className="text-sm text-gray-600 mt-1">{card.title}</p>
              {card.change && (
                <div className="flex items-center gap-1 mt-2 text-xs">
                  <TrendingUp size={14} className="text-[#27AE60]" />
                  <span className="text-[#27AE60]">+{card.change}</span>
                  <span className="text-gray-500">{card.changeLabel}</span>
                </div>
              )}
            </div>
          </Link>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200">
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="font-semibold text-[#003D5C]">Senaste registreringar</h2>
            <Link href="/admin/social-workers" className="text-sm text-[#F39C12] hover:underline">
              Visa alla
            </Link>
          </div>
          <div className="divide-y divide-gray-100">
            {recentActivity.map((activity) => (
              <Link
                key={activity.id}
                href={`/admin/social-workers/${activity.id}`}
                className="flex items-center justify-between p-4 hover:bg-gray-50 transition"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#003D5C]/10 rounded-full flex items-center justify-center">
                    <span className="text-[#003D5C] font-medium">{activity.name.charAt(0)}</span>
                  </div>
                  <div>
                    <p className="font-medium text-[#003D5C]">{activity.name}</p>
                    <p className="text-sm text-gray-500">{activity.email}</p>
                  </div>
                </div>
                <div className="text-right">
                  {getStatusBadge(activity.status)}
                  <p className="text-xs text-gray-500 mt-1">{activity.municipality}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <h2 className="font-semibold text-[#003D5C]">Snabbåtgärder</h2>
          </div>
          <div className="p-4 space-y-3">
            <Link
              href="/admin/social-workers/new"
              className="flex items-center gap-3 p-3 bg-[#F39C12] text-white rounded-lg hover:bg-[#E67E22] transition"
            >
              <Plus size={20} />
              <span className="font-medium">Lägg till socialsekreterare</span>
            </Link>
            <Link
              href="/admin/social-workers?filter=pending"
              className="flex items-center gap-3 p-3 bg-[#003D5C] text-white rounded-lg hover:bg-[#004e75] transition"
            >
              <Clock size={20} />
              <span className="font-medium">Granska väntande ({stats.pendingVerification})</span>
            </Link>
            <Link
              href="/admin/volunteers"
              className="flex items-center gap-3 p-3 border border-[#003D5C] text-[#003D5C] rounded-lg hover:bg-gray-50 transition"
            >
              <Eye size={20} />
              <span className="font-medium">Visa alla volontärer</span>
            </Link>
            <Link
              href="/admin/settings"
              className="flex items-center gap-3 p-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
            >
              <BarChart3 size={20} />
              <span className="font-medium">Systemstatistik</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Social Workers by Municipality */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="font-semibold text-[#003D5C] mb-4">Socialsekreterare per kommun</h3>
          <div className="space-y-3">
            {municipalityData.map((item: {name: string, count: number}, index: number) => (
              <div key={index} className="flex items-center gap-3">
                <span className="w-24 text-sm text-gray-600 truncate">{item.name}</span>
                <div className="flex-1 bg-gray-100 rounded-full h-6 overflow-hidden">
                  <div 
                    className="bg-[#003D5C] h-full rounded-full flex items-center justify-end pr-2"
                    style={{ width: `${(item.count / 15) * 100}%` }}
                  >
                    <span className="text-xs text-white font-medium">{item.count}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Verification Status */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="font-semibold text-[#003D5C] mb-4">Verifieringsstatus</h3>
          <div className="flex items-center justify-center gap-8">
            <div className="text-center">
              <div className="w-24 h-24 rounded-full border-8 border-[#27AE60] flex items-center justify-center mb-2">
                <span className="text-2xl font-bold text-[#003D5C]">89%</span>
              </div>
              <p className="text-sm text-gray-600">Verifierade</p>
              <p className="text-lg font-bold text-[#003D5C]">{stats.activeAccounts}</p>
            </div>
            <div className="text-center">
              <div className="w-24 h-24 rounded-full border-8 border-[#F39C12] flex items-center justify-center mb-2">
                <span className="text-2xl font-bold text-[#003D5C]">11%</span>
              </div>
              <p className="text-sm text-gray-600">Väntande</p>
              <p className="text-lg font-bold text-[#003D5C]">{stats.pendingVerification}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
