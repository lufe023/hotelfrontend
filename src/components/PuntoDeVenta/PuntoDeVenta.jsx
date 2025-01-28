import React, { useEffect, useRef, useState } from "react";
import ListaProductosPOS from "./ListaProductos";
import CarritoPOS from "./CarritoDeCompras";
import OpcionesPOS from "./OpcionesDePago";
import { useMenu } from "../../utils/MenuContext";
import PMenu from "./PMenu";
import "./PuntoDeVenta.css";
import Swal from 'sweetalert2';
import HorizontalScroll from "./HorizontalScroll";

const PuntoDeVenta = () => {
  const LOCAL_STORAGE_KEY = "puntoDeVentaTabs";
  const scrollContainerRef = useRef(null);  // Referencia al contenedor del scroll

  useEffect(() => {
    const handleKeyDown = (e) => {
      switch (e.key) {
        case 'F12':
          // Aquí puedes ejecutar la función para finalizar la compra
          finalizarCompra();
          break;
        case 'F6':
          // Aquí puedes ejecutar la función para abrir una nueva tab
          agregarTab();
          break;
        default:
          break;
      }
    };
  
    window.addEventListener('keydown', handleKeyDown);
  
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const [tabs, setTabs] = useState(() => {
    const storedTabs = localStorage.getItem(LOCAL_STORAGE_KEY);
    return storedTabs
      ? JSON.parse(storedTabs)
      : [{ id: 1, cliente: { firstName: "No registrado", telefono: "1", email: "" }, carrito: [], total: 0 }];
  });

  const [activeTab, setActiveTab] = useState(1); // ID del tab activo
  const [busqueda, setBusqueda] = useState("");
  const divRef = useRef(null);
  const [altura, setAltura] = useState(0);

  const { isPinned } = useMenu();

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(tabs));
  }, [tabs]);

  const actualizarAltura = () => {
    if (divRef.current) {
      const nuevaAltura = divRef.current.offsetHeight;
      setAltura(nuevaAltura);
    }
  };

  useEffect(() => {
    const storedTabs = localStorage.getItem(LOCAL_STORAGE_KEY);
    const tabsInicializados = storedTabs ? JSON.parse(storedTabs) : [{ id: 1, cliente: { firstName: "No registrado", telefono: "1", email: "" }, carrito: [], total: 0 }];
    setTabs(tabsInicializados);
    setActiveTab(tabsInicializados.length ? tabsInicializados[tabsInicializados.length - 1].id : 1);
  }, []);

  useEffect(() => {
    actualizarAltura();
    window.addEventListener("resize", actualizarAltura);

    return () => {
      window.removeEventListener("resize", actualizarAltura);
    };
  }, []);

  // Cambiar entre tabs
  const cambiarTab = (id) => {
    setActiveTab(id);
  };

// Añadir un nuevo tab
const agregarTab = () => {
  // Encontrar el primer id disponible
  let nuevoId = 1;
  while (tabs.some(tab => tab.id === nuevoId)) {
    nuevoId++;
  }

  // Crear el nuevo tab
  setTabs((prevTabs) => {
    const nuevosTabs = [
      ...prevTabs,
      {
        id: nuevoId,
        cliente: { firstName: `No registrado ${nuevoId}`, telefono: "1", email: "" },
        carrito: [],
        total: 0,
      },
    ];

    // Hacer que el nuevo tab sea el activo
    setActiveTab(nuevoId);

    return nuevosTabs;
  });
};

