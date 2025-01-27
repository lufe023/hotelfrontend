import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import axios from 'axios';
import getConfig from '../../utils/getConfig';
import Spinner from '../spinner/Spinner';
import RoomDetailsUpdate from './RoomDetailsUpdate';
import PendingReservations from './PendingReservations';
import Gallery from '../gallery/Gallery';
import GalleryUploader from '../gallery/GalleryUploader';
import Amenities from './Amenities';
import CheckIn from '../dashboard/CheckIn';
import History from './History';
import AmenitiesUpdate from './AmenitiesUpdate';
import Aside from '../aside';
import Navbar from '../Navbar';
import { useMenu } from '../../utils/MenuContext';
import RoomIssuesList from './RoomIssuesList';
import RoomCleaningsList from './RoomCleaningsList';

const Rooms = () => {
  const [hasScrolled, setHasScrolled] = useState(false);
  const { id } = useParams();
  const location = useLocation(); // Captura la información de la URL actual
  const queryParams = new URLSearchParams(location.search);
  let action = queryParams.get("action"); // Lee el parámetro "action"
  const [isLoading, setIsLoading] = useState(false);
  const [room, setRoom] = useState(null);
  const [editing, setEditing] = useState(false);
  const [triger, setTriger] = useState(false);

  const { isPinned } = useMenu(); // Controla el estado del menú

  const getRoomsInfo = (id) => {

    setIsLoading(true);
    const URL = `${import.meta.env.VITE_API_SERVER}/api/v1/rooms/${id}`;
    axios
      .get(URL, getConfig())
      .then((res) => {
        setRoom(res.data);
        setIsLoading(false);
      })
      .catch((err) =>{
        setIsLoading(false);
         console.log(err)});
  };

  useEffect(() => {
    getRoomsInfo(id);
  }, [id,triger]);

  // Efecto para hacer scroll a la sección correspondiente
  useEffect(() => {

    if (action && room && !hasScrolled) {
      // Esperamos medio segundo para que el navegador complete el scroll
      setTimeout(() => {
        let targetElement = document.getElementById(action); // Acción es el id al que hacer scroll (como 'history')
  
        if (targetElement) {
          // Usamos getBoundingClientRect() para obtener la posición del elemento dentro del viewport
          const rect = targetElement.getBoundingClientRect();
  
          // Ajustamos el scroll después de que el navegador haya ido al top del elemento
          window.scrollTo({
            top: rect.top + window.scrollY - 110, // Ajusta el scroll teniendo en cuenta el margen de 50px
            behavior: "smooth", // Desplazamiento suave
          });
  
          // Agregar la clase para la animación
          targetElement.classList.add('card-highlight');
  
          // Eliminar la clase después de que la animación haya terminado (0.3 segundos)
          setTimeout(() => {
            targetElement.classList.remove('card-highlight');
            
          }, 300); // Duración de la animación

          setTimeout(() => {
          // Marcar que el scroll ya se ha realizado
          setHasScrolled(true);
            
          }, 350); // Duración de la animación
        }
      }, 500); // Espera un poco para asegurarse de que el componente haya sido renderizado
      
    }

      
  }, [action, room, hasScrolled]);
  

  const statusClass = (roomStatus) => {
    switch (roomStatus) {
      case "available":
        return { className: "", label: "Disponible" };
      case "cleaning":
        return { className: "bg-dark text-white  ", label: "Limpiando" };
      case "occupied":
        return { className: "bg-primary", label: "Reservada" };
      case "pendingReservation":
        return { className: "bg-warning", label: "Reservacion Pendiente" };
      case "repairing":
        return { className: "bg-danger", label: "Hay un problema reportado" };
      default:
        return { className: "bg-secondary", label: "Desconocido" };
    }
  };

  const { className, label } = statusClass(room?.status || "");

  return (
    <div className={`g-sidenav-show ${isPinned ? "g-sidenav-pinned" : ""}`}>
      <Aside />
        <Navbar />
        {isLoading && (
            <div
              className="row d-flex align-items-center justify-content-center"
              style={{
                justifyContent: "center",
                position: "fixed",
                zIndex: 1000,
                height: "100%",
                width: "100%",
                backdropFilter: "blur(1px)",
                backgroundColor: "rgba(255, 255, 255, 0.5)",
                borderRadius: "0.5rem",
              }}
            >
              <Spinner />
            </div>
          )}
      <main className="main-content position-relative max-height-vh-100 h-100 border-radius-lg pt-7">
        <div className="container-fluid py-4 ">
        
          {room && (
            <div className="row">
              <div className="col-lg-8 col-md-6 mb-md-0 mb-4">
                <div className="card rounded-4 shadow-sm" style={{ marginBottom: 20 }}>
                  {editing ? (
                    <RoomDetailsUpdate room={room} getRoomsInfo={getRoomsInfo} setEditing={setEditing} />
                  ) : (
                    <div className={`card-header ${className} rounded-top-4 pb-2`}>
                      <div className="card-tools ms-auto text-end">
                        <button className="btn btn-link px-3 mb-0 bg-primary text-white" onClick={() => setEditing(true)}>
                          <i className="fas fa-pencil-alt me-2" /> Editar
                        </button>
                      </div>
                      <h6 className={`mb-1 ${className}`}>Habitación #{room?.roomNumber} <span className='text-xs'>( {label + " " +room?.pricePerNight } )</span></h6>
                      <p className="text-sm mb-0">
                        {console.log(room)}
                        <i className="fas fa-map-marker-alt me-2"></i>{room?.areas.name}
                      </p>
                    </div>
                  )}

                  <div className="card-body p-4">
                    <div className="d-flex align-items-center gap-4 mb-3">
                      <div
                        className="icon bg-primary text-white rounded-circle d-flex align-items-center justify-content-center shadow-sm"
                        style={{ width: "50px", height: "50px", aspectRatio: 1 }}
                      >
                        <i className="fas fa-bed"></i>
                      </div>
                      <div>
                        <h5 className="text-dark mb-1">{room?.roomType}</h5>
                        <p className="text-muted mb-0">{room?.description}</p>
                      </div>
                    </div>
                    <div className="d-flex flex-column gap-4">
                      <Amenities room={room} />
                    </div>
                  </div>
                </div>
                {room?.reservations?.length > 0 && <PendingReservations setTriger={setTriger} reservations={room.reservations} />}
                <div className="" id='gallery' style={{ marginTop: 20 }}>
                  <div>
                    <div className="card rounded-4 shadow-sm">
                      <div className="card-body">
                        {room?.gallery?.gallery_images.length > 0 && (
                          <Gallery images={room?.gallery?.gallery_images} getRoomsInfo={getRoomsInfo} roomId={id} />
                        )}

                        <GalleryUploader
                          galleryId={room.galleryId || null}
                          galleryName={`Galería de Habitación ${room.roomNumber || "Sin Número"}`}
                          roomId={room.id}
                          getRoomsInfo={getRoomsInfo}
                        />
                      </div>
                    </div>
                  </div>
                  <RoomCleaningsList setTriger={setTriger} roomId={room.id} roomCleanings={room?.room_cleanings}/>
                </div>
              </div>
              <div className="col-lg-4 col-md-6" id="checkin">
                {room && <CheckIn id={id} room={room} getRoomsInfo={getRoomsInfo} />}
                <div style={{ marginTop: "20px" }} id="history">
                  {room && id && <History id={room.id} triger={triger} setTriger={setTriger} />}
                </div>
                {room && (
                  <div style={{ marginTop: "20px" }} id="actualizar">
                    <AmenitiesUpdate room={room} getRoomsInfo={getRoomsInfo} />
                  </div>
                )}
                  <RoomIssuesList setTriger={setTriger} getRoomsInfo={getRoomsInfo} roomId={room.id} roomIssues={room.room_issues}/>

              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Rooms;
