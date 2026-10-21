import React, { useEffect, useState } from 'react';
import { adminApi, dashboardApi } from '../services/api';
import { useToast } from '../components/Toast';
import ConfirmModal from '../components/ConfirmModal';
import { TableSkeleton } from '../components/LoadingSkeleton';
import { 
  ShieldCheck, 
  Users, 
  FolderGit2, 
  Wrench, 
  Award, 
  Search, 
  Eye, 
  UserCheck, 
  UserX, 
  ExternalLink, 
  X, 
  Globe, 
  ChevronLeft, 
  ChevronRight 
} from 'lucide-react';

export default function AdminDashboardPage() {
  const { success, error } = useToast();

  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);

  // Student directory
  const [students, setStudents] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [tableLoading, setTableLoading] = useState(true);

  // Detail Modal
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  // Status Change Confirmation Modal
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [targetStudent, setTargetStudent] = useState(null);
  const [statusSubmitting, setStatusSubmitting] = useState(false);

  useEffect(() => {
    loadAdminStats();
  }, []);

  useEffect(() => {
    loadStudents();
  }, [page, searchQuery]);

  const loadAdminStats = async () => {
    try {
      setStatsLoading(true);
      const res = await dashboardApi.getAdminDashboard();
      if (res.data?.success) {
        setStats(res.data.data);
      }
    } catch (err) {
      error('Failed to load admin dashboard metrics.');
    } finally {
      setStatsLoading(false);
    }
  };

  const loadStudents = async () => {
    try {
      setTableLoading(true);
      const res = await adminApi.getStudents({
        query: searchQuery.trim(),
        page: page,
        size: 10,
      });
      if (res.data?.success) {
        const p = res.data.data;
        setStudents(p.content || []);
        setTotalPages(p.totalPages || 0);
        setTotalElements(p.totalElements || 0);
      }
    } catch (err) {
      error('Failed to load student directory.');
    } finally {
      setTableLoading(false);
    }
  };

  const handleInspect = async (studentSummary) => {
    try {
      setDetailLoading(true);
      setDetailModalOpen(true);
      const res = await adminApi.getStudentDetail(studentSummary.userId);
      if (res.data?.success) {
        setSelectedStudent(res.data.data);
      }
    } catch (err) {
      error('Failed to load full student portfolio details.');
      setDetailModalOpen(false);
    } finally {
      setDetailLoading(false);
    }
  };

  const confirmToggleStatus = (student) => {
    setTargetStudent(student);
    setStatusModalOpen(true);
  };

  const handleToggleStatus = async () => {
    if (!targetStudent) return;
    try {
      setStatusSubmitting(true);
      const nextStatus = !targetStudent.active;
      await adminApi.updateStudentStatus(targetStudent.userId, nextStatus);
      success(`Student account ${nextStatus ? 'activated' : 'deactivated'}.`);
      setStudents((prev) =>
        prev.map((s) => (s.userId === targetStudent.userId ? { ...s, active: nextStatus } : s))
      );
      if (selectedStudent && selectedStudent.userId === targetStudent.userId) {
        setSelectedStudent((prev) => ({ ...prev, active: nextStatus }));
      }
      setStatusModalOpen(false);
    } catch (err) {
      error('Failed to update student status.');
    } finally {
      setStatusSubmitting(false);
      setTargetStudent(null);
    }
  };

  return (
    <div className="space-y-6 font-sans">
      
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-bold border border-amber-200 mb-2">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Faculty & Administrative Portal</span>
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Admin Oversight Dashboard</h1>
        <p className="text-sm text-slate-500 mt-1">
          Monitor student skill acquisition, portfolio publication, and departmental records across the institution.
        </p>
      </div>

      {/* Aggregate Metrics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Students</p>
          <p className="text-2xl font-extrabold text-slate-900 mt-1">{stats?.totalStudents ?? 0}</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Projects</p>
          <p className="text-2xl font-extrabold text-blue-600 mt-1">{stats?.totalProjects ?? 0}</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Skills</p>
          <p className="text-2xl font-extrabold text-indigo-600 mt-1">{stats?.totalSkills ?? 0}</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Certificates</p>
          <p className="text-2xl font-extrabold text-emerald-600 mt-1">{stats?.totalCertifications ?? 0}</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Honors</p>
          <p className="text-2xl font-extrabold text-purple-600 mt-1">{stats?.totalAchievements ?? 0}</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Live Public</p>
          <p className="text-2xl font-extrabold text-teal-600 mt-1">{stats?.publishedPortfolios ?? 0}</p>
        </div>
      </div>

      {/* Searchable Student Directory */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        
        {/* Table Controls */}
        <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">Student Directory</h2>
            <p className="text-xs text-slate-500">Total {totalElements} registered student records</p>
          </div>

          <div className="relative max-w-sm w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search by student, college, department..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(0);
              }}
              className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
            />
          </div>
        </div>

        {/* Directory Table */}
        <div className="overflow-x-auto">
          {tableLoading ? (
            <TableSkeleton rows={5} />
          ) : students.length === 0 ? (
            <div className="p-12 text-center text-slate-500 text-sm">
              No students found matching your criteria.
            </div>
          ) : (
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200/80 text-slate-600 font-semibold uppercase tracking-wider text-[10px]">
                  <th className="py-3.5 px-4">Student</th>
                  <th className="py-3.5 px-4">College & Dept</th>
                  <th className="py-3.5 px-4 text-center">Skills</th>
                  <th className="py-3.5 px-4 text-center">Projects</th>
                  <th className="py-3.5 px-4">Public Status</th>
                  <th className="py-3.5 px-4">Account</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {students.map((s) => (
                  <tr key={s.userId} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900 text-sm">{s.fullName}</div>
                      <div className="text-[11px] text-slate-500">{s.email}</div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">
                      <div className="font-medium text-slate-800">{s.college || '—'}</div>
                      <div className="text-[11px] text-slate-500">{s.department || '—'}</div>
                    </td>
                    <td className="py-3.5 px-4 text-center font-bold text-indigo-600">
                      {s.totalSkills}
                    </td>
                    <td className="py-3.5 px-4 text-center font-bold text-blue-600">
                      {s.totalProjects}
                    </td>
                    <td className="py-3.5 px-4">
                      {s.isPublished ? (
                        <a
                          href={`/p/${s.portfolioSlug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 hover:underline"
                        >
                          <span>Live</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      ) : (
                        <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                          Private
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        s.active ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                      }`}>
                        {s.active ? 'ACTIVE' : 'DEACTIVATED'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-1">
                      <button
                        onClick={() => handleInspect(s)}
                        className="p-1.5 rounded-lg text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                        title="Inspect full student record"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => confirmToggleStatus(s)}
                        className={`p-1.5 rounded-lg transition-colors ${
                          s.active 
                            ? 'text-slate-600 hover:text-rose-600 hover:bg-rose-50' 
                            : 'text-slate-600 hover:text-emerald-600 hover:bg-emerald-50'
                        }`}
                        title={s.active ? 'Deactivate account' : 'Activate account'}
                      >
                        {s.active ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination Footer */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Page {page + 1} of {totalPages}</span>
            <div className="flex gap-2">
              <button
                disabled={page === 0}
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>Previous</span>
              </button>
              <button
                disabled={page >= totalPages - 1}
                onClick={() => setPage((p) => p + 1)}
                className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1"
              >
                <span>Next</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

      </div>

      {/* Inspect Student Detail Modal */}
      {detailModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setDetailModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>

            {detailLoading || !selectedStudent ? (
              <div className="py-12 text-center">
                <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                <p className="text-xs text-slate-500">Loading comprehensive student records...</p>
              </div>
            ) : (
              <div className="space-y-6">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-bold text-slate-900">
                      {selectedStudent.profile?.fullName}
                    </h3>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      selectedStudent.active ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                    }`}>
                      {selectedStudent.active ? 'ACTIVE' : 'DEACTIVATED'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">{selectedStudent.email}</p>
                </div>

                {/* College / Program Information */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">College</span>
                    <span className="font-semibold text-slate-800">{selectedStudent.profile?.college || '—'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Department</span>
                    <span className="font-semibold text-slate-800">{selectedStudent.profile?.department || '—'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Degree</span>
                    <span className="font-semibold text-slate-800">{selectedStudent.profile?.degree || '—'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Year</span>
                    <span className="font-semibold text-slate-800">{selectedStudent.profile?.academicYear || '—'}</span>
                  </div>
                </div>

                {/* Projects recorded */}
                <div>
                  <h4 className="text-xs font-bold uppercase text-slate-500 mb-2">
                    Projects ({selectedStudent.projects?.length || 0})
                  </h4>
                  {selectedStudent.projects?.length === 0 ? (
                    <p className="text-xs text-slate-400 italic">No projects recorded.</p>
                  ) : (
                    <div className="space-y-2">
                      {selectedStudent.projects?.map((p) => (
                        <div key={p.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                          <div className="font-bold text-slate-900">{p.title}</div>
                          <div className="text-slate-600 text-[11px] mt-0.5">{p.technologies}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Skills recorded */}
                <div>
                  <h4 className="text-xs font-bold uppercase text-slate-500 mb-2">
                    Skills ({selectedStudent.skills?.length || 0})
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedStudent.skills?.map((s) => (
                      <span key={s.id} className="px-2 py-1 bg-indigo-50 text-indigo-700 text-xs font-semibold rounded-lg border border-indigo-100">
                        {s.name} ({s.proficiencyLevel})
                      </span>
                    ))}
                  </div>
                </div>

                {/* Certifications */}
                <div>
                  <h4 className="text-xs font-bold uppercase text-slate-500 mb-2">
                    Certifications ({selectedStudent.certifications?.length || 0})
                  </h4>
                  <div className="space-y-1.5 text-xs text-slate-700">
                    {selectedStudent.certifications?.map((c) => (
                      <div key={c.id} className="flex justify-between items-center p-2 bg-slate-50 rounded-xl">
                        <span><strong>{c.name}</strong> — {c.issuer}</span>
                        {c.credentialUrl && (
                          <a href={c.credentialUrl} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline flex items-center gap-1 text-[11px]">
                            <span>Verify</span> <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex justify-end">
                  <button
                    onClick={() => setDetailModalOpen(false)}
                    className="px-5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl"
                  >
                    Close Inspection
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Account Status Confirmation Modal */}
      <ConfirmModal
        isOpen={statusModalOpen}
        title={targetStudent?.active ? 'Deactivate Student Account' : 'Activate Student Account'}
        message={
          targetStudent?.active
            ? `Are you sure you want to deactivate ${targetStudent?.fullName}'s account? They will not be able to log in until re-enabled.`
            : `Are you sure you want to reactivate ${targetStudent?.fullName}'s account?`
        }
        confirmText={targetStudent?.active ? 'Yes, Deactivate' : 'Yes, Activate'}
        isDanger={targetStudent?.active}
        isLoading={statusSubmitting}
        onConfirm={handleToggleStatus}
        onClose={() => setStatusModalOpen(false)}
      />

    </div>
  );
}
