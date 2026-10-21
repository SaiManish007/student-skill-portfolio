import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, ArrowLeft, HelpCircle } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center p-4 text-center font-sans">
      <div className="w-16 h-16 rounded-3xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-6 shadow-sm border border-indigo-100">
        <HelpCircle className="w-8 h-8" />
      </div>

      <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">404 - Page Not Found</h1>
      <p className="mt-3 text-sm text-slate-600 max-w-sm leading-relaxed">
        The page you are looking for does not exist, has been removed, or is temporarily unavailable.
      </p>

      <div className="mt-8 flex gap-3">
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold shadow-sm transition-all shadow-indigo-600/20"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return Home</span>
        </Link>
      </div>

      <p className="mt-12 text-xs text-slate-400">Skillfolio • Student Skill & Project Portfolio System</p>
    </div>
  );
}
