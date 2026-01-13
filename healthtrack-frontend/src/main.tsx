import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import { AuthProvider } from "./context/AuthContext";
import { HealthTrackProvider } from "./context/HealthTrackContext";
import { ThemeProvider } from "./context/ThemeContext";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <HealthTrackProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </HealthTrackProvider>
      </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>
);
