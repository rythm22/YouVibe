export interface Album {
  _id: string;
  title: string;
  artist: string;
  imageUrl: string;
  releaseYear: number;
  songs: Song[]; // Array of song IDs
  createdAt: string;
  updatedAt: string;
}

export interface UserAlbum {
  _id: string;
  title: string;
  songs: Song[]; 
  createdAt: string;
  updatedAt: string;
}

export interface CreateAlbumDTO {
  title: string;
  artist: string;
  imageUrl: string;
  releaseYear: number;
}

export interface Song {
  _id: string;
  title: string;
  imageUrl: string;
  audioUrl: string;
  artist: string;
  duration: number;
  albumId: string;
  createdAt: string;
}

export interface User {
  _id: string;
  fullName: string;
  imageUrl: string;
  clerkId: string;
}

export type AdminStatus = boolean;

export interface VibeStats {
  totalAlbums: number;
  totalSongs: number;
  totalUsers: number;
  totalArtists: number;
}

export interface Message {
  _id: string;
  senderId: string;
  receiverId: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface AxiosError {
  response: {
    data: {
      message: string;
    };
  };
}
