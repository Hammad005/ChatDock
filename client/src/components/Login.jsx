import React, { useState } from "react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import GoogleLogo from "../assets/googleLogo.png";
import { useAuthStore } from "@/store/useAuthStore";
import { Eye, EyeOff, Loader2 } from "lucide-react";

const Login = ({ setActive }) => {
  const { login, userLoading } = useAuthStore();

  const handleGoogleLogin = () => {
    window.open(`${import.meta.env.VITE_API_URL}/api/auth/google`, "_self");
  };

  const [data, setData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    login(data);
  };
  return (
    <>
      <form className="flex flex-col gap-3 w-full mt-5" onSubmit={handleSubmit}>
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

        <Button type="submit" className={"w-full"} disabled={userLoading}>
          {userLoading ? <Loader2 className="animate-spin" /> : "Login"}
        </Button>
      </form>
      <div className="relative w-full my-4">
        <p className="w-full h-px bg-muted-foreground" />
        <span className="text-sm text-muted-foreground text-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-background px-2">
          or
        </span>
      </div>

      <Button
        className={"w-full"}
        variant={"outline"}
        onClick={handleGoogleLogin}
        disabled={userLoading}
      >
        <img src={GoogleLogo} alt="Google" className="w-4 h-4" />
        Continue with Google
      </Button>

      <p className="text-xs text-muted-foreground text-center mt-2 w-full">
        Don&apos;t have an account?{" "}
        <button
          type="button"
          className="text-primary hover:underline cursor-pointer"
          onClick={() => setActive("signup")}
          disabled={userLoading}
        >
          Signup
        </button>
      </p>
    </>
  );
};

export default Login;
