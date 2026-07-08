import Topbar from "@/components/Topbar";
import FeaturedSection from "./components/FeaturedSection";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  useGetFeaturedSongs,
  useGetMadeForYouSongs,
  useGetTrendingSongs,
} from "@/hooks/songs/useSong";
import SectionGrid from "./components/SectionGrid";
import { usePlayerStore } from "@/store/usePlayerStore";
import { useEffect } from "react";
import SectionGrid2 from "./components/SectionGrid2";

const HomePage = () => {
  const { data: madeForYouSongs } = useGetMadeForYouSongs();
  const { data: trendingSongs } = useGetTrendingSongs();
  const { data: featuredSongs } = useGetFeaturedSongs();
  const isLoading1 = !madeForYouSongs;
  const isLoading2 = !trendingSongs;

  const { initializeQueue } = usePlayerStore();
   useEffect(() => {
     if (
       madeForYouSongs &&
       trendingSongs &&
       featuredSongs &&
       madeForYouSongs.length > 0 &&
       trendingSongs.length > 0 &&
       featuredSongs.length > 0
     ) {
       const allSongs = [
         ...featuredSongs,
         ...madeForYouSongs,
         ...trendingSongs,
       ];
       initializeQueue(allSongs);
     }
   }, [initializeQueue, featuredSongs, madeForYouSongs, trendingSongs]);


  return (
    <div className="rounded-md overflow-hidden">
      <Topbar />
      <ScrollArea className="h-[calc(100vh-160px)]">
        <div className="p-4 sm:p-6">
          <h1 className="text-2xl sm:text-3xl font-bold mb-6">
            Good afternoon
          </h1>
          <FeaturedSection />

          <div className="space-y-8">
            <SectionGrid2 />
            <SectionGrid
              title="Made For You"
              songs={madeForYouSongs!}
              isLoading={isLoading1}
            />
            <SectionGrid
              title="Trending"
              songs={trendingSongs!}
              isLoading={isLoading2}
            />
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};

export default HomePage;
