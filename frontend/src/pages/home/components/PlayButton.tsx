import { Button } from "@/components/ui/button";
import { Song } from "@/lib/types";
import { usePlayerStore } from "@/store/usePlayerStore";
import { Play } from "lucide-react";
import MusicWave2 from "./MusicWave2";

interface PlayButtonProps {
  song: Song;
}
const PlayButton = ({ song }: PlayButtonProps) => {
  const { currentSong, isPlaying, setCurrentSong, togglePlay } =
    usePlayerStore();
  const isCurrentSong = currentSong?._id === song._id;

  const handlePlay = () => {
    if (isCurrentSong) togglePlay();
    else setCurrentSong(song);
  };

  return (
    <Button
      onClick={handlePlay}
      className={`absolute bottom-3 right-2 bg-gradient-to-r from-blue-700 to-red-700 hover:from-red-700 hover:to-blue-700 shadow-lg transform transition duration-300 ease-in-out hover:scale-105"
				opacity-0 translate-y-2 group-hover:translate-y-0 h-11 w-11 rounded-full ${
          isCurrentSong ? "opacity-100" : "opacity-0 group-hover:opacity-100"
        }`}
    >
      {isCurrentSong && isPlaying ? (
        <MusicWave2 isPlaying={isPlaying && isCurrentSong} />
      ) : (
        <Play className="size-5 text-white" />
      )}
    </Button>
  );
};

export default PlayButton;
