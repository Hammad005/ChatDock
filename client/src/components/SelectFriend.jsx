import React, { useEffect, useMemo, useState } from "react";
import { Input } from "./ui/input";
import { useAuthStore } from "@/store/useAuthStore";
import { Button } from "./ui/button";
import { File, Image, Loader2, UserPlus } from "lucide-react";
import { useChatStore } from "@/store/useChatStore";

const SelectFriend = ({ setActive, activeChat, setActiveChat, setData }) => {
  const { allUsers, userLoading, userFriends, onlineUsers } = useAuthStore();
  const { sendedMessages, receivedMessages } = useChatStore();

  const [filteredFriends, setFilteredFriends] = useState(
    allUsers?.filter((u) => userFriends?.some((req) => req === u._id))
  );

  useEffect(() => {
    setFilteredFriends(
      allUsers?.filter((u) => userFriends?.some((req) => req === u._id))
    );
  }, [allUsers, userFriends]);

  const LastMessage = ({ user, receivedMessages, sendedMessages }) => {
  const formatDateTime = (dateStr) => {
    const d = new Date(dateStr);
    return `${d.toDateString()} - ${d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
  };

  const lastMessage = useMemo(() => {
    const msgs = [
      ...receivedMessages.filter((m) => m.senderId === user._id),
      ...sendedMessages.filter((m) => m.receiverId === user._id),
    ];
    if (msgs.length === 0) return null;
    return msgs.reduce((latest, m) =>
      new Date(m.createdAt) > new Date(latest.createdAt) ? m : latest
    );
  }, [user._id, receivedMessages, sendedMessages]);

  if (!lastMessage) return null;

  const isUnseen = lastMessage.senderId === user._id && !lastMessage.seen;

  // Priority: text → images → files
  if (lastMessage.text) {
    return (
      <p className={`flex items-center justify-between ${isUnseen && "font-black"}`}>
        <span className="flex items-center gap-1">
          {isUnseen && <span className="rounded-full bg-red-500 w-2 h-2" />}
          {lastMessage.text}
        </span>
        <span className="text-[10px]">{formatDateTime(lastMessage.createdAt)}</span>
      </p>
    );
  }

  if (lastMessage.images?.length > 0) {
    return (
      <p className={`flex items-center justify-between w-full ${isUnseen && "font-black"}`}>
        <span className="flex items-center gap-1">
          {isUnseen && <span className="rounded-full bg-red-500 w-2 h-2" />}
          <Image className={`size-4 ${isUnseen && "stroke-3"}`} />
          {lastMessage.images.length} {lastMessage.images.length > 1 ? "images" : "image"}
        </span>
        <span className="text-[10px]">{formatDateTime(lastMessage.createdAt)}</span>
      </p>
    );
  }

  if (lastMessage.files?.length > 0) {
    return (
      <p className={`flex items-center justify-between w-full ${isUnseen && "font-black"}`}>
        <span className="flex items-center gap-1">
          {isUnseen && <span className="rounded-full bg-red-500 w-2 h-2" />}
          <File className={`size-4 ${isUnseen && "stroke-3"}`} />
          {lastMessage.files.length} {lastMessage.files.length > 1 ? "files" : "file"}
        </span>
        <span className="text-[10px]">{formatDateTime(lastMessage.createdAt)}</span>
      </p>
    );
  }

  return null;
};


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
              className={`${
                activeChat === user._id && "bg-muted-foreground/10"
              } hover:bg-muted-foreground/10 cursor-pointer p-3 rounded-md border`}
              key={user._id}
              onClick={() => {
                setActiveChat((prev) => (prev === user._id ? null : user._id));
                setData({
                  text: "",
                  images: [],
                  files: [],
                });
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
                  <div className="size-12 object-contain rounded-full overflow-hidden border-2 border-primary bg-primary/50">
                    {user?.profilePic?.imageUrl ? (
                      <img
                        src={user?.profilePic?.imageUrl}
                        alt="loading"
                        draggable={false}
                        className="w-full h-full object-cover object-top"
                      />
                    ) : (
                      <p className="flex items-center justify-center h-full w-full text-white font-semibold text-base">
                        {user?.fullName?.charAt(0).toUpperCase()}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex flex-col items-start w-full gap-1">
                  <h3 className="text-base font-semibold">
                    {user.fullName.length > 25
                      ? `${user.fullName.slice(0, 25)}...`
                      : user.fullName}
                  </h3>
                  <div className="text-xs text-muted-foreground w-full">
                    <LastMessage
                      user={user}
                      receivedMessages={receivedMessages}
                      sendedMessages={sendedMessages}
                    />
                  </div>
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
