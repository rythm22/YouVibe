import { SignedOut, UserButton } from "@clerk/clerk-react";
import { LayoutDashboardIcon, Menu } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { buttonVariants } from "./ui/button";
import SignInOAuthButtons from "./SignInOAuthButtons";
import logo from "../assets/𓆩♡𓆪.jpg";
import { useGetAdminStatus } from "@/hooks/admin/useAdmin";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useEffect, useState } from "react";
import LeftSheet from "@/userfeatures/LeftSheet";

const Topbar = () => {
  const { data: isAdmin } = useGetAdminStatus();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 905);

  // Update isMobile state on window resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 935);
    };

    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <div className="flex items-center justify-between p-4 sticky top-0 bg-zinc-900/75 backdrop-blur-md z-50">
      <div className="flex gap-2 justify-center items-center">
        {isMobile ? (
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <button className="flex items-center gap-2">
                <Menu className="size-6 text-zinc-400" />
              </button>
            </SheetTrigger>
            <SheetContent
              side="left"
              className="w-[300px] p-0 bg-zinc-900 border-zinc-800"
            >
              <LeftSheet />
            </SheetContent>
          </Sheet>
        ) : (
          <img src={logo} className="size-10 rounded-full" alt="youvibe logo" />
        )}
      </div>
      <div className="flex items-center gap-4">
        {isAdmin && (
          <Link
            to={"/admin"}
            className={cn(buttonVariants({ variant: "outline" }))}
          >
            <LayoutDashboardIcon className="size-4 mr-2" />
            Admin Dashboard
          </Link>
        )}

        <SignedOut>
          <SignInOAuthButtons />
        </SignedOut>

        <UserButton />
      </div>
    </div>
  );
};

export default Topbar;