const cerrarTab = (id) => {
  const tabToClose = tabs.find(tab => tab.id === id);

  // Si el tab tiene productos en el carrito, preguntar confirmación
  if (tabToClose && tabToClose.carrito.length > 0) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: `${tabToClose.cliente.firstName} tiene productos en la comanda. Si lo cierras, se perderá la selección.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, cerrar tab',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        eliminarTab(id);
      }
    });
  } else {
    // Si el carrito está vacío, cerrar el tab directamente
    eliminarTab(id);
  }
};

// Función para eliminar el tab después de la confirmación
const eliminarTab = (id) => {
  // Eliminar el tab seleccionado
  const updatedTabs = tabs.filter((tab) => tab.id !== id);

  if (updatedTabs.length === 0) {
    // Si ya no quedan tabs, crear uno nuevo automáticamente
    const nuevoTab = {
      id: 1,
      cliente: { firstName: 'No registrado 1', telefono: '1', email: '' },
      carrito: [],
      total: 0,
    };
    setTabs([nuevoTab]);
    setActiveTab(1);
    return; // Terminar la función aquí, ya que no hay más lógica necesaria
  }

  // Reordenar los ids de los tabs si quedan tabs
  const reindexedTabs = updatedTabs.map((tab, index) => ({
    ...tab,
    id: index + 1, // Reasigna los IDs para no dejar gaps
  }));

  // Si el tab eliminado era el activo, seleccionar el siguiente o el último
  let newActiveTab = reindexedTabs[0]?.id || 1;
  if (id === activeTab) {
    newActiveTab = reindexedTabs.length ? reindexedTabs[reindexedTabs.length - 1].id : 1;
  }

  setTabs(reindexedTabs);
  setActiveTab(newActiveTab);
};

  const tabActivo = tabs.find((tab) => tab.id === activeTab);

  const setMetodoPago = (nuevoMetodo) => {
    setTabs(
      tabs.map((tab) =>
        tab.id === activeTab ? { ...tab, metodoPago: nuevoMetodo } : tab
      )
    );
  };

  useEffect(() => {
    // Después de agregar un nuevo tab, mover el scroll hacia la derecha para enfocar el nuevo tab
    if (scrollContainerRef.current) {
      const nuevoTab = tabs[tabs.length - 1]; // Último tab agregado
      const tabElement = document.getElementById(`tab-${nuevoTab.id}`);
      
      if (tabElement) {
        tabElement.scrollIntoView({ behavior: 'smooth', inline: 'center' });
      }
    }
  }, [tabs]);

  const handleMouseDown = (e, id) => {
    if (e.button === 1) { // 1 es el botón del medio (rueda del mouse)
      cerrarTab(id);
    }
  };

  return (
    <div className={`g-sidenav-show ${isPinned ? "g-sidenav-pinned" : ""}`} style={{ userSelect: "none" }}>
      
    <div className='top-0 z-index-sticky' 
    style={{  width:"100%", margin:'auto',  boxSizing: "border-box",   marginBottom:"0px", position:'fixed'}}>
    
    <PMenu busqueda={busqueda} setBusqueda={setBusqueda} />
      <div className="mb-4 p-2 bg-white" style={{ backdropFilter: "blur(15px)", width: "100%" }}>
        <HorizontalScroll ref={scrollContainerRef}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`btn btn-sm me-2 mb-0 ${activeTab === tab.id ? "btn-primary" : "btn-light"}`}
              onClick={() => cambiarTab(tab.id)}
              style={{ minWidth: "200px", minHeight: "50px" }}
              onMouseDown={(e) => handleMouseDown(e, tab.id)}
            >
              {tab.cliente.firstName || "Venta"}
              <span
                className="ms-2 text-danger"
                onClick={(e) => {
                  e.stopPropagation();
                  cerrarTab(tab.id);
                }}
              >
                ✖
              </span>
            </button>
          ))}
          <button
            className="btn btn-sm btn-success ms-2 mb-0"
            onClick={agregarTab}
            style={{ minWidth: "200px", minHeight: "50px" }}
          >
            + Nueva Venta
          </button>
        </HorizontalScroll>
      </div>
          </div>

      <main className="main-content max-height-vh-100 h-100 border-radius-lg pt-9 p-2">
        <div className="container-fluid p-2">
          {/* Sistema de tabs */}
      

          <div className="row gx-2 gy-3">
            {/* Lista de productos */}
            <div className="col-lg-8">
              <div className="card shadow">
                <div className="card-body pb-0">
                  <ListaProductosPOS
                    carrito={tabActivo?.carrito || []}
                    setCarrito={(nuevoCarrito) =>
                      setTabs(
                        tabs.map((tab) =>
                          tab.id === activeTab ? { ...tab, carrito: nuevoCarrito } : tab
                        )
                      )
                    }
                    busqueda={busqueda}
                    setBusqueda={setBusqueda}
                  />
                </div>
              </div>
            </div>

            {/* Carrito */}
            <div className="col-lg-4">
              <div className="card shadow">
                <div className="card-header bg-dark p-2" style={{ height: "40px" }}>
                  <h6 className="mb-0 text-white">Comanda</h6>
                </div>
                <div className="card-body">
                  <CarritoPOS
                    carrito={tabActivo?.carrito || []}
                    setCarrito={(nuevoCarrito) =>
                      setTabs(
                        tabs.map((tab) =>
                          tab.id === activeTab ? { ...tab, carrito: nuevoCarrito } : tab
                        )
                      )
                    }
                    setTotal={(nuevoTotal) =>
                      setTabs(
                        tabs.map((tab) =>
                          tab.id === activeTab ? { ...tab, total: nuevoTotal } : tab
                        )
                      )
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div ref={divRef} className="bg-white border p-3" style={{ minHeight: "25vh", width: "100%" }}>
          <OpcionesPOS
            total={tabActivo?.total || 0}
            cliente={tabActivo?.cliente || { firstName: "", telefono: "", email: "" }}
            setCliente={(nuevoCliente) =>
              setTabs(
                tabs.map((tab) =>
                  tab.id === activeTab ? { ...tab, cliente: nuevoCliente } : tab
                )
              )
            }
            metodoPago={tabActivo?.metodoPago || 'Efectivo'}
            setMetodoPago={setMetodoPago}
          />
        </div>
      </main>
    </div>
  );
};

export default PuntoDeVenta;
