import {
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import LeftSidebar from "./components/LeftSidebar";
import AudioPlayer from "./components/AudioPlayer";
import PlayBackControls from "./components/PlayBackControl";

const MainLayout = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 935);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <div className="h-screen bg-black text-white flex flex-col">
      <ResizablePanelGroup
        direction="horizontal"
        className="flex-1 flex h-full overflow-hidden p-2"
      >
        <AudioPlayer />
        {/* left sidebar */}
        {!isMobile && (
          <>
            <ResizablePanel
              defaultSize={20}
              minSize={isMobile ? 0 : 20}
              maxSize={20}
            >
              <LeftSidebar />
            </ResizablePanel>
          </>
        )}
        {/* Main content */}
        <ResizablePanel defaultSize={100}>
          <Outlet />
        </ResizablePanel>
      </ResizablePanelGroup>

      <PlayBackControls />
    </div>
  );
};
export default MainLayout;
