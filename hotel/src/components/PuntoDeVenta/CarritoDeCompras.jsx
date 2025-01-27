import React from "react";

const CarritoDeCompras = ({ carrito, setCarrito, setTotal }) => {
  const actualizarCantidad = (id, cantidad) => {
    const nuevoCarrito = carrito.map((item) =>
      item.id === id ? { ...item, cantidad } : item
    );
    setCarrito(nuevoCarrito);
    calcularTotal(nuevoCarrito);
  };

  const calcularTotal = (carrito) => {
    const total = carrito.reduce((acc, item) => acc + item.precio * item.cantidad, 0);
    setTotal(total);
  };

  const eliminarProducto = (id) => {
    const nuevoCarrito = carrito.filter((item) => item.id !== id);
    setCarrito(nuevoCarrito);
    calcularTotal(nuevoCarrito);
  };

  return (
    <div className="carrito-compras">
      <h2>Carrito de Compras</h2>
      {carrito.length === 0 ? (
        <p>El carrito está vacío</p>
      ) : (
        <ul>
          {carrito.map((item) => (
            <li key={item.id}>
              <span>{item.nombre}</span>
              <input
                type="number"
                min="1"
                value={item.cantidad}
                onChange={(e) => actualizarCantidad(item.id, parseInt(e.target.value, 10))}
              />
              <span>${item.precio * item.cantidad}</span>
              <button onClick={() => eliminarProducto(item.id)}>Eliminar</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CarritoDeCompras;
