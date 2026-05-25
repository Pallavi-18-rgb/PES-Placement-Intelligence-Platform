import { useCompanyStats } from '@/hooks/useCompanies';
import { SectionHeader, EmptyState } from '@/components/shared/DataDisplay';
import { BarChart3, Building2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

const COLORS = [
  'hsl(187, 72%, 53%)',
  'hsl(152, 60%, 45%)',
  'hsl(38, 92%, 50%)',
  'hsl(0, 72%, 51%)',
  'hsl(210, 80%, 56%)',
  'hsl(270, 60%, 55%)',
];

export default function AnalyticsPage() {
  const { data: stats, isLoading } = useCompanyStats();

  const categoryData = stats
    ? Object.entries(stats.byCategory).map(([name, value]) => ({ name, value }))
    : [];

  const velocityData = stats
    ? Object.entries(stats.byHiringVelocity).map(([name, value]) => ({ name, value }))
    : [];

  const profitData = stats
    ? Object.entries(stats.byProfitability).map(([name, value]) => ({ name, value }))
    : [];

  const remoteData = stats
    ? Object.entries(stats.byRemotePolicy).map(([name, value]) => ({ name, value }))
    : [];

  const hasData = stats && stats.total > 0;

  return (
    <div className="max-w-[1600px] mx-auto px-4 py-6 space-y-6">
      <SectionHeader
        title="Analytics & Insights"
        description="Visual overview of the placement landscape"
        icon={<BarChart3 className="w-4 h-4" />}
      />

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-64 rounded-lg bg-card border border-border animate-pulse" />
          ))}
        </div>
      ) : !hasData ? (
        <EmptyState
          title="No analytics data"
          description="Connect your database to see placement analytics and visualizations."
          icon={<Building2 className="w-6 h-6 text-muted-foreground" />}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ChartCard title="Companies by Category">
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={categoryData}>
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: 'hsl(215, 20%, 55%)' }} />
                <YAxis tick={{ fontSize: 10, fill: 'hsl(215, 20%, 55%)' }} />
                <Tooltip contentStyle={{ background: 'hsl(222, 44%, 9%)', border: '1px solid hsl(222, 25%, 18%)', borderRadius: 8, fontSize: 12 }} />
                <Bar dataKey="value" fill="hsl(187, 72%, 53%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Hiring Velocity">
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={velocityData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" paddingAngle={2}>
                  {velocityData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ background: 'hsl(222, 44%, 9%)', border: '1px solid hsl(222, 25%, 18%)', borderRadius: 8, fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Profitability Status">
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={profitData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" paddingAngle={2}>
                  {profitData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ background: 'hsl(222, 44%, 9%)', border: '1px solid hsl(222, 25%, 18%)', borderRadius: 8, fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Remote / Hybrid / On-site">
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={remoteData} layout="vertical">
                <XAxis type="number" tick={{ fontSize: 10, fill: 'hsl(215, 20%, 55%)' }} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 10, fill: 'hsl(215, 20%, 55%)' }} width={80} />
                <Tooltip contentStyle={{ background: 'hsl(222, 44%, 9%)', border: '1px solid hsl(222, 25%, 18%)', borderRadius: 8, fontSize: 12 }} />
                <Bar dataKey="value" fill="hsl(152, 60%, 45%)" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      )}
    </div>
  );
}

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <h3 className="text-xs font-semibold text-foreground mb-3">{title}</h3>
      {children}
    </div>
  );
}
