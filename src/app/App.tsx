import { useState, useMemo, useEffect } from 'react';
import {
  Plus, Briefcase, CheckCircle, XCircle, Clock, Search, ArrowUpDown,
  ArrowUp, ArrowDown, LayoutGrid, List, ChevronLeft, ChevronRight,
  TrendingUp, Sparkles,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { JobCard } from './components/JobCard';
import { JobForm } from './components/JobForm';
import { StatsCard } from './components/StatsCard';
import { Pipeline } from './components/Pipeline';
import type { Job, JobStatus, SortField, SortOrder, ViewMode, Priority } from './types';

const initialJobs: Job[] = [
  { id: '1', company: 'Google', position: 'Senior Software Engineer', location: 'Mountain View, CA', salary: '$180k – $250k', status: 'interview', priority: 'high', appliedDate: '2026-02-15T00:00:00.000Z', cvUsed: 'Senior Engineer v2', jobUrl: 'https://careers.google.com', notes: 'Referral from a friend on the team. Very excited about this one — great culture & tech stack.' },
  { id: '2', company: 'Meta', position: 'Frontend Engineer', location: 'Remote', salary: '$160k – $220k', status: 'technical-test', priority: 'high', appliedDate: '2026-02-20T00:00:00.000Z', deadline: '2026-03-10T00:00:00.000Z', cvUsed: 'Frontend Specialist v1', notes: 'Technical assessment due next week. Focus on React performance & system design.' },
  { id: '3', company: 'Stripe', position: 'Full Stack Developer', location: 'San Francisco, CA', salary: '$170k – $240k', status: 'applied', priority: 'medium', appliedDate: '2026-02-28T00:00:00.000Z', cvUsed: 'Full Stack v3', jobUrl: 'https://stripe.com/jobs' },
  { id: '4', company: 'OpenAI', position: 'Software Engineer, Platform', location: 'San Francisco, CA', salary: '$200k – $300k', status: 'phone-screen', priority: 'high', appliedDate: '2026-02-22T00:00:00.000Z', cvUsed: 'Senior Engineer v2', deadline: '2026-03-15T00:00:00.000Z', notes: 'Phone screen with HR scheduled for March 5th. Research their recent products.' },
  { id: '5', company: 'Netflix', position: 'Senior Frontend Engineer', location: 'Los Angeles, CA', salary: '$190k – $260k', status: 'offer', priority: 'high', appliedDate: '2026-01-20T00:00:00.000Z', cvUsed: 'Senior Engineer v2', notes: 'Offer received! Evaluating vs. Google. Stock comp is very competitive.' },
  { id: '6', company: 'Airbnb', position: 'React Developer', location: 'Remote', salary: '$140k – $190k', status: 'rejected', priority: 'low', appliedDate: '2026-01-10T00:00:00.000Z', cvUsed: 'Full Stack v2', notes: 'Didn\'t pass the final system design round. Review distributed systems concepts.' },
  { id: '7', company: 'Vercel', position: 'Developer Experience Engineer', location: 'Remote', salary: '$150k – $200k', status: 'interview', priority: 'medium', appliedDate: '2026-02-18T00:00:00.000Z', cvUsed: 'Frontend Specialist v1', jobUrl: 'https://vercel.com/careers', notes: 'Second round interview with the DX team lead. Prepare open source contributions.' },
  { id: '8', company: 'Figma', position: 'Senior Software Engineer', location: 'San Francisco, CA', salary: '$175k – $245k', status: 'technical-test', priority: 'high', appliedDate: '2026-02-25T00:00:00.000Z', deadline: '2026-03-08T00:00:00.000Z', cvUsed: 'Senior Engineer v2', jobUrl: 'https://figma.com/jobs' },
  { id: '9', company: 'Shopify', position: 'Lead Developer', location: 'Remote', salary: '$160k – $210k', status: 'wishlist', priority: 'low', appliedDate: '2026-03-01T00:00:00.000Z', cvUsed: '', notes: 'Interesting role — tailor CV toward their commerce platform before applying.' },
  { id: '10', company: 'Linear', position: 'Frontend Engineer', location: 'Remote', salary: '$130k – $180k', status: 'applied', priority: 'medium', appliedDate: '2026-03-02T00:00:00.000Z', cvUsed: 'Frontend Specialist v1', jobUrl: 'https://linear.app/careers', notes: 'Love their product design philosophy. Great fit for my skills.' },
  { id: '11', company: 'Supabase', position: 'TypeScript Engineer', location: 'Remote', salary: '$120k – $170k', status: 'applied', priority: 'medium', appliedDate: '2026-03-03T00:00:00.000Z', cvUsed: 'Full Stack v3' },
  { id: '12', company: 'PlanetScale', position: 'Developer Advocate', location: 'Remote', salary: '$110k – $150k', status: 'withdrawn', priority: 'low', appliedDate: '2026-01-28T00:00:00.000Z', cvUsed: 'DevRel Resume', notes: 'Withdrew after receiving the Netflix offer.' },
];

const ITEMS_PER_PAGE_OPTIONS = [6, 9, 12];

const sortOptions: { value: SortField; label: string }[] = [
  { value: 'appliedDate', label: 'Date Applied' },
  { value: 'company', label: 'Company' },
  { value: 'priority', label: 'Priority' },
  { value: 'status', label: 'Status' },
];

const priorityOrder: Record<Priority, number> = { high: 0, medium: 1, low: 2 };
const statusOrder: Record<JobStatus, number> = { wishlist: 0, applied: 1, 'phone-screen': 2, 'technical-test': 3, interview: 4, offer: 5, rejected: 6, withdrawn: 7 };

// Particle positions fixed to avoid re-render issues
const particles = Array.from({ length: 30 }, (_, i) => ({
  id: i,
  left: `${(i * 3.7 + 5) % 100}%`,
  top: `${(i * 7.3 + 10) % 100}%`,
  size: i % 3 === 0 ? 3 : i % 5 === 0 ? 4 : 2,
  duration: 15 + (i % 15),
  delay: i * 0.5,
  xRange: [(i * 11) % 100 - 50, (i * 17) % 100 - 50],
  yRange: [(i * 13) % 100 - 50, (i * 19) % 100 - 50],
}));

export default function App() {
  const [jobs, setJobs] = useState<Job[]>(initialJobs);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);

  // Filters
  const [filterStatus, setFilterStatus] = useState<JobStatus | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Sorting
  const [sortField, setSortField] = useState<SortField>('appliedDate');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(6);

  // View
  const [viewMode, setViewMode] = useState<ViewMode>('grid');

  // Reset page when filters change
  useEffect(() => { setCurrentPage(1); }, [filterStatus, searchQuery, sortField, sortOrder, itemsPerPage]);

  const handleAddJob = (jobData: Omit<Job, 'id'>) => {
    if (editingJob) {
      setJobs(jobs.map(j => j.id === editingJob.id ? { ...jobData, id: j.id } : j));
      setEditingJob(null);
    } else {
      setJobs([{ ...jobData, id: Date.now().toString() }, ...jobs]);
    }
  };

  const handleDeleteJob = (id: string) => {
    setJobs(jobs.filter(j => j.id !== id));
  };

  const handleEditJob = (job: Job) => {
    setEditingJob(job);
    setIsFormOpen(true);
  };

  const toggleSort = (field: SortField) => {
    if (sortField === field) setSortOrder(o => o === 'asc' ? 'desc' : 'asc');
    else { setSortField(field); setSortOrder('desc'); }
  };

  // Derived data
  const existingCVs = useMemo(() => [...new Set(jobs.map(j => j.cvUsed).filter(Boolean) as string[])], [jobs]);

  const filteredAndSorted = useMemo(() => {
    let result = jobs;
    if (filterStatus !== 'all') result = result.filter(j => j.status === filterStatus);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(j =>
        j.company.toLowerCase().includes(q) ||
        j.position.toLowerCase().includes(q) ||
        (j.location?.toLowerCase().includes(q)) ||
        (j.cvUsed?.toLowerCase().includes(q))
      );
    }
    return [...result].sort((a, b) => {
      let cmp = 0;
      if (sortField === 'appliedDate') cmp = new Date(a.appliedDate).getTime() - new Date(b.appliedDate).getTime();
      else if (sortField === 'company') cmp = a.company.localeCompare(b.company);
      else if (sortField === 'priority') cmp = priorityOrder[a.priority] - priorityOrder[b.priority];
      else if (sortField === 'status') cmp = statusOrder[a.status] - statusOrder[b.status];
      return sortOrder === 'asc' ? cmp : -cmp;
    });
  }, [jobs, filterStatus, searchQuery, sortField, sortOrder]);

  const totalPages = Math.max(1, Math.ceil(filteredAndSorted.length / itemsPerPage));
  const safePage = Math.min(currentPage, totalPages);
  const paginatedJobs = filteredAndSorted.slice((safePage - 1) * itemsPerPage, safePage * itemsPerPage);

  const stats = {
    total: jobs.length,
    active: jobs.filter(j => ['applied', 'phone-screen', 'technical-test', 'interview'].includes(j.status)).length,
    offers: jobs.filter(j => j.status === 'offer').length,
    rejected: jobs.filter(j => j.status === 'rejected').length,
    successRate: jobs.length > 0 ? Math.round((jobs.filter(j => j.status === 'offer').length / jobs.filter(j => j.status !== 'wishlist').length) * 100) : 0,
  };

  return (
    <div className="min-h-screen relative overflow-x-hidden">
      {/* ── Animated Background ── */}
      <div className="fixed inset-0 bg-[#060918]">
        {/* Aurora layers */}
        <motion.div
          animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.65, 0.4] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-[-20%] left-[-10%] w-[70vw] h-[70vh] rounded-full"
          style={{ background: 'radial-gradient(ellipse, rgba(99,102,241,0.35) 0%, transparent 70%)', filter: 'blur(60px)' }}
        />
        <motion.div
          animate={{ scale: [1.1, 1, 1.1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
          className="absolute bottom-[-20%] right-[-10%] w-[65vw] h-[65vh] rounded-full"
          style={{ background: 'radial-gradient(ellipse, rgba(168,85,247,0.3) 0%, transparent 70%)', filter: 'blur(70px)' }}
        />
        <motion.div
          animate={{ x: [0, 80, 0], y: [0, -40, 0], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut', delay: 7 }}
          className="absolute top-[30%] left-[40%] w-[40vw] h-[40vh] rounded-full"
          style={{ background: 'radial-gradient(ellipse, rgba(59,130,246,0.25) 0%, transparent 70%)', filter: 'blur(50px)' }}
        />
        <motion.div
          animate={{ x: [0, -60, 0], y: [0, 50, 0], opacity: [0.15, 0.3, 0.15] }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          className="absolute top-[60%] left-[10%] w-[35vw] h-[35vh] rounded-full"
          style={{ background: 'radial-gradient(ellipse, rgba(236,72,153,0.2) 0%, transparent 70%)', filter: 'blur(60px)' }}
        />

        {/* Grid overlay */}
        <div className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
      </div>

      {/* ── Floating Particles ── */}
      {particles.map(p => (
        <motion.div
          key={p.id}
          className="fixed rounded-full pointer-events-none"
          style={{ left: p.left, top: p.top, width: p.size, height: p.size, background: 'rgba(255,255,255,0.4)' }}
          animate={{ x: p.xRange, y: p.yRange, opacity: [0.2, 0.6, 0.2] }}
          transition={{ duration: p.duration, repeat: Infinity, ease: 'easeInOut', delay: p.delay }}
        />
      ))}

      {/* ── Main Content ── */}
      <div className="relative z-10 container mx-auto px-4 py-10 max-w-7xl">

        {/* ── Header ── */}
        <motion.div initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mb-10">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-2xl flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', boxShadow: '0 4px 20px rgba(139,92,246,0.5)' }}>
                  <Briefcase className="w-5 h-5 text-white" />
                </div>
                <div>
                  <span className="text-xs text-white/40 uppercase tracking-widest">OpenClaw</span>
                  <h1 className="text-white leading-none" style={{
                    background: 'linear-gradient(135deg, #e0e7ff 0%, #c4b5fd 40%, #f0abfc 80%)',
                    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontWeight: 700
                  }}>
                    Job Tracker
                  </h1>
                </div>
              </div>
              <p className="text-white/40 text-sm ml-[52px]">Track every application, ace every opportunity</p>
            </div>

            <motion.button
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => { setEditingJob(null); setIsFormOpen(true); }}
              className="flex items-center gap-2.5 px-6 py-3 rounded-2xl text-white text-sm transition-all"
              style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6, #a855f7)', boxShadow: '0 4px 24px rgba(139,92,246,0.45)' }}
            >
              <Plus className="w-4 h-4" />
              Add Application
              <Sparkles className="w-4 h-4 opacity-70" />
            </motion.button>
          </div>
        </motion.div>

        {/* ── Stats Grid ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatsCard title="Total Applied" value={stats.total} icon={Briefcase}
            gradient="from-blue-500/15 to-indigo-600/15" glowColor="rgba(99,102,241,0.3)" delay={0} />
          <StatsCard title="In Progress" value={stats.active} icon={Clock}
            gradient="from-violet-500/15 to-purple-600/15" glowColor="rgba(139,92,246,0.3)" delay={0.1}
            total={stats.total} subtitle="across all stages" />
          <StatsCard title="Offers" value={stats.offers} icon={CheckCircle}
            gradient="from-emerald-500/15 to-green-600/15" glowColor="rgba(52,211,153,0.3)" delay={0.2}
            total={stats.total} subtitle={`${stats.successRate}% success rate`} trend="up" />
          <StatsCard title="Rejected" value={stats.rejected} icon={XCircle}
            gradient="from-rose-500/15 to-red-600/15" glowColor="rgba(248,113,113,0.3)" delay={0.3}
            total={stats.total} subtitle="keep pushing forward" />
        </div>

        {/* ── Pipeline Funnel ── */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}>
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-4 h-4 text-white/40" />
            <span className="text-xs text-white/40 uppercase tracking-widest">Application Pipeline</span>
            <span className="text-xs text-white/25">— click to filter</span>
          </div>
          <Pipeline jobs={jobs} activeFilter={filterStatus} onFilterChange={setFilterStatus} />
        </motion.div>

        {/* ── Controls Bar ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-4 mb-6"
          style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.3)' }}
        >
          <div className="flex flex-col lg:flex-row gap-3">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search company, role, location, CV…"
                className="w-full pl-10 pr-4 py-2.5 bg-white/8 border border-white/12 rounded-xl text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-purple-400/30 focus:border-purple-400/40 text-sm transition-all"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors text-xs">✕</button>
              )}
            </div>

            {/* Sort */}
            <div className="flex items-center gap-2">
              <ArrowUpDown className="w-4 h-4 text-white/40 flex-shrink-0" />
              <div className="flex gap-1">
                {sortOptions.map(opt => (
                  <button key={opt.value} onClick={() => toggleSort(opt.value)}
                    className={`flex items-center gap-1 px-3 py-2 rounded-xl text-xs transition-all border ${
                      sortField === opt.value
                        ? 'bg-purple-500/25 border-purple-400/40 text-purple-200'
                        : 'bg-white/5 border-white/10 text-white/50 hover:text-white/70 hover:bg-white/10'
                    }`}>
                    {opt.label}
                    {sortField === opt.value && (
                      sortOrder === 'desc' ? <ArrowDown className="w-3 h-3" /> : <ArrowUp className="w-3 h-3" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* View + Per page */}
            <div className="flex items-center gap-2">
              {/* View mode toggle */}
              <div className="flex bg-white/5 border border-white/10 rounded-xl p-1">
                {(['grid', 'list'] as ViewMode[]).map(mode => (
                  <button key={mode} onClick={() => setViewMode(mode)}
                    className={`p-2 rounded-lg transition-all ${viewMode === mode ? 'bg-white/15 text-white' : 'text-white/40 hover:text-white/70'}`}>
                    {mode === 'grid' ? <LayoutGrid className="w-3.5 h-3.5" /> : <List className="w-3.5 h-3.5" />}
                  </button>
                ))}
              </div>

              {/* Items per page */}
              <select value={itemsPerPage} onChange={e => setItemsPerPage(Number(e.target.value))}
                className="px-3 py-2 bg-white/8 border border-white/12 rounded-xl text-white/70 text-xs focus:outline-none focus:ring-2 focus:ring-purple-400/30 cursor-pointer">
                {ITEMS_PER_PAGE_OPTIONS.map(n => <option key={n} value={n} className="bg-gray-900">{n} / page</option>)}
              </select>
            </div>
          </div>

          {/* Active filter chips + count */}
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/8">
            <div className="flex items-center gap-2 flex-wrap">
              {filterStatus !== 'all' && (
                <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }}
                  className="flex items-center gap-1.5 px-3 py-1 bg-purple-500/20 border border-purple-400/30 rounded-full text-xs text-purple-300">
                  Status: {filterStatus.split('-').map(w => w[0].toUpperCase() + w.slice(1)).join(' ')}
                  <button onClick={() => setFilterStatus('all')} className="hover:text-white ml-0.5">✕</button>
                </motion.span>
              )}
              {searchQuery && (
                <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }}
                  className="flex items-center gap-1.5 px-3 py-1 bg-blue-500/20 border border-blue-400/30 rounded-full text-xs text-blue-300">
                  Search: "{searchQuery}"
                  <button onClick={() => setSearchQuery('')} className="hover:text-white ml-0.5">✕</button>
                </motion.span>
              )}
              {filterStatus === 'all' && !searchQuery && (
                <span className="text-xs text-white/25">No active filters</span>
              )}
            </div>
            <span className="text-xs text-white/40 flex-shrink-0">
              {filteredAndSorted.length} of {jobs.length} applications
            </span>
          </div>
        </motion.div>

        {/* ── Jobs Grid / List ── */}
        <AnimatePresence mode="wait">
          {paginatedJobs.length === 0 ? (
            <motion.div key="empty" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
              className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-16 text-center">
              <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-5">
                <Briefcase className="w-9 h-9 text-white/20" />
              </div>
              <p className="text-white/50 mb-1">No applications found</p>
              <p className="text-sm text-white/30">
                {filterStatus !== 'all' || searchQuery ? 'Try adjusting your filters' : 'Click "Add Application" to get started'}
              </p>
              {(filterStatus !== 'all' || searchQuery) && (
                <button onClick={() => { setFilterStatus('all'); setSearchQuery(''); }}
                  className="mt-5 px-5 py-2 bg-white/10 hover:bg-white/15 border border-white/15 rounded-xl text-white/70 text-sm transition-all">
                  Clear filters
                </button>
              )}
            </motion.div>
          ) : (
            <motion.div key={`${viewMode}-${safePage}`}
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5' : 'flex flex-col gap-3'}>
              <AnimatePresence>
                {paginatedJobs.map((job, i) => (
                  <motion.div key={job.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }} transition={{ delay: i * 0.05 }}>
                    <JobCard job={job} onEdit={handleEditJob} onDelete={handleDeleteJob} viewMode={viewMode} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Pagination ── */}
        {totalPages > 1 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
            className="flex items-center justify-center gap-2 mt-8">
            <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={safePage === 1}
              className="p-2.5 backdrop-blur-xl bg-white/8 border border-white/15 rounded-xl text-white/60 hover:text-white hover:bg-white/15 disabled:opacity-30 disabled:cursor-not-allowed transition-all">
              <ChevronLeft className="w-4 h-4" />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => {
              const isActive = page === safePage;
              const isNear = Math.abs(page - safePage) <= 2 || page === 1 || page === totalPages;
              if (!isNear) {
                if (page === safePage - 3 || page === safePage + 3) return <span key={page} className="text-white/30 px-1">…</span>;
                return null;
              }
              return (
                <motion.button key={page} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}
                  onClick={() => setCurrentPage(page)}
                  className={`w-9 h-9 rounded-xl text-sm transition-all border ${isActive
                    ? 'text-white border-purple-400/50'
                    : 'backdrop-blur-xl bg-white/5 border-white/10 text-white/50 hover:text-white hover:bg-white/15'}`}
                  style={isActive ? { background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', boxShadow: '0 4px 16px rgba(139,92,246,0.4)' } : {}}>
                  {page}
                </motion.button>
              );
            })}

            <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={safePage === totalPages}
              className="p-2.5 backdrop-blur-xl bg-white/8 border border-white/15 rounded-xl text-white/60 hover:text-white hover:bg-white/15 disabled:opacity-30 disabled:cursor-not-allowed transition-all">
              <ChevronRight className="w-4 h-4" />
            </button>

            <span className="ml-2 text-xs text-white/30">
              Page {safePage} of {totalPages}
            </span>
          </motion.div>
        )}

        {/* Bottom padding */}
        <div className="h-12" />
      </div>

      {/* ── Form Modal ── */}
      <JobForm
        isOpen={isFormOpen}
        onClose={() => { setIsFormOpen(false); setEditingJob(null); }}
        onSubmit={handleAddJob}
        editingJob={editingJob}
        existingCVs={existingCVs}
      />
    </div>
  );
}
