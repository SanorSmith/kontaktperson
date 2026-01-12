'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  UserCheck,
  Shield,
  FileText,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronRight
} from 'lucide-react';

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  badge?: number;
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [pendingCount, setPendingCount] = useState(3); // Mock pending count
  const [adminUser, setAdminUser] = useState({ name: 'Admin', email: 'admin@kontaktperson.se' });

  const navItems: NavItem[] = [
    { label: 'Dashboard', href: '/admin', icon: <LayoutDashboard size={20} /> },
    { label: 'Socialsekreterare', href: '/admin/social-workers', icon: <Users size={20} />, badge: pendingCount },
    { label: 'Volontärer', href: '/admin/volunteers', icon: <UserCheck size={20} /> },
    { label: 'Behörigheter', href: '/admin/permissions', icon: <Shield size={20} /> },
    { label: 'Granskningsloggar', href: '/admin/audit-logs', icon: <FileText size={20} /> },
    { label: 'Inställningar', href: '/admin/settings', icon: <Settings size={20} /> },
  ];

  const isActive = (href: string) => {
    if (href === '/admin') return pathname === '/admin';
    return pathname.startsWith(href);
  };

  const handleLogout = () => {
    localStorage.removeItem('adminUser');
    window.location.href = '/login';
  };

  const formatDate = () => {
    return new Date().toLocaleDateString('sv-SE', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Get breadcrumbs from pathname
  const getBreadcrumbs = () => {
    const paths = pathname.split('/').filter(Boolean);
    const breadcrumbs = [{ label: 'Admin', href: '/admin' }];
    
    const labels: Record<string, string> = {
      'social-workers': 'Socialsekreterare',
      'volunteers': 'Volontärer',
      'permissions': 'Behörigheter',
      'audit-logs': 'Granskningsloggar',
      'settings': 'Inställningar',
      'new': 'Lägg till',
      'edit': 'Redigera'
    };

    let currentPath = '';
    paths.forEach((path, index) => {
      if (index === 0) return; // Skip 'admin'
      currentPath += `/${path}`;
      if (labels[path]) {
        breadcrumbs.push({ label: labels[path], href: `/admin${currentPath}` });
      }
    });

    return breadcrumbs;
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50
        w-64 bg-[#003D5C] text-white
        transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        flex flex-col
      `}>
        {/* Logo */}
        <div className="p-4 border-b border-white/10">
          <Link href="/admin" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#F39C12] rounded-lg flex items-center justify-center">
              <Shield size={24} className="text-white" />
            </div>
            <div>
              <span className="font-bold text-lg block">Admin Panel</span>
              <span className="text-xs text-white/60">Kontaktperson Platform</span>
            </div>
          </Link>
        </div>

        {/* Admin Profile */}
        <div className="p-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
              <span className="text-lg font-bold">{adminUser.name.charAt(0)}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{adminUser.name}</p>
              <p className="text-xs text-white/60 truncate">{adminUser.email}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setSidebarOpen(false)}
              className={`
                flex items-center gap-3 px-4 py-3 rounded-lg transition-all
                ${isActive(item.href) 
                  ? 'bg-[#F39C12] text-white' 
                  : 'text-white/80 hover:bg-white/10 hover:text-white'
                }
              `}
            >
              {item.icon}
              <span className="flex-1">{item.label}</span>
              {item.badge && item.badge > 0 && (
                <span className={`
                  px-2 py-0.5 text-xs font-bold rounded-full
                  ${isActive(item.href) ? 'bg-white text-[#F39C12]' : 'bg-[#F39C12] text-white'}
                `}>
                  {item.badge}
                </span>
              )}
            </Link>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition"
          >
            <LogOut size={20} />
            <span>Logga ut</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top Bar */}
        <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-4 lg:px-6 sticky top-0 z-30">
          <div className="flex items-center gap-4">
            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
            >
              {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Breadcrumbs */}
            <nav className="hidden md:flex items-center gap-2 text-sm">
              {getBreadcrumbs().map((crumb, index, arr) => (
                <div key={crumb.href} className="flex items-center gap-2">
                  {index > 0 && <ChevronRight size={16} className="text-gray-400" />}
                  {index === arr.length - 1 ? (
                    <span className="text-[#003D5C] font-medium">{crumb.label}</span>
                  ) : (
                    <Link href={crumb.href} className="text-gray-500 hover:text-[#003D5C]">
                      {crumb.label}
                    </Link>
                  )}
                </div>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-4">
            {/* Date */}
            <span className="hidden sm:block text-sm text-gray-500 capitalize">
              {formatDate()}
            </span>

            {/* Admin Name */}
            <div className="flex items-center gap-2 pl-4 border-l border-gray-200">
              <div className="w-8 h-8 bg-[#003D5C] rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">{adminUser.name.charAt(0)}</span>
              </div>
              <span className="hidden sm:block text-sm font-medium text-[#003D5C]">
                {adminUser.name}
              </span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 lg:p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
