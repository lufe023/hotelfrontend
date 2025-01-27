import React from "react";

const ListaProductos = ({ carrito, setCarrito }) => {
  const productos = [
    { id: 1, nombre: "Bebida", precio: 3 },
    { id: 2, nombre: "Comida", precio: 10 },
    { id: 3, nombre: "Spa", precio: 50 },
  ];

  const agregarAlCarrito = (producto) => {
    setCarrito([...carrito, { ...producto, cantidad: 1 }]);
  };

  return (
    <div className="lista-productos">
      <h2>Productos/Servicios</h2>
      <ul>
        {productos.map((producto) => (
          <li key={producto.id}>
            <span>{producto.nombre}</span>
            <span>${producto.precio}</span>
            <button onClick={() => agregarAlCarrito(producto)}>Agregar</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ListaProductos;
