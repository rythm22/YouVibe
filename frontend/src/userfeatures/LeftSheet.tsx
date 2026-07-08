import { buttonVariants } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useGetUserAlbums } from "@/hooks/chat/useChat";
import { UserAlbum } from "@/lib/types";
import { cn } from "@/lib/utils";
import { SignedIn, useUser } from "@clerk/clerk-react";
import { HeadphonesIcon, HomeIcon, Library, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";
import PlaylistSkeleton from "@/components/skeletons/PlaylistSkeleton";
import lawliet from "@/assets/49451d65-d201-49a9-8bd7-63c5bdde1051.jpg";
import CreateLeftSheetAlbumDialog from "./CreateLeftSheetAlbum";

const LeftSheet = () => {
  const { data: myAlbums } = useGetUserAlbums();
  const isLoading = !myAlbums;
  const { user } = useUser();

  return (
    <div className="h-full flex flex-col gap-2 w-full p-2">
      {/* Navigation menu */}
      <div className="rounded-lg bg-zinc-900/50 p-2">
        <div className="space-y-1">
          <Link
            to={"/"}
            className={cn(
              buttonVariants({
                variant: "ghost",
                className:
                  "w-full justify-start text-white hover:bg-zinc-800 h-12",
              })
            )}
          >
            <HomeIcon className="mr-3 size-5" />
            <span className="text-base">Home</span>
          </Link>

          <SignedIn>
            <Link
              to={"/chat"}
              className={cn(
                buttonVariants({
                  variant: "ghost",
                  className:
                    "w-full justify-start text-white hover:bg-zinc-800 h-12",
                })
              )}
            >
              <MessageCircle className="mr-3 size-5" />
              <span className="text-base">Messages</span>
            </Link>
          </SignedIn>
        </div>
      </div>

      {/* Library section */}
      <div className="flex-1 rounded-lg bg-zinc-900/50 overflow-hidden">
        <div className="flex items-center justify-between p-3">
          <div className="flex items-center text-white">
            <Library className="size-5 mr-3" />
            <span className="text-base">Activites</span>
          </div>
        </div>
        <ScrollArea className="h-[calc(100vh-220px)]">
          {user ? (
            <div className="space-y-2 p-2">
              <CreateLeftSheetAlbumDialog />
              <div className="space-y-1">
                {isLoading ? (
                  <PlaylistSkeleton />
                ) : (
                  myAlbums.map((album: UserAlbum) => (
                    <Link
                      to={`/user/album/${album._id}`}
                      key={album._id}
                      className="p-2 hover:bg-zinc-800 rounded-md flex items-center gap-3 group cursor-pointer"
                    >
                      <img
                        src={lawliet}
                        alt="Playlist img"
                        className="size-14 rounded-md flex-shrink-0 object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-base">{album.title}</p>
                        <p className="text-sm text-zinc-400">
                          Album • {user?.firstName}
                        </p>
                      </div>
                    </Link>
                  ))
                )}
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center p-6 text-center space-y-4">
              <div className="relative">
                <div
                  className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-sky-500 rounded-full blur-lg
                  opacity-85 animate-pulse"
                  aria-hidden="true"
                />
                <div className="relative bg-zinc-900 rounded-full p-4">
                  <HeadphonesIcon className="size-8 text-emerald-400" />
                </div>
              </div>

              <div className="space-y-2 max-w-[250px]">
                <h3 className="text-lg font-semibold text-white">
                  Enjoy songs with us
                </h3>
                <p className="text-sm text-zinc-400">
                  Login to create albums, chat real time with your friends and
                  many more activites
                </p>
              </div>
            </div>
          )}
        </ScrollArea>
      </div>
    </div>
  );
};

export default LeftSheet;
