'use client';
import { useMovies } from '@/hooks/use-movies';
import { AnalyticsDashboard } from '@/components/analytics-dashboard';
import { Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AnalyticsPage() {
  const { mounted, stats } = useMovies();

  if (!mounted) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-zinc-950 text-zinc-400">
        <Loader2 className="w-8 h-8 animate-spin text-zinc-700 mb-3" />
        <span className="text-xs font-mono tracking-widest uppercase">Initializing Cinephile...</span>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      <AnalyticsDashboard stats={stats} />
    </motion.div>
  );
}
