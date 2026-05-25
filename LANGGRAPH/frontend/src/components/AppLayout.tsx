import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Home,
  Building2,
  LayoutGrid,
  GitCompare,
  BrainCircuit,
  BarChart3,
  CalendarDays,
  Rocket,
  Shield,
  Menu,
  X,
  Zap,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

const navItems = [
  { path: '/', label: 'Home', icon: Home },
  { path: '/timeline', label: 'Timeline', icon: CalendarDays },
  { path: '/experiences', label: 'Experiences', icon: Rocket },
  { path: '/rejection-engine', label: 'Risk Engine', icon: Shield },
  { path: '/companies', label: 'Companies', icon: Building2 },
  { path: '/explore', label: 'Explore', icon: Building2 },
  { path: '/categories', label: 'Categories', icon: LayoutGrid },
  { path: '/compare', label: 'Compare', icon: GitCompare },
  { path: '/skills', label: 'Skill Map', icon: BrainCircuit },
  { path: '/analytics', label: 'Analytics', icon: BarChart3 },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top Bar */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="flex items-center justify-between px-4 h-14 max-w-[1600px] mx-auto">
          <Link to="/" className="flex items-center gap-3">
            <img
              src="/assets/logo-placeholder.svg"
              alt="PlaceIntel"
              className="w-8 h-8 rounded-md bg-gradient-to-br from-slate-800 to-slate-700 p-1"
            />
            <span className="font-bold text-foreground text-sm tracking-wide">
              PES <span className="text-cyan-400">PlaceIntel</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const active = location.pathname === item.path ||
                (item.path !== '/' && location.pathname.startsWith(item.path));
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    'flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors',
                    active
                      ? 'bg-primary/15 text-primary'
                      : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                  )}
                >
                  <item.icon className="w-3.5 h-3.5" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Mobile toggle */}
          <button
            className="md:hidden p-2 text-muted-foreground"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Mobile Nav */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden border-b border-border bg-card overflow-hidden z-40"
          >
            <nav className="flex flex-col p-2">
              {navItems.map((item) => {
                const active = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      'flex items-center gap-2 px-3 py-2.5 rounded-md text-sm font-medium transition-colors',
                      active
                        ? 'bg-primary/15 text-primary'
                        : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                    )}
                  >
                    <item.icon className="w-4 h-4" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Content */}
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}
