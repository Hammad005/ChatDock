/* eslint-disable react-refresh/only-export-components */
// ImageOverlayContext.js
import { createContext, useContext, useState } from "react";

const ImageOverlayContext = createContext();

export const ImageOverlayProvider = ({ children }) => {
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const [imageData, setImageData] = useState({
    name: "",
    image: ""
  });

  return (
    <ImageOverlayContext.Provider value={{ isOverlayOpen, setIsOverlayOpen, imageData, setImageData }}>
      {children}
    </ImageOverlayContext.Provider>
  );
};


export const useImageOverlay = () => useContext(ImageOverlayContext);
