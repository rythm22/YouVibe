import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { axiosInstance } from "@/lib/axios";
import { UserAlbum } from "@/lib/types";
import { useAuth } from "@clerk/clerk-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, Plus } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useGetAllSongs } from "@/hooks/admin/useAdmin";
import { useGetUserAlbumSongs } from "@/hooks/songs/useSong";

interface AddSongsToAlbumDialogProps {
  album: UserAlbum;
}

const UserAddAlbumSongs = ({ album }: AddSongsToAlbumDialogProps) => {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedSongs, setSelectedSongs] = useState<string[]>([]);

  // Get all available songs
  const { data: songs } = useGetAllSongs();
  const { data: albumSongs } = useGetUserAlbumSongs(album._id);

  const canAddSongs = songs?.filter(
    (song) => !albumSongs?.some((albumSong) => albumSong._id === song._id)
  );

  const handleSongToggle = (songId: string) => {
    setSelectedSongs((prev) =>
      prev.includes(songId)
        ? prev.filter((id) => id !== songId)
        : [...prev, songId]
    );
  };

  const mutation = useMutation({
    mutationFn: async () => {
      const token = await getToken();
      const response = await axiosInstance.post(
        "/albums/addsongs",
        {
          albumId: album._id,
          songs: JSON.stringify(selectedSongs),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    },

    onSuccess: () => {
      setSelectedSongs([]);
      setDialogOpen(false);
      toast.success("Songs added to album successfully");
      // Invalidate both queries to refetch fresh data
      queryClient.invalidateQueries({ queryKey: ["user-albums", album._id] });
      queryClient.invalidateQueries({ queryKey: ["user-albums"] });
      queryClient.invalidateQueries({
        queryKey: ["useralbum-songs", album._id],
      });
    },

    onError: (error) => {
      toast.error("Failed to add songs to album");
      console.error("Error:", error);
    },
  });

  const handleSubmit = () => {
    if (selectedSongs.length === 0) {
      toast.error("Please select at least one song");
      return;
    }
    mutation.mutate();
  };

  //   const mutation = useMutation({
  //     mutationFn: async () => {
  //       const token = await getToken();
  //       const response = await axiosInstance.post(
  //         `/admin/addalbumsong/${album._id}`,
  //         {
  //           albumId: album._id,
  //           songs: JSON.stringify(selectedSongs),
  //         },
  //         {
  //           headers: {
  //             Authorization: `Bearer ${token}`,
  //           },
  //         }
  //       );
  //       return response.data;
  //     },

  //     onMutate: async () => {
  //       // Cancel any outgoing refetches
  //       await queryClient.cancelQueries({ queryKey: ["albums", album._id] });

  //       // Snapshot the previous album data
  //       const previousAlbum = queryClient.getQueryData<Album>([
  //         "albums",
  //         album._id,
  //       ]);

  //       // Optimistically update the album
  //       queryClient.setQueryData<Album>(["albums", album._id], (old) => {
  //         if (!old) return old;

  //         // Create a new set of songs to avoid duplicates
  //         const updatedSongs = new Set([...old.songs, ...selectedSongs]);

  //         return {
  //           ...old,
  //           songs: Array.from(updatedSongs),
  //         };
  //       });

  //       return { previousAlbum };
  //     },

  //     //   // Also update the albums list if it exists in cache
  //     //   queryClient.setQueryData<Album[]>(["albums"], (oldAlbums) => {
  //     //     if (!oldAlbums) return oldAlbums;

  //     //     return oldAlbums.map((oldAlbum) => {
  //     //       if (oldAlbum._id === album._id) {
  //     //         const updatedSongs = new Set([...oldAlbum.songs, ...selectedSongs]);
  //     //         return {
  //     //           ...oldAlbum,
  //     //           songs: Array.from(updatedSongs),
  //     //         };
  //     //       }
  //     //       return oldAlbum;
  //     //     });
  //     //   });

  //     //   return { previousAlbum };
  //     // },

  //     onSuccess: () => {
  //       setSelectedSongs([]);
  //       setDialogOpen(false);
  //       toast.success("Songs added to album successfully");
  //     },

  //     onError: (err, newAlbum, context) => {
  //       // Revert the optimistic update
  //       queryClient.setQueryData(["albums", album._id], context?.previousAlbum);
  //       toast.error("Failed to add songs to album");
  //     },

  //     onSettled: () => {
  //       // Refetch to ensure consistency
  //       queryClient.invalidateQueries({ queryKey: ["albums", album._id] });
  //       queryClient.invalidateQueries({ queryKey: ["albums"] });
  //     },
  //   });

  //   const handleSubmit = async () => {
  //     if (selectedSongs.length === 0) {
  //       toast.error("Please select at least one song");
  //       return;
  //     }

  //     try {
  //       await mutation.mutateAsync();
  //     } catch (error) {
  //       console.error("Error:", error);
  //     }
  //   };

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button className="bg-violet-500 hover:bg-violet-600 text-white">
          <Plus className="mr-2 h-4 w-4" />
          Add Songs
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-zinc-900 border-zinc-700 max-h-[80vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>Add Songs to {album.title}</DialogTitle>
          <DialogDescription>
            Select songs to add to this album
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Select Songs</label>
            <div className="max-h-60 overflow-y-auto space-y-2 bg-zinc-800 rounded-md p-3">
              {canAddSongs?.map((song) => (
                <div key={song._id} className="flex items-center space-x-2">
                  <Checkbox
                    id={song._id}
                    checked={selectedSongs.includes(song._id)}
                    onCheckedChange={() => handleSongToggle(song._id)}
                  />
                  <img className="h-8 w-8" src={song.imageUrl} alt="" />
                  <label
                    htmlFor={song._id}
                    className="text-sm cursor-pointer hover:text-pink-400"
                  >
                    {song.title}
                  </label>
                </div>
              ))}
            </div>
            <p className="text-xs text-zinc-400">
              Selected songs: {selectedSongs.length}
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setDialogOpen(false)}
            disabled={mutation.isPending}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            className="bg-violet-500 hover:bg-violet-600"
            disabled={mutation.isPending || selectedSongs.length === 0}
          >
            {mutation.isPending ? (
              <Loader2 className="animate-spin text-white size-4" />
            ) : (
              "Add Songs"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UserAddAlbumSongs;
