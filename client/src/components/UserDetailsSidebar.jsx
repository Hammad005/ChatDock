import React, { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useImageOverlay } from "@/context/ImageOverlayContext";
import { toast } from "sonner";
import { ArrowLeft, ArrowRight, Images } from "lucide-react";
import { Button } from "./ui/button";
import { useChatStore } from "@/store/useChatStore";
import { useMediaOverlay } from "@/context/MediaOverlayContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "react-router-dom";

const UserDetailsSidebar = ({ open, setOpen, user }) => {
  const [openAside, setOpenAside] = useState(false);
  const { setIsOverlayOpen, setImageData } = useImageOverlay();
  const { sendedMessages, receivedMessages } = useChatStore();
  const {
    setMediaData,
    setIsMediaOverlayOpen,
    setMediaIndex,
    setMessageIndex,
  } = useMediaOverlay();

  const merged = [
    ...sendedMessages.filter((msg) => msg?.receiverId === user?._id),
    ...receivedMessages.filter((msg) => msg?.senderId === user?._id),
  ];
  const mergedChats = [
    ...sendedMessages.filter((msg) => msg?.receiverId === user?._id),
    ...receivedMessages.filter((msg) => msg?.senderId === user?._id),
  ];

  const filterChat = merged.sort(
    (a, b) => new Date(b.createdAt) + new Date(a.createdAt)
  );
  const chatWithLinks = mergedChats.sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  const urlRegex = /(https?:\/\/[^\s]+)/;

  return (
    <Sheet
      open={open}
      onOpenChange={(set) => {
        setOpen(set);
        setOpenAside(false);
      }}
    >
      <SheetContent>
        {!openAside && (
          <>
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
                <div className="flex items-center justify-between w-full">
                  <p className="text-base flex items-center">
                    <Images className="mr-2 size-5 text-muted-foreground" />
                    Media
                  </p>

                  <Button
                    variant={"ghost"}
                    disabled={
                      merged
                        ?.map((msg) => msg?.images?.length)
                        .reduce((a, b) => a + b, 0) === 0
                    }
                    size={"sm"}
                    onClick={() => setOpenAside(true)}
                    className="text-sm text-muted-foreground"
                  >
                    {filterChat
                      ?.map((msg) => msg?.images?.length)
                      .reduce((a, b) => a + b, 0)}
                    <ArrowRight />
                  </Button>
                </div>
                <div className="grid grid-cols-4 gap-2 w-full">
                  {filterChat
                    ?.flatMap(
                      (msg, i) =>
                        msg.images
                          ?.map((image, index) => ({
                            image,
                            msgIndex: i,
                            imageIndex: index,
                          }))
                          .reverse() || []
                    )
                    .map(({ image, msgIndex, imageIndex }, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          setMediaData(filterChat);
                          setMessageIndex(msgIndex);
                          setMediaIndex(imageIndex);
                          setOpen(false);
                          setIsMediaOverlayOpen(true);
                        }}
                        className="cursor-pointer"
                      >
                        <img
                          src={image.imageUrl}
                          alt="image"
                          draggable={false}
                          className="w-[100px] h-[80px] object-cover object-top rounded-lg"
                        />
                      </button>
                    ))
                    .reverse()
                    .slice(0, 4)}
                </div>
              </div>
            </div>
          </>
        )}

        {openAside && (
          <aside className="flex flex-col h-full gap-4 w-full">
            <Button
              onClick={() => setOpenAside(false)}
              variant={"ghost"}
              size={"icon"}
              className={"m-2"}
            >
              <ArrowLeft />
            </Button>

            <div className="p-2">
              <Tabs defaultValue="media">
                <TabsList className={"w-full bg-background"}>
                  <TabsTrigger
                    value="media"
                    className={
                      "border-0 bg-background border-b-3 dark:data-[state=active]:border-b-primary data-[state=active]:border-b-primary dark:data-[state=active]:bg-background rounded-none data-[state=active]:shadow-none"
                    }
                  >
                    Media
                  </TabsTrigger>
                  <TabsTrigger
                    value="docs"
                    className={
                      "border-0 bg-background border-b-3 dark:data-[state=active]:border-b-primary data-[state=active]:border-b-primary dark:data-[state=active]:bg-background rounded-none data-[state=active]:shadow-none"
                    }
                  >
                    Docs
                  </TabsTrigger>
                  <TabsTrigger
                    value="links"
                    className={
                      "border-0 bg-background border-b-3 dark:data-[state=active]:border-b-primary data-[state=active]:border-b-primary dark:data-[state=active]:bg-background rounded-none data-[state=active]:shadow-none"
                    }
                  >
                    Links
                  </TabsTrigger>
                </TabsList>
                <TabsContent
                  value="media"
                  className={"flex items-center justify-center"}
                >
                  <div className="overflow-y-auto h-[calc(100vh-130px)]">
                    {filterChat
                      ?.map((msg, i) => (
                        <div key={i}>
                          {msg?.images?.length > 0 && (
                            <p className="text-[10px] font-semibold py-2">
                              {new Date(msg.createdAt).toDateString() +
                                " - " +
                                new Date(msg.createdAt).toLocaleTimeString()}
                            </p>
                          )}
                          <div className={"grid grid-cols-3 gap-4"}>
                            {msg?.images?.map((image, index) => (
                              <button
                                key={msg._id}
                                onClick={() => {
                                  setMediaData(filterChat);
                                  setMessageIndex(i);
                                  setMediaIndex(index);
                                  setOpenAside(false);
                                  setOpen(false);
                                  setIsMediaOverlayOpen(true);
                                }}
                                className="cursor-pointer"
                              >
                                <img
                                  src={image.imageUrl}
                                  alt="image"
                                  draggable={false}
                                  className="w-[100px] h-[100px] object-cover object-top rounded-lg"
                                />
                              </button>
                            ))}
                          </div>
                        </div>
                      ))
                      .reverse()}
                  </div>
                </TabsContent>
                <TabsContent
                  value="docs"
                  className={"flex items-center justify-center"}
                >
                  <div className="overflow-y-auto h-[calc(100vh-130px)]"></div>
                </TabsContent>
                <TabsContent
                  value="links"
                  className={"flex items-center justify-center"}
                >
                  <div className="overflow-y-auto h-[calc(100vh-130px)] flex flex-col gap-3">
                    {chatWithLinks
                      ?.filter((msg) => urlRegex.test(msg?.text)) // ✅ only messages with link
                      .map((msg) => {
                        const isMyMessage = msg.senderId !== user._id;
                        return (
                          <>
                            {!isMyMessage ? <div className="flex items-center gap-2">
                              <div className="size-7 object-contain rounded-full overflow-hidden border-2 border-primary">
                                <img
                                  src={user?.profilePic?.imageUrl}
                                  alt="prfoile"
                                  draggable={false}
                                  className="w-full h-full object-cover object-top"
                                />
                              </div>
                              <h3 className="text-xs font-semibold">
                                {user?.fullName}
                              </h3>
                            </div> :
                            <h3 className="text-xs font-semibold text-end">
                                You
                              </h3>
                            }
                            <div
                              key={msg._id || msg.createdAt}
                              className={`p-3 rounded-2xl text-sm break-words ${
                                isMyMessage
                                  ? "bg-primary text-white rounded-tr-none"
                                  : "bg-background border border-muted-foreground/30 rounded-tl-none"
                              }`}
                            >
                              {msg.text.split(urlRegex).map((part, i) =>
                                urlRegex.test(part) ? (
                                  <Link
                                    key={i}
                                    to={part}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-500 underline"
                                  >
                                    {part}
                                  </Link>
                                ) : (
                                  part
                                )
                              )}

                              <p className="text-xs text-muted-foreground text-end">
                                {new Date(msg.createdAt).toDateString() +
                                  " - " +
                                  new Date(msg.createdAt).toLocaleTimeString()}
                              </p>
                            </div>
                            <span className="w-full h-px bg-secondary" />
                          </>
                        );
                      })}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </aside>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default UserDetailsSidebar;
