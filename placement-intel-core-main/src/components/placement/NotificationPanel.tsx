import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import {
  Bell,
  X,
  Calendar,
  Trophy,
  Clock,
  CheckCircle,
  AlertTriangle,
  Building2,
  Megaphone,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { API_BASE_URL } from '@/config/api';

// ── Badge config ───────────────────────────────────────────────────────────────
type BadgeType =
  | 'Deadline Approaching'
  | 'Interview Tomorrow'
  | 'Results Published'
  | 'Hiring Open'
  | 'Registration Open'
  | 'New Update';

const badgeStyles: Record<BadgeType, string> = {
  'Deadline Approaching': 'bg-amber-500/15 text-amber-400 border-amber-500/30',
  'Interview Tomorrow': 'bg-violet-500/15 text-violet-400 border-violet-500/30',
  'Results Published': 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  'Hiring Open': 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30',
  'Registration Open': 'bg-blue-500/15 text-blue-400 border-blue-500/30',
  'New Update': 'bg-pink-500/15 text-pink-400 border-pink-500/30',
};

// ── Icon mapping per badge ─────────────────────────────────────────────────────
const badgeIcons: Record<BadgeType, React.ComponentType<{ className?: string }>> = {
  'Deadline Approaching': AlertTriangle,
  'Interview Tomorrow': Clock,
  'Results Published': Trophy,
  'Hiring Open': Building2,
  'Registration Open': Calendar,
  'New Update': Megaphone,
};

interface NotificationData {
  id: string;
  slug: string;
  title: string;
  description: string;
  badge: BadgeType;
  time: string;
  initialRead: boolean;
}

export default function NotificationPanel({
  open,
  onClose,
  onUnreadChange
}: {
  open: boolean;
  onClose: () => void;
  onUnreadChange?: (count: number) => void;
}) {
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setIsLoading(true);
        const res = await fetch(`${API_BASE_URL}/notifications`);
        const json = await res.json();
        
        if (json.success && json.data) {
          const mapped = json.data.map((n: any, i: number) => {
            let time = 'Just now';
            if (i < 2) time = `${i * 15 + 10}m ago`;
            else if (i < 6) time = `${i - 1}h ago`;
            else time = `${Math.floor(i / 2)}d ago`;

            // Use badge from backend if valid, else derive from status
            let badge: BadgeType = (n.badge as BadgeType) || 'New Update';
            if (!['Deadline Approaching','Interview Tomorrow','Results Published','Hiring Open','Registration Open','New Update'].includes(badge)) {
              if (n.status === 'Actively Hiring') badge = 'Deadline Approaching';
              else if (n.status === 'Scheduled') badge = 'Interview Tomorrow';
              else badge = 'New Update';
            }

            // Build slug using company_id for reliable routing
            const idSlug = String(n.company_id || n.id || '');
            const nameSlug = (n.short_name || n.company || '').toLowerCase().replace(/\s+/g, '-');
            const slug = idSlug || nameSlug;

            return {
              id: String(n.id),
              slug,
              title: n.company,
              description: n.message,
              badge,
              time,
              initialRead: i > 4
            };
          });
          setNotifications(mapped);
        }
      } catch (err) {
        console.error("Failed to fetch notifications:", err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchNotifications();
  }, []);

  // Track read state locally
  const [readIds, setReadIds] = useState<Set<string>>(new Set());

  const unreadCount = notifications.filter((n) => !n.initialRead && !readIds.has(n.id)).length;

  useEffect(() => {
    if (onUnreadChange) {
      onUnreadChange(unreadCount);
    }
  }, [unreadCount, onUnreadChange]);

  const markAllRead = () => {
    const allIds = notifications.map((n) => n.id);
    setReadIds((prev) => {
      const newSet = new Set(prev);
      allIds.forEach(id => newSet.add(id));
      return newSet;
    });
  };

  const handleNotificationClick = (id: string, slug: string) => {
    setReadIds((prev) => {
      const newSet = new Set(prev);
      newSet.add(id);
      return newSet;
    });
    navigate(`/company/${encodeURIComponent(slug)}`);
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="notif-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[90] bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      {open && (
        <motion.aside
          key="notif-panel"
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 28, stiffness: 300 }}
          className={cn(
            'fixed top-0 right-0 z-[100] h-full w-full sm:w-[380px]',
            'flex flex-col',
            'bg-card border-l border-border shadow-2xl shadow-black/40',
          )}
        >
          {/* Header */}
          <div className="flex items-center justify-between gap-3 px-5 py-4 border-b border-border/60">
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <Bell className="w-5 h-5 text-primary" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[9px] font-bold text-primary-foreground">
                    {unreadCount}
                  </span>
                )}
              </div>
              <h2 className="text-sm font-semibold text-foreground tracking-tight">
                Placement Notifications
              </h2>
            </div>

            <button
              onClick={onClose}
              className="rounded-md p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
              aria-label="Close notifications"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Mark all read bar */}
          {unreadCount > 0 && (
            <div className="flex items-center justify-between px-5 py-2 border-b border-border/40 bg-muted/20">
              <span className="text-[11px] text-muted-foreground">
                {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
              </span>
              <button
                onClick={markAllRead}
                className="flex items-center gap-1 text-[11px] font-medium text-primary hover:text-primary/80 transition-colors cursor-pointer"
              >
                <CheckCircle className="w-3 h-3" />
                Mark all as read
              </button>
            </div>
          )}

          {/* Notification list */}
          <div className="flex-1 overflow-y-auto overscroll-contain custom-scrollbar">
            {isLoading ? (
              <div className="p-5 space-y-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="h-20 bg-muted/40 animate-pulse rounded-lg" />
                ))}
              </div>
            ) : (
              notifications.map((notif, idx) => {
                const Icon = badgeIcons[notif.badge];
                const isRead = notif.initialRead || readIds.has(notif.id);

                return (
                  <motion.div
                    key={notif.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.04, duration: 0.25 }}
                    className={cn(
                      'group relative flex gap-3.5 px-5 py-4 border-b border-border/30 cursor-pointer transition-all duration-200',
                      isRead
                        ? 'hover:bg-muted/40'
                        : 'bg-primary/5 hover:bg-primary/10',
                    )}
                    onClick={() => handleNotificationClick(notif.id, notif.slug)}
                  >
                    {/* Unread dot */}
                    {!isRead && (
                      <span className="absolute left-1.5 top-1/2 -translate-y-1/2 h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_6px_1px_hsl(var(--primary)/0.6)]" />
                    )}

                    {/* Icon container */}
                    <div
                      className={cn(
                        'mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border shadow-sm transition-transform duration-200 group-hover:scale-105',
                        badgeStyles[notif.badge],
                      )}
                    >
                      <Icon className="w-4 h-4" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0 space-y-1.5">
                      <div className="flex items-start justify-between gap-2">
                        <p
                          className={cn(
                            'text-sm leading-tight tracking-tight',
                            isRead
                              ? 'text-muted-foreground font-medium'
                              : 'text-foreground font-semibold',
                          )}
                        >
                          {notif.title}
                        </p>
                        <span className="shrink-0 text-[10px] text-muted-foreground/60 tabular-nums font-medium">
                          {notif.time}
                        </span>
                      </div>

                      <p className="text-xs leading-relaxed text-muted-foreground/90 line-clamp-2">
                        {notif.description}
                      </p>

                      {/* Badge */}
                      <span
                        className={cn(
                          'inline-flex mt-1 rounded border px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider',
                          badgeStyles[notif.badge],
                        )}
                      >
                        {notif.badge}
                      </span>
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-border/60 px-5 py-3 flex items-center justify-center">
            <span className="text-[10px] text-muted-foreground/60 tracking-wide">
              Showing {notifications.length} live updates • Placement Cell
            </span>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
