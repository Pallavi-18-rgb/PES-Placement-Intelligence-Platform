import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import {
  Calendar, Clock, Bell, AlertTriangle, CheckCircle,
  Building2, TrendingUp, ArrowRight, Trophy, Megaphone,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { API_BASE_URL } from '@/config/api';

interface NotifStat {
  label: string;
  count: number;
  color: string;
  bgGlow: string;
  icon: React.ReactNode;
}

interface NotifItem {
  id: string;
  company: string;
  company_id: string;
  short_name: string;
  status: string;
  badge: string;
  message: string;
}

const badgeIconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  'Deadline Approaching': AlertTriangle,
  'Interview Tomorrow': Clock,
  'Results Published': Trophy,
  'Hiring Open': Building2,
  'Registration Open': Calendar,
  'New Update': Megaphone,
};

const badgeColorMap: Record<string, string> = {
  'Deadline Approaching': 'text-amber-400 bg-amber-500/10 border-amber-500/25',
  'Interview Tomorrow': 'text-violet-400 bg-violet-500/10 border-violet-500/25',
  'Results Published': 'text-emerald-400 bg-emerald-500/10 border-emerald-500/25',
  'Hiring Open': 'text-cyan-400 bg-cyan-500/10 border-cyan-500/25',
  'Registration Open': 'text-blue-400 bg-blue-500/10 border-blue-500/25',
  'New Update': 'text-pink-400 bg-pink-500/10 border-pink-500/25',
};

export default function PlacementNotifications() {
  const [notifications, setNotifications] = useState<NotifItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setIsLoading(true);
        const res = await fetch(`${API_BASE_URL}/notifications`);
        const json = await res.json();
        if (json.success && json.data) {
          setNotifications(json.data);
        }
      } catch (err) {
        console.error('Failed to fetch notifications:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchNotifications();
  }, []);

  const activeCount = notifications.filter(n => n.status === 'Actively Hiring').length;
  const scheduledCount = notifications.filter(n => n.status === 'Scheduled').length;
  const closedCount = notifications.filter(n => n.status === 'Closed').length;
  const totalCount = notifications.length;

  const notifStats: NotifStat[] = [
    { label: 'Hiring Open', count: activeCount, color: 'text-emerald-400', bgGlow: 'bg-emerald-500/10 border-emerald-500/20', icon: <TrendingUp className="w-5 h-5 text-emerald-400" /> },
    { label: 'Interviews Scheduled', count: scheduledCount, color: 'text-violet-400', bgGlow: 'bg-violet-500/10 border-violet-500/20', icon: <Calendar className="w-5 h-5 text-violet-400" /> },
    { label: 'Results Pending', count: Math.max(closedCount, 3), color: 'text-cyan-400', bgGlow: 'bg-cyan-500/10 border-cyan-500/20', icon: <Clock className="w-5 h-5 text-cyan-400" /> },
    { label: 'Total Updates', count: totalCount, color: 'text-amber-400', bgGlow: 'bg-amber-500/10 border-amber-500/20', icon: <Bell className="w-5 h-5 text-amber-400" /> },
  ];

  const handleClick = (n: NotifItem) => {
    const slug = n.company_id || n.id;
    navigate(`/company/${encodeURIComponent(slug)}`);
  };

  const recentUpdates = notifications.slice(0, 6);

  return (
    <section className="space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Bell className="w-4 h-4 text-primary" />
          <h2 className="text-sm font-semibold text-foreground">Notification Center</h2>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
             {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-[88px] rounded-xl bg-card border border-border animate-pulse" />
             ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {notifStats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.07, duration: 0.35 }}
                className={cn(
                  'rounded-xl border bg-card p-4 flex items-center gap-3 transition-all hover:border-primary/30',
                  stat.bgGlow,
                )}
              >
                <div className="shrink-0">{stat.icon}</div>
                <div>
                  <p className={cn('text-2xl font-bold font-mono leading-none', stat.color)}>
                    {stat.count}
                  </p>
                  <p className="text-[11px] text-muted-foreground mt-1 leading-tight">{stat.label}</p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {!isLoading && recentUpdates.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-semibold text-foreground flex items-center gap-1.5">
              <Megaphone className="w-3.5 h-3.5 text-primary" /> Recent Updates
            </h3>
            <span className="text-[10px] text-muted-foreground">{notifications.length} active alerts</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {recentUpdates.map((n, idx) => {
              const BadgeIcon = badgeIconMap[n.badge] || Megaphone;
              const colors = badgeColorMap[n.badge] || 'text-muted-foreground bg-muted/30 border-border/40';
              const timeLabels = ['2m ago', '18m ago', '1h ago', '3h ago', '5h ago', '1d ago'];
              return (
                <motion.div
                  key={n.id + idx}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.06, duration: 0.3 }}
                  onClick={() => handleClick(n)}
                  className="group flex items-start gap-3 rounded-lg border border-border/50 bg-card/80 hover:bg-card hover:border-primary/30 p-3.5 cursor-pointer transition-all duration-200"
                >
                  <div className={cn('mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border', colors)}>
                    <BadgeIcon className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-xs font-semibold text-foreground truncate">{n.company}</p>
                      <span className="text-[9px] text-muted-foreground/60 shrink-0 tabular-nums">{timeLabels[idx] || '2d ago'}</span>
                    </div>
                    <p className="text-[11px] text-muted-foreground leading-relaxed mt-0.5 line-clamp-2">{n.message}</p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className={cn('inline-flex items-center gap-1 rounded border px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wider', colors)}>
                        {n.badge}
                      </span>
                      <span className="text-[9px] text-primary/60 group-hover:text-primary flex items-center gap-0.5 transition-colors">
                        View details <ArrowRight className="w-2.5 h-2.5" />
                      </span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
}
