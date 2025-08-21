import MinSidebar from "@/components/MinSidebar";
import React, { useState } from "react";
import HomePhoto from "../assets/HomePhoto.png";
import Logo from "../assets/logo.png";
import Profile from "@/components/Profile";
import Suggestions from "@/components/Suggestions";
import Friends from "@/components/Friends";
import SelectFriend from "@/components/SelectFriend";
import Chat from "@/components/Chat";
import { useChatStore } from "@/store/useChatStore";

const Home = () => {
  const {sendMessage} = useChatStore();
  const [active, setActive] = useState("Home");
  const [activeChat, setActiveChat] = useState(null);

  const [data, setData] = useState({
    text: "",
    images: [],
    files: [],
  });
  const [fileName, setFileName] = useState([]);

  const handleSubmit = async () => {
    const res = await sendMessage(activeChat, data);
    if (res?.success) {
      setData({ text: "", images: [], files: [] });
      setFileName([]);
    }

    return {success: true};
  };
  return (
    <>
      <div className="grid lg:grid-cols-12">
        {/* Left Sticky Section */}
        <div className="col-span-4 sticky top-0 h-screen">
          <div className="grid grid-cols-12 h-full">
            <div className="col-span-2 bg-primary/10">
              <MinSidebar active={active} setActive={setActive} />
            </div>
            <div
              className={`col-span-10 ${
                activeChat ? "lg:p-3 p-0" : "p-3"
              }  flex flex-col h-screen gap-4`}
            >
              <h3
                className={`text-3xl font-bold tracking-wider ${
                  activeChat ? "hidden lg:flex" : "flex"
                } flex-col`}
              >
                ChatDock
                <span className="text-xs text-muted-foreground tracking-normal ">
                  {active}
                </span>
              </h3>

              <div className="h-full overflow-y-auto overflow-x-hidden">
                {active === "Home" && <Suggestions />}
                {active === "Profile" && <Profile />}
                {active === "Chat" && (
                  <>
                    <div
                      className={`${activeChat ? "hidden lg:block" : "block"}`}
                    >
                      <SelectFriend
                        setActive={setActive}
                        activeChat={activeChat}
                        setActiveChat={setActiveChat}
                        setData={setData}
                      />
                    </div>
                    <div
                      className={`${activeChat ? "lg:hidden block" : "hidden"}`}
                    >
                      <Chat
                        activeChat={activeChat}
                        setActiveChat={setActiveChat}
                        chatData={data}
                        setChatData={setData}
                        fileName={fileName}
                        setFileName={setFileName}
                        handleSubmit={handleSubmit}
                      />
                    </div>
                  </>
                )}
                {active === "Friends" && <Friends />}
              </div>
            </div>
          </div>
        </div>

        {/* Right Sticky Section */}
        <div
          className={`lg:col-span-8 lg:flex hidden ${
            activeChat ? "bg-background" : "bg-primary/10"
          } backdrop-blur-md sticky top-0 h-screen`}
        >
          {!activeChat ? (
            <div className="flex flex-col items-center justify-center gap-2">
              <div className="flex items-center justify-center gap-2">
                <div className="w-[40px] h-auto object-contain">
                  <img
                    src={Logo}
                    alt="loading"
                    draggable={false}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex flex-col">
                  <h3 className="text-3xl font-bold tracking-wider">
                    ChatDock
                  </h3>
                </div>
              </div>
              <img
                src={HomePhoto}
                alt="HomePhoto"
                draggable={false}
                className="w-[500px] h-auto"
              />
              <p className="text-sm w-1/2 text-center">
                "ChatDock is a fast, secure, and modern web-based messaging
                platform that keeps all your conversations docked in one place —
                anytime, anywhere."
              </p>
            </div>
          ) : (
            <div className="h-full overflow-y-auto overflow-x-hidden w-full">
              <Chat
                activeChat={activeChat}
                setActiveChat={setActiveChat}
                chatData={data}
                setChatData={setData}
                fileName={fileName}
                setFileName={setFileName}
                handleSubmit={handleSubmit}
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Home;
