import React from "react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import GoogleLogo from "../assets/googleLogo.png"

const Login = ({ setActive }) => {
  const handleGoogleLogin = () => {
    window.open(`${import.meta.env.VITE_API_URL}/api/auth/google`, "_self");
  };
  return (
    <form className="flex flex-col gap-3 w-full mt-5">
      <Label htmlFor="email">Email</Label>
      <Input type="email" placeholder="Enter your email" />

      <Label htmlFor="password">Password</Label>
      <Input type="password" placeholder="Enter your password" />

      <Button onClick={() => setActive("chat")} className={"w-full"}>
        Login
      </Button>

      <div className="relative w-full my-2">
        <p className="w-full h-px bg-muted-foreground"/>
        <span className="text-sm text-muted-foreground text-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-background px-2">or</span>
      </div>

      <Button className={"w-full"} variant={"outline"} onClick={handleGoogleLogin}>
        <img src={GoogleLogo} alt="Google" className="w-4 h-4" />
        Continue with Google
      </Button>

      <p className="text-xs text-muted-foreground text-center mt-2">
        Don&apos;t have an account?{" "}
        <button
          className="text-primary hover:underline cursor-pointer"
          onClick={() => setActive("signup")}
        >
          Signup
        </button>
      </p>
    </form>
  );
};

export default Login;
