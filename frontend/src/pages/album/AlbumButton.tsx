import { Button } from "@/components/ui/button";
import { useGetAlbumById } from "@/hooks/album/useAlbum";
import { usePlayerStore } from "@/store/usePlayerStore";
import { Pause, Play } from "lucide-react";

interface AlbumButtonProps {
    albumId: string | undefined;
}

const AlbumButton = ({ albumId }: AlbumButtonProps) => {
     const { data: cA } = useGetAlbumById(albumId!);

     const currentAlbum = cA!;
    const {
      currentSong,
      isPlaying,
      playAlbum,
      togglePlay,
      currentAlbumId,
    } = usePlayerStore();
 
    const isCurrentAlbum = currentAlbum?._id === currentAlbumId;

    const handlePlayAlbum = () => {
      const isCurrentAlbumSongPlaying = currentAlbum.songs.some(
        (song) => song._id === currentSong?._id
      );

      if (isCurrentAlbum && isCurrentAlbumSongPlaying) togglePlay();
      else playAlbum(currentAlbum.songs, currentAlbum._id, 0);
    };

  return (
    <div>
      <Button
        onClick={handlePlayAlbum}
        size="icon"
        className="w-14 h-14 rounded-full bg-gradient-to-r from-pink-700 to-blue-700
                hover:scale-105 hover:from-blue-700 hover:to-pink-700 transition-all"
      >
        {isPlaying &&
        isCurrentAlbum &&
        currentAlbum?.songs.some((song) => song._id === currentSong?._id) ? (
          <Pause className="h-7 w-7 text-white" />
        ) : (
          <Play className="h-7 w-7 text-white" />
        )}
      </Button>
    </div>
  );
}

export default AlbumButton