import { Building2, Calendar, DollarSign, MapPin, Trash2, Edit, ExternalLink, FileText, AlertTriangle, Clock } from 'lucide-react';
import { motion } from 'motion/react';
import type { Job } from '../types';

interface JobCardProps {
  job: Job;
  onEdit: (job: Job) => void;
  onDelete: (id: string) => void;
  viewMode?: 'grid' | 'list';
}

const statusConfig: Record<string, { gradient: string; border: string; badge: string; glow: string }> = {
  wishlist:         { gradient: 'from-slate-500/15 to-slate-700/15', border: 'border-slate-400/25', badge: 'bg-slate-500/20 text-slate-200 border-slate-400/40', glow: 'rgba(148,163,184,0.15)' },
  applied:          { gradient: 'from-blue-500/15 to-blue-700/15', border: 'border-blue-400/25', badge: 'bg-blue-500/20 text-blue-200 border-blue-400/40', glow: 'rgba(96,165,250,0.15)' },
  'phone-screen':   { gradient: 'from-cyan-500/15 to-cyan-700/15', border: 'border-cyan-400/25', badge: 'bg-cyan-500/20 text-cyan-200 border-cyan-400/40', glow: 'rgba(34,211,238,0.15)' },
  'technical-test': { gradient: 'from-amber-500/15 to-amber-700/15', border: 'border-amber-400/25', badge: 'bg-amber-500/20 text-amber-200 border-amber-400/40', glow: 'rgba(251,191,36,0.15)' },
  interview:        { gradient: 'from-purple-500/15 to-purple-700/15', border: 'border-purple-400/25', badge: 'bg-purple-500/20 text-purple-200 border-purple-400/40', glow: 'rgba(192,132,252,0.15)' },
  offer:            { gradient: 'from-emerald-500/15 to-emerald-700/15', border: 'border-emerald-400/25', badge: 'bg-emerald-500/20 text-emerald-200 border-emerald-400/40', glow: 'rgba(52,211,153,0.15)' },
  rejected:         { gradient: 'from-red-500/15 to-red-700/15', border: 'border-red-400/25', badge: 'bg-red-500/20 text-red-200 border-red-400/40', glow: 'rgba(248,113,113,0.15)' },
  withdrawn:        { gradient: 'from-zinc-500/15 to-zinc-700/15', border: 'border-zinc-400/25', badge: 'bg-zinc-500/20 text-zinc-200 border-zinc-400/40', glow: 'rgba(161,161,170,0.15)' },
};

const priorityConfig = {
  high:   { color: '#f87171', label: 'High', bg: 'bg-red-500/20 text-red-300 border-red-400/40' },
  medium: { color: '#fbbf24', label: 'Medium', bg: 'bg-amber-500/20 text-amber-300 border-amber-400/40' },
  low:    { color: '#34d399', label: 'Low', bg: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40' },
};

function getInitials(company: string) {
  return company.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
}

function getDaysAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return 'Today';
  if (days === 1) return '1 day ago';
  return `${days} days ago`;
}

function getDeadlineStatus(deadline?: string) {
  if (!deadline) return null;
  const diff = new Date(deadline).getTime() - Date.now();
  const days = Math.ceil(diff / 86400000);
  if (days < 0) return { label: 'Overdue', color: 'text-red-400', urgent: true };
  if (days <= 3) return { label: `${days}d left`, color: 'text-red-400', urgent: true };
  if (days <= 7) return { label: `${days}d left`, color: 'text-amber-400', urgent: false };
  return { label: `${days}d left`, color: 'text-white/50', urgent: false };
}

