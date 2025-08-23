import { useMediaOverlay } from "@/context/MediaOverlayContext";
import React, { useEffect, useRef } from "react";
import { Button } from "./ui/button";
import { ArrowLeft, ArrowRight, X } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";

const MediaOverlay = () => {
  const {
    isMediaOverlayOpen,
    setIsMediaOverlayOpen,
    mediaData,
    mediaIndex,
    setMediaIndex,
    messageIndex,
    setMessageIndex,
  } = useMediaOverlay();
  const { allUsers, user } = useAuthStore();

  const senderId = mediaData?.[messageIndex]?.senderId;
  const imageOwner =
    allUsers?.find((u) => u?._id === senderId) ||
    (senderId === user?._id ? user : null);

  const activeThumbRef = useRef(null);

  // Auto-scroll when mediaIndex/messageIndex changes
  useEffect(() => {
    if (activeThumbRef.current) {
      activeThumbRef.current.scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "center",
      });
    }
  }, [mediaIndex, messageIndex, isMediaOverlayOpen]);

  const hasPrevImage = () => {
    const activeMessage = mediaData?.[messageIndex];

    // If there are more images in the current message (going backwards)
    if (activeMessage?.images && mediaIndex - 1 >= 0) {
      return true;
    }

    // Otherwise, check the previous messages for at least 1 image
    for (let i = messageIndex - 1; i >= 0; i--) {
      if (mediaData[i]?.images?.length > 0) {
        return true;
      }
    }

    return false; // no previous images
  };

  const hasNextImage = () => {
    const activeMessage = mediaData?.[messageIndex];

    // If there are more images in the current message (going forward)
    if (activeMessage?.images && mediaIndex + 1 < activeMessage.images.length) {
      return true;
    }

    // Otherwise, check the next messages for at least 1 image
    for (let i = messageIndex + 1; i < mediaData.length; i++) {
      if (mediaData[i]?.images?.length > 0) {
        return true;
      }
    }

    return false; // no next images
  };

  if (!isMediaOverlayOpen) return null;
  return (
    <>
      <div className="fixed flex flex-col items-center justify-between gap-3 inset-0 bg-background z-[100] data-[state=open]:animate-overlayShow w-full p-4">
        <div className="flex items-center justify-between w-full ">
          <div className="flex items-center gap-2">
            <div className="size-12 object-contain rounded-full overflow-hidden border-2 border-primary">
              <img
                src={imageOwner?.profilePic?.imageUrl}
                alt="loading"
                draggable={false}
                className="w-full h-full object-cover object-top"
              />
            </div>
            <h3 className="text-base font-semibold">
              {imageOwner?.fullName === user?.fullName
                ? "You"
                : imageOwner?.fullName}
              <p className="text-xs text-muted-foreground">
                {new Date(mediaData[messageIndex]?.createdAt).toDateString() +
                  " - " +
                  new Date(
                    mediaData[messageIndex]?.createdAt
                  ).toLocaleTimeString()}
              </p>
            </h3>
          </div>

          <Button
            variant={"ghost"}
            onClick={() => setIsMediaOverlayOpen(false)}
          >
            <X />
          </Button>
        </div>
        <div className="flex items-center justify-between gap-4 w-full">
          <Button
            variant={"secondary"}
            className={"rounded-full"}
            size={"icon"}
            disabled={!hasPrevImage()}
            onClick={() => {
              const activeMessage = mediaData[messageIndex];
              if (activeMessage?.images && mediaIndex - 1 >= 0) {
                setMediaIndex(mediaIndex - 1);
                return;
              }
              for (let i = messageIndex - 1; i >= 0; i--) {
                if (mediaData[i]?.images?.length > 0) {
                  setMessageIndex(i);
                  setMediaIndex(mediaData[i]?.images?.length - 1); // always start at last image of previous message
                  return;
                }
              }
            }}
          >
            <ArrowLeft />
          </Button>
          <div className="w-auto h-[350px] ">
            <img
              src={mediaData[messageIndex]?.images[mediaIndex]?.imageUrl}
              alt="image"
              draggable={false}
              className="w-full h-full object-contain"
            />
          </div>
          <Button
            variant={"secondary"}
            size={"icon"}
            className={"rounded-full"}
            disabled={
              !hasNextImage()
            }
            onClick={() => {
              const activeMessage = mediaData[messageIndex];
              if (
                activeMessage?.images &&
                mediaIndex + 1 < activeMessage.images.length
              ) {
                setMediaIndex(mediaIndex + 1);
                return;
              }
              for (let i = messageIndex + 1; i < mediaData.length; i++) {
                if (mediaData[i]?.images?.length > 0) {
                  setMessageIndex(i);
                  setMediaIndex(0); // always start at first image of next message
                  return;
                }
              }
            }}
          >
            <ArrowRight />
          </Button>
        </div>
        <div
          className="overflow-x-auto w-fit border-t border-t-muted-foreground p-3"
          style={{
            scrollbarColor: "var(--muted-foreground) transparent",
          }}
        >
          <div className="flex gap-2 h-full translate-x-1/3">
            {mediaData?.map((item, i) =>
              item?.images?.map((img, index) => {
                const isActive = mediaIndex === index && messageIndex === i;
                return (
                  <button
                    key={index}
                    onClick={() => {
                      setMessageIndex(i);
                      setMediaIndex(index);
                    }}
                    className="max-w-[100px] w-full max-h-[100px] h-ful object-contain cursor-pointer"
                    ref={isActive ? activeThumbRef : null}
                  >
                    <img
                      src={img?.imageUrl}
                      alt="image"
                      draggable={false}
                      className={`w-full h-full object-cover object-top rounded-lg border-3 transition-all ${
                        mediaIndex === index && messageIndex === i
                          ? "opacity-100 border-primary scale-85"
                          : "opacity-40 hover:border-accent-foreground hover:opacity-100"
                      }`}
                    />
                  </button>
                );
              })
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default MediaOverlay;
