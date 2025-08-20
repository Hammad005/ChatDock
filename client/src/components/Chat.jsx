import React from "react";
import ChatHeader from "./ChatHeader";
import ChatContainer from "./ChatContainer";
import ChatArea from "./ChatArea";
import ChatBG from "../assets/chatbg.png";

const Chat = ({ activeChat, setActiveChat }) => {
  return (
    <div className="relative flex flex-col w-full h-screen">
      {/* Full page background */}
      <div className="absolute inset-0 -z-10">
        <img
          src={ChatBG}
          alt="loading"
          draggable={false}
          className="w-full h-full object-cover opacity-10"
        />
      </div>

      {/* Header */}
      <div className="sticky top-0 z-10">
        <ChatHeader activeChat={activeChat} setActiveChat={setActiveChat} />
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden">
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
