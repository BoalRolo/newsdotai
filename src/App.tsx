import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./components/LoginPage";
import LabelTopicManager from "./components/LabelTopicManager";
import ProtectedRoute from "./components/ProtectedRoute";
import ProfilePage from "./components/ProfilePage";
import Header from "./components/Header";
import { ThemeProvider } from "./components/ThemeContext";

const App: React.FC = () => (
  <ThemeProvider>
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route
          path="/labeltopicmanager"
          element={
            <ProtectedRoute>
              <LabelTopicManager />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  </ThemeProvider>
);

export default App;
