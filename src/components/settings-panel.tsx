'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ApiSettings, TrackedItem } from '@/lib/movie-db';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Key, Download, Upload, Trash2, ShieldAlert } from 'lucide-react';
import { toast } from 'sonner';

interface SettingsPanelProps {
  settings: ApiSettings;
  onSaveSettings: (settings: ApiSettings) => void;
  trackedItems: TrackedItem[];
  onImport: (jsonData: string) => boolean;
  onClear: () => void;
}

export function SettingsPanel({
  settings,
  onSaveSettings,
  trackedItems,
  onImport,
  onClear,
}: SettingsPanelProps) {
  const [tmdbKey, setTmdbKey] = useState('');
  const [omdbKey, setOmdbKey] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setTmdbKey(settings.tmdbApiKey || '');
    setOmdbKey(settings.omdbApiKey || '');
  }, [settings]);

  const handleSaveKeys = () => {
    onSaveSettings({
      tmdbApiKey: tmdbKey.trim(),
      omdbApiKey: omdbKey.trim(),
    });
  };

  const handleExport = () => {
    if (trackedItems.length === 0) {
      toast.error("Your library is empty. Nothing to export.");
      return;
    }
    const dataStr = JSON.stringify(trackedItems, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `movie-tracker-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success("Backup file exported successfully.");
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (text) {
        onImport(text);
      }
    };
    reader.readAsText(file);
    // Reset file input value so same file can be selected again
    e.target.value = '';
  };

  const handleClearAll = () => {
    if (confirm("WARNING: This will permanently delete your entire watch library. This action cannot be undone. Are you sure you want to proceed?")) {
      onClear();
    }
  };

  return (
    <div className="space-y-6">
      {/* API Configuration */}
      <Card className="bg-zinc-950 border-zinc-900 shadow-md">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold text-zinc-200 flex items-center gap-2">
            <Key className="w-4 h-4 text-indigo-400" /> External API Configuration
          </CardTitle>
          <CardDescription className="text-xs text-zinc-500">
            By default, search filters our offline mock database. Add api keys to enable live query searches.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-zinc-400 uppercase">TMDB API Key (V3)</label>
              <Input
                type="password"
                value={tmdbKey}
                onChange={(e) => setTmdbKey(e.target.value)}
                placeholder="Paste TMDB API Key..."
                className="bg-zinc-900 border-zinc-800 text-zinc-200 text-xs placeholder:text-zinc-650"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-zinc-400 uppercase">OMDb API Key</label>
              <Input
                type="password"
                value={omdbKey}
                onChange={(e) => setOmdbKey(e.target.value)}
                placeholder="Paste OMDb API Key..."
                className="bg-zinc-900 border-zinc-800 text-zinc-200 text-xs placeholder:text-zinc-650"
              />
            </div>
          </div>
          <div className="pt-2 flex justify-end">
            <Button
              onClick={handleSaveKeys}
              className="bg-zinc-100 hover:bg-zinc-200 text-zinc-950 font-medium text-xs h-8 px-4 rounded"
            >
              Save Keys
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Backup and Restore */}
      <Card className="bg-zinc-950 border-zinc-900 shadow-md">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold text-zinc-200 flex items-center gap-2">
            <Download className="w-4 h-4 text-emerald-400" /> Data Portability
          </CardTitle>
          <CardDescription className="text-xs text-zinc-500">
            Export your entire movie library as a JSON file or import library details from a backup.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Button
            variant="outline"
            onClick={handleExport}
            className="border-zinc-850 hover:bg-zinc-900 text-zinc-200 text-xs h-9 rounded flex items-center gap-2"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Library (.json)</span>
          </Button>

          <input
            type="file"
            accept=".json"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
          />
          <Button
            variant="outline"
            onClick={handleImportClick}
            className="border-zinc-850 hover:bg-zinc-900 text-zinc-200 text-xs h-9 rounded flex items-center gap-2"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Import Backup (.json)</span>
          </Button>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="bg-zinc-950 border-red-900/30 border shadow-md">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold text-red-400 flex items-center gap-2">
            <ShieldAlert className="w-4 h-4" /> Danger Zone
          </CardTitle>
          <CardDescription className="text-xs text-zinc-500">
            These operations delete data permanently and cannot be recovered.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-2">
          <div className="flex items-center justify-between border border-red-950/20 bg-red-950/10 p-3 rounded-lg">
            <div className="space-y-0.5 max-w-[70%]">
              <h4 className="text-xs font-semibold text-zinc-200">Delete all Library Data</h4>
              <p className="text-[11px] text-zinc-500">
                Purge all custom items, watched histories, watchlists, ratings and notes.
              </p>
            </div>
            <Button
              variant="destructive"
              onClick={handleClearAll}
              className="bg-red-950 border border-red-900/50 hover:bg-red-900 text-red-200 text-xs h-9 rounded flex items-center gap-2 px-4"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Purge Library</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
export default SettingsPanel;
