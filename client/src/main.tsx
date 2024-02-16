import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { ChakraProvider } from "@chakra-ui/react";
import { AlertDialogProvider } from "./context/AlertDialogProvider";
import { RecoilRoot } from "recoil";
import { SocketProvider } from "./context/SocketProvider.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RecoilRoot>
      <ChakraProvider>
        <SocketProvider>
          <AlertDialogProvider>
            <BrowserRouter>
              <App />
            </BrowserRouter>
          </AlertDialogProvider>
        </SocketProvider>
      </ChakraProvider>
    </RecoilRoot>
  </React.StrictMode>
);
