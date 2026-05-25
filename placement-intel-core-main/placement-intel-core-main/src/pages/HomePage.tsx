import { useCompanyStats } from '@/hooks/useCompanies';
import { StatCard, EmptyState, SectionHeader } from '@/components/shared/DataDisplay';
import {
  Building2,
  TrendingUp,
  Search,
  Briefcase,
  Rocket,
  Server,
  Cpu,
  BarChart3,
  Zap,
  PieChart,
  MapPin,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';

const categoryTiles = [
  { label: 'Tech Giants', icon: Cpu, color: 'from-blue-500/20 to-blue-600/5' },
  { label: 'Product Companies', icon: Rocket, color: 'from-emerald-500/20 to-emerald-600/5' },
  { label: 'Service Companies', icon: Server, color: 'from-amber-500/20 to-amber-600/5' },
  { label: 'Startups / Scale-ups', icon: Zap, color: 'from-violet-500/20 to-violet-600/5' },
];

export default function HomePage() {
  const { data: stats, isLoading } = useCompanyStats();
  const [search, setSearch] = useState('');

  return (
    <div className="max-w-[1600px] mx-auto px-4 py-6 space-y-8">
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center py-8"
      >
        <h1 className="text-2xl md:text-4xl font-bold text-foreground">
          PES <span className="text-gradient-cyan">Placement Intelligence</span>
        </h1>
        <p className="text-sm text-muted-foreground mt-2 max-w-lg mx-auto">
          Decision-grade insights into campus hiring companies. 163 structured parameters per company.
        </p>

        {/* Search */}
        <div className="mt-6 max-w-md mx-auto relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search companies, sectors, tech stack..."
            className="pl-9 bg-card border-border"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </motion.div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard
          label="Total Companies"
          value={stats?.total ?? '—'}
          icon={<Building2 className="w-4 h-4 text-primary" />}
        />
        <StatCard
          label="Categories"
          value={stats ? Object.keys(stats.byCategory).length : '—'}
          icon={<Briefcase className="w-4 h-4 text-primary" />}
        />
        <StatCard
          label="Profitable"
          value={stats?.byProfitability?.['Profitable'] ?? '—'}
          icon={<TrendingUp className="w-4 h-4 text-primary" />}
        />
        <StatCard
          label="Hiring Actively"
          value={stats?.byHiringVelocity?.['High'] ?? '—'}
          icon={<Zap className="w-4 h-4 text-primary" />}
        />
      </div>

      {/* Category Tiles */}
      <div>
        <SectionHeader title="Browse by Category" icon={<LayoutGridIcon />} />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {categoryTiles.map((cat, i) => (
            <motion.div
              key={cat.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
            >
              <Link
                to={`/categories?category=${encodeURIComponent(cat.label)}`}
                className={`block rounded-lg border border-border bg-gradient-to-br ${cat.color} p-5 transition-all hover:border-primary/40 hover:glow-cyan`}
              >
                <cat.icon className="w-6 h-6 text-foreground mb-2" />
                <p className="text-sm font-semibold text-foreground">{cat.label}</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  {stats?.byCategory?.[cat.label] ?? 0} companies
                </p>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Insight Cards */}
      <div>
        <SectionHeader
          title="Quick Insights"
          description="Overview signals from the placement landscape"
          icon={<BarChart3 className="w-4 h-4" />}
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <InsightCard
            title="Hiring Velocity Distribution"
            icon={<Zap className="w-4 h-4" />}
            data={stats?.byHiringVelocity}
          />
          <InsightCard
            title="Profitability Status"
            icon={<PieChart className="w-4 h-4" />}
            data={stats?.byProfitability}
          />
          <InsightCard
            title="Remote / Hybrid / On-site"
            icon={<MapPin className="w-4 h-4" />}
            data={stats?.byRemotePolicy}
          />
        </div>
      </div>

      {/* Updated Features Highlight */}
      <div className="bg-primary/5 border border-primary/10 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-primary/20 p-2 rounded-lg">
            <Rocket className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-foreground">Updated Intelligence Features</h2>
            <p className="text-xs text-muted-foreground">New strategic modules now live for all 118 companies</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-card border border-border p-4 rounded-lg hover:border-primary/30 transition-all">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-4 h-4 text-amber-500" />
              <h3 className="text-sm font-semibold text-foreground">Hiring Grounds</h3>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Detailed breakdown of recruitment funnels, including coding rounds, interview patterns, and compensation structures for every company.
            </p>
          </div>
          <div className="bg-card border border-border p-4 rounded-lg hover:border-primary/30 transition-all">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-emerald-500" />
              <h3 className="text-sm font-semibold text-foreground">InnovX Framework</h3>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Future-facing analysis of company innovation themes, active tech projects, and long-term industry strategic roadmaps.
            </p>
          </div>
        </div>
      </div>

      {!stats?.total && !isLoading && (
        <EmptyState
          title="No company data yet"
          description="Connect your Supabase table to start seeing placement intelligence."
          icon={<Building2 className="w-6 h-6 text-muted-foreground" />}
        />
      )}
    </div>
  );
}

function LayoutGridIcon() {
  return <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>;
}

function InsightCard({
  title,
  icon,
  data,
}: {
  title: string;
  icon: React.ReactNode;
  data?: Record<string, number>;
}) {
  const entries = data ? Object.entries(data) : [];

  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <div className="flex items-center gap-2 mb-3">
        <div className="text-primary">{icon}</div>
        <h3 className="text-xs font-semibold text-foreground">{title}</h3>
      </div>
      {entries.length > 0 ? (
        <div className="space-y-2">
          {entries.map(([key, val]) => (
            <div key={key} className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">{key}</span>
              <span className="font-mono font-medium text-foreground">{val}</span>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-xs text-muted-foreground italic">No data available</p>
      )}
    </div>
  );
}
