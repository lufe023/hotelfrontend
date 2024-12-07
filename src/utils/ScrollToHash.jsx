import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToHash = () => {
  const location = useLocation();

  useEffect(() => {
    const hash = location.hash;
    if (hash) {
      const element = document.querySelector(hash); // Busca el elemento con ese id
      if (element) {
        element.scrollIntoView({ behavior: "smooth" }); // Hace scroll al elemento
      }
    }
  }, [location]);

  return null; // No renderiza nada en pantalla
};

export default ScrollToHash;
