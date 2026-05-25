'use client';

import React, { useState } from 'react';
import { TrackedItem } from '@/lib/movie-db';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Star, Trash2 } from 'lucide-react';

interface MovieDialogProps {
  item: TrackedItem | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (id: string, updates: Partial<TrackedItem>) => void;
  onRemove: (id: string) => void;
}

export function MovieDialog({ item, isOpen, onClose, onUpdate, onRemove }: MovieDialogProps) {
  const [status, setStatus] = useState<'watchlist' | 'watching' | 'watched'>(item?.status || 'watchlist');
  const [rating, setRating] = useState(item?.rating || 0);
  const [notes, setNotes] = useState(item?.notes || '');
  const [episodesWatched, setEpisodesWatched] = useState(item?.progress?.episodesWatched || 0);
  const [episodesTotal, setEpisodesTotal] = useState(item?.progress?.episodesTotal || 10);
  const [seasonsWatched, setSeasonsWatched] = useState(item?.progress?.seasonsWatched || 1);
  const [percentage, setPercentage] = useState(item?.progress?.percentage || 0);
  const [tagsInput, setTagsInput] = useState(item?.customTags?.join(', ') || '');
  const [prevItem, setPrevItem] = useState(item);

  if (item !== prevItem) {
    setPrevItem(item);
    if (item) {
      setStatus(item.status);
      setRating(item.rating);
      setNotes(item.notes);
      setTagsInput(item.customTags.join(', '));
      
      if (item.movie.type === 'series') {
        setEpisodesWatched(item.progress?.episodesWatched || 0);
        setEpisodesTotal(item.progress?.episodesTotal || 10);
        setSeasonsWatched(item.progress?.seasonsWatched || 1);
      } else {
        setPercentage(item.progress?.percentage || 0);
      }
    }
  }

  if (!item) return null;

  const handleSave = () => {
    const parsedTags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const progress =
      item.movie.type === 'series'
        ? {
            episodesWatched,
            episodesTotal,
            seasonsWatched,
          }
        : {
            percentage,
          };

    onUpdate(item.id, {
      status,
      rating: status === 'watched' ? rating : 0, // only watched can have rating
      notes,
      customTags: parsedTags,
      progress,
    });
    onClose();
  };

  const handleDelete = () => {
    if (confirm(`Are you sure you want to remove "${item.movie.title}"?`)) {
      onRemove(item.id);
      onClose();
    }
  };

  const handleStarClick = (selectedRating: number) => {
    setRating(selectedRating);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md bg-zinc-950 border border-zinc-900 text-zinc-100 rounded-xl shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-zinc-100 flex items-center justify-between pr-6 font-semibold">
            <span className="truncate">{item.movie.title}</span>
            <span className="text-xs text-zinc-500 font-normal shrink-0">{item.movie.year}</span>
          </DialogTitle>
          <DialogDescription className="text-zinc-500 text-xs">
            {item.movie.director} &bull; {item.movie.genre.join(', ')}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-3 text-sm">
          {/* Status Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-400">STATUS</label>
            <Select
              value={status}
              onValueChange={(val) => {
                if (val) {
                  setStatus(val as 'watchlist' | 'watching' | 'watched');
                  // Switch default rating if we move to watched
                  if (val !== 'watched') setRating(0);
                }
              }}
            >
              <SelectTrigger className="w-full bg-zinc-900 border-zinc-800 text-zinc-200">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent className="bg-zinc-900 border-zinc-800 text-zinc-200">
                <SelectItem value="watchlist" className="hover:bg-zinc-800 focus:bg-zinc-800 cursor-pointer">Watchlist</SelectItem>
                <SelectItem value="watching" className="hover:bg-zinc-800 focus:bg-zinc-800 cursor-pointer">Currently Watching</SelectItem>
                <SelectItem value="watched" className="hover:bg-zinc-800 focus:bg-zinc-800 cursor-pointer">Watched</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Conditional Input: Rating (Only if Watched) */}
          {status === 'watched' && (
            <div className="space-y-2">
              <label className="text-xs font-semibold text-zinc-400">RATING</label>
              <div className="flex items-center gap-1.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => handleStarClick(star)}
                    className="p-1 hover:scale-110 transition duration-150"
                  >
                    <Star
                      className={`w-6 h-6 ${
                        star <= rating
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-zinc-700 hover:text-zinc-500'
                      }`}
                    />
                  </button>
                ))}
                {rating > 0 && (
                  <span className="text-xs text-zinc-400 font-medium ml-2">{rating} / 5</span>
                )}
              </div>
            </div>
          )}

          {/* Conditional Input: Progress tracking (If Currently Watching) */}
          {status === 'watching' && (
            <div className="space-y-3 bg-zinc-900/40 p-3 rounded-lg border border-zinc-900">
              {item.movie.type === 'series' ? (
                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-semibold text-zinc-500 uppercase">Season</label>
                    <Input
                      type="number"
                      min={1}
                      value={seasonsWatched}
                      onChange={(e) => setSeasonsWatched(Math.max(1, parseInt(e.target.value) || 1))}
                      className="bg-zinc-900 border-zinc-800 text-zinc-200"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-semibold text-zinc-500 uppercase">Ep Watched</label>
                    <Input
                      type="number"
                      min={0}
                      value={episodesWatched}
                      onChange={(e) => setEpisodesWatched(Math.max(0, parseInt(e.target.value) || 0))}
                      className="bg-zinc-900 border-zinc-800 text-zinc-200"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-semibold text-zinc-500 uppercase">Total Eps</label>
                    <Input
                      type="number"
                      min={1}
                      value={episodesTotal}
                      onChange={(e) => setEpisodesTotal(Math.max(1, parseInt(e.target.value) || 10))}
                      className="bg-zinc-900 border-zinc-800 text-zinc-200"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] font-semibold text-zinc-500 uppercase">Progress (%)</label>
                    <span className="text-xs text-zinc-400 font-medium">{percentage}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="5"
                    value={percentage}
                    onChange={(e) => setPercentage(parseInt(e.target.value) || 0)}
                    className="w-full h-1 bg-zinc-850 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                  />
                </div>
              )}
            </div>
          )}

          {/* Tags Editor */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-400">TAGS (comma-separated)</label>
            <Input
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="e.g. Sci-Fi, Masterpiece, Oscar Winner"
              className="bg-zinc-900 border-zinc-800 text-zinc-200 placeholder:text-zinc-650"
            />
          </div>

          {/* Review / Notes */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-400">NOTES & REVIEW</label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="What did you think of it? Any favorite episodes, characters, or quotes?"
              className="min-h-24 bg-zinc-900 border-zinc-800 text-zinc-200 placeholder:text-zinc-650 resize-none"
            />
          </div>
        </div>

        <DialogFooter className="flex flex-row items-center justify-between border-t border-zinc-900 pt-3">
          <Button
            type="button"
            variant="ghost"
            onClick={handleDelete}
            className="text-red-400 hover:text-red-300 hover:bg-red-500/10 p-2 h-9 rounded"
            title="Remove from Library"
          >
            <Trash2 className="w-4 h-4 mr-1.5" />
            <span>Remove</span>
          </Button>

          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="border-zinc-850 hover:bg-zinc-900 hover:text-zinc-100 h-9 rounded"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleSave}
              className="bg-zinc-100 hover:bg-zinc-200 text-zinc-950 font-medium h-9 rounded"
            >
              Save Changes
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
export default MovieDialog;
