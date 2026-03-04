import { useState, useEffect } from 'react';
import type { ReactNode, FormEvent } from 'react';
import { X, Briefcase, MapPin, DollarSign, Calendar, FileText, Link, AlertCircle, Flame, Minus, Leaf } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import type { Job, JobStatus, Priority } from '../types';

interface JobFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (job: Omit<Job, 'id'>) => void;
  editingJob?: Job | null;
  existingCVs?: string[];
}

const statusOptions: { value: JobStatus; label: string; color: string }[] = [
  { value: 'wishlist', label: 'Wishlist', color: '#94a3b8' },
  { value: 'applied', label: 'Applied', color: '#60a5fa' },
  { value: 'phone-screen', label: 'Phone Screen', color: '#22d3ee' },
  { value: 'technical-test', label: 'Technical Test', color: '#fbbf24' },
  { value: 'interview', label: 'Interview', color: '#c084fc' },
  { value: 'offer', label: 'Offer', color: '#34d399' },
  { value: 'rejected', label: 'Rejected', color: '#f87171' },
  { value: 'withdrawn', label: 'Withdrawn', color: '#94a3b8' },
];

const priorityOptions: { value: Priority; label: string; icon: ReactNode; color: string }[] = [
  { value: 'high', label: 'High', icon: <Flame className="w-4 h-4" />, color: '#f87171' },
  { value: 'medium', label: 'Medium', icon: <Minus className="w-4 h-4" />, color: '#fbbf24' },
  { value: 'low', label: 'Low', icon: <Leaf className="w-4 h-4" />, color: '#34d399' },
];

const inputClass = "w-full px-4 py-3 bg-white/8 border border-white/15 rounded-xl text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-purple-400/40 focus:border-purple-400/50 focus:bg-white/12 backdrop-blur-sm transition-all text-sm";
const labelClass = "block text-xs text-white/60 uppercase tracking-widest mb-2";

const defaultForm = {
  company: '',
  position: '',
  location: '',
  salary: '',
  status: 'applied' as JobStatus,
  priority: 'medium' as Priority,
  appliedDate: new Date().toISOString().split('T')[0],
  deadline: '',
  notes: '',
  cvUsed: '',
  jobUrl: '',
};

