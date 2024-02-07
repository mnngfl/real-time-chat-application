import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { ChakraProvider } from "@chakra-ui/react";
import { AlertDialogProvider } from "./context/AlertDialogProvider";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ChakraProvider>
      <AlertDialogProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </AlertDialogProvider>
    </ChakraProvider>
  </React.StrictMode>
);
