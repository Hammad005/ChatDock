import React, { useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Home from "./page/Home";
import AuthPage from "./page/AuthPage";
import { useAuthStore } from "./store/useAuthStore";
import Loading from "./components/Loading";
import { Toaster } from "@/components/ui/sonner";
import ImageOverlay from "./components/ImageOverlay";

const protectRoutes = (condition, children, naivagate) => {
  return condition ? children : <Navigate to={naivagate} />;
};
const App = () => {
  const { authLoading, checkAuth, user, progress, getAllUsers } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (user) {
      getAllUsers();
    }
  }, [user, getAllUsers]);

  if (authLoading) return <Loading progress={progress} />;
  return (
    <>
      <Routes>
        <Route path="/" element={protectRoutes(user, <Home />, "/login")} />
        <Route
          path="/login"
          element={protectRoutes(!user, <AuthPage />, "/")}
        />
      </Routes>
      <Toaster position="top-center" />
      <ImageOverlay />
    </>
  );
};

export default App;
