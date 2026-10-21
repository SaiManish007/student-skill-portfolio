import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { profileApi } from '../services/api';
import { useToast } from '../components/Toast';
import { 
  Terminal, 
  Github, 
  ExternalLink, 
  Info, 
  Pencil, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';

export default function CodingProfilesPage() {
  const { error } = useToast();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const res = await profileApi.getMyProfile();
      if (res.data?.success) {
        setProfile(res.data.data);
      }
    } catch (err) {
      error('Failed to load coding profile configuration.');
    } finally {
      setLoading(false);
    }
  };

  const platforms = [
    {
      name: 'GitHub',
      icon: Github,
      iconColor: 'bg-slate-900 text-white',
      url: profile?.githubUrl,
      description: 'Public repositories, commits, and open-source contributions.',
      statusText: 'Direct Repository Launch',
    },
    {
      name: 'LeetCode',
      badge: 'LC',
      iconColor: 'bg-amber-500 text-white',
      url: profile?.leetcodeUrl,
      description: 'Data structures, algorithm practice, and contest ratings.',
      statusText: 'Direct Contest & Problem Profile Launch',
    },
    {
      name: 'CodeChef',
      badge: 'CC',
      iconColor: 'bg-stone-700 text-white',
      url: profile?.codechefUrl,
      description: 'Competitive programming divisions, stars, and challenge ratings.',
      statusText: 'Direct Star Rating Launch',
    },
  ];

  return (
    <div className="space-y-6 font-sans">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Coding Platform Profiles</h1>
          <p className="text-sm text-slate-500 mt-1">
            Verified platform shortcuts for campus recruiters and coding evaluators.
          </p>
        </div>

        <Link
          to="/profile"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold shadow-sm transition-all"
        >
          <Pencil className="w-4 h-4" />
          <span>Edit Profile URLs</span>
        </Link>
      </div>

      {/* Academic Policy Notice */}
      <div className="p-4 rounded-2xl bg-indigo-50/80 border border-indigo-200/80 flex items-start gap-3">
        <Info className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
        <div className="text-xs text-indigo-950 leading-relaxed space-y-1">
          <p className="font-bold">Transparent Verification Standard:</p>
          <p>
            In compliance with strict academic integrity guidelines, Skillfolio does not simulate or invent fake real-time contest metrics. 
            All links connect evaluators and recruiters directly to your official authenticated profile.
          </p>
        </div>
      </div>

      {/* Platform Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {platforms.map((platform) => {
          const Icon = platform.icon;
          const isConfigured = Boolean(platform.url);

          return (
            <div
              key={platform.name}
              className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-base shadow-sm ${platform.iconColor}`}>
                    {Icon ? <Icon className="w-6 h-6" /> : platform.badge}
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    isConfigured 
                      ? 'bg-emerald-100 text-emerald-800' 
                      : 'bg-slate-100 text-slate-500'
                  }`}>
                    {isConfigured ? 'LINKED' : 'UNCONFIGURED'}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-slate-900">{platform.name}</h3>
                <p className="text-xs text-slate-500 mt-1">{platform.description}</p>

                {/* Explicit State Pill as requested by Functional Req 7 */}
                <div className="mt-4 p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600 space-y-1">
                  <div className="font-semibold text-slate-700">Platform Sync State:</div>
                  <div className="text-slate-500">
                    Statistics integration not configured (Direct Profile Launch Active)
                  </div>
                </div>

                {isConfigured ? (
                  <div className="mt-4 p-2.5 rounded-xl bg-indigo-50/50 border border-indigo-100 text-xs text-indigo-900 truncate">
                    <span className="font-semibold block text-[10px] uppercase text-indigo-500">Target URL:</span>
                    <span className="font-mono text-xs">{platform.url}</span>
                  </div>
                ) : (
                  <div className="mt-4 p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-400 italic">
                    No URL added yet
                  </div>
                )}
              </div>

              {/* Action */}
              <div className="mt-6 pt-4 border-t border-slate-100">
                {isConfigured ? (
                  <a
                    href={platform.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-sm transition-colors"
                  >
                    <span>Open Official Profile</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                ) : (
                  <Link
                    to="/profile"
                    className="w-full flex items-center justify-center gap-1.5 py-2 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
                  >
                    <span>Configure in Profile</span>
                  </Link>
                )}
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}
