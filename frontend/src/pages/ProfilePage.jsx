import React, { useEffect, useState } from 'react';
import { profileApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import { 
  User, 
  GraduationCap, 
  Building, 
  MapPin, 
  Phone, 
  Mail, 
  Globe, 
  Linkedin, 
  Github, 
  Code2, 
  Link2, 
  Check, 
  Copy, 
  ExternalLink, 
  Save, 
  Sparkles,
  AlertCircle
} from 'lucide-react';

export default function ProfilePage() {
  const { updateUser } = useAuth();
  const { success, error } = useToast();

  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingSlug, setSavingSlug] = useState(false);
  const [togglingPublish, setTogglingPublish] = useState(false);
  const [copied, setCopied] = useState(false);

  // Profile Form state
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    college: '',
    department: '',
    degree: '',
    academicYear: '',
    graduationYear: '',
    bio: '',
    location: '',
    profileImageUrl: '',
    linkedinUrl: '',
    githubUrl: '',
    leetcodeUrl: '',
    codechefUrl: '',
    portfolioSlug: '',
    isPublished: false,
  });

  const [slugInput, setSlugInput] = useState('');

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const res = await profileApi.getMyProfile();
      if (res.data?.success) {
        const p = res.data.data;
        setFormData({
          fullName: p.fullName || '',
          email: p.email || '',
          phone: p.phone || '',
          college: p.college || '',
          department: p.department || '',
          degree: p.degree || '',
          academicYear: p.academicYear || '',
          graduationYear: p.graduationYear || '',
          bio: p.bio || '',
          location: p.location || '',
          profileImageUrl: p.profileImageUrl || '',
          linkedinUrl: p.linkedinUrl || '',
          githubUrl: p.githubUrl || '',
          leetcodeUrl: p.leetcodeUrl || '',
          codechefUrl: p.codechefUrl || '',
          portfolioSlug: p.portfolioSlug || '',
          isPublished: p.isPublished || false,
        });
        setSlugInput(p.portfolioSlug || '');
      }
    } catch (err) {
      error('Failed to load profile details.');
    } finally {
      setLoading(false);
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      setSavingProfile(true);
      const payload = {
        fullName: formData.fullName.trim(),
        phone: formData.phone.trim() || null,
        college: formData.college.trim() || null,
        department: formData.department.trim() || null,
        degree: formData.degree.trim() || null,
        academicYear: formData.academicYear.trim() || null,
        graduationYear: formData.graduationYear ? parseInt(formData.graduationYear) : null,
        bio: formData.bio.trim() || null,
        location: formData.location.trim() || null,
        profileImageUrl: formData.profileImageUrl.trim() || null,
        linkedinUrl: formData.linkedinUrl.trim() || null,
        githubUrl: formData.githubUrl.trim() || null,
        leetcodeUrl: formData.leetcodeUrl.trim() || null,
        codechefUrl: formData.codechefUrl.trim() || null,
      };

      const res = await profileApi.updateMyProfile(payload);
      if (res.data?.success) {
        success('Profile updated successfully!');
        updateUser({ fullName: res.data.data.fullName });
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to update profile.';
      error(msg);
    } finally {
      setSavingProfile(false);
    }
  };

  const handleSlugUpdate = async (e) => {
    e.preventDefault();
    if (!slugInput.trim()) return;

    try {
      setSavingSlug(true);
      const res = await profileApi.updateSlug(slugInput.trim());
      if (res.data?.success) {
        success('Portfolio URL slug updated!');
        setFormData((prev) => ({ ...prev, portfolioSlug: res.data.data.portfolioSlug }));
        updateUser({ portfolioSlug: res.data.data.portfolioSlug });
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to update slug. It may already be in use.';
      error(msg);
    } finally {
      setSavingSlug(false);
    }
  };

  const handleTogglePublish = async () => {
    try {
      setTogglingPublish(true);
      const nextStatus = !formData.isPublished;
      const res = await profileApi.updatePublishStatus(nextStatus);
      if (res.data?.success) {
        setFormData((prev) => ({ ...prev, isPublished: res.data.data.isPublished }));
        updateUser({ isPublished: res.data.data.isPublished });
        success(res.data.data.isPublished ? 'Portfolio is now published publicly!' : 'Portfolio is now private.');
      }
    } catch (err) {
      error('Failed to update publication status.');
    } finally {
      setTogglingPublish(false);
    }
  };

  const copyLink = () => {
    if (!formData.portfolioSlug) return;
    const url = `${window.location.origin}/p/${formData.portfolioSlug}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    success('Public link copied to clipboard!');
    setTimeout(() => setCopied(false), 3000);
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-44 bg-white rounded-3xl border border-slate-200"></div>
        <div className="h-96 bg-white rounded-3xl border border-slate-200"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 font-sans max-w-4xl mx-auto">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Student Profile & Settings</h1>
        <p className="text-sm text-slate-500 mt-1">
          Maintain your verified personal credentials, social profiles, and public portfolio availability.
        </p>
      </div>

      {/* Public URL & Publishing Card */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900">Public Portfolio Status</h2>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                formData.isPublished 
                  ? 'bg-emerald-100 text-emerald-800' 
                  : 'bg-amber-100 text-amber-800'
              }`}>
                {formData.isPublished ? 'PUBLISHED' : 'PRIVATE'}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Toggle whether recruiters and examiners can view your published portfolio showcase.
            </p>
          </div>

          <button
            type="button"
            onClick={handleTogglePublish}
            disabled={togglingPublish}
            className={`px-5 py-2.5 rounded-xl font-semibold text-xs transition-all shadow-sm flex items-center gap-2 ${
              formData.isPublished
                ? 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
                : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-600/20'
            }`}
          >
            {togglingPublish ? 'Updating...' : formData.isPublished ? 'Unpublish Portfolio' : 'Publish to Public'}
          </button>
        </div>

        {/* Custom Slug Editor */}
        <form onSubmit={handleSlugUpdate} className="space-y-3">
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
            Custom Portfolio URL Slug
          </label>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <div className="flex items-center rounded-xl bg-slate-50 border border-slate-300 px-3 py-2 text-sm text-slate-500 flex-1 focus-within:bg-white focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:border-indigo-600">
              <span className="text-slate-400 select-none mr-1">{window.location.origin}/p/</span>
              <input
                type="text"
                value={slugInput}
                onChange={(e) => setSlugInput(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                placeholder="your-unique-slug"
                className="bg-transparent border-none p-0 text-slate-900 font-medium focus:outline-none w-full"
                required
              />
            </div>
            <button
              type="submit"
              disabled={savingSlug || slugInput === formData.portfolioSlug}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 disabled:text-slate-400 text-white text-xs font-semibold rounded-xl transition-colors shrink-0 shadow-sm"
            >
              {savingSlug ? 'Saving...' : 'Update Slug'}
            </button>
          </div>

          {formData.portfolioSlug && formData.isPublished && (
            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={copyLink}
                className="inline-flex items-center gap-1.5 text-xs text-indigo-600 hover:text-indigo-700 font-medium"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied Link!' : 'Copy Shareable URL'}</span>
              </button>
              <span className="text-slate-300">•</span>
              <a
                href={`/p/${formData.portfolioSlug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-700 font-medium"
              >
                <span>Preview Public View</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          )}
        </form>
      </div>

      {/* Main Profile Details Form */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm">
        <form onSubmit={handleProfileSubmit} className="space-y-6">
          <h2 className="text-base font-bold text-slate-900 pb-3 border-b border-slate-100">
            Personal & Academic Information
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Full Name *
              </label>
              <input
                type="text"
                required
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full px-3.5 py-2.5 text-sm text-slate-900 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Account Email (Read Only)
              </label>
              <input
                type="email"
                disabled
                value={formData.email}
                className="w-full px-3.5 py-2.5 text-sm text-slate-500 bg-slate-100 border border-slate-200 rounded-xl cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Phone Number (Optional)
              </label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+91 98765 43210"
                className="w-full px-3.5 py-2.5 text-sm text-slate-900 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
              />
              <p className="text-[10px] text-slate-400 mt-1">Note: Phone is private and never exposed on your public URL.</p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Location (Optional)
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="e.g. Bangalore, India"
                className="w-full px-3.5 py-2.5 text-sm text-slate-900 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                College / University
              </label>
              <input
                type="text"
                value={formData.college}
                onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                placeholder="e.g. National Institute of Technology"
                className="w-full px-3.5 py-2.5 text-sm text-slate-900 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Department / Branch
              </label>
              <input
                type="text"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                placeholder="e.g. Computer Science & Engineering"
                className="w-full px-3.5 py-2.5 text-sm text-slate-900 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Degree Program
              </label>
              <input
                type="text"
                value={formData.degree}
                onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                placeholder="e.g. B.Tech Computer Science"
                className="w-full px-3.5 py-2.5 text-sm text-slate-900 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Academic Year
                </label>
                <input
                  type="text"
                  value={formData.academicYear}
                  onChange={(e) => setFormData({ ...formData, academicYear: e.target.value })}
                  placeholder="e.g. 3rd Year"
                  className="w-full px-3.5 py-2.5 text-sm text-slate-900 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Graduation Year
                </label>
                <input
                  type="number"
                  value={formData.graduationYear}
                  onChange={(e) => setFormData({ ...formData, graduationYear: e.target.value })}
                  placeholder="2027"
                  className="w-full px-3.5 py-2.5 text-sm text-slate-900 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Professional Bio & Academic Summary
            </label>
            <textarea
              rows={4}
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              placeholder="Write a brief professional summary highlighting your engineering interests, key technical areas, and career goals..."
              className="w-full px-3.5 py-2.5 text-sm text-slate-900 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 leading-relaxed"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Profile Avatar Image URL (Optional)
            </label>
            <input
              type="url"
              value={formData.profileImageUrl}
              onChange={(e) => setFormData({ ...formData, profileImageUrl: e.target.value })}
              placeholder="https://images.unsplash.com/photo-... or avatar link"
              className="w-full px-3.5 py-2.5 text-sm text-slate-900 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
            />
          </div>

          <h2 className="text-base font-bold text-slate-900 pt-4 pb-3 border-b border-slate-100">
            Professional & Coding Profile URLs
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Linkedin className="w-3.5 h-3.5 text-blue-600" />
                LinkedIn Profile URL
              </label>
              <input
                type="url"
                value={formData.linkedinUrl}
                onChange={(e) => setFormData({ ...formData, linkedinUrl: e.target.value })}
                placeholder="https://linkedin.com/in/username"
                className="w-full px-3.5 py-2.5 text-sm text-slate-900 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Github className="w-3.5 h-3.5 text-slate-800" />
                GitHub Profile URL
              </label>
              <input
                type="url"
                value={formData.githubUrl}
                onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                placeholder="https://github.com/username"
                className="w-full px-3.5 py-2.5 text-sm text-slate-900 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Code2 className="w-3.5 h-3.5 text-amber-500" />
                LeetCode Profile URL
              </label>
              <input
                type="url"
                value={formData.leetcodeUrl}
                onChange={(e) => setFormData({ ...formData, leetcodeUrl: e.target.value })}
                placeholder="https://leetcode.com/u/username"
                className="w-full px-3.5 py-2.5 text-sm text-slate-900 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Code2 className="w-3.5 h-3.5 text-stone-700" />
                CodeChef Profile URL
              </label>
              <input
                type="url"
                value={formData.codechefUrl}
                onChange={(e) => setFormData({ ...formData, codechefUrl: e.target.value })}
                placeholder="https://www.codechef.com/users/username"
                className="w-full px-3.5 py-2.5 text-sm text-slate-900 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
              />
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              disabled={savingProfile}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm rounded-xl shadow-md shadow-indigo-600/20 flex items-center gap-2 transition-all hover:-translate-y-0.5"
            >
              <Save className="w-4 h-4" />
              <span>{savingProfile ? 'Saving Details...' : 'Save Profile Changes'}</span>
            </button>
          </div>

        </form>
      </div>

    </div>
  );
}
