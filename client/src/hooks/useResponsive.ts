import { throttle } from "lodash";
import { useEffect, useState } from "react";

const useResponsive = () => {
  const [isPc, setIsPc] = useState(window.innerWidth >= 992);

  const handleResize = throttle(() => {
    setIsPc(window.innerWidth >= 992);
  }, 200);

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [handleResize]);

  return { isPc };
};

export default useResponsive;
