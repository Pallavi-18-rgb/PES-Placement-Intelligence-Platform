import React from 'react';
import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, PieChart, MapPin } from 'lucide-react';
import cn from '@/lib/utils';

interface Stats {
  total: number;
  byCategory: Record<string, number>;
  byHiringVelocity?: Record<string, number>;
  byProfitability?: Record<string, number>;
  byRemotePolicy?: Record<string, number>;
}

export default function CompanyStatsShowcase({ stats }: { stats: Stats }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Total Companies */}
      <div className="rounded-lg bg-card border border-border p-4">
        <h3 className="text-sm font-medium text-foreground mb-2">Total Companies</h3>
        <p className="text-3xl font-bold text-primary">{stats.total}</p>
      </div>

      {/* Categories */}
      <div className="rounded-lg bg-card border border-border p-4">
        <h3 className="text-sm font-medium text-foreground mb-2 flex items-center">
          <BarChart3 className="w-4 h-4 mr-1" /> Categories
        </h3>
        <ul className="space-y-1 text-sm">
          {Object.entries(stats.byCategory).map(([cat, count]) => (
            <li key={cat} className="flex justify-between">
              <span>{cat}</span>
              <span className="font-medium text-foreground">{count}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Hiring Velocity */}
      {stats.byHiringVelocity && (
        <div className="rounded-lg bg-card border border-border p-4">
          <h3 className="text-sm font-medium text-foreground mb-2 flex items-center">
            <TrendingUp className="w-4 h-4 mr-1" /> Hiring Velocity
          </h3>
          <ul className="space-y-1 text-sm">
            {Object.entries(stats.byHiringVelocity).map(([vel, cnt]) => (
              <li key={vel} className="flex justify-between">
                <span>{vel}</span>
                <span className="font-medium text-foreground">{cnt}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Profitability */}
      {stats.byProfitability && (
        <div className="rounded-lg bg-card border border-border p-4">
          <h3 className="text-sm font-medium text-foreground mb-2 flex items-center">
            <PieChart className="w-4 h-4 mr-1" /> Profitability
          </h3>
          <ul className="space-y-1 text-sm">
            {Object.entries(stats.byProfitability).map(([status, cnt]) => (
              <li key={status} className="flex justify-between">
                <span>{status}</span>
                <span className="font-medium text-foreground">{cnt}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Remote Policy */}
      {stats.byRemotePolicy && (
        <div className="rounded-lg bg-card border border-border p-4">
          <h3 className="text-sm font-medium text-foreground mb-2 flex items-center">
            <MapPin className="w-4 h-4 mr-1" /> Remote Policy
          </h3>
          <ul className="space-y-1 text-sm">
            {Object.entries(stats.byRemotePolicy).map(([policy, cnt]) => (
              <li key={policy} className="flex justify-between">
                <span>{policy}</span>
                <span className="font-medium text-foreground">{cnt}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </motion.div>
  );
}
