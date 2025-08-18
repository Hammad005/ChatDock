import React, { useEffect, useState } from "react";
import { Input } from "./ui/input";
import { useAuthStore } from "@/store/useAuthStore";
import { useImageOverlay } from "@/context/ImageOverlayContext";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { Loader2, UserPlus } from "lucide-react";

const SelectFriend = ({ setActive, activeChat, setActiveChat }) => {
  const { allUsers, userLoading, userFriends, onlineUsers } = useAuthStore();

  const { setIsOverlayOpen, setImageData } = useImageOverlay();

  const [filteredFriends, setFilteredFriends] = useState(
    allUsers?.filter((u) => userFriends?.some((req) => req === u._id))
  );

  useEffect(() => {
    setFilteredFriends(
      allUsers?.filter((u) => userFriends?.some((req) => req === u._id))
    );
  }, [allUsers, userFriends]);
  return (
    <>
      <div className="flex flex-col w-full gap-4 mt-5">
        <Input
          type="text"
          placeholder="Search for a user"
          className="rounded-full focus-visible:ring-[1px]"
          onChange={(e) => {
            const filtered = allUsers.filter(
              (user) =>
                userFriends?.includes(user._id) &&
                user?.fullName
                  ?.toLowerCase()
                  .includes(e.target.value.toLowerCase())
            );
            setFilteredFriends(filtered);
          }}
        />

        {userLoading ? (
          <Loader2 className="animate-spin text-center w-full" />
        ) : filteredFriends?.length > 0 ? (
          filteredFriends?.map((user) => (
            <button
              className={`${activeChat === user._id && "bg-muted-foreground/10"} hover:bg-muted-foreground/10 p-3 rounded-md border`}
              key={user._id}
              onClick={() => {
                setActiveChat((prev) => (prev === user._id ? null : user._id));
              }}
            >
              <div className="flex items-center gap-4">
                <div className="relative">
                  <span
                    className={`absolute bottom-0 right-0 -translate-y-1/4 w-4 h-4 border-2 border-white rounded-full
                    ${
                      onlineUsers?.includes(user._id)
                        ? "bg-green-500"
                        : "bg-gray-500"
                    }
                    `}
                  />
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
                    className="size-12 object-contain cursor-pointer rounded-full overflow-hidden border-2 border-primary bg-primary/50"
                  >
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
                </div>
                <div className="flex flex-col items-start">
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
            </button>
          ))
        ) : (
          <>
            <h3 className="text-center font-bold">
              You have no friends to chat with.
            </h3>
            <Button
              onClick={() => {
                setActive("Home");
              }}
            >
              <UserPlus /> Add friends
            </Button>
          </>
        )}
      </div>
    </>
  );
};

export default SelectFriend;
