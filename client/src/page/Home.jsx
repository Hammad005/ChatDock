import MinSidebar from "@/components/MinSidebar";
import React, { useState } from "react";
import HomePhoto from "../assets/HomePhoto.png";
import Logo from "../assets/logo.png";
import Profile from "@/components/Profile";

const Home = () => {
  const [active, setActive] = useState("Home");
  return (
    <>
      <div className="grid lg:grid-cols-12">
        {/* Left Sticky Section */}
        <div className="col-span-4 sticky top-0 h-screen">
          <div className="grid grid-cols-12 h-full">
            <div className="col-span-2 bg-primary/10">
              <MinSidebar active={active} setActive={setActive} />
            </div>
            <div className="col-span-10 p-3 flex flex-col h-screen gap-4">
              <h3 className="text-3xl font-bold tracking-wider flex flex-col">
                ChatDock
                <span className="text-xs text-muted-foreground tracking-normal ">
                  {active}
                </span>
              </h3>

              <div className="h-full overflow-y-auto overflow-x-hidden">
                {active === "Profile" && <Profile />}
              </div>
            </div>
          </div>
        </div>

        {/* Right Sticky Section */}
        <div className="lg:col-span-8 lg:flex flex-col gap-2 items-center justify-center hidden bg-primary/10 backdrop-blur-md sticky top-0 h-screen">
          <div className="flex items-center justify-center gap-2">
            <div className="w-[40px] h-auto object-contain">
              <img
                src={Logo}
                alt="loading"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-col">
              <h3 className="text-3xl font-bold tracking-wider">ChatDock</h3>
            </div>
          </div>
          <img src={HomePhoto} alt="HomePhoto" className="w-[500px] h-auto" />
          <p className="text-sm w-1/2 text-center">
            "ChatDock is a fast, secure, and modern web-based messaging platform
            that keeps all your conversations docked in one place — anytime,
            anywhere."
          </p>
        </div>
      </div>
    </>
  );
};

export default Home;
