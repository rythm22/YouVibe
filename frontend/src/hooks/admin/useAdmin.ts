import { AdminStatus, Album, Song, VibeStats } from "@/lib/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@clerk/clerk-react";
import { axiosInstance } from "@/lib/axios";
import toast from "react-hot-toast";

export const useGetAdminStatus = () => {
  const { getToken } = useAuth();
  return useQuery<AdminStatus>({
    queryKey: ["isAdmin"],
    queryFn: async () => {
      const token = await getToken();
      const response = await axiosInstance.get<AdminStatus>("/admin/check", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    },
  });
};

export const useGetVibeStats = () => {
  const { getToken } = useAuth();
  return useQuery<VibeStats>({
    queryKey: ["stats"],
    queryFn: async () => {
      const token = await getToken();
      const response = await axiosInstance.get<VibeStats>("/stats", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    },
  });
};

export const useGetAllSongs = () => {
  const { getToken } = useAuth();
  return useQuery<Song[]>({
    queryKey: ["allsongs"],
    queryFn: async () => {
      const token = await getToken();
      const response = await axiosInstance.get<Song[]>("/songs/allsongs", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    },
  });
};

export const useDeleteSong = () => {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();
  return useMutation({
    mutationFn: async (id: string) => {
      const token = await getToken();
      const response = await axiosInstance.delete(`/admin/deletesong/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    },
    onMutate: async (id) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["allsongs"] });
      await queryClient.cancelQueries({ queryKey: ["stats"] });

      // Snapshot the previous values
      const prevSongs = queryClient.getQueryData<Song[]>(["allsongs"]);
      const prevStats = queryClient.getQueryData<VibeStats>(["stats"]);

      // Optimistically update songs list
      queryClient.setQueryData<Song[]>(["allsongs"], (old) =>
        old ? old.filter((song) => song._id !== id) : []
      );

      // Optimistically update stats
      queryClient.setQueryData<VibeStats>(["stats"], (old) => {
        if (!old) return old;
        return {
          ...old,
          totalSongs: (old.totalSongs || 0) - 1,
        };
      });

      return { prevSongs, prevStats };
    },

    onSuccess: () => {
      toast.success("Song deleted successfully");
    },

    onError: (err, id, context) => {
      // Revert changes if mutation fails
      queryClient.setQueryData(["allsongs"], context?.prevSongs);
      queryClient.setQueryData(["stats"], context?.prevStats);
    },

    onSettled: () => {
      // Refetch to ensure data is in sync
      queryClient.invalidateQueries({ queryKey: ["allsongs"] });
      queryClient.invalidateQueries({ queryKey: ["stats"] });
      queryClient.invalidateQueries({ queryKey: ["user-albums"] });
      queryClient.invalidateQueries({ queryKey: ["madeforyou-songs"] });
      queryClient.invalidateQueries({ queryKey: ["featured-songs"] });
      queryClient.invalidateQueries({ queryKey: ["trending-songs"] });
    },
  });
};

export const useDeleteAlbum = () => {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();
  return useMutation({
    mutationFn: async (id: string) => {
      const token = await getToken();
      const response = await axiosInstance.delete(`/admin/deletealbum/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    },
    onMutate: async (id) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["albums"] });
      await queryClient.cancelQueries({ queryKey: ["stats"] });

      // Snapshot the previous values
      const prevAlbums = queryClient.getQueryData<Album[]>(["albums"]);
      const prevStats = queryClient.getQueryData<VibeStats>(["stats"]);

      // Optimistically update songs list
      queryClient.setQueryData<Album[]>(["album"], (old) =>
        old ? old.filter((album) => album._id !== id) : []
      );

      // Optimistically update stats
      queryClient.setQueryData<VibeStats>(["stats"], (old) => {
        if (!old) return old;
        return {
          ...old,
          totalAlbums: (old.totalAlbums || 0) - 1,
        };
      });

      return { prevAlbums, prevStats };
    },

    onSuccess: () => {
      toast.success("Album deleted successfully");
    },

    onError: (err, id, context) => {
      // Revert changes if mutation fails
      queryClient.setQueryData(["albums"], context?.prevAlbums);
      queryClient.setQueryData(["stats"], context?.prevStats);
    },

    onSettled: () => {
      // Refetch to ensure data is in sync
      queryClient.invalidateQueries({ queryKey: ["albums"] });
      queryClient.invalidateQueries({ queryKey: ["stats"] });
    },
  });
};

