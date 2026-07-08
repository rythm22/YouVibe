import { UserButton } from "@clerk/clerk-react";
import { Link } from "react-router-dom";
import logo from "@/assets/L Lawliet♡.jpg";

const Header = () => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Link to="/" className="rounded-lg">
          <img src={logo} className="size-10 rounded-full text-black" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Music Manager</h1>
          <p className="text-zinc-400 mt-1">Manage your music catalog</p>
        </div>
      </div>
      <UserButton />
    </div>
  );
};
export default Header;
