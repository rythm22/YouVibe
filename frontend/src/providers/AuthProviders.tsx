import { axiosInstance } from "@/lib/axios";
import { useChatStore } from "@/store/useChatStore";
import { useAuth } from "@clerk/clerk-react";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

const updateApiToken = (token: string | null) => {
  if (token)
    axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  else delete axiosInstance.defaults.headers.common["Authorization"];
};

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { getToken, userId } = useAuth();
  const [loading, setLoading] = useState(true);
  const { initSocket, disconnectSocket } = useChatStore();

  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = await getToken();
        updateApiToken(token);
        // init socket
        if (userId) initSocket(userId);
      } catch (error) {
        updateApiToken(null);
        console.log("Error in auth provider", error);
      } finally {
        setLoading(false);
      }
    };

    initAuth();

    // clean up
    return () => disconnectSocket();
  }, [getToken, userId, initSocket, disconnectSocket]);

  if (loading)
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <Loader2 className="size-12 text-blue-400 animate-spin" />
      </div>
    );

  return <>{children}</>;
};
export default AuthProvider;
