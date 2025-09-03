export type Song = {
  id: number;
  title: string;
  artist: string;
  album: string;
  genre: string;
  coverImage: string;
};

export type Genre = string;

export type QueueState = {
  queue: Song[];
  history: Song[];
  current: Song | null;
  genres: Genre[];
  selectedGenres: Genre[];
};

export async function fetchSongs(): Promise<Song[]> {
  const res = await fetch("/songs.json");
  if (!res.ok) {
    throw new Error("Failed to fetch songs");
  }
  return res.json();
}

export function getGenres(songs: Song[]): Genre[] {
  return Array.from(new Set(songs.map((s) => s.genre))).sort();
}

export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function getAvailableSongs(allSongs: Song[], queue: Song[], history: Song[], current: Song | null, selectedGenres: Genre[]): Song[] {
  const usedIds = new Set([...queue.map((s) => s.id), ...history.map((s) => s.id), ...(current ? [current.id] : [])]);

  let available = allSongs.filter((song) => !usedIds.has(song.id));

  if (selectedGenres.length > 0) {
    available = available.filter((song) => selectedGenres.includes(song.genre));
  }

  return available;
}

export function refillQueue(allSongs: Song[], currentQueue: Song[], history: Song[], current: Song | null, selectedGenres: Genre[], minLength = 10): Song[] {
  if (currentQueue.length >= minLength) {
    return currentQueue;
  }

  const available = getAvailableSongs(allSongs, currentQueue, history, current, selectedGenres);
  const shuffled = shuffleArray(available);
  const needed = minLength - currentQueue.length;

  return [...currentQueue, ...shuffled.slice(0, needed)];
}

export function rebuildQueueWithGenreFilter(allSongs: Song[], current: Song | null, history: Song[], selectedGenres: Genre[], minLength = 10): Song[] {
  const initialQueue: Song[] = [];

  return refillQueue(allSongs, initialQueue, history, current, selectedGenres, minLength);
}
