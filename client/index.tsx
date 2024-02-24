import { ClerkProvider, SignIn, SignedIn, SignedOut } from "@clerk/clerk-react";
import React from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ErrorPage from "./routes/Error";
import { Settings } from "./routes/Settings";
import { Station } from "./routes/Station";
import { getStageEnv } from "./stage";

const root = createRoot(document.getElementById("app") as Element);

const router = createBrowserRouter([
  {
    path: "/",
    element: <Station />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/settings",
    element: <Settings />,
  },
]);

root.render(
  <React.StrictMode>
    <ClerkProvider publishableKey={getStageEnv().VITE_CLERK_PUBLISHABLE_KEY}>
      <SignedOut>
        <SignIn />
      </SignedOut>
      <SignedIn>
        <RouterProvider router={router} />
      </SignedIn>
    </ClerkProvider>
  </React.StrictMode>
);
