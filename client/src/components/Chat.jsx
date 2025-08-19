import React from "react";
import ChatHeader from "./ChatHeader";
import ChatContainer from "./ChatContainer";
import ChatArea from "./ChatArea";

const Chat = ({ activeChat, setActiveChat }) => {
  return (
    <>
      <div className="flex flex-col w-full">

        <div className="sticky top-0">
        <ChatHeader activeChat={activeChat} setActiveChat={setActiveChat} />
        </div>
        <div className="h-screen overflow-y-auto overflow-x-hidden">
        <ChatContainer activeChat={activeChat} setActiveChat={setActiveChat} />
        </div>
        <div className="sticky bottom-0">
        <ChatArea activeChat={activeChat} setActiveChat={setActiveChat} />
        </div>
      </div>
    </>
  );
};

export default Chat;
