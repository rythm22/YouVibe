import { User, UserAlbum } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@clerk/clerk-react";
import { axiosInstance } from "@/lib/axios";

export const useGetUsers = () => {
  const { getToken } = useAuth();
  return useQuery<User[]>({
    queryKey: ["users"],
    queryFn: async () => {
      const token = await getToken();
      const response = await axiosInstance.get<User[]>("/users/getusers", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000, 
  });
};

export const useGetUserAlbums = () => {
    const { getToken } = useAuth();
    return useQuery({
      queryKey: ["user-albums"],
      queryFn: async () => {
        const token = await getToken();
        const response = await axiosInstance.get<UserAlbum[]>("/users/myalbums", {
          headers: { Authorization: `Bearer ${token}`},
        });

        return response.data;
      }
    });
}

export const useGetUserAlbum = (albumId: string) => {
    const { getToken } = useAuth();
    return useQuery({
      queryKey: ["user-albums", albumId],
      queryFn: async () => {
        const token = await getToken();
        const response = await axiosInstance.get<UserAlbum>(`/users/myalbums/${albumId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        return response.data;
      },
      refetchOnWindowFocus: false,
      staleTime: Infinity,
    });
}

export const useGetMessages = (userId: string | undefined) => {
  const { getToken } = useAuth();
  return useQuery({
    queryKey: ["messages", userId],
    queryFn: async () => {
      const token = await getToken();
      const response = await axiosInstance.get(
        `/users/messages/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    },
    refetchOnWindowFocus: false,
    staleTime: Infinity,
  });
};