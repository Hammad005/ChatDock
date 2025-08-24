import { useChatStore } from "@/store/useChatStore";
import { ArrowDownIcon, Check, CheckCheck, Download, File, MailWarning } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { useEffect, useRef, useState } from "react";
import { useMediaOverlay } from "@/context/MediaOverlayContext";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";

const ChatContainer = ({ activeChat }) => {
  const [readMore, setReadMore] = useState(null);
  const { sendedMessages, receivedMessages } = useChatStore();
  const [showScroll, setShowScroll] = useState(false);
  const {
    setMediaData,
    setIsMediaOverlayOpen,
    setMediaIndex,
    setMessageIndex,
  } = useMediaOverlay();
  const { user, allUsers } = useAuthStore();

  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null); 

  const merged = [
    ...sendedMessages.filter((msg) => msg?.receiverId === activeChat),
    ...receivedMessages.filter((msg) => msg?.senderId === activeChat),
  ];
  const urlRegex = /(https?:\/\/[^\s]+)/g;

  const filterChat = merged.sort(
    (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
  );

  const userChat = allUsers?.find((u) => u._id === activeChat);

  const handleDownload = async (file) => {
    try {
      const response = await fetch(file.fileUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = file.fileName; // force the filename
      document.body.appendChild(link);
      link.click();

      // cleanup
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed", error);
    }
  };

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [sendedMessages, activeChat, receivedMessages]);

   useEffect(() => {
    const container = chatContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const nearBottom =
        container.scrollHeight - container.scrollTop - container.clientHeight < 100;
      setShowScroll(!nearBottom);
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  return (
    <>
      {filterChat.length > 0 ? (
        <div ref={chatContainerRef} className="flex flex-col gap-8 p-2 overflow-y-auto h-full">
          {filterChat.map((msg, i) => {
            const isMyMessage = msg.senderId === user._id;

            return (
              <div
                key={msg._id || i}
                className={`flex flex-col gap-2 ${
                  isMyMessage ? "items-end" : "items-start"
                }`}
              >
                <div
                  className={`flex flex-col justify-start gap-2 ${
                    isMyMessage ? "items-end" : "items-start"
                  } w-full`}
                >
                  {!isMyMessage && (
                    <div className="flex items-center gap-2">
                      <div className="size-7 object-contain rounded-full overflow-hidden border-2 border-primary">
                        <img
                          src={userChat?.profilePic?.imageUrl}
                          alt="prfoile"
                          draggable={false}
                          className="w-full h-full object-cover object-top"
                        />
                      </div>
                      <h3 className="text-xs font-semibold">
                        {userChat?.fullName}
                      </h3>
                    </div>
                  )}
                  <div
                    className={`md:max-w-[80%] p-3 rounded-2xl text-sm break-words ${
                      isMyMessage
                        ? "bg-primary text-white rounded-tr-none"
                        : "bg-background border border-muted-foreground/30 rounded-tl-none"
                    }`}
                  >
                    {msg.images.length > 0 && (
                      <div
                        className={`${
                          msg.images.length > 1 ? "grid" : "flex"
                        } grid-cols-2 gap-2 mb-2`}
                      >
                        {msg.images.length > 4
                          ? msg.images.slice(0, 4).map((image, index) => (
                              <button
                                key={index}
                                className="relative cursor-pointer"
                                onClick={() => {
                                  setMediaData(filterChat);
                                  setMessageIndex(i);
                                  setMediaIndex(index);
                                  setIsMediaOverlayOpen(true);
                                }}
                              >
                                <img
                                  src={image.imageUrl}
                                  alt="image"
                                  draggable={false}
                                  className="w-full sm:h-[300px] h-full object-cover object-top rounded-lg"
                                />
                                {index === 3 && (
                                  <div className="absolute cursor-pointer top-0 left-0 w-full h-full bg-black/80 flex items-center justify-center rounded-lg">
                                    <p className="text-sm text-white">
                                      +{msg.images.length - 4}
                                    </p>{" "}
                                  </div>
                                )}
                              </button>
                            ))
                          : msg.images.map((image, index) => (
                              <button
                                key={index}
                                className="cursor-pointer"
                                onClick={() => {
                                  setMediaData(filterChat);
                                  setMessageIndex(i);
                                  setMediaIndex(index);
                                  setIsMediaOverlayOpen(true);
                                }}
                              >
                                <img
                                  src={image.imageUrl}
                                  draggable={false}
                                  alt="image"
                                  className="w-full sm:h-[300px] h-full object-cover object-top rounded-lg"
                                />
                              </button>
                            ))}
                      </div>
                    )}
                    {msg.files.length > 0 && (
                      <div className={`flex flex-col gap-2 mb-2`}>
                        {msg.files.map((file, index) => (
                          <div
                            key={index}
                            className="p-2 bg-muted-foreground/20 rounded-lg flex items-center justify-between gap-2 text-foreground"
                          >
                            <File className="size-5 text-purple-500" />
                            <p className="text-white">
                              {file.fileName.length > 20
                                ? file.fileName.slice(0, 20) + "..."
                                : file.fileName}
                            </p>

                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => handleDownload(file)}
                            >
                              <Download />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                    <p className="whitespace-pre-wrap">
                      {msg.text.length > 750 && readMore !== msg._id ? (
                        <>
                          {msg.text
                            .slice(0, 750)
                            .replace(
                              urlRegex,
                              (url) =>
                                `<Link to="${url}" target="_blank" rel="noopener noreferrer" class="text-blue-500 underline">${url}</Link>`
                            )}
                          <span>...</span>
                          <button
                            className="hover:underline ml-1 font-semibold cursor-pointer"
                            onClick={() => setReadMore(msg._id)}
                          >
                            Read more
                          </button>
                        </>
                      ) : (
                        msg.text.split(urlRegex).map((part, i) =>
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
                        )
                      )}
                    </p>
                    <div className="flex items-center justify-end gap-2 mt-2">
                      <p className="text-[10px] text-muted-foreground">
                        {new Date(msg.createdAt).toDateString() +
                          " - " +
                          new Date(msg.createdAt).toLocaleTimeString()}
                      </p>
                      {isMyMessage &&
                        (msg.seen ? (
                          <CheckCheck className="size-4 text-blue-500" />
                        ) : (
                          <Check className="size-4 text-muted-foreground" />
                        ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
          {/* dummy div to scroll into view */}
          <div ref={messagesEndRef} />
          {showScroll && (
            <div className="fixed bottom-20 self-end">
              <Button
                onClick={scrollToBottom}
                variant={'outline'}
              >
                <ArrowDownIcon size={20} />
              </Button>
            </div>
          )}
        </div>
      ) : (
        <div className="flex items-end pb-5 justify-center h-full">
          <span className="flex items-center text-muted-foreground bg-background p-2 rounded-lg border md:text-sm text-[10px]">
            <MailWarning className="mr-2 size-5 text-primary" />
            No Messages yet, start a conversation now.
          </span>
        </div>
      )}
    </>
  );
};

export default ChatContainer;
