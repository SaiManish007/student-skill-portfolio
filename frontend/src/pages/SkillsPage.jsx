import React, { useEffect, useState } from 'react';
import { skillApi } from '../services/api';
import { useToast } from '../components/Toast';
import ConfirmModal from '../components/ConfirmModal';
import EmptyState from '../components/EmptyState';
import { CardSkeleton } from '../components/LoadingSkeleton';
import { 
  Wrench, 
  Plus, 
  Pencil, 
  Trash2, 
  Search, 
  Filter, 
  X, 
  Sparkles,
  CheckCircle2
} from 'lucide-react';

export default function SkillsPage() {
  const { success, error } = useToast();
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState(null);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    category: 'TECHNICAL',
    proficiencyLevel: 'INTERMEDIATE',
    yearsOfExperience: '',
  });

  // Delete Confirmation State
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [skillToDelete, setSkillToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    loadSkills();
  }, [activeCategory]);

  const loadSkills = async () => {
    try {
      setLoading(true);
      const catParam = activeCategory === 'ALL' ? undefined : activeCategory;
      const res = await skillApi.getSkills(catParam);
      if (res.data?.success) {
        setSkills(res.data.data);
      }
    } catch (err) {
      error('Failed to load skills.');
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setEditingSkill(null);
    setFormData({
      name: '',
      category: activeCategory === 'ALL' ? 'TECHNICAL' : activeCategory,
      proficiencyLevel: 'INTERMEDIATE',
      yearsOfExperience: '',
    });
    setModalOpen(true);
  };

  const openEditModal = (skill) => {
    setEditingSkill(skill);
    setFormData({
      name: skill.name,
      category: skill.category,
      proficiencyLevel: skill.proficiencyLevel,
      yearsOfExperience: skill.yearsOfExperience ?? '',
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    try {
      setFormSubmitting(true);
      const payload = {
        name: formData.name.trim(),
        category: formData.category,
        proficiencyLevel: formData.proficiencyLevel,
        yearsOfExperience: formData.yearsOfExperience ? parseFloat(formData.yearsOfExperience) : null,
      };

      if (editingSkill) {
        const res = await skillApi.updateSkill(editingSkill.id, payload);
        if (res.data?.success) {
          success('Skill updated successfully!');
          setSkills((prev) => prev.map((s) => (s.id === editingSkill.id ? res.data.data : s)));
        }
      } else {
        const res = await skillApi.createSkill(payload);
        if (res.data?.success) {
          success('Skill created successfully!');
          setSkills((prev) => [res.data.data, ...prev]);
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
    if (!skillToDelete) return;
    try {
      setDeleting(true);
      await skillApi.deleteSkill(skillToDelete.id);
      success('Skill deleted.');
      setSkills((prev) => prev.filter((s) => s.id !== skillToDelete.id));
      setDeleteModalOpen(false);
    } catch (err) {
      error('Failed to delete skill.');
    } finally {
      setDeleting(false);
      setSkillToDelete(null);
    }
  };

  const filteredSkills = skills.filter((s) => {
    if (!searchQuery.trim()) return true;
    return s.name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const getProficiencyBadge = (level) => {
    switch (level) {
      case 'EXPERT':
        return { label: 'Expert', bg: 'bg-emerald-100 text-emerald-800 border-emerald-200' };
      case 'ADVANCED':
        return { label: 'Advanced', bg: 'bg-indigo-100 text-indigo-800 border-indigo-200' };
      case 'INTERMEDIATE':
        return { label: 'Intermediate', bg: 'bg-blue-100 text-blue-800 border-blue-200' };
      case 'BEGINNER':
      default:
        return { label: 'Beginner', bg: 'bg-slate-100 text-slate-800 border-slate-200' };
    }
  };

  return (
    <div className="space-y-6 font-sans">
      
      {/* Header & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Skills & Capabilities</h1>
          <p className="text-sm text-slate-500 mt-1">
            Log your technical and soft capabilities, proficiency tiers, and experience.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold shadow-sm shadow-indigo-600/20 transition-all hover:-translate-y-0.5"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Skill</span>
        </button>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-200/70 rounded-2xl overflow-x-auto">
          {[
            { id: 'ALL', label: 'All Skills' },
            { id: 'TECHNICAL', label: 'Technical' },
            { id: 'SOFT', label: 'Soft Skills' },
            { id: 'TOOLS', label: 'Tools & DevOps' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveCategory(tab.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                activeCategory === tab.id
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative max-w-xs w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search skills..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
          />
        </div>
      </div>

      {/* Content Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
      ) : filteredSkills.length === 0 ? (
        <EmptyState
          icon={Wrench}
          title={searchQuery ? 'No matching skills found' : 'No skills in this category yet'}
          description={searchQuery ? 'Try clearing your search query' : 'Add your programming languages, frameworks, or soft skills.'}
          actionLabel="Add Skill"
          onAction={openCreateModal}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSkills.map((skill) => {
            const badge = getProficiencyBadge(skill.proficiencyLevel);
            return (
              <div
                key={skill.id}
                className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm hover:border-indigo-200 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-bold text-slate-900 text-base">{skill.name}</h3>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md uppercase bg-slate-100 text-slate-600">
                      {skill.category}
                    </span>
                  </div>

                  <div className="mt-3 flex items-center gap-2">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg border ${badge.bg}`}>
                      {badge.label}
                    </span>
                    {skill.yearsOfExperience != null && (
                      <span className="text-xs text-slate-500 font-medium">
                        {skill.yearsOfExperience} {skill.yearsOfExperience === 1 ? 'yr' : 'yrs'} exp
                      </span>
                    )}
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-end gap-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => openEditModal(skill)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                    title="Edit skill"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      setSkillToDelete(skill);
                      setDeleteModalOpen(true);
                    }}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                    title="Delete skill"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add / Edit Skill Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 relative">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-slate-900">
              {editingSkill ? 'Edit Skill' : 'Add New Skill'}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5 mb-4">
              Enter skill information and proficiency classification.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Skill Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Java, React, System Design, Leadership"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
                  <option value="TECHNICAL">Technical (Languages, Frameworks, DBs)</option>
                  <option value="SOFT">Soft Skills (Communication, Teamwork)</option>
                  <option value="TOOLS">Tools & DevOps (Git, Docker, CI/CD, AWS)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Proficiency Level *
                </label>
                <select
                  value={formData.proficiencyLevel}
                  onChange={(e) => setFormData({ ...formData, proficiencyLevel: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                >
                  <option value="BEGINNER">Beginner (Foundational)</option>
                  <option value="INTERMEDIATE">Intermediate (Comfortable with projects)</option>
                  <option value="ADVANCED">Advanced (Industry/Production ready)</option>
                  <option value="EXPERT">Expert (Specialist / Deep mastery)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Years of Experience (Optional)
                </label>
                <input
                  type="number"
                  step="0.5"
                  min="0"
                  max="50"
                  placeholder="e.g. 2.5"
                  value={formData.yearsOfExperience}
                  onChange={(e) => setFormData({ ...formData, yearsOfExperience: e.target.value })}
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
                  {formSubmitting ? 'Saving...' : editingSkill ? 'Save Changes' : 'Add Skill'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        title="Delete Skill"
        message={`Are you sure you want to remove "${skillToDelete?.name}" from your portfolio?`}
        confirmText="Yes, Delete"
        isLoading={deleting}
        onConfirm={handleDelete}
        onClose={() => setDeleteModalOpen(false)}
      />

    </div>
  );
}
