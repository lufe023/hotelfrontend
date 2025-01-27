import React, { useEffect, useRef, useState } from "react";
import ListaProductosPOS from "./ListaProductos";
import CarritoPOS from "./CarritoDeCompras";
import OpcionesPOS from "./OpcionesDePago";
import { useMenu } from "../../utils/MenuContext";
import PMenu from "./PMenu";
import "./PuntoDeVenta.css";


const PuntoDeVenta = () => {
  const [carrito, setCarrito] = useState([]);
  const [total, setTotal] = useState(0);
  const [cliente, setCliente] = useState(
    { firstName: "No registrado", telefono: "1", email: "" },
  );

  const divRef = useRef(null); // Referencia al div
  const [altura, setAltura] = useState(0); // Estado para guardar la altura

  const actualizarAltura = () => {
    if (divRef.current) {
      const nuevaAltura = divRef.current.offsetHeight;
      setAltura(nuevaAltura); // Actualizar el estado con la nueva altura
    }
  };

    // useEffect para medir la altura al montar y en cambios de tamaño
    useEffect(() => {
      actualizarAltura(); // Obtener la altura inicial
      window.addEventListener("resize", actualizarAltura); // Escuchar cambios de tamaño
  
      return () => {
        window.removeEventListener("resize", actualizarAltura); // Limpiar el evento al desmontar
      };
    }, []);
  const [busqueda, setBusqueda] = useState("");

  const { isPinned } = useMenu(); // Controla el estado del menú
  return (
    <div className={`g-sidenav-show ${isPinned ? "g-sidenav-pinned" : ""}`}>

    <PMenu  busqueda={busqueda} setBusqueda={setBusqueda}/>
      <main className="main-content  max-height-vh-100 h-100 border-radius-lg pt-8">
        <div className="container-fluid p-2">
    <div className="row gx-2 gy-3 ">
      <div className="col-lg-8">
        <div className="card shadow">
          <div className="card-body pb-0">
            <ListaProductosPOS carrito={carrito} setCarrito={setCarrito} busqueda={busqueda} setBusqueda={setBusqueda} />
          </div>
        </div>
      </div>

      {/* Carrito */}
      <div className="col-lg-4">
        <div className="card shadow">
          <div className="card-header bg-dark p-2" style={{height: "40px"}}>
            <h6 className="mb-0 text-white">Comanda</h6>
          </div>
          <div className="card-body">
            <CarritoPOS carrito={carrito} setCarrito={setCarrito} setTotal={setTotal} />
          </div>
        </div>
      </div>

    </div>
    </div>
    {/* <div className="" style={{height: `${altura}px`, width: "100%"}}>
    </div> */}

    
    <div ref={divRef} onResize={actualizarAltura} className="bg-white border p-3 " style={{minHeight: "25vh", position: `${altura>991?'fixed':'auto'}`, width: "100%"}}>
    <OpcionesPOS total={total} cliente={cliente} setCliente={setCliente} />
    </div>
    </main>
    </div>
  );
};

export default PuntoDeVenta;
