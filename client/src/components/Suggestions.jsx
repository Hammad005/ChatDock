import React, { useState } from "react";
import { Input } from "./ui/input";
import { useAuthStore } from "@/store/useAuthStore";
import { Button } from "./ui/button";
import { UserPlus } from "lucide-react";
import { useImageOverlay } from "@/store/ImageOverlayContext";
import { toast } from "sonner";

const Suggestions = () => {
  const { allUsers } = useAuthStore();

    const { setIsOverlayOpen, setImageData } = useImageOverlay();
  

  const [filteredUser, setfilteredUser] = useState(allUsers);
  return (
    <>
      <div className="flex flex-col items-center w-full gap-4 mt-5">
        <Input
          type="text"
          placeholder="Search for a user"
          className="rounded-full focus-visible:ring-[1px]"
          onChange={(e) => {
            const filtered = allUsers.filter((user) => {
              return user?.fullName
                ?.toLowerCase()
                .includes(e.target.value.toLowerCase());
            });
            setfilteredUser(filtered);
          }}
        />

        <div className="flex flex-col  w-full gap-6">
          <div>
            <h3 className="text-2xl font-semibold tracking-wider">
              Suggestions
            </h3>
            <p className="text-xs text-muted-foreground">People you may know</p>
          </div>

          {filteredUser?.map((user) => (
            <div className="flex items-center justify-between " key={user._id}>
              <div className="flex items-center gap-4">
                <button 
                onClick={() => {
                    if (user?.profilePic?.imageUrl) {
                        setIsOverlayOpen(true);
                        setImageData({
                          image: user?.profilePic?.imageUrl,
                          name: user?.fullName,
                        });
                    } else {
                        toast.error("No profile photo");
                    }
                }}
                className="size-12 object-contain cursor-pointer rounded-full overflow-hidden border-2 border-primary bg-primary/50">
                  {user?.profilePic?.imageUrl ? (
                    <img
                      src={user?.profilePic?.imageUrl}
                      alt="loading"
                      className="w-full h-full object-cover object-top"
                    />
                  ) : (
                    <p className="flex items-center justify-center h-full w-full text-white font-semibold text-base">
                      {user?.fullName?.charAt(0).toUpperCase()}
                    </p>
                  )}
                </button>
                <div className="flex flex-col">
                  <h3 className="text-base font-semibold">
                    {user.fullName.length > 25
                      ? `${user.fullName.slice(0, 25)}...`
                      : user.fullName}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {user.about.length > 25
                      ? `${user.about.slice(0, 25)}...`
                      : user.about}
                  </p>
                </div>
              </div>

              <Button>
                <UserPlus /> Add Friend
              </Button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Suggestions;
