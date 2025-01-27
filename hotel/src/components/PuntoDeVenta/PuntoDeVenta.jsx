import React, { useState } from "react";
import ListaProductos from "./ListaProductos";
import CarritoDeCompras from "./CarritoDeCompras";
import DetallesCliente from "./DetallesCliente";
import OpcionesDePago from "./OpcionesDePago";
import ResumenVenta from "./ResumenVenta";

const PuntoDeVenta = () => {
  const [carrito, setCarrito] = useState([]);
  const [cliente, setCliente] = useState(null);
  const [total, setTotal] = useState(0);

  return (
    <div className="punto-de-venta">
      <h1>Punto de Venta</h1>
      <div className="grid">
        <ListaProductos carrito={carrito} setCarrito={setCarrito} />
        <CarritoDeCompras carrito={carrito} setCarrito={setCarrito} setTotal={setTotal} />
        <DetallesCliente cliente={cliente} setCliente={setCliente} />
        <OpcionesDePago cliente={cliente} total={total} carrito={carrito} />
        <ResumenVenta total={total} carrito={carrito} />
      </div>
    </div>
  );
};

export default PuntoDeVenta;
