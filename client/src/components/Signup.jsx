import React, { useState } from "react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import GoogleLogo from "../assets/googleLogo.png";
import { toast } from "sonner";
import { useAuthStore } from "@/store/useAuthStore";
import { Eye, EyeOff, Loader2 } from "lucide-react";

const Signup = ({ setActive }) => {
  const { signup, userLoading } = useAuthStore();
  const handleGoogleSignup = () => {
    const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID; // from Google Cloud
    const REDIRECT_URI = import.meta.env.VITE_GOOGLE_CALLBACK_URL; // your frontend redirect route
    const SCOPE = "openid email profile";
    const RESPONSE_TYPE = "code";

    // Force account chooser every time → prompt=select_account
    const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${SCOPE}&prompt=consent%20select_account`;

    window.location.href = url;
  };

  const [data, setData] = useState({
    fullName: "",
    email: "",
    password: "",
  });
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConPassword, setShowConPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (data.password !== confirmPassword) {
      return toast.error("Password and confirm password do not match");
    }

    signup(data);
  };
  return (
    <>
      <form className="flex flex-col gap-3 w-full mt-5" onSubmit={handleSubmit}>
        <Label htmlFor="email">Full Name</Label>
        <Input
          type="text"
          placeholder="Enter your full name"
          required
          value={data.fullName}
          onChange={(e) => setData({ ...data, fullName: e.target.value })}
        />

        <Label htmlFor="email">Email</Label>
        <Input
          type="email"
          placeholder="Enter your email"
          required
          value={data.email}
          onChange={(e) => setData({ ...data, email: e.target.value })}
        />

        <Label htmlFor="password">Password</Label>
        <div className="relative">
          <Input
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            required
            value={data.password}
            onChange={(e) => setData({ ...data, password: e.target.value })}
          />
          <div className="absolute top-1/2 right-2 transform -translate-y-1/2">
            {!showPassword ? (
              <Eye
                className="size-[1.25rem] cursor-pointer text-primary"
                onClick={() => setShowPassword(true)}
              />
            ) : (
              <EyeOff
                className="size-[1.25rem] cursor-pointer text-primary"
                onClick={() => setShowPassword(false)}
              />
            )}
          </div>
        </div>

        <Label htmlFor="password">Confirm Password</Label>
        <div className="relative">
          <Input
            type={showConPassword ? "text" : "password"}
            placeholder="Enter your password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <div className="absolute top-1/2 right-2 transform -translate-y-1/2">
            {!showConPassword ? (
              <Eye
                className="size-[1.25rem] cursor-pointer text-primary"
                onClick={() => setShowConPassword(true)}
              />
            ) : (
              <EyeOff
                className="size-[1.25rem] cursor-pointer text-primary"
                onClick={() => setShowConPassword(false)}
              />
            )}
          </div>
        </div>

        <Button type="submit" className={"w-full"} disabled={userLoading}>
          {userLoading ? <Loader2 className="animate-spin" /> : "Signup"}
        </Button>
      </form>
      <div className="relative w-full my-4">
        <p className="w-full h-px bg-muted-foreground" />
        <span className="text-sm text-muted-foreground text-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-background px-2">
          or
        </span>
      </div>
      <Button
        type="button"
        className={"w-full"}
        variant={"outline"}
        onClick={handleGoogleSignup}
        disabled={userLoading}
      >
        <img src={GoogleLogo} draggable={false} alt="Google" className="w-4 h-4" />
        Continue with Google
      </Button>

      <p className="text-xs text-muted-foreground text-center mt-2 w-full">
        Already have an account?{" "}
        <button
          className="text-primary hover:underline cursor-pointer"
          onClick={() => setActive("login")}
          disabled={userLoading}
        >
          Login
        </button>
      </p>
    </>
  );
};

export default Signup;
