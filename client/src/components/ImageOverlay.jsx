import { useImageOverlay } from "@/context/ImageOverlayContext";
import React from "react";
import { Button } from "./ui/button";
import { X } from "lucide-react";

const ImageOverlay = () => {
  const { isOverlayOpen, setIsOverlayOpen, imageData } = useImageOverlay();

  if (!isOverlayOpen) return null; // only show if context says so
  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur z-[100] data-[state=open]:animate-overlayShow w-full">
        <div className="flex items-center justify-between p-4 w-full ">
          <div className="flex items-center gap-2">
            <div className="size-12 object-contain rounded-full overflow-hidden border-2 border-primary">
              <img
                src={imageData.image}
                alt="loading"
                className="w-full h-full object-cover object-top"
              />
            </div>
            <h3 className="text-base font-semibold">
              {imageData.name}
            </h3>
          </div>

          <Button variant={"ghost"} onClick={() => setIsOverlayOpen(false)}>
            <X />
          </Button>
        </div>
      <div className="flex items-start mt-10 justify-center h-full">

        <div className="md:w-full w-[350px] h-[500px] ">
          <img
            src={imageData.image}
            alt="image"
            className="w-full h-full object-contain"
          />
        </div>
      </div>
    </div>
  );
};

export default ImageOverlay;
