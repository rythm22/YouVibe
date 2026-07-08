import AlbumSkeleton from "@/components/skeletons/AlbumSkeleton";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useGetUserAlbum } from "@/hooks/chat/useChat";
import { MusicWave } from "@/layout/components/WaveButton";
import { usePlayerStore } from "@/store/usePlayerStore";
import { useAuth, useUser } from "@clerk/clerk-react";
import {
  Clock,
  Loader2,
  Music2,
  Pause,
  Play,
  Repeat,
  Trash2,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import lawliet from "@/assets/49451d65-d201-49a9-8bd7-63c5bdde1051.jpg";
import UserAddAlbumSongs from "./UserAddAlbumSongs";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { axiosInstance } from "@/lib/axios";
import Topbar from "@/components/Topbar";

const UserAlbumPage = () => {
  const { albumId } = useParams();
  const { data: currentAlbum } = useGetUserAlbum(albumId!);
  const { user } = useUser();
  const { getToken } = useAuth();
  const queryClient = useQueryClient();
  const {
    currentSong,
    isPlaying,
    playAlbum,
    playAlbumInLoop,
    togglePlay,
    currentAlbumId,
  } = usePlayerStore();

  const [loadingSongId, setLoadingSongId] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const deleteMutation = useMutation({
    mutationFn: async (songId: string) => {
      const token = await getToken();
      const response = await axiosInstance.delete("/albums/deletesongs", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: {
          albumId,
          songId,
        },
      });
      return response.data;
    },

    onSuccess: () => {
      toast.success("Songs removed successfully");

      queryClient.invalidateQueries({ queryKey: ["user-albums", albumId] });
      queryClient.invalidateQueries({ queryKey: ["user-albums"] });
      queryClient.invalidateQueries({ queryKey: ["useralbum-songs", albumId] });
    },

    onError: (error) => {
      toast.error("Failed to add songs to album");
      console.error("Error:", error);
    },
  });

  const deleteAlbumSong = async (songId: string) => {
    setLoadingSongId(songId);
    try {
      await deleteMutation.mutateAsync(songId);
    } catch (error) {
      console.error("Error deleting song:", error);
    } finally {
      setLoadingSongId("");
    }
  };

  const deleteAlbumMutation = useMutation({
    mutationFn: async () => {
      const token = await getToken();
      const response = await axiosInstance.delete(
        `/albums/delete/album/${albumId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    },
    onSuccess: () => {
      toast.success("Album removed successfully");
      navigate("/");
      queryClient.invalidateQueries({ queryKey: ["user-albums", albumId] });
      queryClient.invalidateQueries({ queryKey: ["user-albums"] });
    },

    onError: (error) => {
      toast.error("Failed to delete album");
      console.error("Error:", error);
    },
  });

  const deleteUserAlbum = async () => {
    setLoading(true);
    try {
      await deleteAlbumMutation.mutateAsync();
    } catch (error) {
      console.error("Error deleting album:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  if (!currentAlbum) {
    return <AlbumSkeleton />;
  }

  const isCurrentAlbum = albumId === currentAlbumId;
  const handlePlayAlbum = () => {
    const isCurrentAlbumSongPlaying = currentAlbum.songs.some(
      (song) => song._id === currentSong?._id
    );

    if (isCurrentAlbum && isCurrentAlbumSongPlaying) togglePlay();
    else playAlbum(currentAlbum.songs, albumId, 0);
  };

  const handlePlayLoop = () => {
    playAlbumInLoop(currentAlbum.songs, 0);
  };

  const handlePlaySong = (index: number) => {
    if (!currentAlbum) return;

    // Check if the album is currently in loop mode
    const { isLooping } = usePlayerStore.getState();

    if (isLooping) {
      // If already in loop mode, use playAlbumInLoop to maintain looping
      playAlbumInLoop(currentAlbum.songs, index);
    } else {
      // If not in loop mode, use standard playAlbum
      playAlbum(currentAlbum.songs, albumId, index);
    }
  };

  return (
    <div className="h-full overflow-auto">
      <Topbar />
      <ScrollArea className="h-full">
        {/* Main Content */}
        <div className="relative min-h-full">
          {/* bg gradient */}
          <div
            className="absolute inset-0 bg-gradient-to-b from-[#5038a0]/80 via-zinc-900/80
					 to-zinc-900 pointer-events-none"
            aria-hidden="true"
          />

          {/* Content */}
          <div className="relative z-10">
            <div className="flex justify-between">
              <div className="custom-flex .show-at-920 p-6 gap-6 pb-8">
                <img
                  src={lawliet}
                  alt={currentAlbum?.title}
                  className="w-[240px] h-[240px] shadow-xl rounded"
                />
                <div className="flex flex-col justify-end">
                  <p className="text-sm font-medium mt-4">Album</p>
                  <h1 className="text-7xl font-bold my-4">
                    {currentAlbum?.title}
                  </h1>
                  <div className="flex items-center gap-2 text-sm text-zinc-100">
                    <span className="font-medium text-white">
                      {user?.firstName}
                    </span>
                    <span>• {currentAlbum?.songs.length} songs</span>
                  </div>
                  <div className="mt-5">
                    <UserAddAlbumSongs album={currentAlbum} />
                  </div>
                </div>
              </div>
              <div className="m-5">
                <Button
                  onClick={deleteUserAlbum}
                  className="text-white bg-red-600 hover:bg-red-700"
                >
                  {loading ? (
                    <Loader2 className="size-5 animate-spin text-white" />
                  ) : (
                    "Delete Album"
                  )}
                </Button>
              </div>
            </div>

            {/* play button */}
            <div className="px-6 pb-4 flex items-center justify-between gap-6">
              <Button
                onClick={handlePlayAlbum}
                size="icon"
                className="w-14 h-14 rounded-full bg-gradient-to-r bg-blue-500
                hover:scale-105 hover:from-purple-700 hover:to-blue-400 transition-all"
              >
                {isPlaying &&
                isCurrentAlbum &&
                currentAlbum?.songs.some(
                  (song) => song._id === currentSong?._id
                ) ? (
                  <Pause className="h-7 w-7 text-white" />
                ) : (
                  <Play className="h-7 w-7 text-white" />
                )}
              </Button>
              <Button
                onClick={handlePlayLoop}
                className="flex items-center justify-center text-white bg-gradient-to-r from-[#5038a0]/80 to-red-700 hover:from-red-700 hover:to-[#5038a0]/80 rounded-full px-6 py-3 shadow-lg transform transition duration-300 ease-in-out hover:scale-105"
              >
                <Repeat className="mr-2 h-5 w-5" />{" "}
                <span className="font-semibold">Listen in loop</span>
              </Button>
            </div>

            {/* Table Section */}
            <div className="bg-black/20 backdrop-blur-sm">
              {/* table header */}
              <div
                className="grid grid-cols-[16px_4fr_2fr_1fr] gap-4 px-10 py-2 text-sm 
            text-zinc-400 border-b border-white/5"
              >
                <div>
                  <Music2 className="h-[0.95rem] w-[0.95rem] mt-[0.2rem]" />
                </div>
                <div>Title</div>
                <div>Released Date</div>
                <div>
                  <Clock className="h-4 w-4" />
                </div>
              </div>

              {/* songs list */}

              <div className="px-6">
                <div className="space-y-2 py-4">
                  {currentAlbum?.songs.map((song, index) => {
                    const isCurrentSong = currentSong?._id === song._id;
                    return (
                      <div
                        key={song._id}
                        onClick={() => handlePlaySong(index)}
                        className={`grid grid-cols-[16px_4fr_2fr_1fr] gap-4 px-4 py-2 text-sm 
                      text-zinc-400 hover:bg-white/5 rounded-md group cursor-pointer`}
                      >
                        <div className="flex items-center justify-center">
                          {isCurrentSong && isCurrentAlbum ? (
                            <div className="size-4 text-blue-500">
                              <MusicWave
                                isPlaying={isPlaying && isCurrentSong}
                              />
                            </div>
                          ) : (
                            <span className="group-hover:hidden">
                              {index + 1}
                            </span>
                          )}
                          {!isCurrentSong && (
                            <Play className="h-4 w-4 hidden group-hover:block" />
                          )}
                        </div>

                        <div className="flex items-center gap-3">
                          <img
                            src={song.imageUrl}
                            alt={song.title}
                            className="size-10"
                          />

                          <div>
                            <div
                              className={
                                isCurrentSong && isCurrentAlbum
                                  ? `font-medium text-blue-400`
                                  : `text-white font-medium`
                              }
                            >
                              {song.title}
                            </div>
                            <div>{song.artist}</div>
                          </div>
                        </div>
                        <div className="flex items-center">
                          {song.createdAt.split("T")[0]}
                        </div>
                        <div className="flex gap-10 items-center">
                          {formatDuration(song.duration)}

                          <div className="flex gap-2 justify-end">
                            <Button
                              variant={"ghost"}
                              size={"sm"}
                              className="text-red-400 hover:text-red-300 hover:bg-red-400/10"
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteAlbumSong(song._id);
                              }}
                            >
                              {deleteMutation.isPending &&
                              loadingSongId === song._id ? (
                                <Loader2 className="animate-spin text-white size-4" />
                              ) : (
                                <Trash2 className="size-4" />
                              )}
                            </Button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};

export default UserAlbumPage;
