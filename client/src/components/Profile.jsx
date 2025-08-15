import { useAuthStore } from "@/store/useAuthStore";
import { Eye, FolderOpen, Image, Trash2 } from "lucide-react";
import React, { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ImageOverlay from "./ImageOverlay";
import { useImageOverlay } from "@/store/ImageOverlayContext";

const Profile = () => {
  const { user } = useAuthStore();
  const [overlayActive, setOverlayActive] = useState(false);
    const { setIsOverlayOpen, setImageData } = useImageOverlay();
  
  return (
    <>
      <div className="flex flex-col items-center gap-4 mt-10">
        <DropdownMenu onOpenChange={(open) => setOverlayActive(open)}>
          <DropdownMenuTrigger asChild>
            <div className="relative group">
              {/* Profile picture */}
              <div className="size-[130px] cursor-pointer object-contain rounded-full border-2 border-primary overflow-hidden bg-primary/50">
                {user?.profilePic?.imageUrl ? (
                  <img
                    src={user?.profilePic?.imageUrl}
                    alt="loading"
                    className="w-full h-full object-cover object-top"
                  />
                ) : (
                  <p className="flex items-center justify-center h-full text-white font-semibold text-base">
                    {user?.fullName?.charAt(0).toUpperCase()}
                  </p>
                )}

                {/* Overlay */}
                <div
                  className={`absolute inset-0 rounded-full flex flex-col items-center justify-center 
                    bg-black/60 backdrop-blur text-white opacity-0 
                    group-hover:opacity-100 ${
                      overlayActive && "opacity-100"
                    } transition-opacity duration-300`}
                >
                  <Image />
                  <p className="text-center font-semibold text-base">
                    {user?.profilePic?.imageUrl
                      ? "Change Profile Photo"
                      : "Add Profile Photo"}
                  </p>
                </div>
              </div>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem disabled={!user?.profilePic?.imageUrl} onClick={() => {
              setIsOverlayOpen(true);
              setImageData({
                name: user?.fullName,
                image: user?.profilePic?.imageUrl
              });
            }}>
              <Eye /> View photo
            </DropdownMenuItem>
            <DropdownMenuItem>
              <FolderOpen /> Uplaod photo
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive">
              <Trash2 /> Remove photo
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </>
  );
};

export default Profile;
