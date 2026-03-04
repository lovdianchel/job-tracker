import { motion } from 'motion/react';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  gradient: string;
  glowColor: string;
  delay?: number;
  subtitle?: string;
  total?: number;
  trend?: 'up' | 'down' | 'neutral';
}

export function StatsCard({
  title,
  value,
  icon: Icon,
  gradient,
  glowColor,
  delay = 0,
  subtitle,
  total,
  trend,
}: StatsCardProps) {
  const percentage = total && total > 0 ? Math.round((value / total) * 100) : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay, type: 'spring', stiffness: 200, damping: 20 }}
      whileHover={{ y: -6, scale: 1.02 }}
      className={`relative backdrop-blur-xl bg-gradient-to-br ${gradient} border border-white/20 rounded-2xl p-6 shadow-lg transition-all duration-300 group overflow-hidden cursor-default`}
      style={{ boxShadow: `0 8px 32px ${glowColor}` }}
    >
      {/* Animated glow orb */}
      <div
        className="absolute -top-4 -right-4 w-24 h-24 rounded-full opacity-20 blur-xl group-hover:opacity-40 transition-opacity duration-500"
        style={{ background: glowColor }}
      />
      {/* Shimmer overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="relative z-10">
        <div className="flex items-start justify-between mb-3">
          <div>
            <p className="text-xs text-white/60 uppercase tracking-widest mb-1">{title}</p>
            <motion.p
              key={value}
              initial={{ scale: 1.2, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-4xl text-white"
              style={{ fontWeight: 700 }}
            >
              {value}
            </motion.p>
            {subtitle && <p className="text-xs text-white/50 mt-1">{subtitle}</p>}
          </div>
          <div
            className="p-3 rounded-xl group-hover:scale-110 transition-transform duration-300"
            style={{ background: `${glowColor}33` }}
          >
            <Icon className="w-5 h-5 text-white" />
          </div>
        </div>

        {/* Progress bar */}
        {percentage !== null && (
          <div className="mt-3">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs text-white/40">of total</span>
              <span className="text-xs text-white/70">{percentage}%</span>
            </div>
            <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${percentage}%` }}
                transition={{ delay: delay + 0.3, duration: 0.8, ease: 'easeOut' }}
                className="h-full rounded-full"
                style={{ background: `linear-gradient(90deg, ${glowColor}, white)` }}
              />
            </div>
          </div>
        )}

        {trend && trend !== 'neutral' && (
          <div className={`flex items-center gap-1 mt-2 ${trend === 'up' ? 'text-emerald-400' : 'text-rose-400'}`}>
            {trend === 'up' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            <span className="text-xs">{trend === 'up' ? 'Growing' : 'Declining'}</span>
          </div>
        )}
      </div>
    </motion.div>
  );
}
