import React from "react";
import ChatHeader from "./ChatHeader";
import ChatContainer from "./ChatContainer";
import ChatArea from "./ChatArea";
import ChatBG from "../assets/chatbg.png";

const Chat = ({ activeChat, setActiveChat, chatData, setChatData, handleSubmit }) => {
  return (
    <div
      className="flex flex-col w-full h-screen bg-fixed bg-cover bg-center relative"
      style={{ backgroundImage: `url(${ChatBG})`}}
    >
      {/* Overlay for opacity effect */}
      <div className="absolute inset-0 bg-background opacity-90 z-10 w-full"/>

      {/* Header */}
      <div className="sticky top-0 z-20">
        <ChatHeader activeChat={activeChat} setActiveChat={setActiveChat} />
      </div>

      {/* Messages (scrollable) */}
      <div className="flex-1 px-4 z-10 overflow-y-auto overflow-x-hidden">
        <ChatContainer
          activeChat={activeChat}
          setActiveChat={setActiveChat}
        />
      </div>

      {/* Input */}
      <div className="sticky bottom-0 z-10">
        <ChatArea
        chatData={chatData} setChatData={setChatData}
        handleSubmit={handleSubmit}
        />
      </div>
    </div>
  );
};

export default Chat;
