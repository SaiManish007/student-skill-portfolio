import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { dashboardApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import { StatCardSkeleton } from '../components/LoadingSkeleton';
import { 
  Wrench, 
  FolderGit2, 
  Award, 
  Trophy, 
  Sparkles, 
  Copy, 
  Check, 
  ExternalLink, 
  ArrowRight,
  Github,
  Code,
  Globe,
  Plus
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  Cell 
} from 'recharts';

export default function StudentDashboardPage() {
  const { user } = useAuth();
  const { success, error } = useToast();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const res = await dashboardApi.getStudentDashboard();
      if (res.data?.success) {
        setData(res.data.data);
      }
    } catch (err) {
      error('Failed to load dashboard statistics.');
    } finally {
      setLoading(false);
    }
  };

  const copyPublicLink = () => {
    if (!data?.portfolioSlug) return;
    const url = `${window.location.origin}/p/${data.portfolioSlug}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    success('Public portfolio link copied to clipboard!');
    setTimeout(() => setCopied(false), 3000);
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-28 bg-white rounded-3xl border border-slate-200"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCardSkeleton />
          <StatCardSkeleton />
          <StatCardSkeleton />
          <StatCardSkeleton />
        </div>
      </div>
    );
  }

  // Real chart data from backend
  const chartData = [
    { category: 'Technical', count: data?.skillsByCategory?.Technical || 0, color: '#4f46e5' },
    { category: 'Soft Skills', count: data?.skillsByCategory?.Soft || 0, color: '#06b6d4' },
    { category: 'Tools', count: data?.skillsByCategory?.Tools || 0, color: '#8b5cf6' },
  ];

  const totalSkillsCount = data?.totalSkills || 0;

  return (
    <div className="space-y-6 font-sans">
      
      {/* Welcome Banner & Public Status */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-navy-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-2 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-indigo-200 text-xs font-semibold backdrop-blur-sm">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Student Academic Portfolio</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome back, {data?.fullName || user?.fullName || 'Student'}!
          </h1>
          <p className="text-slate-300 text-sm max-w-xl leading-relaxed">
            Manage your academic credentials, showcase real-world projects, and share your verifiable profile with campus placement recruiters.
          </p>
        </div>

        {/* Public Share Card */}
        <div className="bg-white/10 backdrop-blur-md border border-white/15 p-4 rounded-2xl md:max-w-xs w-full flex flex-col gap-3 relative z-10 shrink-0">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-indigo-400" />
              Public Portfolio
            </span>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
              data?.published ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
            }`}>
              {data?.published ? 'LIVE' : 'PRIVATE'}
            </span>
          </div>

          <p className="text-xs text-slate-300">
            {data?.published ? (
              <span>Your portfolio is active and visible to recruiters.</span>
            ) : (
              <span>Your portfolio is currently hidden from public view. Enable it in Profile Settings.</span>
            )}
          </p>

          <div className="flex gap-2">
            {data?.portfolioSlug && data?.published ? (
              <>
                <button
                  onClick={copyPublicLink}
                  className="flex-1 py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy Link'}</span>
                </button>
                <Link
                  to={`/p/${data.portfolioSlug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2 px-3 rounded-xl bg-white/20 hover:bg-white/30 text-white text-xs font-medium transition-colors flex items-center justify-center gap-1"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </>
            ) : (
              <Link
                to="/profile"
                className="w-full py-2 px-3 rounded-xl bg-white/20 hover:bg-white/30 text-white text-xs font-medium transition-colors text-center"
              >
                Configure Public URL
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Real Counts Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Skills Logged</p>
            <p className="text-3xl font-extrabold text-slate-900 mt-1">{data?.totalSkills ?? 0}</p>
            <Link to="/skills" className="text-xs font-medium text-indigo-600 hover:text-indigo-700 mt-1 inline-flex items-center gap-1">
              <span>Manage skills</span> <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Wrench className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Projects</p>
            <p className="text-3xl font-extrabold text-slate-900 mt-1">{data?.totalProjects ?? 0}</p>
            <Link to="/projects" className="text-xs font-medium text-blue-600 hover:text-blue-700 mt-1 inline-flex items-center gap-1">
              <span>View projects</span> <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <FolderGit2 className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Certifications</p>
            <p className="text-3xl font-extrabold text-slate-900 mt-1">{data?.totalCertifications ?? 0}</p>
            <Link to="/certifications" className="text-xs font-medium text-emerald-600 hover:text-emerald-700 mt-1 inline-flex items-center gap-1">
              <span>View credentials</span> <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Award className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Achievements</p>
            <p className="text-3xl font-extrabold text-slate-900 mt-1">{data?.totalAchievements ?? 0}</p>
            <Link to="/achievements" className="text-xs font-medium text-purple-600 hover:text-purple-700 mt-1 inline-flex items-center gap-1">
              <span>View honors</span> <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <Trophy className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Profile Completion & Real Skills Distribution Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Profile Completion Card */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-slate-900">Profile Completion</h2>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                {data?.profileCompletionPercentage ?? 0}%
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-100 rounded-full h-3 mb-4 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-indigo-500 to-blue-600 h-3 rounded-full transition-all duration-500"
                style={{ width: `${data?.profileCompletionPercentage ?? 0}%` }}
              ></div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              A high completion score highlights your profile to recruiters and ensures your viva submission is comprehensive.
            </p>

            <ul className="space-y-2 text-xs text-slate-600">
              <li className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${data?.fullName ? 'bg-emerald-500' : 'bg-slate-300'}`}></span>
                <span>Personal & Academic Details</span>
              </li>
              <li className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${totalSkillsCount > 0 ? 'bg-emerald-500' : 'bg-slate-300'}`}></span>
                <span>Technical Skills ({totalSkillsCount} added)</span>
              </li>
              <li className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${(data?.totalProjects || 0) > 0 ? 'bg-emerald-500' : 'bg-slate-300'}`}></span>
                <span>Projects ({data?.totalProjects || 0} added)</span>
              </li>
              <li className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${(data?.githubConfigured || data?.leetcodeConfigured) ? 'bg-emerald-500' : 'bg-slate-300'}`}></span>
                <span>Coding Profiles Linked</span>
              </li>
            </ul>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100">
            <Link
              to="/profile"
              className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-colors"
            >
              <span>Complete Missing Fields</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Real Skills Breakdown Chart */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm lg:col-span-2 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">Skill Distribution by Category</h2>
              <p className="text-xs text-slate-500">Real counts calculated directly from your saved database records</p>
            </div>
            <Link
              to="/skills"
              className="text-xs font-medium text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Skill</span>
            </Link>
          </div>

          {totalSkillsCount === 0 ? (
            <div className="h-56 flex flex-col items-center justify-center text-center p-6 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
              <Wrench className="w-8 h-8 text-slate-400 mb-2" />
              <p className="text-sm font-semibold text-slate-700">No Skills Recorded</p>
              <p className="text-xs text-slate-500 mt-1 max-w-xs">
                Log your technical, soft, and tool capabilities to generate live distribution charts.
              </p>
              <Link
                to="/skills"
                className="mt-3 px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-medium"
              >
                Add Your First Skill
              </Link>
            </div>
          ) : (
            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey="category" tick={{ fill: '#64748b', fontSize: 12 }} />
                  <YAxis allowDecimals={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                  <Tooltip 
                    cursor={{ fill: '#f1f5f9' }}
                    contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
                  />
                  <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Verified DB Aggregate</span>
            <span>Total Skills: {totalSkillsCount}</span>
          </div>
        </div>

      </div>

      {/* Recent Projects & Coding Profiles Shortcuts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Recent Projects (2 cols) */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-slate-900">Recently Added Projects</h2>
            <Link
              to="/projects"
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {(!data?.recentProjects || data.recentProjects.length === 0) ? (
            <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
              <FolderGit2 className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-700">No Projects Added Yet</p>
              <p className="text-xs text-slate-500 mt-1">Showcase your capstone, course, or hackathon projects here.</p>
              <Link
                to="/projects"
                className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-medium"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add First Project</span>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {data.recentProjects.map((p) => (
                <div
                  key={p.id}
                  className="p-4 rounded-2xl bg-slate-50 border border-slate-200 hover:border-indigo-200 transition-colors flex items-start justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-slate-900">{p.title}</h4>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        p.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-800' :
                        p.status === 'IN_PROGRESS' ? 'bg-amber-100 text-amber-800' : 'bg-slate-200 text-slate-700'
                      }`}>
                        {p.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 line-clamp-1">{p.description}</p>
                    <p className="text-[11px] font-medium text-indigo-600">{p.technologies}</p>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    {p.githubUrl && (
                      <a
                        href={p.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-200 transition-colors"
                        title="GitHub Repository"
                      >
                        <Github className="w-4 h-4" />
                      </a>
                    )}
                    {p.liveDemoUrl && (
                      <a
                        href={p.liveDemoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-slate-200 transition-colors"
                        title="Live Demo"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Coding Profiles Shortcut Card */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-slate-900">Coding Profiles</h2>
              <Link
                to="/coding-profiles"
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-700"
              >
                Configure
              </Link>
            </div>

            <div className="space-y-3">
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center">
                    <Github className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">GitHub</p>
                    <p className="text-[10px] text-slate-500">
                      {data?.githubConfigured ? 'Linked & Verified' : 'Not configured'}
                    </p>
                  </div>
                </div>
                <span className={`w-2 h-2 rounded-full ${data?.githubConfigured ? 'bg-emerald-500' : 'bg-slate-300'}`}></span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold text-xs">
                    LC
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">LeetCode</p>
                    <p className="text-[10px] text-slate-500">
                      {data?.leetcodeConfigured ? 'Linked & Verified' : 'Not configured'}
                    </p>
                  </div>
                </div>
                <span className={`w-2 h-2 rounded-full ${data?.leetcodeConfigured ? 'bg-emerald-500' : 'bg-slate-300'}`}></span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-stone-700 text-white flex items-center justify-center font-bold text-xs">
                    CC
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">CodeChef</p>
                    <p className="text-[10px] text-slate-500">
                      {data?.codechefConfigured ? 'Linked & Verified' : 'Not configured'}
                    </p>
                  </div>
                </div>
                <span className={`w-2 h-2 rounded-full ${data?.codechefConfigured ? 'bg-emerald-500' : 'bg-slate-300'}`}></span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100">
            <Link
              to="/coding-profiles"
              className="w-full py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded-xl flex items-center justify-center gap-1.5 transition-colors"
            >
              <span>Manage Profile URLs</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

      </div>

    </div>
  );
}
