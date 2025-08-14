import React from "react";
import ModeToggle from "./ModeToggle";
import Logo from "../assets/logo.png";
import { Button } from "./ui/button";
import { BellRing, Home, Loader2, LogOut, MessageCircleMore } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useAuthStore } from "@/store/useAuthStore";

const MinSidebar = ({ active, setActive }) => {
  const { user, logout, userLoading } = useAuthStore();

  return (
    <>
      <div className="flex flex-col items-center justify-between py-5 gap-4 h-full">
        <div className="flex flex-col items-center gap-4">
          <img src={Logo} alt="loading" className="w-auto h-[40px]" />
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size={"icon"}
                onClick={() => setActive("Home")}
                variant={active === "Home" ? "default" : "secondary"}
              >
                <Home />
              </Button>
            </TooltipTrigger>
            <TooltipContent side={"right"}>
              <p>Home</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size={"icon"}
                onClick={() => setActive("Chat")}
                variant={active === "Chat" ? "default" : "secondary"}
              >
                <MessageCircleMore />
              </Button>
            </TooltipTrigger>
            <TooltipContent side={"right"}>
              <p>Chat</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size={"icon"}
                onClick={() => setActive("Notification")}
                variant={active === "Notification" ? "default" : "secondary"}
              >
                <BellRing />
              </Button>
            </TooltipTrigger>
            <TooltipContent side={"right"}>
              <p>Notifications</p>
            </TooltipContent>
          </Tooltip>

          <span className="h-px w-full bg-muted-foreground/40" />

          <Tooltip>
            <TooltipTrigger>
              <ModeToggle />
            </TooltipTrigger>
            <TooltipContent side={"right"}>
              <p>Theme</p>
            </TooltipContent>
          </Tooltip>
        </div>

        <div className="flex flex-col items-center gap-4">

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant={"secondary"} size={"icon"} disabled={userLoading} onClick={logout}>
                {!userLoading ? <LogOut/> : <Loader2 className="animate-spin" />}
              </Button>
            </TooltipTrigger>
            <TooltipContent side={"right"}>
              <p>Logout</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={() => setActive("Profile")}
                className="size-9 cursor-pointer object-contain rounded-full border-2 border-primary overflow-hidden bg-primary/50"
              >
                {user?.profilePic?.imageUrl ? (
                  <img
                    src={user?.profilePic?.imageUrl}
                    alt="loading"
                    className="w-full h-full object-cover object-top"
                  />
                ) : (
                  <p className="text-center text-white font-semibold text-base">
                    {user?.fullName?.charAt(0).toUpperCase()}
                  </p>
                )}
              </button>
            </TooltipTrigger>
            <TooltipContent side={"right"}>
              <p>Profile</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </>
  );
};

export default MinSidebar;
