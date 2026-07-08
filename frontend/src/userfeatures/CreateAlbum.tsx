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
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useGetAllSongs } from "@/hooks/admin/useAdmin";
import { axiosInstance } from "@/lib/axios";
import { Song, UserAlbum } from "@/lib/types";
import { useAuth } from "@clerk/clerk-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, Plus } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

const CreateAlbumDialog = () => {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();
  const { data: songs } = useGetAllSongs();
  const [albumDialogOpen, setAlbumDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedSongs, setSelectedSongs] = useState<string[]>([]);

  const [newAlbum, setNewAlbum] = useState({
    title: "",
  });

  const mutation = useMutation({
    mutationFn: async () => {
      const token = await getToken();
      const formData = new FormData();
      formData.append("title", newAlbum.title);
      // Append the selected song IDs as a JSON string
      formData.append("songs", JSON.stringify(selectedSongs));

      const response = await axiosInstance.post("/users/createme", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    },

    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["user-albums"] });

      const previousAlbums = queryClient.getQueryData<UserAlbum[]>([
        "user-albums",
      ]);

      const optimisticAlbum: UserAlbum = {
        _id: "temp-id-" + Date.now(),
        title: newAlbum.title,
        songs: selectedSongs.map((id) => ({ _id: id })) as Song[],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      if (previousAlbums) {
        queryClient.setQueryData<UserAlbum[]>(
          ["user-albums"],
          [...previousAlbums, optimisticAlbum]
        );
      }

      return { previousAlbums };
    },

    onSuccess: () => {
      setNewAlbum({
        title: "",
      });
      setSelectedSongs([]);
      setAlbumDialogOpen(false);
      toast.success("Album created successfully");
    },

    onError: (err, id, context) => {
      queryClient.setQueryData(["user-albums"], context?.previousAlbums);
      toast.error("Failed to create album");
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["user-albums"] });
    },
  });

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      await mutation.mutateAsync();
    } catch (error) {
      toast.error(`Failed to add album: ${error}`);
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSongToggle = (songId: string) => {
    setSelectedSongs((prev) => {
      if (prev.includes(songId)) {
        return prev.filter((id) => id !== songId);
      } else {
        return [...prev, songId];
      }
    });
  };

  return (
    <Dialog open={albumDialogOpen} onOpenChange={setAlbumDialogOpen}>
      <DialogTrigger asChild>
        <Button className="text-white w-[16vw] bg-gradient-to-r from-[#5038a0]/80 to-pink-900 hover:from-purple-900 hover:to-[#5038a0]/80">
          <Plus className="h-4 w-4" />
          Create Album
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-zinc-900 border-zinc-700 max-h-[80vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>Create your own Album</DialogTitle>
          <DialogDescription>
            Add a new album to your collection
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Album Name</label>
            <Input
              value={newAlbum.title}
              onChange={(e) =>
                setNewAlbum({ ...newAlbum, title: e.target.value })
              }
              className="bg-zinc-800 border-zinc-700"
              placeholder="Enter your album name"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Select Songs</label>
            <div className="max-h-60 overflow-y-auto space-y-2 bg-zinc-800 rounded-md p-3">
              {songs?.map((song) => (
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
            onClick={() => setAlbumDialogOpen(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            className="bg-violet-500 hover:bg-violet-600"
            disabled={
              isLoading || !newAlbum.title || selectedSongs.length === 0
            }
          >
            {isLoading ? (
              <Loader2 className="animate-spin text-white size-4" />
            ) : (
              "Create Album"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateAlbumDialog;
