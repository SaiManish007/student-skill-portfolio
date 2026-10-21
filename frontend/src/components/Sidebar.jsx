import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  User,
  Wrench,
  FolderGit2,
  Award,
  Trophy,
  Terminal,
  ShieldCheck,
  Globe,
  Sparkles,
} from 'lucide-react';

export default function Sidebar({ mobileOpen, onCloseMobile }) {
  const { user, isAdmin } = useAuth();

  const studentLinks = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/profile', label: 'Profile & Details', icon: User },
    { to: '/skills', label: 'Skills & Tech', icon: Wrench },
    { to: '/projects', label: 'Projects', icon: FolderGit2 },
    { to: '/certifications', label: 'Certifications', icon: Award },
    { to: '/achievements', label: 'Achievements', icon: Trophy },
    { to: '/coding-profiles', label: 'Coding Profiles', icon: Terminal },
  ];

  const adminLinks = [
    { to: '/admin', label: 'Admin Dashboard', icon: ShieldCheck },
  ];

  const links = isAdmin ? adminLinks : studentLinks;

  const sidebarContent = (
    <div className="h-full flex flex-col justify-between p-4">
      <div className="space-y-6">
        <div>
          <p className="px-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
            {isAdmin ? 'Administration' : 'Portfolio Management'}
          </p>
          <nav className="space-y-1">
            {links.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={onCloseMobile}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`
                  }
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Portfolio Status Footer Card (for students) */}
      {!isAdmin && user && (
        <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-50 to-blue-50 border border-indigo-100/80">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-indigo-950 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-indigo-600" />
              Public Status
            </span>
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                user.isPublished
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-amber-100 text-amber-800'
              }`}
            >
              {user.isPublished ? 'PUBLISHED' : 'UNPUBLISHED'}
            </span>
          </div>
          <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed">
            {user.isPublished
              ? `Live at /p/${user.portfolioSlug || '...'}`
              : 'Portfolio is hidden from public view'}
          </p>
          {user.portfolioSlug && user.isPublished && (
            <a
              href={`/p/${user.portfolioSlug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 flex items-center justify-center gap-1.5 w-full py-1.5 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium transition-colors shadow-sm shadow-indigo-600/20"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Open Live Showcase
            </a>
          )}
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:block w-64 shrink-0 bg-white border-r border-slate-200/80 min-h-[calc(100vh-4rem)]">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden flex">
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
            onClick={onCloseMobile}
          />
          <div className="relative w-72 max-w-xs bg-white h-full shadow-2xl z-50 animate-in slide-in-from-left duration-200">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}
