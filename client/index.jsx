import { ClerkProvider } from "@clerk/clerk-react";
import React from "react";
import { createRoot } from "react-dom/client";
import { App } from "./components/App";
import { STAGES } from "./stage";

const root = createRoot(document.getElementById("app"));

root.render(
  <React.StrictMode>
    <ClerkProvider publishableKey={STAGES.staging.VITE_CLERK_PUBLISHABLE_KEY}>
      <App />
    </ClerkProvider>
  </React.StrictMode>
);
