import { axiosInstance } from "@/lib/axios";
import { Song } from "@/lib/types";

export const getFeaturedSongs = async (): Promise<Song[]> => {
  const { data } = await axiosInstance.get<Song[]>("/songs/featured-songs");
  return data;
};

export const getMadeForYouSongs = async (): Promise<Song[]> => {
  const { data } = await axiosInstance.get<Song[]>("/songs/made-for-you");
  return data;
};

export const getTrendingSongs = async (): Promise<Song[]> => {
  const { data } = await axiosInstance.get<Song[]>("/songs/trending-songs");
  return data;
};

export const getAlbumSongs = async (albumId: string): Promise<Song[]> => {
  const { data } = await axiosInstance.get<Song[]>(
    `/songs/songs-album/${albumId}`
  );
  return data;
};

export const getUserAlbumSongs = async (albumId: string): Promise<Song[]> => {
  const { data } = await axiosInstance.get<Song[]>(
    `/songs/songs-useralbum/${albumId}`
  );
  return data;
};

