import { useMediaOverlay } from "@/context/MediaOverlayContext";
import React from "react";
import { Button } from "./ui/button";
import { X } from "lucide-react";

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

  if (!isMediaOverlayOpen) return null;

  console.log(mediaData);

  return (
    <>
      <div className="fixed flex flex-col items-center justify-between gap-3 inset-0 bg-background z-[100] data-[state=open]:animate-overlayShow w-full p-4">
        <div className="flex items-center justify-between w-full ">
          <div className="flex items-center gap-2">
            <div className="size-12 object-contain rounded-full overflow-hidden border-2 border-primary">
              {/* <img
                src={imageData.image}
                alt="loading"
                draggable={false}
                className="w-full h-full object-cover object-top"
              /> */}
            </div>
            <h3 className="text-base font-semibold">
              {/* {imageData.name} */}
            </h3>
          </div>

          <Button
            variant={"ghost"}
            onClick={() => setIsMediaOverlayOpen(false)}
          >
            <X />
          </Button>
        </div>
          <div className="w-auto h-[350px] ">
            <img
              src={mediaData[messageIndex]?.images[mediaIndex]?.imageUrl}
              alt="image"
              draggable={false}
              className="w-full h-full object-contain"
            />
          </div>
        <div
          className="overflow-x-auto w-fit border-t border-t-muted-foreground p-3"
          style={{
            scrollbarColor: "var(--muted-foreground) transparent",
          }}
        >
          <div className="flex gap-2 h-full translate-x-1/3">
            {mediaData?.map((item, i) =>
              item?.images?.map((img, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setMessageIndex(i);
                    setMediaIndex(index);
                  }}
                  className="max-w-[100px] w-full max-h-[100px] h-ful object-contain cursor-pointer"
                >
                  <img
                    src={img?.imageUrl}
                    alt="image"
                    draggable={false}
                    className={`w-full h-full object-cover object-top rounded-lg border-3 ${
                      mediaIndex === index && messageIndex === i
                        ? "opacity-100 border-primary"
                        : "opacity-40 border-accent"
                    }`}
                  />
                </button>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default MediaOverlay;
