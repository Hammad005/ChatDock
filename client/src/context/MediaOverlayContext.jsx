/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState } from "react";

const MediaOverlayContext = createContext();

export const MediaOverlayProvider = ({ children }) => {
  const [isMediaOverlayOpen, setIsMediaOverlayOpen] = useState(false);
  const [mediaData, setMediaData] = useState();
  const [mediaIndex, setMediaIndex] = useState();
  const [messageIndex, setMessageIndex] = useState();

  return (
    <MediaOverlayContext.Provider value={{ isMediaOverlayOpen, setIsMediaOverlayOpen, mediaData, setMediaData, mediaIndex, setMediaIndex, messageIndex, setMessageIndex }}>
      {children}
    </MediaOverlayContext.Provider>
  );
};


export const useMediaOverlay = () => useContext(MediaOverlayContext);
