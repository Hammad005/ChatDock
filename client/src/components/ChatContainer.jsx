import { useChatStore } from "@/store/useChatStore";
import { MailWarning } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { useEffect, useRef, useState } from "react";

const ChatContainer = ({ activeChat }) => {
  const [readMore, setReadMore] = useState(null);
  const { sendedMessages, receivedMessages } = useChatStore();
  const { user } = useAuthStore();

  const messagesEndRef = useRef(null);

  const merged = [
    ...sendedMessages.filter((msg) => msg?.receiverId === activeChat),
    ...receivedMessages.filter((msg) => msg?.senderId === activeChat),
  ];

  const filterChat = merged.sort(
    (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
  );

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [sendedMessages]);

  return (
    <>
      {filterChat.length > 0 ? (
        <div className="flex flex-col gap-8 p-2 overflow-y-auto h-full">
          {filterChat.map((msg, index) => {
            const isMyMessage = msg.senderId === user._id;

            return (
              <div
                key={msg._id || index}
                className={`flex flex-col gap-2 ${
                  isMyMessage ? "items-end" : "items-start"
                }`}
              >
                <div
                  className={`md:max-w-[80%] p-3 rounded-2xl text-sm break-words ${
                    isMyMessage
                      ? "bg-primary text-white rounded-br-none"
                      : "bg-background border border-muted-foreground/30 rounded-bl-none"
                  }`}
                >
                  {msg.images.length > 0 && (
                    <div className={`${msg.images.length > 1 ? "grid" : "flex"} grid-cols-2 gap-2 mb-2`}>
                      {(msg.images.length > 4 ? msg.images.slice(0,
                      4).map((image, index) => (
                      <div key={index} className="relative">
                        <img
                          src={image.imageUrl}
                          alt="image"
                          draggable={false}
                          className="w-full lg:h-[300px] h-full object-cover object-top rounded-lg"
                        />
                        {index === 3 && (
                          <button className="absolute cursor-pointer top-0 left-0 w-full h-full bg-black/80 flex items-center justify-center rounded-lg">
                            <p className="text-sm text-white">
                              +{msg.images.length - 4}
                            </p>{" "}
                          </button>
                        )}
                      </div>
                      )) : msg.images.map((image, index) => (
                      <img
                        key={index}
                        src={image.imageUrl}
                        draggable={false}
                        alt="image"
                        className="w-full h-full object-cover object-top rounded-lg"
                      />
                      )))}
                    </div>
                  )}
                  <p className="whitespace-pre-wrap">
                    {msg.text.length > 750 && readMore !== msg._id ? (
                      <>
                        {msg.text.slice(0, 750)}
                        <span>...</span>
                        <button
                          className="hover:underline ml-1 font-semibold cursor-pointer"
                          onClick={() => setReadMore(msg._id)}
                        >
                          Read more
                        </button>
                      </>
                    ) : (
                      msg.text
                    )}
                  </p>
                </div>
                <p className="text-xs text-muted-foreground">
                  {new Date(msg.createdAt).toDateString() +
                    " - " +
                    new Date(msg.createdAt).toLocaleTimeString()}
                </p>
              </div>
            );
          })}
          {/* dummy div to scroll into view */}
          <div ref={messagesEndRef} />
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
