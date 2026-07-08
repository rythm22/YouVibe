import { Song } from "@/lib/types";
import { create } from "zustand";

interface PlayerStore {
  currentSong: Song | null;
  isPlaying: boolean;
  queue: Song[];
  currentIndex: number;
  currentAlbumId: string;
  isLooping: boolean;

  initializeQueue: (songs: Song[]) => void;
  playAlbum: (songs: Song[], albumId?: string, startIndex?: number) => void;
  playAlbumInLoop: (songs: Song[], startIndex?: number) => void;
  resetQueueWithLooping: (songs: Song[], startIndex?: number) => void;
  setCurrentSong: (song: Song | null) => void;
  togglePlay: () => void;
  playNext: () => void;
  playPrevious: () => void;
  setLooping: (loop: boolean) => void;
}

export const usePlayerStore = create<PlayerStore>((set, get) => ({
  currentSong: null,
  isPlaying: false,
  queue: [],
  currentIndex: -1,
  currentAlbumId: "",
  isLooping: false,

  initializeQueue: (songs: Song[]) => {
    set({
      queue: songs,
      currentSong: get().currentSong || songs[0],
      currentIndex: get().currentIndex === -1 ? 0 : get().currentIndex,
    });
  },

  playAlbum: (songs: Song[], albumId, startIndex = 0) => {
    if (songs.length === 0) return;

    const song = songs[startIndex];
    set({
      queue: songs,
      currentSong: song,
      currentIndex: startIndex,
      currentAlbumId: albumId,
      isPlaying: true,
      isLooping: false,
    });
  },

  playAlbumInLoop: (songs: Song[], startIndex = 0) => {
    if (songs.length === 0) return;

    const song = songs[startIndex];
    set({
      queue: songs,
      currentSong: song,
      currentIndex: startIndex,
      isPlaying: true,
      isLooping: true,
    });
  },

  resetQueueWithLooping: (songs: Song[], startIndex = 0) => {
    set({
      queue: songs,
      currentSong: songs[startIndex],
      currentIndex: startIndex,
      isPlaying: true,
      isLooping: true,
    });
  },

  setCurrentSong: (song: Song | null) => {
    if (!song) return;

    const songIndex = get().queue.findIndex((s) => s._id === song._id);
    set({
      currentSong: song,
      isPlaying: true,
      currentIndex: songIndex !== -1 ? songIndex : get().currentIndex,
      isLooping: get().isLooping,
    });
  },

  setLooping: (loop: boolean) => {
    set({ isLooping: loop });
  },

  togglePlay: () => {
    const willStartPlaying = !get().isPlaying;

    set({
      isPlaying: willStartPlaying,
    });
  },

  playNext: () => {
    const { currentIndex, queue, isLooping } = get();
    const nextIndex = currentIndex + 1;

    // If there is a next song to play
    if (nextIndex < queue.length) {
      const nextSong = queue[nextIndex];

      set({
        currentSong: nextSong,
        currentIndex: nextIndex,
        isPlaying: true,
      });
    } else {
      // If at the end of the queue and looping is enabled
      if (isLooping) {
        // Reset to the first song
        const firstSong = queue[0];
        set({
          currentSong: firstSong,
          currentIndex: 0,
          isPlaying: true,
        });
      } else {
        // No next song and not looping
        set({ isPlaying: false });
      }
    }
  },

  playPrevious: () => {
    const { currentIndex, queue, isLooping } = get();
    const prevIndex = currentIndex - 1;

    // If there's a previous song
    if (prevIndex >= 0) {
      const prevSong = queue[prevIndex];
      set({
        currentSong: prevSong,
        currentIndex: prevIndex,
        isPlaying: true,
      });
    } else {
      // If at the beginning of the queue and looping is enabled
      if (isLooping) {
        // Go to the last song
        const lastSong = queue[queue.length - 1];
        set({
          currentSong: lastSong,
          currentIndex: queue.length - 1,
          isPlaying: true,
        });
      } else {
        // No previous song and not looping
        set({ isPlaying: false });
      }
    }
  },
}));
