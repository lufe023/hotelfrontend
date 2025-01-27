import React from "react";

const OpcionesDePago = ({ cliente, total, carrito }) => {
  const cobrar = () => {
    alert(`Cobrado: $${total}`);
  };

  const sumarAFactura = () => {
    alert(`Se sumó $${total} a la factura del cliente: ${cliente}`);
  };

  return (
    <div className="opciones-pago">
      <h2>Opciones de Pago</h2>
      <button onClick={cobrar} disabled={carrito.length === 0}>
        Cobrar Ahora
      </button>
      <button onClick={sumarAFactura} disabled={!cliente || carrito.length === 0}>
        Sumar a Factura
      </button>
    </div>
  );
};

export default OpcionesDePago;
