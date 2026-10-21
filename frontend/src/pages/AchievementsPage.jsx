import React, { useEffect, useState } from 'react';
import { achievementApi } from '../services/api';
import { useToast } from '../components/Toast';
import ConfirmModal from '../components/ConfirmModal';
import EmptyState from '../components/EmptyState';
import { CardSkeleton } from '../components/LoadingSkeleton';
import { 
  Trophy, 
  Plus, 
  Pencil, 
  Trash2, 
  ExternalLink, 
  Calendar, 
  Building2, 
  X,
  Sparkles
} from 'lucide-react';

export default function AchievementsPage() {
  const { success, error } = useToast();
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingAch, setEditingAch] = useState(null);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    organization: '',
    eventDate: '',
    category: 'ACADEMIC',
    evidenceUrl: '',
  });

  // Delete Confirmation State
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [achToDelete, setAchToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    loadAchievements();
  }, []);

  const loadAchievements = async () => {
    try {
      setLoading(true);
      const res = await achievementApi.getAchievements();
      if (res.data?.success) {
        setAchievements(res.data.data);
      }
    } catch (err) {
      error('Failed to load achievements.');
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setEditingAch(null);
    setFormData({
      title: '',
      description: '',
      organization: '',
      eventDate: '',
      category: 'ACADEMIC',
      evidenceUrl: '',
    });
    setModalOpen(true);
  };

  const openEditModal = (ach) => {
    setEditingAch(ach);
    setFormData({
      title: ach.title,
      description: ach.description || '',
      organization: ach.organization || '',
      eventDate: ach.eventDate || '',
      category: ach.category,
      evidenceUrl: ach.evidenceUrl || '',
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      error('Please enter achievement title.');
      return;
    }

    try {
      setFormSubmitting(true);
      const payload = {
        title: formData.title.trim(),
        description: formData.description.trim() || null,
        organization: formData.organization.trim() || null,
        eventDate: formData.eventDate || null,
        category: formData.category,
        evidenceUrl: formData.evidenceUrl.trim() || null,
      };

      if (editingAch) {
        const res = await achievementApi.updateAchievement(editingAch.id, payload);
        if (res.data?.success) {
          success('Achievement updated!');
          setAchievements((prev) => prev.map((a) => (a.id === editingAch.id ? res.data.data : a)));
        }
      } else {
        const res = await achievementApi.createAchievement(payload);
        if (res.data?.success) {
          success('Achievement added!');
          setAchievements((prev) => [res.data.data, ...prev]);
        }
      }
      setModalOpen(false);
    } catch (err) {
      const msg = err.response?.data?.message || 'Operation failed.';
      error(msg);
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!achToDelete) return;
    try {
      setDeleting(true);
      await achievementApi.deleteAchievement(achToDelete.id);
      success('Achievement removed.');
      setAchievements((prev) => prev.filter((a) => a.id !== achToDelete.id));
      setDeleteModalOpen(false);
    } catch (err) {
      error('Failed to delete achievement.');
    } finally {
      setDeleting(false);
      setAchToDelete(null);
    }
  };

  const getCategoryBadge = (cat) => {
    switch (cat) {
      case 'HACKATHON':
        return { label: 'Hackathon', bg: 'bg-purple-100 text-purple-800' };
      case 'ACADEMIC':
        return { label: 'Academic Merit', bg: 'bg-blue-100 text-blue-800' };
      case 'EXTRACURRICULAR':
        return { label: 'Extracurricular', bg: 'bg-emerald-100 text-emerald-800' };
      case 'LEADERSHIP':
        return { label: 'Leadership', bg: 'bg-amber-100 text-amber-800' };
      case 'OTHER':
      default:
        return { label: 'Honors', bg: 'bg-slate-100 text-slate-800' };
    }
  };

  return (
    <div className="space-y-6 font-sans">
      
      {/* Header & Add Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Achievements & Activities</h1>
          <p className="text-sm text-slate-500 mt-1">
            Showcase hackathon prizes, academic scholarships, leadership roles, and extracurricular honors.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold shadow-sm shadow-indigo-600/20 transition-all hover:-translate-y-0.5"
        >
          <Plus className="w-4 h-4" />
          <span>Add Achievement</span>
        </button>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
      ) : achievements.length === 0 ? (
        <EmptyState
          icon={Trophy}
          title="No achievements logged"
          description="Record academic competitions, technical symposium awards, and extracurricular contributions."
          actionLabel="Add Your First Achievement"
          onAction={openCreateModal}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {achievements.map((ach) => {
            const catBadge = getCategoryBadge(ach.category);
            return (
              <div
                key={ach.id}
                className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm hover:border-indigo-200 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                      <Trophy className="w-5 h-5" />
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${catBadge.bg}`}>
                      {catBadge.label}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 leading-snug group-hover:text-indigo-600 transition-colors">
                    {ach.title}
                  </h3>

                  {ach.organization && (
                    <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium mt-1">
                      <Building2 className="w-3.5 h-3.5 text-slate-400" />
                      <span>{ach.organization}</span>
                    </div>
                  )}

                  {ach.eventDate && (
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>{ach.eventDate}</span>
                    </div>
                  )}

                  {ach.description && (
                    <p className="mt-3 text-xs text-slate-600 line-clamp-3 leading-relaxed">
                      {ach.description}
                    </p>
                  )}
                </div>

                {/* Footer Action Buttons */}
                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                  {ach.evidenceUrl ? (
                    <a
                      href={ach.evidenceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition-colors"
                    >
                      <span>Evidence</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  ) : (
                    <span className="text-[11px] text-slate-400 italic">No link</span>
                  )}

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openEditModal(ach)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                      title="Edit achievement"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        setAchToDelete(ach);
                        setDeleteModalOpen(true);
                      }}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                      title="Delete achievement"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* Add / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-slate-900">
              {editingAch ? 'Edit Achievement' : 'Add Achievement'}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5 mb-4">
              Enter award or extracurricular recognition details.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 1st Place - Smart India Hackathon"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Category *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                >
                  <option value="HACKATHON">Hackathon & Coding Competitions</option>
                  <option value="ACADEMIC">Academic Excellence & Merit</option>
                  <option value="EXTRACURRICULAR">Extracurricular & Sports</option>
                  <option value="LEADERSHIP">Leadership & Student Club</option>
                  <option value="OTHER">Other Recognition</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Issuing Organization / Host
                </label>
                <input
                  type="text"
                  placeholder="e.g. Ministry of Education, IEEE, ACM Chapter"
                  value={formData.organization}
                  onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Date
                </label>
                <input
                  type="date"
                  value={formData.eventDate}
                  onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Details about project, problem solved, or criteria for this honor..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Evidence URL (Optional)
                </label>
                <input
                  type="url"
                  placeholder="https://drive.google.com/... or certificate link"
                  value={formData.evidenceUrl}
                  onChange={(e) => setFormData({ ...formData, evidenceUrl: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 rounded-xl border border-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formSubmitting}
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl shadow-sm"
                >
                  {formSubmitting ? 'Saving...' : editingAch ? 'Save Changes' : 'Add Achievement'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        title="Delete Achievement"
        message={`Are you sure you want to remove "${achToDelete?.title}"?`}
        confirmText="Yes, Delete"
        isLoading={deleting}
        onConfirm={handleDelete}
        onClose={() => setDeleteModalOpen(false)}
      />

    </div>
  );
}
