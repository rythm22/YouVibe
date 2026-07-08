import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Music, Sheet } from "lucide-react";
import SongsTable from "./SongsTable";
import { useGetAllSongs } from "@/hooks/admin/useAdmin";
import { Button } from "@/components/ui/button";
import AddSongDialog from "./actions/AddSongDialog";

const SongsTabContent = () => {
  const { data: songs } = useGetAllSongs();
  const allSongs = songs!;
  const exportToCSV = () => {
    const csvData = [
      [
        "ID",
        "Title",
        "Created At",
        "Artist",
        "Image URL",
        "Audio URL",
        "Duration (Seconds)",
        "Album ID",
      ],
      ...allSongs.map((song) => [
        song._id,
        song.title,
        song.createdAt,
        song.artist,
        song.imageUrl,
        song.audioUrl,
        song.duration,
        song.albumId ? song.albumId : "NULL",
      ]),
    ];

    const csvContent = csvData.map((row) => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "youvibe-songs.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Card
      className="bg-gradient-to-b from-zinc-900 via-zinc-900
   to-black scrollbar-thin"
    >
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Music className="size-5 text-emerald-500" />
              Songs Library
            </CardTitle>
            <CardDescription>Manage your music tracks</CardDescription>
          </div>
          <div className="flex items-center gap-4">
            <AddSongDialog />
            <Button className="bg-purple-600 text-white" onClick={exportToCSV}>
              <Sheet />
              Export to csv
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <SongsTable />
      </CardContent>
    </Card>
  );
};
export default SongsTabContent;
