import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { publicApi } from '../services/api';
import { 
  GraduationCap, 
  MapPin, 
  Linkedin, 
  Github, 
  Code2, 
  ExternalLink, 
  Calendar, 
  Award, 
  Trophy, 
  FolderGit2, 
  Wrench, 
  Copy, 
  Check, 
  Share2, 
  Lock,
  ArrowLeft
} from 'lucide-react';

export default function PublicPortfolioPage() {
  const { slug } = useParams();
  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    loadPortfolio();
  }, [slug]);

  const loadPortfolio = async () => {
    try {
      setLoading(true);
      setErrorMsg('');
      const res = await publicApi.getPublicPortfolio(slug);
      if (res.data?.success) {
        setPortfolio(res.data.data);
      }
    } catch (err) {
      if (err.response?.status === 404) {
        setErrorMsg('This portfolio is currently private or does not exist.');
      } else {
        setErrorMsg('Unable to load portfolio at this time.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-medium text-slate-500">Loading verified student portfolio...</p>
        </div>
      </div>
    );
  }

  if (errorMsg || !portfolio) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center p-4 text-center font-sans">
        <div className="w-16 h-16 rounded-3xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4 border border-amber-200">
          <Lock className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900">Portfolio Not Available</h1>
        <p className="text-sm text-slate-600 mt-2 max-w-md">
          {errorMsg || 'The requested student portfolio is not published or the link is invalid.'}
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Skillfolio Home</span>
        </Link>
      </div>
    );
  }

  // Filter skills by category
  const technicalSkills = portfolio.skills?.filter((s) => s.category?.toUpperCase() === 'TECHNICAL') || [];
  const softSkills = portfolio.skills?.filter((s) => s.category?.toUpperCase() === 'SOFT') || [];
  const toolSkills = portfolio.skills?.filter((s) => s.category?.toUpperCase() === 'TOOLS') || [];

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans selection:bg-indigo-500 selection:text-white pb-20">
      
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200/80">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold">
              <GraduationCap className="w-5 h-5" />
            </div>
            <span className="font-extrabold text-base text-slate-900 tracking-tight">Skillfolio</span>
          </Link>

          <button
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold border border-indigo-200 transition-colors shadow-sm"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
            <span>{copied ? 'Link Copied!' : 'Share Portfolio'}</span>
          </button>
        </div>
      </header>

      {/* Hero Profile Banner */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 pt-10">
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-sm relative overflow-hidden">
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            
            {/* Avatar */}
            {portfolio.profileImageUrl ? (
              <img
                src={portfolio.profileImageUrl}
                alt={portfolio.fullName}
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl object-cover border-4 border-indigo-50 shadow-md shrink-0"
              />
            ) : (
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-gradient-to-tr from-indigo-600 to-blue-600 text-white font-extrabold text-3xl flex items-center justify-center shadow-md shadow-indigo-600/20 shrink-0">
                {portfolio.fullName?.charAt(0).toUpperCase()}
              </div>
            )}

            {/* Profile Info */}
            <div className="flex-1 space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  {portfolio.fullName}
                </h1>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  Verified Student
                </span>
              </div>

              {/* Academic Subtitle */}
              <p className="text-sm font-semibold text-indigo-600">
                {[portfolio.degree, portfolio.department, portfolio.academicYear].filter(Boolean).join(' • ')}
              </p>

              <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-slate-500 font-medium">
                {portfolio.college && (
                  <span className="flex items-center gap-1">
                    <GraduationCap className="w-3.5 h-3.5 text-slate-400" />
                    {portfolio.college}
                  </span>
                )}
                {portfolio.location && (
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    {portfolio.location}
                  </span>
                )}
                {portfolio.graduationYear && (
                  <span>Graduating {portfolio.graduationYear}</span>
                )}
              </div>
            </div>

          </div>

          {/* Bio */}
          {portfolio.bio && (
            <div className="mt-6 pt-6 border-t border-slate-100">
              <p className="text-sm text-slate-700 leading-relaxed max-w-3xl">
                {portfolio.bio}
              </p>
            </div>
          )}

          {/* Social / Coding Profile Shortcuts */}
          <div className="mt-6 pt-6 border-t border-slate-100 flex flex-wrap items-center gap-2.5">
            {portfolio.githubUrl && (
              <a
                href={portfolio.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition-colors shadow-sm"
              >
                <Github className="w-3.5 h-3.5" />
                <span>GitHub</span>
              </a>
            )}

            {portfolio.linkedinUrl && (
              <a
                href={portfolio.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition-colors shadow-sm"
              >
                <Linkedin className="w-3.5 h-3.5" />
                <span>LinkedIn</span>
              </a>
            )}

            {portfolio.leetcodeUrl && (
              <a
                href={portfolio.leetcodeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500 text-white text-xs font-semibold hover:bg-amber-600 transition-colors shadow-sm"
              >
                <Code2 className="w-3.5 h-3.5" />
                <span>LeetCode</span>
              </a>
            )}

            {portfolio.codechefUrl && (
              <a
                href={portfolio.codechefUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-700 text-white text-xs font-semibold hover:bg-stone-800 transition-colors shadow-sm"
              >
                <Code2 className="w-3.5 h-3.5" />
                <span>CodeChef</span>
              </a>
            )}
          </div>

        </div>
      </section>

      {/* Portfolio Content Tabs/Sections */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 mt-8 space-y-10">
        
        {/* Skills Section */}
        {portfolio.skills && portfolio.skills.length > 0 && (
          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
                <Wrench className="w-4 h-4" />
              </div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">Skills & Tech Stack</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Technical */}
              {technicalSkills.length > 0 && (
                <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-600">Technical Skills</h3>
                  <div className="flex flex-wrap gap-1.5">
                    {technicalSkills.map((s) => (
                      <span
                        key={s.id}
                        className="px-2.5 py-1 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-900 text-xs font-semibold"
                      >
                        {s.name} <span className="text-[10px] text-indigo-500 font-normal">({s.proficiencyLevel?.toLowerCase()})</span>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Tools & DevOps */}
              {toolSkills.length > 0 && (
                <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-purple-600">Tools & DevOps</h3>
                  <div className="flex flex-wrap gap-1.5">
                    {toolSkills.map((s) => (
                      <span
                        key={s.id}
                        className="px-2.5 py-1 rounded-xl bg-purple-50 border border-purple-100 text-purple-900 text-xs font-semibold"
                      >
                        {s.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Soft Skills */}
              {softSkills.length > 0 && (
                <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-600">Soft Skills</h3>
                  <div className="flex flex-wrap gap-1.5">
                    {softSkills.map((s) => (
                      <span
                        key={s.id}
                        className="px-2.5 py-1 rounded-xl bg-cyan-50 border border-cyan-100 text-cyan-900 text-xs font-semibold"
                      >
                        {s.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Featured Projects Section */}
        {portfolio.projects && portfolio.projects.length > 0 && (
          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                <FolderGit2 className="w-4 h-4" />
              </div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">Featured Projects</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {portfolio.projects.map((p) => {
                const techList = p.technologies?.split(',').map((t) => t.trim()).filter(Boolean) || [];
                return (
                  <div
                    key={p.id}
                    className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <h3 className="text-lg font-bold text-slate-900 leading-snug">{p.title}</h3>
                        <span className="text-[10px] font-bold px-2.5 py-1 rounded-full uppercase bg-slate-100 text-slate-700">
                          {p.status}
                        </span>
                      </div>

                      <p className="text-xs text-slate-600 leading-relaxed mb-4">{p.description}</p>

                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {techList.map((tech, idx) => (
                          <span
                            key={idx}
                            className="px-2.5 py-0.5 rounded-lg bg-indigo-50 text-indigo-700 text-[11px] font-semibold border border-indigo-100"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-100 flex items-center gap-2">
                      {p.githubUrl && (
                        <a
                          href={p.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition-colors"
                        >
                          <Github className="w-3.5 h-3.5" />
                          <span>View Code</span>
                        </a>
                      )}
                      {p.liveDemoUrl && (
                        <a
                          href={p.liveDemoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold transition-colors shadow-sm"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>Live Demo</span>
                        </a>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Certifications Section */}
        {portfolio.certifications && portfolio.certifications.length > 0 && (
          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                <Award className="w-4 h-4" />
              </div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">Verified Certifications</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {portfolio.certifications.map((c) => (
                <div
                  key={c.id}
                  className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm flex flex-col justify-between"
                >
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 leading-snug">{c.name}</h3>
                    <p className="text-xs font-semibold text-slate-600 mt-1">{c.issuer}</p>
                    <p className="text-[11px] text-slate-400 mt-2">Issued: {c.issueDate}</p>
                  </div>

                  {c.credentialUrl && (
                    <div className="mt-4 pt-3 border-t border-slate-100">
                      <a
                        href={c.credentialUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-700 font-semibold"
                      >
                        <span>Verify Credential</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Achievements Section */}
        {portfolio.achievements && portfolio.achievements.length > 0 && (
          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center">
                <Trophy className="w-4 h-4" />
              </div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">Honors & Extracurriculars</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {portfolio.achievements.map((a) => (
                <div
                  key={a.id}
                  className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm space-y-2"
                >
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-sm font-bold text-slate-900 leading-snug">{a.title}</h3>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase bg-purple-50 text-purple-700 border border-purple-100">
                      {a.category}
                    </span>
                  </div>
                  {a.organization && (
                    <p className="text-xs text-slate-600 font-medium">{a.organization}</p>
                  )}
                  {a.description && (
                    <p className="text-xs text-slate-500 leading-relaxed">{a.description}</p>
                  )}
                  {a.evidenceUrl && (
                    <div className="pt-2">
                      <a
                        href={a.evidenceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-700 font-medium"
                      >
                        <span>View Evidence</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

      </main>

      {/* Public Footer */}
      <footer className="mt-20 border-t border-slate-200 py-8 text-center text-xs text-slate-500">
        <p>Built with Skillfolio • Student Skill & Project Portfolio System</p>
      </footer>

    </div>
  );
}
