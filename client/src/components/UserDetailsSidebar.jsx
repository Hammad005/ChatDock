import React from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useImageOverlay } from "@/context/ImageOverlayContext";
import { toast } from "sonner";
import { ArrowRight, Images } from "lucide-react";
import { Button } from "./ui/button";

const UserDetailsSidebar = ({ open, setOpen, user }) => {
  const { setIsOverlayOpen, setImageData } = useImageOverlay();

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>User Info</SheetTitle>
        </SheetHeader>
        <div className="mt-5 flex flex-col items-center justify-start gap-4 overflow-auto h-full">
          <button
            onClick={() => {
              if (user?.profilePic?.imageUrl) {
                setOpen(false);
                setIsOverlayOpen(true);
                setImageData({
                  image: user?.profilePic?.imageUrl,
                  name: user?.fullName,
                });
              } else {
                toast.error("No profile photo");
              }
            }}
            className="size-[130px] cursor-pointer object-contain rounded-full border-2 border-primary overflow-hidden bg-primary/50"
          >
            {user?.profilePic?.imageUrl ? (
              <img
                src={user?.profilePic?.imageUrl}
                alt="loading"
                draggable={false}
                className="w-full h-full object-cover object-top"
              />
            ) : (
              <p className="flex items-center justify-center h-full text-white font-semibold text-6xl">
                {user?.fullName?.charAt(0).toUpperCase()}
              </p>
            )}
          </button>

          <h3 className="text-2xl font-semibold flex flex-col items-center gap-1">
            {user?.fullName}
            <span className="text-muted-foreground text-sm font-normal">
              {user?.email}
            </span>
          </h3>

          <div className="flex flex-col items-start gap-2 mt-5 px-6 w-full">
            <p className="text-base text-muted-foreground">About</p>
            <textarea
              readOnly
              className="w-full min-h-[50px] resize-none focus:outline-none"
              defaultValue={user?.about}
            />
            <span className="h-px w-full bg-muted-foreground" />
          </div>
          <div className="flex flex-col items-start gap-2 px-6 w-full">
            <dic className="flex items-center justify-between w-full">
                <p className="text-base flex items-center">
                <Images className="mr-2 size-5 text-muted-foreground" />
                Media
                </p>

                <Button variant={"ghost"} size={"sm"} className="text-sm text-muted-foreground">
                    100
                    <ArrowRight/>
                </Button>
            </dic>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default UserDetailsSidebar;
