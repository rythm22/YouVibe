import { Button } from "@/components/ui/button";
import SectionGridSkeleton from "@/components/skeletons/SectionGridSkeleton";
import { useGetAlbums } from "@/hooks/album/useAlbum";
import AlbumButton from "@/pages/album/AlbumButton";
import { useNavigate } from "react-router-dom";
import { usePlayerStore } from "@/store/usePlayerStore";

const SectionGrid2 = () => {
  const { data: albums } = useGetAlbums();
  const { isPlaying, currentAlbumId } = usePlayerStore(); 
  const navigate = useNavigate();
  const isLoading = albums.length === 0;

  const handleAlbumClick = (e, albumId: string) => {
    if (!e.target.closest(".album-play-button")) {
      navigate(`/album/${albumId}`);
    }
  };

  if (isLoading) return <SectionGridSkeleton />;

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl sm:text-2xl font-bold">Trending Albums</h2>
        <Button
          variant="link"
          className="text-sm text-zinc-400 hover:text-white"
        >
          Show all
        </Button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {albums?.map((album) => (
          <div
            key={album._id}
            onClick={(e) => handleAlbumClick(e, album._id)}
            className="bg-zinc-800/40 p-4 rounded-md hover:bg-zinc-700/40 transition-all group cursor-pointer relative"
          >
            <div className="relative mb-4">
              <div className="aspect-square rounded-md shadow-lg overflow-hidden">
                <img
                  src={album.imageUrl}
                  alt={album.title}
                  className="w-full h-full object-cover transition-transform duration-300 
                  group-hover:scale-105"
                />
              </div>
              {/* Play button container */}
              <div
                className={`album-play-button absolute bottom-2 right-2 transition-opacity duration-200 
                ${
                  currentAlbumId === album._id && isPlaying
                    ? "opacity-100"
                    : "opacity-0 group-hover:opacity-100"
                }`}
              >
                <AlbumButton albumId={album._id} />
              </div>
            </div>
            <h3 className="font-medium mb-2 truncate">{album.title}</h3>
            <p className="text-sm text-zinc-400 truncate">{album.artist}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SectionGrid2;
