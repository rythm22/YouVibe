import Header from "./components/Header";
import DashboardStates from "./components/DashboardStates";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Album, Loader2, Music } from "lucide-react";
import SongsTabContent from "./components/SongsTabContent";
import AlbumsTabContent from "./components/AlbumsTabContent";
import { useGetAdminStatus } from "@/hooks/admin/useAdmin";

const AdminPage = () => {
  const { data: isAdmin } = useGetAdminStatus();
  if (!isAdmin)
    return (
      <div className="h-screen flex justify-center items-center">
        <Loader2 className="size-14 text-blue-400 animate-spin" />
      </div>
    );
  return (
    <div
      className="min-h-screen bg-gradient-to-b from-zinc-900 via-zinc-900
   to-black text-zinc-100 p-8 scrollbar-thin overflow-x-auto overflow-y-auto "
    >
      <Header />

      <DashboardStates />

      <Tabs defaultValue="songs" className="space-y-6 scrollbar-thin">
        <TabsList className="p-1 bg-zinc-800/50">
          <TabsTrigger
            value="songs"
            className="data-[state=active]:bg-zinc-700"
          >
            <Music className="mr-2 size-4" />
            Songs
          </TabsTrigger>
          <TabsTrigger
            value="albums"
            className="data-[state=active]:bg-zinc-700"
          >
            <Album className="mr-2 size-4" />
            Albums
          </TabsTrigger>
        </TabsList>

        <TabsContent value="songs">
          <SongsTabContent />
        </TabsContent>
        <TabsContent value="albums">
          <AlbumsTabContent />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminPage;
