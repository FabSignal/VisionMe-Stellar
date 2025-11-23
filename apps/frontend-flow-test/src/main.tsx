// src/main.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import Providers from "../providers/Providers";

const rootElement = document.getElementById("root") as HTMLElement;

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <Providers>
      <App />
    </Providers>
  </React.StrictMode>
);

