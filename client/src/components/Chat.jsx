import React from "react";
import ChatHeader from "./ChatHeader";
import ChatContainer from "./ChatContainer";
import ChatArea from "./ChatArea";
import ChatBG from "../assets/chatbg.png";

const Chat = ({ activeChat, setActiveChat }) => {
  return (
    <div
      className="flex flex-col w-full h-screen bg-fixed bg-cover bg-center relative"
      style={{ backgroundImage: `url(${ChatBG})`}}
    >
      {/* Overlay for opacity effect */}
      <div className="absolute inset-0 bg-background opacity-85 z-10"></div>

      {/* Header */}
      <div className="sticky top-0 z-10">
        <ChatHeader activeChat={activeChat} setActiveChat={setActiveChat} />
      </div>

      {/* Messages (scrollable) */}
      <div className="h-screen px-4 z-10 overflow-y-auto overflow-x-hidden">
        <ChatContainer
          activeChat={activeChat}
          setActiveChat={setActiveChat}
        />
      </div>

      {/* Input */}
      <div className="sticky bottom-0 z-10">
        <ChatArea activeChat={activeChat} setActiveChat={setActiveChat} />
      </div>
    </div>
  );
};

export default Chat;
