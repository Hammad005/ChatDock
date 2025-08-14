import Login from "@/components/Login";
import Signup from "@/components/Signup";
import React, { useState } from "react";
import Logo from "../assets/logo.png";
import AuthPhoto from '../assets/authPhoto.png'

const AuthPage = () => {
  const [active, setActive] = useState("login");
  return (
    <>
      <div className="flex items-center justify-between min-h-screen">
        <div className="flex items-center justify-center w-full">
          <div className="lg:w-1/2 w-full lg:px-0 px-12 flex flex-col justify-center items-start">
            <div className="flex items-center justify-center gap-2">
              <div className="w-[40px] h-auto object-contain">
                <img
                  src={Logo}
                  alt="loading"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex flex-col">
              <h3 className="text-xl font-bold tracking-wider">ChatDock</h3>
              <p className="text-xs text-muted-foreground">{active === "login" ? "Login to keep the conversation going" : "Signup to start your first chat today."}</p>
              </div>
            </div>
            {active === "login" ? (
              <Login setActive={setActive} />
            ) : (
              <Signup setActive={setActive} />
            )}
          </div>
        </div>
        <div className="w-full bg-primary/10 backdrop-blur-md h-screen lg:flex flex-col gap-2 items-center justify-center hidden">
        <img src={AuthPhoto} alt="auth" className="w-auto h-[400px]" />
        <p className="text-xs text-muted-foreground">"Log in to keep the conversation going, or sign up to start your first chat today."</p>
        </div>
      </div>
    </>
  );
};

export default AuthPage;
