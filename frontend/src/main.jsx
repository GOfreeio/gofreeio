import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App";
import ErrorBoundary from "./ErrorBoundary";
import { AuthProvider } from "./context/AuthContext";
import "./styles.css";

const root = ReactDOM.createRoot(document.getElementById("root"));

// expose React globally to avoid ReferenceError in files that reference `React` directly
try {
  if (typeof window !== "undefined" && !window.React) window.React = React;
} catch (e) {
  // ignore in non-browser env
}

root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <AuthProvider>
          <App />
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  </React.StrictMode>
);