import { atom } from "recoil";
import { io, type Socket } from "socket.io-client";

export const socketState = atom<Socket>({
  key: "socketState",
  default: io(import.meta.env.VITE_SOCKET_URL),
  dangerouslyAllowMutability: true,
});
