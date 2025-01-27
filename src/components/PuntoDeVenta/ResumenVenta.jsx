import React from "react";

const ResumenVenta = ({ total, carrito }) => {
  return (
    <div className="resumen-venta">
      <h2>Resumen de Venta</h2>
      <p>Total: ${total}</p>
      <p>Productos:</p>
      <ul>
        {carrito.map((item) => (
          <li key={item.id}>
            {item.nombre} x {item.cantidad} = ${item.precio * item.cantidad}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ResumenVenta;
