'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { Film, CheckCircle2, Play, Bookmark, Star, PieChart as PieIcon, BarChart2 } from 'lucide-react';

interface AnalyticsProps {
  stats: {
    total: number;
    watched: number;
    watching: number;
    watchlist: number;
    averageRating: number;
    genreDistribution: { name: string; value: number }[];
    monthlyHistory: { name: string; count: number }[];
  };
}

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];

export function AnalyticsDashboard({ stats }: AnalyticsProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className="w-full h-[400px] flex items-center justify-center text-zinc-500 text-sm">
        Loading analytics charts...
      </div>
    );
  }

  // Custom tooltips for Recharts to maintain minimalist theme
  const CustomBarTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-zinc-900 border border-zinc-800 p-2.5 rounded-lg shadow-xl text-xs">
          <p className="font-semibold text-zinc-300">{payload[0].payload.name}</p>
          <p className="text-indigo-400 mt-0.5">Watched: {payload[0].value} movies</p>
        </div>
      );
    }
    return null;
  };

  const CustomPieTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-zinc-900 border border-zinc-800 p-2.5 rounded-lg shadow-xl text-xs">
          <p className="font-semibold text-zinc-300">{payload[0].name}</p>
          <p className="text-emerald-400 mt-0.5">Count: {payload[0].value} titles</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Mini Stats Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3.5">
        <Card className="bg-zinc-950 border-zinc-900 shadow-md">
          <CardContent className="p-4 flex flex-col justify-center items-center text-center">
            <Film className="w-5 h-5 text-zinc-500 mb-1" />
            <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-semibold">Total Library</span>
            <span className="text-xl font-bold text-zinc-100 mt-1">{stats.total}</span>
          </CardContent>
        </Card>

        <Card className="bg-zinc-950 border-zinc-900 shadow-md">
          <CardContent className="p-4 flex flex-col justify-center items-center text-center">
            <CheckCircle2 className="w-5 h-5 text-emerald-500 mb-1" />
            <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-semibold">Completed</span>
            <span className="text-xl font-bold text-zinc-100 mt-1">{stats.watched}</span>
          </CardContent>
        </Card>

        <Card className="bg-zinc-950 border-zinc-900 shadow-md">
          <CardContent className="p-4 flex flex-col justify-center items-center text-center">
            <Play className="w-5 h-5 text-indigo-500 mb-1" />
            <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-semibold">Watching</span>
            <span className="text-xl font-bold text-zinc-100 mt-1">{stats.watching}</span>
          </CardContent>
        </Card>

        <Card className="bg-zinc-950 border-zinc-900 shadow-md">
          <CardContent className="p-4 flex flex-col justify-center items-center text-center">
            <Bookmark className="w-5 h-5 text-amber-500 mb-1" />
            <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-semibold">Watchlist</span>
            <span className="text-xl font-bold text-zinc-100 mt-1">{stats.watchlist}</span>
          </CardContent>
        </Card>

        <Card className="bg-zinc-950 border-zinc-900 shadow-md col-span-2 md:col-span-1">
          <CardContent className="p-4 flex flex-col justify-center items-center text-center">
            <Star className="w-5 h-5 text-amber-400 mb-1 fill-amber-400/20" />
            <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-semibold">Avg Rating</span>
            <span className="text-xl font-bold text-zinc-100 mt-1">
              {stats.averageRating > 0 ? `${stats.averageRating} / 5` : '—'}
            </span>
          </CardContent>
        </Card>
      </div>

      {/* Recharts section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Watch History Over Time */}
        <Card className="bg-zinc-950 border-zinc-900">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-zinc-200 flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-indigo-400" /> Watch History
            </CardTitle>
            <CardDescription className="text-xs text-zinc-500">
              Completed movies and series over the last 6 months
            </CardDescription>
          </CardHeader>
          <CardContent className="h-[260px] pt-4">
            {stats.monthlyHistory.some((d) => d.count > 0) ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.monthlyHistory} margin={{ top: 5, right: 10, left: -25, bottom: 0 }}>
                  <XAxis
                    dataKey="name"
                    stroke="#52525b"
                    fontSize={10}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="#52525b"
                    fontSize={10}
                    tickLine={false}
                    axisLine={false}
                    allowDecimals={false}
                  />
                  <Tooltip content={<CustomBarTooltip />} cursor={{ fill: 'rgba(39, 39, 42, 0.3)' }} />
                  <Bar
                    dataKey="count"
                    fill="url(#barGradient)"
                    radius={[4, 4, 0, 0]}
                    maxBarSize={32}
                  >
                    <defs>
                      <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#6366f1" stopOpacity={0.8} />
                        <stop offset="100%" stopColor="#4f46e5" stopOpacity={0.1} />
                      </linearGradient>
                    </defs>
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center border border-dashed border-zinc-900 rounded-lg text-xs text-zinc-500">
                Start logging watched titles to see history trends.
              </div>
            )}
          </CardContent>
        </Card>

        {/* Genre Breakdown */}
        <Card className="bg-zinc-950 border-zinc-900">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-zinc-200 flex items-center gap-2">
              <PieIcon className="w-4 h-4 text-emerald-400" /> Genre Breakdown
            </CardTitle>
            <CardDescription className="text-xs text-zinc-500">
              Distribution of genres in your collection
            </CardDescription>
          </CardHeader>
          <CardContent className="h-[260px] flex items-center justify-center">
            {stats.genreDistribution.length > 0 ? (
              <div className="w-full h-full flex flex-col md:flex-row items-center justify-between gap-2">
                <div className="w-full md:w-1/2 h-[200px] flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Tooltip content={<CustomPieTooltip />} />
                      <Pie
                        data={stats.genreDistribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={3}
                        dataKey="value"
                      >
                        {stats.genreDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="#09090b" strokeWidth={2} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="w-full md:w-1/2 flex flex-col gap-2 p-2">
                  <span className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider mb-1 block">Top Genres</span>
                  {stats.genreDistribution.map((entry, index) => (
                    <div key={entry.name} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-2.5 h-2.5 rounded-full shrink-0"
                          style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        />
                        <span className="text-zinc-300 truncate max-w-[100px]">{entry.name}</span>
                      </div>
                      <span className="text-zinc-500 font-medium">{entry.value} titles</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="w-full h-full flex items-center justify-center border border-dashed border-zinc-900 rounded-lg text-xs text-zinc-500">
                Add titles to your library to map genre analytics.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
export default AnalyticsDashboard;
