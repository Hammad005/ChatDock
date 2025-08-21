import { useAuthStore } from "@/store/useAuthStore";
import { ArrowLeft } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import UserDetailsSidebar from "./UserDetailsSidebar";

const ChatHeader = ({ activeChat, setActiveChat }) => {
  const { allUsers, onlineUsers } = useAuthStore();

  const [chatUser, setChatUser] = useState(
    allUsers.find((user) => user._id === activeChat)
  );

  useEffect(() => {
    setChatUser(allUsers.find((user) => user._id === activeChat));
  }, [activeChat, allUsers]);

  const [open, setOpen] = useState(false)
  return (
    <>
    <UserDetailsSidebar open={open} setOpen={setOpen} user={chatUser}/>
      <header className="flex items-center gap-1 p-3 bg-background">
        <Button
          variant={"ghost"}
          size={"icon"}
          onClick={() => setActiveChat(null)}
        >
          <ArrowLeft />
        </Button>
        <button onClick={() => setOpen(true)} className="flex items-center gap-3 cursor-pointer w-full">
        <div className="relative">
          <div className="size-10 object-contain rounded-full overflow-hidden border-2 border-primary bg-primary/50">
            {chatUser?.profilePic?.imageUrl ? (
              <img
                src={chatUser?.profilePic?.imageUrl}
                alt="loading"
                draggable={false}
                className="w-full h-full object-cover object-top"
              />
            ) : (
              <p className="flex items-center justify-center h-full w-full text-white font-semibold text-base">
                {chatUser?.fullName?.charAt(0).toUpperCase()}
              </p>
            )}
          </div>
        </div>
        <div className="flex flex-col items-start">
          <h3 className="text-base font-semibold">{chatUser?.fullName}</h3>
          <p className="text-xs text-muted-foreground">
            {onlineUsers.includes(chatUser?._id) ? "Online" : "Offline"}
          </p>
        </div>
        </button>
      </header>
    </>
  );
};

export default ChatHeader;
