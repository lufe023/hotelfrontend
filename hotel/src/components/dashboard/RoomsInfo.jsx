import React, { useEffect, useState } from 'react'
import Tasks from './Tasks';
import axios from 'axios';
import getConfig from "../../utils/getConfig";
import Spinner from '../spinner/Spinner';
import { Link } from 'react-router-dom';
const RoomsInfo = () => {
    const [isLoading, setIsLoading] = useState(false)
    const [openDropdown, setOpenDropdown] = useState(null);
    const [cards, setCards] =useState([])
    const [ubication, setUbication] = useState('')
    const [allData, setAllData] = useState()
    const [allUbications, setAllUbications] = useState([])
    const getRoomsInfo = (param) => {
      // const URL = `${import.meta.env.VITE_API_SERVER}/api/v1/summary/rooms?ubication=${param}`;
      setIsLoading(true)

      const URL = `${import.meta.env.VITE_API_SERVER}/api/v1/summary/rooms?ubication=${param}`;
      axios
          .get(URL, getConfig())
          .then((res) => {
              setCards(res.data.allRooms)
              setAllData(res.data)
              setAllUbications(res.data.allUbications)
              setIsLoading(false)
          })
          .catch((err) => console.log(err));
  
    }
    
useEffect(() => {
  getRoomsInfo(ubication)
}, [ubication])


 const toggleDropdown = (id) => {
    setOpenDropdown((prev) => (prev === id ? null : id));
  };

  const handleClickOutside = (event) => {
    if (!event.target.closest('.dropdown-menu') && !event.target.closest('.dropdown-toggle')) {
      setOpenDropdown(null);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const statusClass = (roomStatus) => {
    switch (roomStatus) {
      case "available":
        return { className: "bg-success", label: "Disponible" }; // Verde
      case "cleaning":
        return { className: "bg-dark", label: "Limpiando" };  // Naranja
      case "occupied":
        return { className: "bg-primary", label: "Ocupada" };       // Azul
      case "repairing":
        return { className: "bg-danger", label: "Hab con Problemas" }; // Rojo
      
      default:
        return { className: "bg-secondary", label: "Desconocido" }; // Respaldo
    }
  };


  return (
    <div>
      <div className="row">
      <div className="col-12 mt-4">
      <div className="card mb-4">
      <div className="card-header pb-0 p-3">
      <h6 className="mb-1">Habitaciones</h6>
      <p className="text-sm">{ubication}</p>
    </div>
    <div className="card-body p-3">
      <div className='d-flex gap-2 align-items-end' style={{flexWrap:'wrap'}}>
      <button onClick={()=>setUbication('')} className={`btn ${ubication==''?'btn-primary':'btn-secondary'} `} type="button">Todos</button>
      {allUbications?.map((botton, index)=>
      <button key={index}  onClick={()=>setUbication(botton)} className={`btn ${ubication==botton?'btn-primary':'btn-secondary'} `} type="button">{botton}</button>
      )
      }
    </div>
    </div>
  </div>
</div>
</div>
{
  isLoading?
<div
  className="row"
  style={{
    justifyContent: 'center',
    paddingTop:100,
    position: 'absolute',
    zIndex: 1000,
    height: '100%',
    width: '99%',
    backdropFilter: 'blur(1px)', // Efecto de desenfoque
    backgroundColor: 'rgba(255, 255, 255, 0.5)', // Fondo semitransparente
    borderRadius: '0.5rem'
  }}
>
  <Spinner />
</div>:''
}
  <div className="row my-4">

    <div className="col-lg-8">
<div className="row">



{cards.map((card) => {
  const { className, label } = statusClass(card.status);

  return (
    <div key={card.id} className="col-md-4 col-4 col-12 mb-4">
      <div className={`card ${className}`}>

        <span className={`mask ${className} opacity-10 border-radius-lg`}></span>
        <div className="card-body p-3 position-relative">
          

          <div className="row">
            <div className="col-7 text-start">
              <div className="icon icon-shape bg-white shadow text-center border-radius-2xl mb-2">
                <i className="fas fa-bed text-dark text-lg" aria-hidden="true"></i>
              </div>
              <h5 className="text-white font-weight-bolder mb-0 mt-2">#{card.roomNumber}</h5>
              <span className="text-white text-sm">{card.roomType}</span>
              <div className="d-flex mt-2">
                <div className="me-3" title="Camas">
                  <i className="fas fa-bed text-white"></i> {card.bedQuantity}
                </div>
                <div title="Capacidad">
                  <i className="fas fa-user-friends text-white"></i> {card.maxOccupancy}
                </div>
              </div>
            </div>
            <div className="col-5 text-end">
              <div className="dropdown mb-3">
                <a
                  className="cursor-pointer"
                  onClick={() => toggleDropdown(card.id)}
                >
                  <i className="fa fa-ellipsis-h text-white"></i>
                </a>
                {openDropdown === card.id && (
                  <ul className="dropdown-menu px-2 py-3 show">
                    <li>
                      <Link className="dropdown-item border-radius-md" to={`/room/${card.id}`}>Ver detalles</Link>
                    </li>
                    <li>
                      <Link to={`/prepare-checking/${card.id}`} className="dropdown-item border-radius-md">Reservar</Link>
                    </li>
                    <li>
                      <a className="dropdown-item border-radius-md" href="#!">Solicitar limpieza</a>
                    </li>
                    <li>
                      <a className="dropdown-item border-radius-md" href="#!">Reportar un Problema</a>
                    </li>
                  </ul>
                )}
              </div>
              <p className="text-white text-sm font-weight-bolder mt-auto mb-0">{label}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
})}

</div>   
</div>
<div className="col-lg-4">
    <div className="row">
    <div className=" col-12 mt-4 mt-lg-0">
          <div className="card shadow h-100">
            <div className="card-header pb-0 p-3">
              <h6 className="mb-0">{!ubication?"Todas":ubication}<span className="me-2 text-sm font-weight-light"> Informe</span></h6>
            </div>
            <div className="card-body pb-0 p-3">
              <ul className="list-group">
                <li className="list-group-item border-0 d-flex align-items-center px-0 mb-0">
  <div className="w-100">
    <div className="d-flex mb-2">
      <span className="me-2 text-sm font-weight-bold text-dark">Reservas Pendientes</span>
      <span className="ms-auto text-sm font-weight-bold">{allData?.pendingReservations}</span>
    </div>
    <div>
      <div className="progress progress-md">
        <div
          className="progress-bar bg-primary"
          role="progressbar"
          aria-valuenow={allData?.pendingReservations}
          aria-valuemin={0}
          aria-valuemax={allData?.allRooms?.length}
          style={{
            width: `${
              allData?.allRooms?.length > 0
                ? (allData?.pendingReservations / allData?.allRooms?.length) * 100
                : 0
            }%`,
          }}
        />
      </div>
    </div>
  </div>
</li>

<li className="list-group-item border-0 d-flex align-items-center px-0 mb-0">
  <div className="w-100">
    <div className="d-flex mb-2">
      <span className="me-2 text-sm font-weight-bold text-dark">Habitaciones Disponibles</span>
      <span className="ms-auto text-sm font-weight-bold">{allData?.available}</span>
    </div>
    <div>
      <div className="progress progress-md">
        <div
          className="progress-bar bg-primary"
          role="progressbar"
          aria-valuenow={allData?.available}
          aria-valuemin={0}
          aria-valuemax={allData?.allRooms?.length}
          style={{
            width: `${
              allData?.allRooms?.length > 0
                ? (allData?.available / allData?.allRooms?.length) * 100
                : 0
            }%`,
          }}
        />
      </div>
    </div>
  </div>
</li>
<li className="list-group-item border-0 d-flex align-items-center px-0 mb-0">
  <div className="w-100">
    <div className="d-flex mb-2">
      <span className="me-2 text-sm font-weight-bold text-dark">Habitaciones Ocupadas</span>
      <span className="ms-auto text-sm font-weight-bold">{allData?.occupied}</span>
    </div>
    <div>
      <div className="progress progress-md">
        <div
          className="progress-bar bg-primary"
          role="progressbar"
          aria-valuenow={allData?.occupied}
          aria-valuemin={0}
          aria-valuemax={allData?.allRooms?.length}
          style={{
            width: `${
              allData?.allRooms?.length > 0
                ? (allData?.occupied / allData?.allRooms?.length) * 100
                : 0
            }%`,
          }}
        />
      </div>
    </div>
  </div>
</li>
<li className="list-group-item border-0 d-flex align-items-center px-0 mb-0">
  <div className="w-100">
    <div className="d-flex mb-2">
      <span className="me-2 text-sm font-weight-bold text-dark">Habitaciones en Limpieza</span>
      <span className="ms-auto text-sm font-weight-bold">{allData?.cleaning}</span>
    </div>
    <div>
      <div className="progress progress-md">
        <div
          className="progress-bar bg-primary"
          role="progressbar"
          aria-valuenow={allData?.cleaning}
          aria-valuemin={0}
          aria-valuemax={allData?.allRooms?.length}
          style={{
            width: `${
              allData?.allRooms?.length > 0
                ? (allData?.cleaning / allData?.allRooms?.length) * 100
                : 0
            }%`,
          }}
        />
      </div>
    </div>
  </div>
</li>
<li className="list-group-item border-0 d-flex align-items-center px-0 mb-0">
  <div className="w-100">
    <div className="d-flex mb-2">
      <span className="me-2 text-sm font-weight-bold text-dark">Habitaciones en Reparación</span>
      <span className="ms-auto text-sm font-weight-bold">{allData?.repairing}</span>
    </div>
    <div>
      <div className="progress progress-md">
        <div
          className="progress-bar bg-danger"
          role="progressbar"
          aria-valuenow={allData?.repairing}
          aria-valuemin={0}
          aria-valuemax={allData?.allRooms?.length}
          style={{
            width: `${
              allData?.allRooms?.length > 0
                ? (allData?.repairing / allData?.allRooms?.length) * 100
                : 0
            }%`,
          }}
        />
      </div>
    </div>
  </div>
</li>
              </ul>
            </div>
            <div className="card-footer pt-0 p-3 d-flex align-items-center">
              <div className="w-60">
                <p className="text-sm">
                 
                </p>
              </div>
              <div className="w-40 text-end">
                <a className="btn btn-dark mb-0 text-end" >Ver reporte completo</a>
              </div>
            </div>
          </div>
        </div>
        <div className=" col-12 mt-4 mt-lg-4">
        <Tasks/>
        </div>
        </div>
      </div>
      </div>
      </div>
   
  )
}

export default RoomsInfo