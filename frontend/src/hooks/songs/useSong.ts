import { Song } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { getAlbumSongs, getFeaturedSongs, getMadeForYouSongs, getTrendingSongs, getUserAlbumSongs } from "../api/song.api";

export const useGetFeaturedSongs = () => {
  return useQuery<Song[]>({
    queryKey: ["featured-songs"],
    queryFn: getFeaturedSongs,
    refetchOnWindowFocus: false,
    staleTime: Infinity,
  });
};

export const useGetMadeForYouSongs = () => {
  return useQuery<Song[]>({
    queryKey: ["madeforyou-songs"],
    queryFn: getMadeForYouSongs,
    refetchOnWindowFocus: false,
    staleTime: Infinity,
  });
};

export const useGetTrendingSongs = () => {
  return useQuery<Song[]>({
    queryKey: ["trending-songs"],
    queryFn: getTrendingSongs,
    refetchOnWindowFocus: false,
    staleTime: Infinity,
  });
};

export const useGetAlbumSongs = (albumId: string) => {
  return useQuery<Song[]>({
    queryKey: ["album-songs", albumId],
    queryFn: () => getAlbumSongs(albumId),
    refetchOnWindowFocus: false,
    staleTime: Infinity,
  });
};

export const useGetUserAlbumSongs = (albumId: string) => {
  return useQuery<Song[]>({
    queryKey: ["useralbum-songs", albumId],
    queryFn: () => getUserAlbumSongs(albumId),
    refetchOnWindowFocus: false,
    staleTime: Infinity,
  });
};

