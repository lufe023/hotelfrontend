import React, { useState, useEffect } from "react";

const FechaHora = () => {
    const [fechaHora, setFechaHora] = useState(new Date());
    const [department, setDepartment] = useState(
        JSON.parse(localStorage.getItem("defaultDepartment"))
    );
    const options = {
        weekday: "long",
        year: "numeric",
        month: "short",
        day: "numeric",
    };

    useEffect(() => {
        const interval = setInterval(() => {
            setFechaHora(new Date());
        }, 1000);

        return () => clearInterval(interval); // Limpia el intervalo al desmontar el componente
    }, []);

    const formatoFecha = fechaHora.toLocaleDateString("es-ES", options); // Formato de la fecha
    const formatoHora = fechaHora.toLocaleTimeString(); // Formato de la hora

    return (
        <div style={{ textAlign: "left", fontSize: "14px" }}>
            <strong>{formatoHora} </strong>
            <span className="font-italic">({department?.name}) </span>
            <br />
            {formatoFecha}
        </div>
    );
};

export default FechaHora;
