import React, { useState, useRef, useEffect, cloneElement } from "react";

const HorizontalScroll = ({ children }) => {
  const scrollRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  // Detectar si es un dispositivo móvil o tableta
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth <= 768); // Ajusta el ancho según tus necesidades
    };

    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);

    return () => {
      window.removeEventListener("resize", checkIfMobile);
    };
  }, []);

  // Funciones de drag (solo en escritorio)
  const handleMouseDown = (e) => {
    if (isMobile) return; // Desactivar en móviles
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };

  const handleMouseMove = (e) => {
    if (!isDragging || isMobile) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 1; // Ajusta la sensibilidad
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUp = () => {
    if (isMobile) return;
    setIsDragging(false);
  };

  return (
    <div
      className={`scrollHorizontal ${isDragging ? "grabbing" : ""}`}
      ref={scrollRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      style={{
        display: "flex",
        overflowX: "auto",
        WebkitOverflowScrolling: "touch", // Suavizar desplazamiento en móviles
      }}
    >
      {React.Children.map(children, (child) =>
        cloneElement(child, {
          className: `${child.props.className} ${isDragging ? "grabbing" : ""}`,
        })
      )}
    </div>
  );
};

export default HorizontalScroll;