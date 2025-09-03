"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import type { Song, Genre } from "./queueUtils";
import { fetchSongs, getGenres, refillQueue, rebuildQueueWithGenreFilter } from "./queueUtils";

export default function MusicQueue() {
  const [allSongs, setAllSongs] = useState<Song[]>([]);
  const [queue, setQueue] = useState<Song[]>([]);
  const [history, setHistory] = useState<Song[]>([]);
  const [current, setCurrent] = useState<Song | null>(null);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [selectedGenres, setSelectedGenres] = useState<Genre[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        setIsLoading(true);
        const songs = await fetchSongs();
        setAllSongs(songs);
        setGenres(getGenres(songs));

        const initialQueue = songs.slice(1, 11); // Skip first song as it will be current
        setQueue(initialQueue);
        setCurrent(songs[0] || null);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load songs");
      } finally {
        setIsLoading(false);
      }
    };

    initializeApp();
  }, []);

  const maintainQueueLength = useCallback(() => {
    if (allSongs.length === 0 || queue.length >= 10) return;

    const newQueue = refillQueue(allSongs, queue, history, current, selectedGenres, 10);
    setQueue(newQueue);
  }, [allSongs, queue, history, current, selectedGenres]);

  useEffect(() => {
    maintainQueueLength();
  }, [maintainQueueLength]);

  const handleGenreChange = useCallback(
    (genre: Genre) => {
      setSelectedGenres((prev) => {
        const newGenres = prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre];

        const newQueue = rebuildQueueWithGenreFilter(allSongs, current, history, newGenres, 10);
        setQueue(newQueue);

        return newGenres;
      });
    },
    [allSongs, current, history]
  );

  const playNext = useCallback(() => {
    if (queue.length === 0) return;

    if (current) {
      setHistory((prev) => [current, ...prev].slice(0, 10));
    }

    setCurrent(queue[0]);
    setQueue((prev) => prev.slice(1));
  }, [queue, current]);

  const playPrevious = useCallback(() => {
    if (history.length === 0) return;

    if (current) {
      setQueue((prev) => [current, ...prev]);
    }

    setCurrent(history[0]);
    setHistory((prev) => prev.slice(1));
  }, [history, current]);

  const removeFromQueue = useCallback((songId: number) => {
    setQueue((prev) => prev.filter((song) => song.id !== songId));
  }, []);

  const playFromQueue = useCallback(
    (songId: number) => {
      const songToPlay = queue.find((song) => song.id === songId);
      if (!songToPlay) return;

      if (current) {
        setHistory((prev) => [current, ...prev].slice(0, 10));
      }

      setCurrent(songToPlay);
      setQueue((prev) => prev.filter((song) => song.id !== songId));
    },
    [queue, current]
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading music...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-red-400 text-xl">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">Music Player Queue</h1>
          <p className="text-gray-300">Manage your music queue with style</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Now Playing & Controls */}
          <div className="lg:col-span-1 space-y-6">
            {/* Now Playing */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h2 className="text-xl font-semibold mb-4 text-center">Now Playing</h2>
              {current ? (
                <div className="space-y-4">
                  <div className="relative aspect-square rounded-xl overflow-hidden shadow-lg">
                    <Image src={current.coverImage} alt={current.title} fill className="object-cover" />
                  </div>
                  <div className="text-center space-y-2">
                    <h3 className="text-lg font-bold truncate">{current.title}</h3>
                    <p className="text-gray-300 truncate">{current.artist}</p>
                    <p className="text-sm text-gray-400 truncate">{current.album}</p>
                    <span className="inline-block px-3 py-1 bg-purple-500/30 rounded-full text-xs">{current.genre}</span>
                  </div>
                </div>
              ) : (
                <div className="text-center text-gray-400 py-8">No song playing</div>
              )}

              {/* Playback Controls */}
              <div className="flex justify-center gap-4 mt-6">
                <button onClick={playPrevious} disabled={history.length === 0} className="flex items-center justify-center w-12 h-12 rounded-full bg-white/20 hover:bg-white/30 disabled:opacity-50 disabled:cursor-not-allowed transition-colors" title="Previous">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M15.707 15.707a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414l5-5a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 010 1.414zm-6 0a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414l5-5a1 1 0 011.414 1.414L5.414 10l4.293 4.293a1 1 0 010 1.414z" />
                  </svg>
                </button>

                <button onClick={playNext} disabled={queue.length === 0} className="flex items-center justify-center w-12 h-12 rounded-full bg-purple-500 hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors" title="Next">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414zm6 0a1 1 0 011.414 0l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414-1.414L14.586 10l-4.293-4.293a1 1 0 010-1.414z" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Genre Filters */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h3 className="text-lg font-semibold mb-4">Filter by Genre</h3>
              <div className="flex flex-wrap gap-2">
                {genres.map((genre) => (
                  <button key={genre} onClick={() => handleGenreChange(genre)} className={`px-3 py-1 rounded-full text-sm transition-colors ${selectedGenres.includes(genre) ? "bg-purple-500 text-white" : "bg-white/20 text-gray-300 hover:bg-white/30"}`}>
                    {genre}
                  </button>
                ))}
              </div>
              {selectedGenres.length > 0 && <div className="mt-3 text-sm text-gray-400">Filtering: {selectedGenres.join(", ")}</div>}
            </div>

            {/* History */}
            {history.length > 0 && (
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                <h3 className="text-lg font-semibold mb-4">Recently Played</h3>
                <div className="space-y-3">
                  {history.map((song, index) => (
                    <div key={`${song.id}-${index}`} className="flex items-center gap-3">
                      <div className="relative w-10 h-10 rounded-lg overflow-hidden">
                        <Image src={song.coverImage} alt={song.title} fill className="object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{song.title}</p>
                        <p className="text-xs text-gray-400 truncate">{song.artist}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Queue */}
          <div className="lg:col-span-2">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold">Queue</h2>
                <span className="px-3 py-1 bg-purple-500/30 rounded-full text-sm">{queue.length} songs</span>
              </div>

              {queue.length === 0 ? (
                <div className="text-center text-gray-400 py-12">Queue is empty</div>
              ) : (
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {queue.map((song, index) => (
                    <div key={song.id} className="flex items-center gap-4 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors group">
                      <div className="text-sm text-gray-400 w-6 text-center">{index + 1}</div>
                      <div className="relative w-12 h-12 rounded-lg overflow-hidden">
                        <Image src={song.coverImage} alt={song.title} fill className="object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium truncate">{song.title}</h4>
                        <p className="text-sm text-gray-300 truncate">
                          {song.artist} • {song.album}
                        </p>
                        <p className="text-xs text-gray-400">{song.genre}</p>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => playFromQueue(song.id)} className="px-3 py-1 bg-purple-500 hover:bg-purple-600 rounded-lg text-sm transition-colors" title="Play now">
                          Play
                        </button>
                        <button onClick={() => removeFromQueue(song.id)} className="px-3 py-1 bg-red-500/70 hover:bg-red-500 rounded-lg text-sm transition-colors" title="Remove from queue">
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
