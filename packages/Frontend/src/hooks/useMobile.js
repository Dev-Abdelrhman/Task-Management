import { useState, useEffect } from "react";

export function useMobile(breakpoint = 640) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const checkIfMobile = () => {
        setIsMobile(window.innerWidth < breakpoint);
      };
      checkIfMobile();
      window.addEventListener("resize", checkIfMobile);
      return () => {
        window.removeEventListener("resize", checkIfMobile);
      };
    }
  }, [breakpoint]);

  return isMobile;
}
