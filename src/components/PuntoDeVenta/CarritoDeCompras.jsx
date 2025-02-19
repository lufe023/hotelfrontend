import React, { useState, useEffect } from "react";
import { agregarAlCarrito, agregarCantidadAlCarrito, obtenerCantidadTotalEnCarritos, playErrorSound, restarAlCarrito } from "./logicaDelCarrito";
import Swal from "sweetalert2";

const CarritoPOS = ({ carrito, setCarrito, setTotal }) => {
  const [cantidadInput, setCantidadInput] = useState({});

  useEffect(() => {
    // Inicializar los valores del input con las cantidades actuales
    const cantidadesIniciales = carrito.reduce((acc, item) => {
      acc[item.id] = item.cantidad;
      return acc;
    }, {});
    setCantidadInput(cantidadesIniciales);
  }, [carrito]);

  const eliminarProducto = (id) => {
    const nuevoCarrito = carrito.filter((item) => item.id !== id);
    setCarrito(nuevoCarrito);
  };

  const calcularTotal = (nuevoCarrito) => {
    const total = nuevoCarrito.reduce((acc, item) => acc + Number(item.salePrice) * item.cantidad, 0);
    setTotal(total);
  };

  const actualizarCantidad = (producto, nuevaCantidad) => {
    const cantidadFinal = Math.max(1, Number(nuevaCantidad)); // Asegurar que no sea menor a 1

    // Validar y actualizar la cantidad en el carrito
    agregarCantidadAlCarrito(carrito, setCarrito, producto, cantidadFinal);

    // Actualizar el estado del input
    setCantidadInput((prev) => ({ ...prev, [producto.id]: cantidadFinal }));
};

  // Manejar cambios en el input sin afectar inmediatamente el carrito
  const manejarCambioInput = (producto, valor) => {
    const cantidad = parseInt(valor) || "";
    setCantidadInput((prev) => ({ ...prev, [producto.id]: cantidad }));
  };


//Aplicar el cambio real cuando el usuario salga del input
const manejarBlur = (producto) => {
  // Obtener la cantidad total del producto en todos los carritos (incluyendo este)
  const { cantidadTotal } = obtenerCantidadTotalEnCarritos(producto.id);


  // Obtener la cantidad actual en el carrito actual (usando el prop 'carrito')
  const productoEnCarritoActual = carrito.find((item) => item.id === producto.id);
  const cantidadActual = productoEnCarritoActual ? productoEnCarritoActual.cantidad : 0;


  // Calcular la cantidad en otros carritos
  const cantidadOtros = cantidadTotal - cantidadActual;


  // La cantidad máxima que puede haber en este carrito es:
  // stock total del producto menos lo que ya está en otros carritos
  const maxAllowedInCurrentCart = producto.stock - cantidadOtros;


  // La cantidad solicitada por el usuario (valor del input)
  const cantidadSolicitada = Number(cantidadInput[producto.id]) || 0;

// Bloquear Enter en el modal de alerta
const bloquearEnter = (event) => {
  if (event.key === "Enter") {
      event.preventDefault();
      event.stopPropagation();
  }
};

  // Si la cantidad solicitada supera lo permitido, se ajusta
  let cantidadFinal = cantidadSolicitada;
  if (cantidadFinal > maxAllowedInCurrentCart) {
    cantidadFinal = maxAllowedInCurrentCart;
    playErrorSound()
    const alert =() =>{ Swal.fire({
      title: "Stock insuficiente",
      text: `Solo puedes tener hasta ${maxAllowedInCurrentCart} unidades en este carrito.`,
      icon: "warning",
      confirmButtonText: "Aceptar",
      confirmButtonColor: "#22c55e",
      allowOutsideClick:true

    });
  }

    setTimeout(() => {
      alert()
  }, 100);
  }

  // Actualizamos el estado local del input y el carrito actual
  setCantidadInput((prev) => ({ ...prev, [producto.id]: cantidadFinal }));
  actualizarCantidad(producto, cantidadFinal);

};


  useEffect(() => {
    calcularTotal(carrito);
  }, [carrito]);

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
              <div className="col-7 d-flex flex-column justify-content-between" style={{ minHeight: "100%" }}>
                <div>
                  <span className="d-block">{item.name}</span>
                  <small>
                    ${Number(item.salePrice).toFixed(2)} x {item.cantidad} = ${(item.cantidad * Number(item.salePrice)).toFixed(2)}
                  </small>
                </div>
                <button className="btn btn-danger px-3 mt-2 align-self-start" onClick={() => eliminarProducto(item.id)}>
                  <i className="fas fa-trash"></i> Eliminar
                </button>
              </div>

              <div className="col-5 d-flex flex-column justify-content-between align-items-center">
                <a className="btn btn-dark cursor-pointer w-100 mb-2" onClick={() => agregarAlCarrito(carrito, setCarrito, item)}>
                  <i className="fas fa-plus-square" />
                </a>

                {/*Input de cantidad corregido */}
                <input
                  type="number"
                  min="1"
                  className="form-control form-control-sm mx-2 text-center w-100 mb-2"
                  value={cantidadInput[item.id] || ""}
                  onChange={(e) => manejarCambioInput(item, e.target.value)}
                  onBlur={() => manejarBlur(item)}
                  onKeyDown={ (e) => e.key == 'Enter'? manejarBlur(item):''}
                />

                {item.cantidad > 1 ? (                                                              
                  <a className="btn btn-danger cursor-pointer w-100" onClick={() => restarAlCarrito(carrito, setCarrito, item)}>
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
