import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./app/layout/style.css";
import { RouterProvider } from "react-router-dom";
import { router } from "./app/router/Routes";
import { store, StoreContext } from "./app/stores/store";
import { GoogleOAuthProvider } from "@react-oauth/google";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <GoogleOAuthProvider clientId="767693788852-hl2suntdl6ps601orq0h1tst6shvluti.apps.googleusercontent.com">
      <StoreContext.Provider value={store}>
        <RouterProvider router={router} />
      </StoreContext.Provider>
    </GoogleOAuthProvider>
  </StrictMode>
);
