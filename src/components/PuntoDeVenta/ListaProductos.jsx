import React, { useState } from "react";
import productos from "./products.json";

const ListaProductosPOS = ({ carrito, setCarrito, busqueda }) => {


  const agregarAlCarrito = (producto) => {
    const existeEnCarrito = carrito.find((item) => item.id === producto.id);

    if (producto.existencia <= 0) {
      alert("No hay más unidades disponibles de este producto.");
      return;
    }

    if (existeEnCarrito) {
      if (existeEnCarrito.cantidad >= producto.existencia) {
        alert("No hay más unidades disponibles de este producto.");
        return;
      }
      const nuevoCarrito = carrito.map((item) =>
        item.id === producto.id
          ? { ...item, cantidad: item.cantidad + 1 }
          : item
      );
      setCarrito(nuevoCarrito);
    } else {
      setCarrito([...carrito, { ...producto, cantidad: 1 }]);
    }
  };

  // Filtrar los productos según la búsqueda
  const productosFiltrados = productos.filter(
    (producto) =>
      producto.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      producto.codigoBarra.includes(busqueda)
  );

  const manejarSeleccion = (id) => {
    const productoSeleccionado = productos.find(
      (producto) => producto.id === parseInt(id)
    );
    if (productoSeleccionado) {
      agregarAlCarrito(productoSeleccionado);
    }
  };

  const eliminarProducto = (id) => {
    const nuevoCarrito = carrito.filter((item) => item.id !== id);
    setCarrito(nuevoCarrito);
  };

  const restarAlCarrito = (producto) => {
    const productoEnCarrito = carrito.find((item) => item.id === producto.id);
  
    if (productoEnCarrito) {
      if (productoEnCarrito.cantidad > 1) {
        // Si la cantidad es mayor a 1, simplemente resta 1
        const nuevoCarrito = carrito.map((item) =>
          item.id === producto.id
            ? { ...item, cantidad: item.cantidad - 1 }
            : item
        );
        setCarrito(nuevoCarrito);
      } else {
        // Si la cantidad es 1, elimina el producto
        eliminarProducto(producto.id);
      }
    }
  };

  return (
  <div className="col-xl-12">
  <div className="row ps--scrolling-y scroll scrollHistory" style={{maxHeight:"53vh", overflow:'scroll'}}>
  {productosFiltrados.map((producto) => (
    <div key={producto.id} className="col-md-3 col-xl-3  p-2  cursor-pointer" onClick={()=>manejarSeleccion(producto.id)}>
      <div className="card">
      <div
  className={`card-header hover p-1 text-center ${
    carrito.find((item) => item.id === producto.id) ? "bg-dark" : ""
  }`}
>
{carrito.find((item) => item.id === producto.id) ?
(
  <span  className="badge badge-danger pl-3 pr-3" style={{position:"absolute", top:"9px", left:"5px"}}  onClick={(e) => {
    e.stopPropagation();
    restarAlCarrito(producto);
  }}>
  <i className="fas fa-minus" />
</span>
) : (
  ""
)}
  <div className="icon icon-shape icon-lg bg-primary shadow text-center border-radius-lg">
  <i className="fas fa-glass-martini-alt" />
  </div>
    {carrito.find((item) => item.id === producto.id) ? (
  <span  className="badge badge-success navbar-badge pl-3 pr-3">
    {carrito.find((item) => item.id === producto.id).cantidad}
  </span>
) : (
  ""
)}

        </div>
        <div className="card-body pt-0 p-1 text-center ">
          <h6 className="text-center mb-0" style={{fontSize:"14px"}}>{producto.nombre}</h6>
          {/* <span className="text-xs">Categoría</span> */}
          <hr className="horizontal dark my-3" />
          <h5 className="mb-0">${producto.precio}</h5>
        </div>
      </div>
    </div>
  ))}
  </div>
</div>
  );
};

export default ListaProductosPOS;
