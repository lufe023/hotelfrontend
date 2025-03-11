import React, { useEffect, useRef, useState } from "react";
import ListaProductosPOS from "./ListaProductos";
import CarritoPOS from "./CarritoDeCompras";
import OpcionesPOS from "./OpcionesDePago";
import { useMenu } from "../../utils/MenuContext";
import PMenu from "./PMenu";
import "./PuntoDeVenta.css";
import Swal from 'sweetalert2';
import HorizontalScroll from "./HorizontalScroll";
import { cargarFavoritos } from "./logicaFavoritos";
import { eliminarTab } from "./EliminarTab";

const PuntoDeVenta = () => {
  const LOCAL_STORAGE_KEY = "puntoDeVentaTabs";
  const scrollContainerRef = useRef(null);  // Referencia al contenedor del scroll
  const tabRefs = useRef({});
  const [isDragging, setIsDragging] = useState(false);
  const dragTimeout = useRef(null);
  const [activeTab, setActiveTab] = useState(1); // ID del tab activo
  const [busqueda, setBusqueda] = useState("");
  const [productos, setProductos] = useState([])
  const [favoritos, setFavoritos] = useState([]);

  const handleTouch = (event) => {
    if (event.touches.length > 1) {
      event.preventDefault();
    }
  };
  
  useEffect(() => {
    document.addEventListener("touchstart", handleTouch, { passive: false });
  
    return () => {
      document.removeEventListener("touchstart", handleTouch);
    };
  }, []);
  
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'F6') {
        e.preventDefault(); // Evita que el navegador capture la tecla
        agregarTab();
      } else if (e.key === 'F12') {
        e.preventDefault();
        finalizarCompra();
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

  const { isPinned } = useMenu();

//cargando productos favoritos
  useEffect(() => {
    cargarFavoritos(setFavoritos);
}, []);


//llamando las tabs almacenadass
useEffect(() => {
  const storedTabs = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (storedTabs) {
    const parsedTabs = JSON.parse(storedTabs);
    setTabs(parsedTabs);
    setActiveTab(parsedTabs.length ? parsedTabs[parsedTabs.length - 1].id : 1);
  }
}, []);

useEffect(() => {
  if (tabs.length > 0) {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(tabs));
  }
}, [tabs]);


  useEffect(() => {
    const storedTabs = localStorage.getItem(LOCAL_STORAGE_KEY);
    const tabsInicializados = storedTabs ? JSON.parse(storedTabs) : [{ id: 1, cliente: { firstName: "No registrado", telefono: "1", email: "" }, carrito: [], total: 0 }];
    setTabs(tabsInicializados);
    setActiveTab(tabsInicializados.length ? tabsInicializados[tabsInicializados.length - 1].id : 1);
  }, []);


  // Cambiar entre tabs
  const cambiarTab = (id) => {
    setActiveTab(id);
    if (tabRefs.current[id]) {
      tabRefs.current[id].scrollIntoView({ behavior: 'smooth', inline: 'center' });
    }
  };

// Añadir un nuevo tab
const agregarTab = () => {
  setTabs((prevTabs) => {
    // Obtener el último id usado y sumarle 1
    const nuevoId = prevTabs.length > 0 ? Math.max(...prevTabs.map(tab => tab.id)) + 1 : 1;

    const nuevosTabs = [
      ...prevTabs,
      {
        id: nuevoId,
        cliente: { firstName: `No registrado ${nuevoId}`, telefono: "1", email: "" },
        carrito: [],
        total: 0,
      },
    ];

    setActiveTab(nuevoId);
    return nuevosTabs;
  });
};

//centrando tab seleccionada
useEffect(() => {
  if (activeTab !== null && tabRefs.current[activeTab]) {
    tabRefs.current[activeTab].scrollIntoView({ behavior: 'smooth', inline: 'center' });
  }
}, [tabs, activeTab]);

