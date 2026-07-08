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
import { axiosInstance } from "@/lib/axios";
import { Album, VibeStats } from "@/lib/types";
import { useAuth } from "@clerk/clerk-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, Plus, Upload, X } from "lucide-react";
import { ChangeEvent, useRef, useState } from "react";
import toast from "react-hot-toast";

interface ImagePreview {
  url: string;
  file: File;
}

const AddAlbumDialog = () => {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();
  const [albumDialogOpen, setAlbumDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [newAlbum, setNewAlbum] = useState({
    title: "",
    artist: "",
    releaseYear: new Date().getFullYear(),
  });

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

  const mutation = useMutation({
    mutationFn: async () => {
      if (!preview?.file) {
        return toast.error("Please upload image file");
      }

      const token = await getToken();
      const formData = new FormData();
      formData.append("title", newAlbum.title);
      formData.append("artist", newAlbum.artist);
      formData.append("releaseYear", newAlbum.releaseYear.toString());
      formData.append("imageFile", preview.file);

      const response = await axiosInstance.post(
        "/admin/createalbum",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;
    },

    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["albums"] });
      await queryClient.cancelQueries({ queryKey: ["stats"] });

      const previousAlbums = queryClient.getQueryData<Album[]>(["albums"]);
      const previousStats = queryClient.getQueryData<VibeStats[]>(["stats"]);

      const optimisticAlbum: Album = {
        _id: "temp-id-" + Date.now(),
        title: newAlbum.title,
        artist: newAlbum.artist,
        imageUrl: preview!.url,
        releaseYear: newAlbum.releaseYear,
        songs: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      if (previousAlbums) {
        queryClient.setQueryData<Album[]>(
          ["albums"],
          [...previousAlbums, optimisticAlbum]
        );
      }

      if (previousStats) {
        queryClient.setQueryData<VibeStats>(["stats"], (old) => {
          if (!old) return old;
          return {
            ...old,
            totalAlbums: (old.totalAlbums || 0) + 1,
          };
        });
      }

      return { previousAlbums, previousStats };
    },

    onSuccess: () => {
      setNewAlbum({
        title: "",
        artist: "",
        releaseYear: new Date().getFullYear(),
      });
      setPreview(null);
      setAlbumDialogOpen(false);
      toast.success("Song added successfully");
    },

    onError: (err, id, context) => {
      queryClient.setQueryData(["albums"], context?.previousAlbums);
      queryClient.setQueryData(["stats"], context?.previousStats);
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["albums"] });
      queryClient.invalidateQueries({ queryKey: ["stats"] });
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

  return (
    <Dialog open={albumDialogOpen} onOpenChange={setAlbumDialogOpen}>
      <DialogTrigger asChild>
        <Button className="bg-violet-500 hover:bg-violet-600 text-white">
          <Plus className="mr-2 h-4 w-4" />
          Add Album
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-zinc-900 border-zinc-700 max-h-[80vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>Add New Album</DialogTitle>
          <DialogDescription>
            Add a new album to your collection
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageChange}
            accept="image/*"
            className="hidden"
          />
          <div
            className="flex items-center justify-center p-6 border-2 border-dashed border-zinc-700 rounded-lg cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
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
          <div className="space-y-2">
            <label className="text-sm font-medium">Album Title</label>
            <Input
              value={newAlbum.title}
              onChange={(e) =>
                setNewAlbum({ ...newAlbum, title: e.target.value })
              }
              className="bg-zinc-800 border-zinc-700"
              placeholder="Enter album title"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Artist</label>
            <Input
              value={newAlbum.artist}
              onChange={(e) =>
                setNewAlbum({ ...newAlbum, artist: e.target.value })
              }
              className="bg-zinc-800 border-zinc-700"
              placeholder="Enter artist name"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Release Year</label>
            <Input
              type="number"
              value={newAlbum.releaseYear}
              onChange={(e) =>
                setNewAlbum({
                  ...newAlbum,
                  releaseYear: parseInt(e.target.value),
                })
              }
              className="bg-zinc-800 border-zinc-700"
              placeholder="Enter release year"
              min={1900}
              max={new Date().getFullYear()}
            />
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
              isLoading || !preview || !newAlbum.title || !newAlbum.artist
            }
          >
            {isLoading ? (
              <Loader2 className="animate-spin text-white size-4" />
            ) : (
              "Add Album"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
export default AddAlbumDialog;
