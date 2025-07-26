import React from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import MyTopics from "./pages/MyTopics";
import Feed from "./pages/StoredNews";
import Profile from "./pages/Profile";
import Header from "./components/layout/Header";
import { ThemeProvider } from "./components/layout/ThemeContext";
import ProtectedRoute from "./components/layout/ProtectedRoute";
import { useAuth } from "./hooks/useAuth";
import Home from "./pages/Home";

function AppRoutes() {
  const { user } = useAuth();
  const location = useLocation();
  const isAuthPage =
    location.pathname === "/" ||
    location.pathname === "/login" ||
    location.pathname === "/signup";

  return (
    <>
      {!isAuthPage && user && <Header />}
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/home" element={<Home />} />
        <Route
          path="/mytopics"
          element={
            <ProtectedRoute>
              <MyTopics />
            </ProtectedRoute>
          }
        />
        <Route
          path="/feed"
          element={
            <ProtectedRoute>
              <Feed />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

const App: React.FC = () => (
  <ThemeProvider>
    <BrowserRouter
      basename={
        process.env.NODE_ENV === "production" ? "/newsdotai" : undefined
      }
    >
      <AppRoutes />
    </BrowserRouter>
  </ThemeProvider>
);

export default App;