const cerrarTabConfirmation = (id) => {
  const tabToClose = tabs.find(tab => tab.id === id);

  // Si el tab tiene productos en el carrito, preguntar confirmación
  if (tabToClose && tabToClose.carrito.length > 0) {
    Swal.fire({
      title: '¿Estás seguro?',
      html: `<b>${tabToClose.cliente.firstName}</b> tiene productos en la comanda. Si lo cierras, se perderá la selección.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, cerrar tab',
      confirmButtonColor:'#ef4444',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        eliminarTab(id, tabs, setTabs, setActiveTab);
      }
    });
  } else {
    // Si el carrito está vacío, cerrar el tab directamente
    eliminarTab(id, tabs, setTabs, setActiveTab);
  }
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
      cerrarTabConfirmation(id);
    } else {
      setIsDragging(false);
      dragTimeout.current = setTimeout(() => {
        setIsDragging(true);
      }, 200); // Ajusta el tiempo según sea necesario
    }
  };

  const handleMouseUp = (e, id) => {
    clearTimeout(dragTimeout.current);
    if (!isDragging) {
      cambiarTab(id);
    }
    setIsDragging(false);
  };


  const setCarrito = (nuevoCarrito) => {
    setTabs(
      tabs?.map((tab) =>
        tab.id === activeTab ? { ...tab, carrito: nuevoCarrito } : tab
      )
    )
  }

  const total= tabActivo?.total || 0

  const setTotal= (nuevoTotal) =>{
    setTabs(
      tabs.map((tab) =>
        tab.id === activeTab ? { ...tab, total: nuevoTotal } : tab
      )
    )
  }

  return (
    <div className={` g-sidenav-show ${isPinned ? "g-sidenav-pinned" : ""}`} style={{ userSelect: "none" }}>
      
      <div className="top-0" style={{ width: "100%", margin: 'auto', boxSizing: "border-box", marginBottom: "0px", position: 'fixed', zIndex: 1000 }}>
      <div style={{ position: 'relative', zIndex: 2 }}>
  <PMenu busqueda={busqueda} setBusqueda={setBusqueda} 
  productos={productos}
  setProductos={setProductos}
  carrito={tabActivo?.carrito || []}
  setCarrito={setCarrito}
  />
</div>

      <div className=" p-2 bg-white" style={{ backdropFilter: "blur(15px)", width: "100%", zIndex: 1}}>
        <HorizontalScroll ref={scrollContainerRef}>
        {tabs.map((tab) => (
        <button
        key={tab.id}
        ref={(el) => (tabRefs.current[tab.id] = el)}
        className={`btn btn-sm me-2 mb-0 ${activeTab === tab.id ? "btn-primary" : "btn-light"}`}
        onMouseDown={(e) => handleMouseDown(e, tab.id)}
        onMouseUp={(e) => handleMouseUp(e, tab.id)}
        style={{ minWidth: "200px", minHeight: "50px" }}
      >
              {tab.cliente.firstName || "Venta"}
              <span
                className="ms-2 text-danger"
                onClick={(e) => {
                  e.stopPropagation();
                  cerrarTabConfirmation(tab.id);
                }}
              >
                
                ✖
              </span>
            </button>
          ))}
          <button
            className="btn btn-sm btn-success mb-0"
            onClick={agregarTab}
            style={{
              minWidth: "150px",
              minHeight: "50px",
              position: "sticky",
              right: "-25px",
              top: "auto",
              alignItems: "center",
              display: "flex",
            }}
          >
            <i className="fas fa-plus-square" 
            style={{ fontSize: "20px", fontWeight: "bold", marginRight:"5px"}}/> Nueva Venta
            
          </button>
        </HorizontalScroll>
      </div>
    </div>

      <main className="main-content max-height-vh-100 h-100 border-radius-lg pt-9 p-2">
        <div className="container-fluid p-2 ">
          {/* Sistema de tabs */}
          <div className="row gx-2 gy-3">
            {/* Lista de productos */}
            <div className="col-lg-8">
              <div className="card shadow">
                <div className="card-body pb-0">
                <ListaProductosPOS
                carrito={tabActivo?.carrito || []}
                setCarrito={setCarrito}
                productos={productos}
                busqueda={busqueda}
                setFavoritos={setFavoritos}
                favoritos={favoritos}
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
                    setCarrito={setCarrito}
                    setTotal={setTotal}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white border p-3" style={{ minHeight: "25vh", width: "100%" }}>
          <OpcionesPOS
            total={total}
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
            tabActivo={tabActivo}
          />
        </div>
      </main>
    </div>
  );
};

export default PuntoDeVenta;
