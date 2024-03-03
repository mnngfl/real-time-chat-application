import { useRecoilState } from "recoil";
import { socketState } from "../state";
import { useEffect } from "react";
import { io } from "socket.io-client";

const useSocket = () => {
  const [socket, setSocket] = useRecoilState(socketState);

  useEffect(() => {
    if (socket) return;

    const newSocket = io(import.meta.env.VITE_SOCKET_URL);
    setSocket(newSocket);

    return () => {
      if (socket) newSocket.disconnect();
    };
  }, [socket, setSocket]);
};

export default useSocket;
