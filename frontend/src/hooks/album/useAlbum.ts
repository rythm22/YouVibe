import { useQuery, useQueryClient } from "@tanstack/react-query";
import { AlbumApi } from "../api/album.api";
import { Album } from "@/lib/types";

export function useGetAlbums() {
  const queryClient = useQueryClient();
  return useQuery<Album[]>({
    queryKey: ["albums"],
    queryFn: async () => {
      const response = await AlbumApi.getAll();
      queryClient.setQueryData(["albums"], response);
      return response;
    },
    initialData: () => {
      return queryClient.getQueryData<Album[]>(["albums"]) ?? [];
    },
  });
}

export function useGetAlbumById(id: string) {
  return useQuery<Album>({
    queryKey: ["albums", id],
    queryFn: () => AlbumApi.getById(id),
  });
}
