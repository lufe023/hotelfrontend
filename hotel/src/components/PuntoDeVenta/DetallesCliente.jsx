import React from "react";

const DetallesCliente = ({ cliente, setCliente }) => {
  const seleccionarCliente = (e) => {
    setCliente(e.target.value);
  };

  return (
    <div className="detalles-cliente">
      <h2>Detalles del Cliente</h2>
      <select onChange={seleccionarCliente}>
        <option value="">Selecciona un cliente</option>
        <option value="Habitación 101">Habitación 101</option>
        <option value="Cliente Ambulante">Cliente Ambulante</option>
      </select>
      {cliente && <p>Cliente seleccionado: {cliente}</p>}
    </div>
  );
};

export default DetallesCliente;
