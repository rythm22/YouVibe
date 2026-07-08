import { axiosInstance } from "@/lib/axios";
import { Album } from "@/lib/types";

export const AlbumApi = {
  getAll: async (): Promise<Album[]> => {
    const { data } = await axiosInstance.get<Album[]>("/albums");
    return data;
  },

  getById: async (albumId: string): Promise<Album> => {
    const { data } = await axiosInstance.get<Album>(`/albums/${albumId}`);
    return data;
  },
};
