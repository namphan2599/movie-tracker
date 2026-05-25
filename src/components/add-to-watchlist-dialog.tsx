/* eslint-disable react-hooks/set-state-in-effect */
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { useMovies } from '@/hooks/use-movies';
import { Movie } from '@/lib/movie-db';

interface AddToWatchlistDialogProps {
  isOpen: boolean;
  onClose: () => void;
  movie: Movie | null;
}

export function AddToWatchlistDialog({ isOpen, onClose, movie }: AddToWatchlistDialogProps) {
  const { collections, addCollection, addMovie } = useMovies();
  const [selectedId, setSelectedId] = useState<string>('default');
  const [showNew, setShowNew] = useState(false);
  const [newName, setNewName] = useState('');
  const [newColor, setNewColor] = useState('#6366f1');

  // Reset when opening a new movie
  React.useEffect(() => {
    if (isOpen) {
      setSelectedId('default');
      setShowNew(false);
      setNewName('');
      setNewColor('#6366f1');
    }
  }, [isOpen]);

  const handleAdd = () => {
    if (!movie) return;
    const collectionId = selectedId;
    addMovie(movie, 'watchlist', collectionId);
    onClose();
  };

  const handleCreateCollection = () => {
    if (!newName) return;
    const col = addCollection(newName, newColor);
    setSelectedId(col.id);
    setShowNew(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md bg-zinc-950 border border-zinc-900 text-zinc-100 rounded-xl shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-zinc-100 font-semibold">Add to Collection</DialogTitle>
          <DialogDescription className="text-zinc-500 text-sm">
            Choose an existing collection or create a new one.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-3 text-sm">
          {/* Existing Collections */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-400">COLLECTION</label>
            <Select value={selectedId} onValueChange={(val) => setSelectedId(val ?? 'default')}>
              <SelectTrigger className="w-full bg-zinc-900 border-zinc-800 text-zinc-200">
                <SelectValue placeholder="Select collection" />
              </SelectTrigger>
              <SelectContent className="bg-zinc-900 border-zinc-800 text-zinc-200">
                {collections.map((col) => (
                  <SelectItem key={col.id} value={col.id} className="hover:bg-zinc-800 focus:bg-zinc-800 cursor-pointer">
                    {col.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Create New Collection */}
          {showNew ? (
            <div className="space-y-2">
              <div className="flex gap-2 items-center">
                <Input
                  placeholder="Collection name"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="bg-zinc-900 border-zinc-800 text-zinc-200"
                />
                <Input
                  type="color"
                  value={newColor}
                  onChange={(e) => setNewColor(e.target.value)}
                  className="w-12 p-0 bg-zinc-900 border-zinc-800"
                />
                <Button size="sm" onClick={handleCreateCollection} className="bg-amber-600 hover:bg-amber-500 text-white">
                  Create
                </Button>
                <Button size="sm" variant="ghost" onClick={() => setShowNew(false)} className="text-zinc-400">
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <Button variant="outline" size="sm" onClick={() => setShowNew(true)} className="border-zinc-800 text-zinc-200 hover:bg-zinc-900">
              + New Collection
            </Button>
          )}
        </div>
        <DialogFooter className="flex justify-end gap-2 border-t border-zinc-900 pt-3">
          <Button variant="ghost" onClick={onClose} className="border-zinc-850 hover:bg-zinc-900 hover:text-zinc-100">
            Cancel
          </Button>
          <Button onClick={handleAdd} disabled={!movie} className="bg-amber-600 hover:bg-amber-500 text-white">
            Add
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default AddToWatchlistDialog;
