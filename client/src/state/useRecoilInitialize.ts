import { useRecoilState } from "recoil";
import { userState } from ".";
import { useEffect } from "react";

const useRecoilInitialize = () => {
  const [user, setUser] = useRecoilState(userState);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, [setUser]);

  return null;
};

export default useRecoilInitialize;
