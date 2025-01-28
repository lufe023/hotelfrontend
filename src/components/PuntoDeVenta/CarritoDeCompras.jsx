import React, { useEffect } from "react";

const CarritoPOS = ({ carrito, setCarrito, setTotal }) => {
  const eliminarProducto = (id) => {
    const nuevoCarrito = carrito.filter((item) => item.id !== id);
    setCarrito(nuevoCarrito);
  };


  const calcularTotal = (carrito) => {
    const total = carrito.reduce((acc, item) => acc + item.precio * item.cantidad, 0);
    setTotal(total);
  };

  const actualizarCantidad = (id, cantidad) => {
    if (cantidad < 1) return;  // Prevenir cantidades menores a 1
    const nuevoCarrito = carrito.map((item) =>
      item.id === id ? { ...item, cantidad } : item
    );
    setCarrito(nuevoCarrito);
    calcularTotal(nuevoCarrito);
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


  
  useEffect(() => {
    calcularTotal(carrito);
  }, [carrito]); // Recalcula el total cada vez que el carrito cambia

  return (
    <div>
      {carrito.length === 0 ? (
        <ul className="list-group ps--scrolling-y scroll scrollHistory" style={{ height: "44vh", overflow: "scroll" }}>
          <p>Vacio</p>
        </ul>
      ) : (
        <ul className="list-group ps--scrolling-y scroll scrollHistory" style={{ height: "44vh", overflow: "scroll" }}>
          {carrito.map((item) => (
            <li key={item.id} className="list-group-item d-flex align-items-start pb-4 pt-4">
              {/* Columna izquierda: Detalle del artículo */}
              <div className="col-7 d-flex flex-column justify-content-between" style={{ minHeight: "100%" }}>
                <div>
                  <span className="d-block">{item.nombre}</span>
                  <small>
                    ${item.precio.toFixed(2)} x {item.cantidad} = ${(item.cantidad * item.precio).toFixed(2)}
                  </small>
                </div>
                <button className="btn btn-danger px-3 mt-2 align-self-start" onClick={() => eliminarProducto(item.id)}>
                  <i className="fas fa-trash"></i> Eliminar
                </button>
              </div>

              {/* Columna derecha: Botones de control */}
              <div className="col-5 d-flex flex-column justify-content-between align-items-center">
                {/* Botón de aumentar */}
                <a className="btn btn-dark cursor-pointer w-100 mb-2" onClick={() => agregarAlCarrito(item)}>
                  <i className="fas fa-plus-square" />
                </a>

                {/* Input para la cantidad */}
                <input
                  type="number"
                  min="1"
                  className="form-control form-control-sm d-inline-block mb-2"
                  value={item.cantidad}
                  onChange={(e) => actualizarCantidad(item.id, parseInt(e.target.value) || 1)} // Aseguramos que sea >= 1
                />

                {/* Botón de disminuir */}
                {item.cantidad > 1 ? (
                  <a className="btn btn-danger cursor-pointer w-100" onClick={() => restarAlCarrito(item)}>
                    <i className="fas fa-minus-square" />
                  </a>
                ) : (
                  <a className="btn btn-dark cursor-pointer w-100 disabled">
                    <i className="fas fa-minus-square" />
                  </a>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CarritoPOS;