export function JobForm({ isOpen, onClose, onSubmit, editingJob, existingCVs = [] }: JobFormProps) {
  const [formData, setFormData] = useState(defaultForm);

  useEffect(() => {
    if (editingJob) {
      setFormData({
        company: editingJob.company,
        position: editingJob.position,
        location: editingJob.location || '',
        salary: editingJob.salary || '',
        status: editingJob.status,
        priority: editingJob.priority || 'medium',
        appliedDate: editingJob.appliedDate.split('T')[0],
        deadline: editingJob.deadline ? editingJob.deadline.split('T')[0] : '',
        notes: editingJob.notes || '',
        cvUsed: editingJob.cvUsed || '',
        jobUrl: editingJob.jobUrl || '',
      });
    } else {
      setFormData(defaultForm);
    }
  }, [editingJob, isOpen]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      appliedDate: new Date(formData.appliedDate).toISOString(),
      deadline: formData.deadline ? new Date(formData.deadline).toISOString() : undefined,
      location: formData.location || undefined,
      salary: formData.salary || undefined,
      notes: formData.notes || undefined,
      cvUsed: formData.cvUsed || undefined,
      jobUrl: formData.jobUrl || undefined,
    });
    onClose();
  };

  const set = (key: string, value: string) => setFormData(prev => ({ ...prev, [key]: value }));

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-40"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 30 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl z-50 px-4"
          >
            <div className="relative backdrop-blur-2xl bg-gradient-to-br from-white/12 to-white/5 border border-white/20 rounded-3xl shadow-2xl overflow-hidden"
              style={{ boxShadow: '0 25px 80px rgba(139,92,246,0.3), 0 0 0 1px rgba(255,255,255,0.1)' }}>
              {/* Top gradient bar */}
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-400/60 to-transparent" />
              {/* Background glow */}
              <div className="absolute -top-20 -right-20 w-60 h-60 bg-purple-500/15 rounded-full blur-3xl" />
              <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-blue-500/15 rounded-full blur-3xl" />

              <div className="relative z-10 p-8 max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="text-white">{editingJob ? 'Edit Application' : 'New Application'}</h2>
                    <p className="text-sm text-white/40 mt-0.5">
                      {editingJob ? 'Update job application details' : 'Track a new job opportunity'}
                    </p>
                  </div>
                  <button onClick={onClose} className="p-2.5 hover:bg-white/10 rounded-xl transition-colors border border-white/10">
                    <X className="w-4 h-4 text-white/60" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Company & Position */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2 sm:col-span-1">
                      <label className={labelClass}>Company *</label>
                      <div className="relative">
                        <Briefcase className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                        <input type="text" required value={formData.company}
                          onChange={e => set('company', e.target.value)}
                          className={`${inputClass} pl-10`} placeholder="Google, Meta, Stripe…" />
                      </div>
                    </div>
                    <div className="col-span-2 sm:col-span-1">
                      <label className={labelClass}>Position *</label>
                      <input type="text" required value={formData.position}
                        onChange={e => set('position', e.target.value)}
                        className={inputClass} placeholder="Senior Software Engineer" />
                    </div>
                  </div>

                  {/* Location & Salary */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={labelClass}>Location</label>
                      <div className="relative">
                        <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                        <input type="text" value={formData.location}
                          onChange={e => set('location', e.target.value)}
                          className={`${inputClass} pl-10`} placeholder="Remote, NYC, SF…" />
                      </div>
                    </div>
                    <div>
                      <label className={labelClass}>Salary Range</label>
                      <div className="relative">
                        <DollarSign className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                        <input type="text" value={formData.salary}
                          onChange={e => set('salary', e.target.value)}
                          className={`${inputClass} pl-10`} placeholder="$100k – $150k" />
                      </div>
                    </div>
                  </div>

                  {/* Priority */}
                  <div>
                    <label className={labelClass}>Priority *</label>
                    <div className="flex gap-3">
                      {priorityOptions.map(opt => (
                        <button key={opt.value} type="button"
                          onClick={() => set('priority', opt.value)}
                          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border transition-all text-sm ${
                            formData.priority === opt.value
                              ? 'border-current text-white'
                              : 'border-white/15 text-white/40 hover:text-white/70 hover:border-white/25'
                          }`}
                          style={formData.priority === opt.value
                            ? { color: opt.color, borderColor: opt.color, background: `${opt.color}20`, boxShadow: `0 0 12px ${opt.color}30` }
                            : {}}>
                          {opt.icon}
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Status */}
                  <div>
                    <label className={labelClass}>Status *</label>
                    <div className="grid grid-cols-4 gap-2">
                      {statusOptions.map(opt => (
                        <button key={opt.value} type="button"
                          onClick={() => set('status', opt.value)}
                          className={`py-2 px-3 rounded-xl border text-xs transition-all text-center ${
                            formData.status === opt.value
                              ? 'text-white border-current'
                              : 'border-white/15 text-white/40 hover:text-white/60 hover:border-white/25'
                          }`}
                          style={formData.status === opt.value
                            ? { color: opt.color, borderColor: opt.color, background: `${opt.color}20`, boxShadow: `0 0 10px ${opt.color}25` }
                            : {}}>
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Applied Date & Deadline */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={labelClass}>Applied Date *</label>
                      <div className="relative">
                        <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" />
                        <input type="date" required value={formData.appliedDate}
                          onChange={e => set('appliedDate', e.target.value)}
                          className={`${inputClass} pl-10`} />
                      </div>
                    </div>
                    <div>
                      <label className={labelClass}>Application Deadline</label>
                      <div className="relative">
                        <AlertCircle className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" />
                        <input type="date" value={formData.deadline}
                          onChange={e => set('deadline', e.target.value)}
                          className={`${inputClass} pl-10`} />
                      </div>
                    </div>
                  </div>

                  {/* CV Used */}
                  <div>
                    <label className={labelClass}>CV / Resume Used</label>
                    <div className="relative">
                      <FileText className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                      <input
                        type="text"
                        list="cv-list"
                        value={formData.cvUsed}
                        onChange={e => set('cvUsed', e.target.value)}
                        className={`${inputClass} pl-10`}
                        placeholder="e.g. Senior Engineer v2, Frontend Specialist…"
                      />
                      <datalist id="cv-list">
                        {existingCVs.map(cv => <option key={cv} value={cv} />)}
                      </datalist>
                    </div>
                  </div>

                  {/* Job URL */}
                  <div>
                    <label className={labelClass}>Job Posting URL</label>
                    <div className="relative">
                      <Link className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                      <input type="url" value={formData.jobUrl}
                        onChange={e => set('jobUrl', e.target.value)}
                        className={`${inputClass} pl-10`}
                        placeholder="https://careers.company.com/job/…" />
                    </div>
                  </div>

                  {/* Notes */}
                  <div>
                    <label className={labelClass}>Notes</label>
                    <textarea
                      value={formData.notes}
                      onChange={e => set('notes', e.target.value)}
                      rows={3}
                      className={`${inputClass} resize-none`}
                      placeholder="Recruiter name, referral, key requirements, prep notes…"
                    />
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 pt-2">
                    <button type="button" onClick={onClose}
                      className="flex-1 px-6 py-3 bg-white/8 hover:bg-white/15 border border-white/15 rounded-xl text-white/70 hover:text-white transition-all text-sm">
                      Cancel
                    </button>
                    <button type="submit"
                      className="flex-1 px-6 py-3 rounded-xl text-white transition-all text-sm"
                      style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6, #a855f7)', boxShadow: '0 4px 20px rgba(139,92,246,0.4)' }}>
                      {editingJob ? 'Update Application' : 'Add Application'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}