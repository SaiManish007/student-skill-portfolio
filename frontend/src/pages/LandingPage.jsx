import React from 'react';
import { Link } from 'react-router-dom';
import { 
  GraduationCap, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  ShieldCheck, 
  FolderGit2, 
  Award, 
  Terminal, 
  BookOpen, 
  Users 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function LandingPage() {
  const { isAuthenticated, isAdmin } = useAuth();

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans selection:bg-indigo-500 selection:text-white">
      {/* Top Header */}
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-blue-600 flex items-center justify-center text-white shadow-md shadow-indigo-600/20">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <span className="font-extrabold text-xl text-slate-900 tracking-tight">Skillfolio</span>
            <span className="ml-2 bg-indigo-100 text-indigo-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
              Academic SaaS
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <Link
              to={isAdmin ? "/admin" : "/dashboard"}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold shadow-sm transition-all shadow-indigo-600/20"
            >
              <span>Go to Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          ) : (
            <>
              <Link
                to="/login"
                className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold shadow-sm transition-all shadow-indigo-600/20"
              >
                <span>Get Started</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-12 pb-20 overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold mb-6 animate-subtle-pulse">
            <Sparkles className="w-3.5 h-3.5" />
            <span>B.Tech Academic Project • Centralized Student Portfolio System</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
            Empower Your Engineering Journey with{' '}
            <span className="bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-800 bg-clip-text text-transparent">
              Skillfolio
            </span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Centralize your academic & personal projects, technical skills, verified certifications, 
            and coding profiles into an elegant, recruiter-ready public portfolio.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/register"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-base shadow-lg shadow-indigo-600/25 transition-all hover:-translate-y-0.5"
            >
              <span>Build Your Portfolio Free</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/login"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-white hover:bg-slate-50 text-slate-800 font-semibold text-base border border-slate-300 shadow-sm transition-all"
            >
              <span>Student & Admin Login</span>
            </Link>
          </div>

          {/* Key Academic Metrics Pill Bar */}
          <div className="mt-14 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto">
            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
              <div className="text-2xl font-bold text-indigo-600">100%</div>
              <div className="text-xs font-medium text-slate-500 mt-0.5">Database Driven</div>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
              <div className="text-2xl font-bold text-blue-600">JWT</div>
              <div className="text-xs font-medium text-slate-500 mt-0.5">Role Authorization</div>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
              <div className="text-2xl font-bold text-emerald-600">Privacy</div>
              <div className="text-xs font-medium text-slate-500 mt-0.5">Recruiter Safe URLs</div>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
              <div className="text-2xl font-bold text-purple-600">Viva-Ready</div>
              <div className="text-xs font-medium text-slate-500 mt-0.5">Academic Architecture</div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section className="py-16 bg-white border-y border-slate-200/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Designed Specifically for Academic and Placement Success
            </h2>
            <p className="mt-2 text-sm sm:text-base text-slate-600">
              Everything required to represent engineering credentials accurately, verified with Spring Boot backend security.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 hover:border-indigo-300 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center mb-4">
                <FolderGit2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900">Curated Projects</h3>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                Showcase academic and personal projects with technology tags, roles, live demo URLs, and GitHub repository links.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 hover:border-indigo-300 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mb-4">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900">Skills & Certifications</h3>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                Categorize technical and soft skills, proficiency levels, and direct verification links for industry certifications.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 hover:border-indigo-300 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900">Faculty & Admin Oversight</h3>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                Admins and faculty members have a dedicated dashboard to search, review, and monitor student academic progression.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Viva Explanation Section */}
      <section className="py-16 max-w-5xl mx-auto px-4 sm:px-6">
        <div className="bg-gradient-to-br from-indigo-900 via-slate-900 to-navy-950 rounded-3xl p-8 sm:p-12 text-white shadow-xl relative overflow-hidden">
          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-indigo-200 text-xs font-semibold mb-4 backdrop-blur-sm">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Viva Voce Key Architecture</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Simple to Explain in an Academic Review
            </h2>
            <div className="mt-4 space-y-3 text-sm text-slate-300 leading-relaxed">
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Three-Tier Architecture:</strong> React/Tailwind frontend communicates via REST with Java 21 Spring Boot and PostgreSQL.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Strict Privacy Model:</strong> Public portfolios hide emails, phone numbers, and private credentials.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Role Isolation:</strong> Spring Security enforces owner boundaries so students cannot alter other peers' records.</span>
              </div>
            </div>
            <div className="mt-6 pt-6 border-t border-white/10 flex flex-wrap gap-4">
              <Link
                to="/register"
                className="px-5 py-2.5 rounded-xl bg-white text-slate-900 font-bold text-sm hover:bg-slate-100 transition-colors shadow"
              >
                Create Student Account
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 py-8 text-center text-xs text-slate-500">
        <p>Skillfolio • Student Skill & Project Portfolio System • B.Tech Third-Year Academic Project</p>
      </footer>
    </div>
  );
}