export function JobCard({ job, onEdit, onDelete, viewMode = 'grid' }: JobCardProps) {
  const cfg = statusConfig[job.status] || statusConfig.applied;
  const pCfg = priorityConfig[job.priority];
  const deadline = getDeadlineStatus(job.deadline);
  const statusLabel = job.status.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

  if (viewMode === 'list') {
    return (
      <motion.div
        layout
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 20 }}
        whileHover={{ x: 4 }}
        className={`relative group backdrop-blur-xl bg-gradient-to-r ${cfg.gradient} border ${cfg.border} rounded-2xl px-5 py-4 shadow-md hover:shadow-xl transition-all duration-300`}
        style={{ boxShadow: `0 4px 24px ${cfg.glow}` }}
      >
        {/* Priority strip */}
        <div className="absolute left-0 top-3 bottom-3 w-1 rounded-full" style={{ background: pCfg.color, boxShadow: `0 0 8px ${pCfg.color}80` }} />

        <div className="flex items-center gap-4 pl-2">
          {/* Company avatar */}
          <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-sm text-white"
            style={{ background: `linear-gradient(135deg, ${pCfg.color}40, ${pCfg.color}20)`, border: `1px solid ${pCfg.color}40` }}>
            {getInitials(job.company)}
          </div>

          {/* Main info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-white truncate" style={{ fontWeight: 600 }}>{job.position}</span>
              <span className="text-white/50">·</span>
              <span className="text-white/70 text-sm">{job.company}</span>
            </div>
            <div className="flex items-center gap-3 mt-0.5 flex-wrap">
              {job.location && <span className="text-xs text-white/50 flex items-center gap-1"><MapPin className="w-3 h-3" />{job.location}</span>}
              {job.salary && <span className="text-xs text-white/50 flex items-center gap-1"><DollarSign className="w-3 h-3" />{job.salary}</span>}
              {job.cvUsed && <span className="text-xs text-white/50 flex items-center gap-1"><FileText className="w-3 h-3" />{job.cvUsed}</span>}
            </div>
          </div>

          {/* Badges */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className={`text-xs px-2.5 py-1 rounded-full border backdrop-blur-sm ${cfg.badge}`}>{statusLabel}</span>
            <span className={`text-xs px-2 py-1 rounded-full border ${pCfg.bg}`}>{pCfg.label}</span>
            {deadline && (
              <span className={`text-xs flex items-center gap-1 ${deadline.color}`}>
                {deadline.urgent && <AlertTriangle className="w-3 h-3" />}{deadline.label}
              </span>
            )}
            <span className="text-xs text-white/40 flex items-center gap-1"><Clock className="w-3 h-3" />{getDaysAgo(job.appliedDate)}</span>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            {job.jobUrl && (
              <a href={job.jobUrl} target="_blank" rel="noopener noreferrer"
                className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                <ExternalLink className="w-4 h-4 text-white/60" />
              </a>
            )}
            <button onClick={() => onEdit(job)} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
              <Edit className="w-4 h-4 text-white/80" />
            </button>
            <button onClick={() => onDelete(job.id)} className="p-2 hover:bg-red-500/20 rounded-lg transition-colors">
              <Trash2 className="w-4 h-4 text-red-300" />
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  // Grid view
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -6 }}
      className={`relative group backdrop-blur-xl bg-gradient-to-br ${cfg.gradient} border ${cfg.border} rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden`}
      style={{ boxShadow: `0 8px 32px ${cfg.glow}` }}
    >
      {/* Priority top strip */}
      <div className="absolute top-0 left-0 right-0 h-0.5 rounded-t-2xl" style={{ background: `linear-gradient(90deg, transparent, ${pCfg.color}, transparent)` }} />

      {/* Hover glow */}
      <div className="absolute inset-0 bg-white/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            {/* Company avatar */}
            <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 text-sm text-white"
              style={{ background: `linear-gradient(135deg, ${pCfg.color}40, ${pCfg.color}20)`, border: `1px solid ${pCfg.color}40`, fontWeight: 700 }}>
              {getInitials(job.company)}
            </div>
            <div className="min-w-0">
              <h3 className="text-white truncate">{job.position}</h3>
              <div className="flex items-center gap-1.5 text-white/70 mt-0.5">
                <Building2 className="w-3.5 h-3.5 flex-shrink-0" />
                <span className="text-sm truncate">{job.company}</span>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-1 ml-2">
            {job.jobUrl && (
              <a href={job.jobUrl} target="_blank" rel="noopener noreferrer"
                className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 hover:bg-white/10 rounded-lg">
                <ExternalLink className="w-3.5 h-3.5 text-white/60" />
              </a>
            )}
            <button onClick={() => onEdit(job)} className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 hover:bg-white/10 rounded-lg">
              <Edit className="w-3.5 h-3.5 text-white/80" />
            </button>
            <button onClick={() => onDelete(job.id)} className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 hover:bg-red-500/20 rounded-lg">
              <Trash2 className="w-3.5 h-3.5 text-red-300" />
            </button>
          </div>
        </div>

        {/* Badges row */}
        <div className="flex flex-wrap gap-2 mb-4">
          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs border backdrop-blur-sm ${cfg.badge}`}>
            {statusLabel}
          </span>
          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs border ${pCfg.bg}`}
            style={{ boxShadow: `0 0 8px ${pCfg.color}30` }}>
            <span className="w-1.5 h-1.5 rounded-full mr-1.5" style={{ background: pCfg.color }} />
            {pCfg.label} Priority
          </span>
        </div>

        {/* Details */}
        <div className="space-y-1.5 text-sm">
          {job.location && (
            <div className="flex items-center gap-2 text-white/60">
              <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
              <span className="truncate">{job.location}</span>
            </div>
          )}
          {job.salary && (
            <div className="flex items-center gap-2 text-white/60">
              <DollarSign className="w-3.5 h-3.5 flex-shrink-0" />
              <span>{job.salary}</span>
            </div>
          )}
          <div className="flex items-center gap-2 text-white/60">
            <Calendar className="w-3.5 h-3.5 flex-shrink-0" />
            <span>{getDaysAgo(job.appliedDate)} · {new Date(job.appliedDate).toLocaleDateString()}</span>
          </div>
          {deadline && (
            <div className={`flex items-center gap-2 ${deadline.color}`}>
              <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />
              <span>Deadline: {deadline.label}</span>
            </div>
          )}
        </div>

        {/* Bottom row: CV + Notes */}
        {(job.cvUsed || job.notes) && (
          <div className="mt-4 pt-4 border-t border-white/10 space-y-2">
            {job.cvUsed && (
              <div className="flex items-center gap-2">
                <FileText className="w-3.5 h-3.5 text-white/40 flex-shrink-0" />
                <span className="text-xs text-white/50 truncate">CV: <span className="text-white/70">{job.cvUsed}</span></span>
              </div>
            )}
            {job.notes && (
              <p className="text-xs text-white/50 line-clamp-2 leading-relaxed">{job.notes}</p>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}
