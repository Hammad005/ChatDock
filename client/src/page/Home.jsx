import MinSidebar from "@/components/MinSidebar";
import React, { useState } from "react";

const Home = () => {
  const [active, setActive] = useState("Home");
  return (
    <>
      <div className="grid lg:grid-cols-12">
        <div className="col-span-4 w-full h-screen">
          <div className="grid grid-cols-12">
            <div className="col-span-2 bg-primary/10 w-full h-screen sticky top-0">
              <MinSidebar active={active} setActive={setActive} />
            </div>
            <div className="col-span-10  w-full h-screen p-5">
              <h3 className="text-2xl font-bold tracking-wider">ChatDock</h3>
            </div>
          </div>
        </div>
        <div className="lg:col-span-8 lg:flex hidden bg-primary/10 backdrop-blur-md w-full h-screen"></div>
      </div>
    </>
  );
};

export default Home;
