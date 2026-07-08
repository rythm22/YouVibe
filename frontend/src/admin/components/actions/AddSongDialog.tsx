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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetAlbums } from "@/hooks/album/useAlbum";
import { axiosInstance } from "@/lib/axios";
import { Song, VibeStats } from "@/lib/types";
import { useAuth } from "@clerk/clerk-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, Plus, Upload, X } from "lucide-react";
import { ChangeEvent, useRef, useState } from "react";
import toast from "react-hot-toast";

interface NewSong {
  title: string;
  artist: string;
  duration: string;
  album: string;
}

interface ImagePreview {
  url: string;
  file: File;
}

const AddSongDialog = () => {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();
  const { data: albums } = useGetAlbums();
  const [songDialogOpen, setSongDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [newSong, setNewSong] = useState<NewSong>({
    title: "",
    artist: "",
    duration: "0",
    album: "",
  });

  const [vibeAudio, setVibeAudio] = useState<File | null>(null);

  const [preview, setPreview] = useState<ImagePreview | null>(null);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const newPreview: ImagePreview = {
        url: URL.createObjectURL(file),
        file: file,
      };
      setPreview(newPreview);
    }
  };

  const removeImage = () => {
    if (preview?.url) {
      URL.revokeObjectURL(preview.url);
      setPreview(null);
    }
  };

  const audioInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const mutation = useMutation({
    mutationFn: async () => {
      if (!vibeAudio || !preview?.file) {
        return toast.error("Please upload both audio and image files");
      }

      const token = await getToken();
      const formData = new FormData();
      formData.append("title", newSong.title);
      formData.append("artist", newSong.artist);
      formData.append("duration", newSong.duration);
      formData.append("audioFile", vibeAudio);
      formData.append("imageFile", preview.file);
      if (newSong.album && newSong.album !== "none") {
        formData.append("albumId", newSong.album);
      }

      const response = await axiosInstance.post("/admin/addsong", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    },

    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["allsongs"] });
      await queryClient.cancelQueries({ queryKey: ["stats"] });
      const previousSongs = queryClient.getQueryData<Song[]>(["allsongs"]);
      const previousStats = queryClient.getQueryData<VibeStats[]>(["stats"]);

      const optimisticSong: Song = {
        _id: "temp-id-" + Date.now(),
        title: newSong.title,
        artist: newSong.artist,
        imageUrl: preview!.url,
        audioUrl: vibeAudio!.name,
        duration: 15,
        createdAt: new Date().toISOString(),
        albumId: "temp-albumId-" + Date.now(),
      };

      if (previousSongs) {
        queryClient.setQueryData<Song[]>(
          ["allsongs"],
          [...previousSongs, optimisticSong]
        );
      }

      if (previousStats) {
        queryClient.setQueryData<VibeStats>(["stats"], (old) => {
          if (!old) return old;
          return {
            ...old,
            totalSongs: (old.totalSongs || 0) + 1,
          };
        });
      }

      return { previousSongs, previousStats };
    },

    onSuccess: () => {
      setNewSong({
        title: "",
        artist: "",
        duration: "0",
        album: "",
      });
      setPreview(null);
      setVibeAudio(null);
      setSongDialogOpen(false);
      toast.success("Song added successfully");
    },

    onError: (err, id, context) => {
      queryClient.setQueryData(["allsongs"], context?.previousSongs);
      queryClient.setQueryData(["stats"], context?.previousStats);
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["allsongs"] });
      queryClient.invalidateQueries({ queryKey: ["featured-songs"] });
      queryClient.invalidateQueries({ queryKey: ["madeforyou-songs"] });
      queryClient.invalidateQueries({ queryKey: ["trending-songs"] });
      queryClient.invalidateQueries({ queryKey: ["stats"] });
    },
  });

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      await mutation.mutateAsync();
    } catch (error) {
      toast.error(`Failed to add song: ${error}`);
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={songDialogOpen} onOpenChange={setSongDialogOpen}>
      <DialogTrigger asChild>
        <Button className="bg-emerald-500 hover:bg-emerald-600 text-black">
          <Plus className="mr-2 h-4 w-4" />
          Add Song
        </Button>
      </DialogTrigger>

      <DialogContent className="bg-zinc-900 border-zinc-700 max-h-[80vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>Add New Song</DialogTitle>
          <DialogDescription>
            Add a new song to your music library
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <input
            type="file"
            accept="audio/*"
            ref={audioInputRef}
            hidden
            onChange={(e) => setVibeAudio(e.target.files![0])}
          />

          <input
            type="file"
            ref={imageInputRef}
            className="hidden"
            accept="image/*"
            onChange={handleImageChange}
          />

          {/* image upload area */}
          <div
            className="flex items-center justify-center p-6 border-2 border-dashed border-zinc-700 rounded-lg cursor-pointer"
            onClick={() => imageInputRef.current?.click()}
          >
            <div className="text-center">
              {preview ? (
                <div className="relative">
                  <img
                    className="object-cover rounded-lg"
                    src={preview.url}
                    alt=""
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full hover:bg-red-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <>
                  <div className="p-3 bg-zinc-800 rounded-full inline-block mb-2">
                    <Upload className="h-6 w-6 text-zinc-400" />
                  </div>
                  <div className="text-sm text-zinc-400 mb-2">
                    Upload artwork
                  </div>
                  <Button variant="outline" size="sm" className="text-xs">
                    Choose File
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* Audio upload */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Audio File</label>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={() => audioInputRef.current?.click()}
                className="w-full"
              >
                {vibeAudio ? vibeAudio.name.slice(0, 20) : "Choose Audio File"}
              </Button>
            </div>
          </div>

          {/* other fields */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Title</label>
            <Input
              value={newSong.title}
              onChange={(e) =>
                setNewSong({ ...newSong, title: e.target.value })
              }
              className="bg-zinc-800 border-zinc-700"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Artist</label>
            <Input
              value={newSong.artist}
              onChange={(e) =>
                setNewSong({ ...newSong, artist: e.target.value })
              }
              className="bg-zinc-800 border-zinc-700"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Duration (seconds)</label>
            <Input
              type="number"
              min="0"
              value={newSong.duration}
              onChange={(e) =>
                setNewSong({ ...newSong, duration: e.target.value || "0" })
              }
              className="bg-zinc-800 border-zinc-700"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Album (Optional)</label>
            <Select
              value={newSong.album}
              onValueChange={(value) =>
                setNewSong({ ...newSong, album: value })
              }
            >
              <SelectTrigger className="bg-zinc-800 border-zinc-700">
                <SelectValue placeholder="Select album" />
              </SelectTrigger>
              <SelectContent className="bg-zinc-800 border-zinc-700">
                <SelectItem value="none">No Album (Single)</SelectItem>
                {albums.map((album) => (
                  <SelectItem key={album._id} value={album._id}>
                    {album.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setSongDialogOpen(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="text-white size-4 animate-spin" />
            ) : (
              "Add Song"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddSongDialog;
