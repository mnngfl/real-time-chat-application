import { useSetRecoilState } from "recoil";
import { userState } from ".";
import { useEffect } from "react";

const useRecoilInitialize = () => {
  const setUser = useSetRecoilState(userState);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, [setUser]);

  return null;
};

export default useRecoilInitialize;
