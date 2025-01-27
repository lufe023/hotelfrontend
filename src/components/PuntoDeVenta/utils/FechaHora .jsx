import React, { useState, useEffect } from "react";

const FechaHora = () => {
  const [fechaHora, setFechaHora] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setFechaHora(new Date());
    }, 1000);

    return () => clearInterval(interval); // Limpia el intervalo al desmontar el componente
  }, []);

  const formatoFecha = fechaHora.toLocaleDateString(); // Formato de la fecha
  const formatoHora = fechaHora.toLocaleTimeString(); // Formato de la hora

  return (
    <div style={{ textAlign: "center", fontSize: "14px"}}>
    
    {formatoFecha} | {formatoHora}

    </div>
  );
};

export default FechaHora;
