import { useEffect, useRef } from "react";
import { usePlayerStore } from "@/store/usePlayerStore";

const AudioPlayer = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const prevSongRef = useRef<string | null>(null);

  const { currentSong, isPlaying, playNext, isLooping, currentAlbumId } =
    usePlayerStore();

  // Handle play/pause logic
  useEffect(() => {
    if (isPlaying) audioRef.current?.play();
    else audioRef.current?.pause();
  }, [isPlaying]);

  // Handle song ends
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleEnded = () => {
      playNext();
    };

    audio.loop = isLooping && audio.duration > 0;
    audio.addEventListener("ended", handleEnded);

    return () => audio.removeEventListener("ended", handleEnded);
  }, [playNext, isLooping]);

  // Handle song changes
  useEffect(() => {
    if (!audioRef.current || !currentSong) return;

    const audio = audioRef.current;

    const uniqueSongContext = currentAlbumId
      ? `${currentSong?._id}-${currentAlbumId}`
      : currentSong?._id;

    // Check if this is actually a new song
    const isSongChange = prevSongRef.current !== uniqueSongContext;
    if (isSongChange) {
      audio.src = currentSong?.audioUrl;
      // Reset the playback position
      audio.currentTime = 0;

      prevSongRef.current = uniqueSongContext;

      if (isPlaying) audio.play();
    }
  }, [currentSong, isPlaying, currentAlbumId]);

  return <audio ref={audioRef} src={currentSong?.audioUrl || ""} />;
};

export default AudioPlayer;
