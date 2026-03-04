import { motion } from 'motion/react';
import { ChevronRight } from 'lucide-react';
import type { Job, JobStatus } from '../types';

interface PipelineProps {
  jobs: Job[];
  activeFilter: JobStatus | 'all';
  onFilterChange: (status: JobStatus | 'all') => void;
}

const stages: { status: JobStatus; label: string; color: string; glow: string }[] = [
  { status: 'wishlist', label: 'Wishlist', color: 'from-slate-400/30 to-slate-600/30 border-slate-400/40', glow: '#94a3b8' },
  { status: 'applied', label: 'Applied', color: 'from-blue-400/30 to-blue-600/30 border-blue-400/40', glow: '#60a5fa' },
  { status: 'phone-screen', label: 'Phone Screen', color: 'from-cyan-400/30 to-cyan-600/30 border-cyan-400/40', glow: '#22d3ee' },
  { status: 'technical-test', label: 'Tech Test', color: 'from-amber-400/30 to-amber-600/30 border-amber-400/40', glow: '#fbbf24' },
  { status: 'interview', label: 'Interview', color: 'from-purple-400/30 to-purple-600/30 border-purple-400/40', glow: '#c084fc' },
  { status: 'offer', label: 'Offer 🎉', color: 'from-emerald-400/30 to-emerald-600/30 border-emerald-400/40', glow: '#34d399' },
];

export function Pipeline({ jobs, activeFilter, onFilterChange }: PipelineProps) {
  const getCounts = (status: JobStatus) => jobs.filter(j => j.status === status).length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="mb-8"
    >
      <div className="flex items-center gap-1 flex-wrap">
        {stages.map((stage, i) => {
          const count = getCounts(stage.status);
          const isActive = activeFilter === stage.status;
          return (
            <div key={stage.status} className="flex items-center gap-1">
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => onFilterChange(isActive ? 'all' : stage.status)}
                className={`relative backdrop-blur-xl bg-gradient-to-br ${stage.color} border rounded-xl px-4 py-2.5 transition-all duration-200 cursor-pointer`}
                style={{
                  boxShadow: isActive ? `0 0 20px ${stage.glow}60, 0 4px 16px ${stage.glow}30` : 'none',
                  borderColor: isActive ? stage.glow : undefined,
                }}
              >
                {isActive && (
                  <motion.div
                    layoutId="pipeline-active"
                    className="absolute inset-0 rounded-xl opacity-20"
                    style={{ background: stage.glow }}
                  />
                )}
                <div className="relative z-10 flex flex-col items-center min-w-[60px]">
                  <span
                    className="text-xl"
                    style={{ fontWeight: 700, color: isActive ? stage.glow : 'rgba(255,255,255,0.9)' }}
                  >
                    {count}
                  </span>
                  <span className="text-xs text-white/60 whitespace-nowrap">{stage.label}</span>
                </div>
              </motion.button>
              {i < stages.length - 1 && (
                <ChevronRight className="w-4 h-4 text-white/20 flex-shrink-0" />
              )}
            </div>
          );
        })}

        {/* Rejected / Withdrawn exits */}
        <div className="ml-2 flex gap-2">
          {(['rejected', 'withdrawn'] as JobStatus[]).map(s => {
            const count = getCounts(s);
            const isActive = activeFilter === s;
            const color = s === 'rejected' ? '#f87171' : '#94a3b8';
            return (
              <motion.button
                key={s}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => onFilterChange(isActive ? 'all' : s)}
                className="backdrop-blur-xl bg-white/5 border border-white/15 rounded-xl px-3 py-2 transition-all duration-200 cursor-pointer"
                style={{ boxShadow: isActive ? `0 0 16px ${color}40` : 'none', borderColor: isActive ? color : undefined }}
              >
                <div className="flex flex-col items-center min-w-[50px]">
                  <span className="text-lg" style={{ fontWeight: 700, color: isActive ? color : 'rgba(255,255,255,0.5)' }}>
                    {count}
                  </span>
                  <span className="text-xs text-white/40 capitalize">{s}</span>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
