import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToHash = () => {
  const location = useLocation();

  useEffect(() => {
    // Obtiene la parte del hash directamente del objeto window
    const cleanHash = window.location.hash.replace("#", "");
    if (cleanHash) {
      const element = document.getElementById(cleanHash);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [location]);

  return null;
};

export default ScrollToHash;
