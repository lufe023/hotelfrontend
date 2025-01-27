import React, { useEffect, useState } from 'react'


import { useMenu } from '../../utils/MenuContext';
import Aside from '../aside';
import Navbar from '../Navbar';
import axios from 'axios';
import getConfig from '../../utils/getConfig';
import { useParams } from 'react-router-dom';
import Gallery from '../gallery/Gallery';
import GalleryUploader from '../gallery/GalleryUploader';
import AmenitiesUpdate from './AmenitiesUpdate';
import RoomDetailsUpdate from './RoomDetailsUpdate';
import PendingReservations from './PendingReservations';
import History from './History';
import CheckIn from '../dashboard/CheckIn';

const Rooms = () => {
const {id} = useParams()
  const [isLoading, setIsLoading] = useState(false)
  const [room, setRoom] =useState([])
  const [editing, setEditing] = useState(false)

  const getRoomsInfo = (id) => {
    setIsLoading(true)
    const URL = `${import.meta.env.VITE_API_SERVER}/api/v1/rooms/${id}`;
    axios
        .get(URL, getConfig())
        .then((res) => {
          setRoom(res.data)
            
        })
        .catch((err) => console.log(err));
  }

  useEffect(() => {
    getRoomsInfo(id)
  }, [])

    const { isPinned } = useMenu(); // Ahora esto funcionará correctamente
  return (
    <div className={`g-sidenav-show  ${isPinned ? 'g-sidenav-pinned' : ''}`}>
    <Aside/>
    <main className="main-content position-relative max-height-vh-100 h-100 border-radius-lg">
      <Navbar />
      <div className="container-fluid py-4">
        <div className="row">
      <div className="col-lg-8 col-md-6 mb-md-0 mb-4">

  <div className="card rounded-4 shadow-sm" style={{marginBottom:20}}>
{
  editing?
  <RoomDetailsUpdate room={room} getRoomsInfo={getRoomsInfo} setEditing={setEditing}/>
  :
  <div className="card-header  rounded-top-4 pb-2">
    <div className="card-tools  ms-auto text-end">
    <button className="btn btn-link px-3 mb-0 bg-primary text-white" onClick={()=>setEditing(true)}><i className="fas fa-pencil-alt me-2 "  /> Editar</button>
</div>
    <h6 className="mb-1">Habitación #{room?.roomNumber}</h6>
    <p className="text-sm mb-0">
      <i className="fas fa-map-marker-alt me-2"></i>{room?.ubication}
    </p>
  </div>
}

  <div className="card-body p-4">
    <div className="d-flex align-items-center gap-4 mb-3">
      {/* Ícono de habitación */}
      <div
        className="icon bg-primary text-white rounded-circle d-flex align-items-center justify-content-center shadow-sm"
        style={{ width: "50px", height: "50px", aspectRatio:1 }}
      >
        <i className="fas fa-bed"></i>
      </div>
      <div>
        <h5 className="text-dark mb-1">{room?.roomType}</h5>
        <p className="text-muted mb-0">{room?.description}</p>
      </div>
    </div>
    <div className="d-flex flex-column gap-4">
  {/* Amenidades disponibles */}
  <div>
    <h5 className="mb-3">Amenidades Disponibles</h5>
    <div className="d-flex justify-content-start gap-5" style={{ flexWrap: "wrap" }}>
      <div className="text-center">
        <i className="fas fa-bed text-primary mb-1" style={{ fontSize: "15px" }}></i>
        <p className="text-sm mb-0">{room.bedQuantity} cama{room.bedQuantity > 1 ? "s" : ""}</p>
      </div>
      <div className="text-center">
        <i className="fas fa-user-friends text-primary mb-1" style={{ fontSize: "15px" }}></i>
        <p className="text-sm mb-0">{room.maxOccupancy} persona{room.maxOccupancy > 1 ? "s" : ""}</p>
      </div>
      {room.hotWater && (
  <div className="text-center">
    <i className="fas fa-temperature-high text-primary mb-1" style={{ fontSize: "15px" }}></i>
    <p className="text-sm mb-0">Agua Caliente</p>
  </div>
)}
    {room.privateBathroom && (
    <div className="text-center">
      <i className="fas fa-bath text-primary mb-1" style={{ fontSize: "15px" }}></i>
      <p className="text-sm mb-0">Baño Privado</p>
    </div>
  )}
      {room.wifi && (
        <div className="text-center">
          <i className="fas fa-wifi text-primary mb-1" style={{ fontSize: "15px" }}></i>
          <p className="text-sm mb-0">Acceso a Wifi</p>
        </div>
      )}
      {room.landscapeView && (
        <div className="text-center">
          <i className="fas fa-mountain text-primary mb-1" style={{ fontSize: "15px" }}></i>
          <p className="text-sm mb-0">Vista a Paisaje</p>
        </div>
      )}
      {room.balcony && (
        <div className="text-center">
          <i className="fas fa-hotel text-primary mb-1" style={{ fontSize: "15px" }}></i>
          <p className="text-sm mb-0">Balcón</p>
        </div>
      )}
      {room.tv && (
        <div className="text-center">
          <i className="fas fa-tv text-primary mb-1" style={{ fontSize: "15px" }}></i>
          <p className="text-sm mb-0">TV</p>
        </div>
      )}
      {room.minibar && (
        <div className="text-center">
          <i className="fas fa-wine-bottle text-primary mb-1" style={{ fontSize: "15px" }}></i>
          <p className="text-sm mb-0">Minibar</p>
        </div>
      )}
      {room.coffeeMaker && (
        <div className="text-center"> 
          <i className="fas fa-coffee text-primary mb-1" style={{ fontSize: "15px" }}></i>
          <p className="text-sm mb-0">Cafetera</p>
        </div>
      )}
          {room.minibar && (
            <div className="text-center">
              <i className="fas fa-glass-cheers text-primary mb-1" style={{ fontSize: "15px" }}></i>
              <p className="text-sm mb-0">Minibar</p>
            </div>
          )}
      {room.airConditioning && (
        <div className="text-center">
          <i className="fas fa-snowflake text-primary mb-1" style={{ fontSize: "15px" }}></i>
          <p className="text-sm mb-0">Aire Acondicionado</p>
        </div>
      )}
      {room.safeBox && (
       <div className="text-center">
         <i className="fas fa-lock text-primary mb-1" style={{ fontSize: "15px" }}></i>
         <p className="text-sm mb-0">Caja Fuerte</p>
       </div>
     )}

      {room.breakfastIncluded && (
        <div className="text-center">
          <i className="fas fa-bread-slice text-primary mb-1" style={{ fontSize: "15px" }}></i>
          <p className="text-sm mb-0">Desayuno Incluido</p>
        </div>
      )}

    {room.parking && (
        <div className="text-center">
          <i className="fas fa-parking text-primary mb-1" style={{ fontSize: "15px" }}></i>
          <p className="text-sm mb-0">Parqueo</p>
        </div>
      )}
    {room.poolAccess && (
        <div className="text-center">
          <i className="fas fa-swimmer text-primary mb-1" style={{ fontSize: "15px" }}></i>
          <p className="text-sm mb-0">Acceso a Piscina</p>
        </div>
      )}

    {room.gymAccess && (
        <div className="text-center">
          <i className="fas fa-dumbbell text-primary mb-1" style={{ fontSize: "15px" }}></i>
          <p className="text-sm mb-0">Acceso a gimnasio</p>
        </div>
      )}


    </div>
  </div>
  <hr className='bg-primary'/>
  <div>
    <h5 className="mb-3">Amenidades No Disponibles</h5>
    <div className="d-flex justify-content-start gap-5" style={{ flexWrap: "wrap" }}>
      {!room.hotWater && (
        <div className="text-center">
          <i className="fas fa-temperature-high text-dark mb-1" style={{ fontSize: "15px" }}></i>
          <p className="text-sm mb-0">Agua Caliente</p>
        </div>
      )}
      {!room.privateBathroom && (
    <div className="text-center">
      <i className="fas fa-bath text-dark mb-1" style={{ fontSize: "15px" }}></i>
      <p className="text-sm mb-0">Baño Privado</p>
    </div>
  )}
      {!room.wifi && (
        <div className="text-center">
          <i className="fas fa-wifi text-dark mb-1" style={{ fontSize: "15px" }}></i>
          <p className="text-sm mb-0">Acceso a Wifi</p>
        </div>
      )}
      {!room.landscapeView && (
        <div className="text-center">
          <i className="fas fa-mountain text-dark mb-1" style={{ fontSize: "15px" }}></i>
          <p className="text-sm mb-0">Vista a Paisaje</p>
        </div>
      )}
      {!room.balcony && (
        <div className="text-center">
          <i className="fas fa-hotel text-dark mb-1" style={{ fontSize: "15px" }}></i>
          <p className="text-sm mb-0">Balcón</p>
        </div>
      )}
      {!room.tv && (
        <div className="text-center">
          <i className="fas fa-tv text-dark mb-1" style={{ fontSize: "15px" }}></i>
          <p className="text-sm mb-0">TV</p>
        </div>
      )}
      {!room.minibar && (
        <div className="text-center">
          <i className="fas fa-glass-cheers text-dark mb-1" style={{ fontSize: "15px" }}></i>
          <p className="text-sm mb-0">Minibar</p>
        </div>
      )}
       {!room.coffeeMaker && (
        <div className="text-center"> 
          <i className="fas fa-coffee text-dark mb-1" style={{ fontSize: "15px" }}></i>
          <p className="text-sm mb-0">Cafetera</p>
        </div>
      )}
      {!room.airConditioning && (
        <div className="text-center">
          <i className="fas fa-snowflake text-dark mb-1" style={{ fontSize: "15px" }}></i>
          <p className="text-sm mb-0">Aire Acondicionado</p>
        </div>
      )}
      {!room.safeBox && (
        <div className="text-center">
          <i className="fas fa-lock text-dark mb-1" style={{ fontSize: "15px" }}></i>
          <p className="text-sm mb-0">Caja Fuerte</p>
        </div>
      )}

      {!room.breakfastIncluded && (
        <div className="text-center">
          <i className="fas fa-bread-slice text-dark mb-1" style={{ fontSize: "15px" }}></i>
          <p className="text-sm mb-0">Desayuno No inluido</p>
        </div>
      )}

    {!room.parking && (
        <div className="text-center">
          <i className="fas fa-parking text-dark mb-1" style={{ fontSize: "15px" }}></i>
          <p className="text-sm mb-0">Parqueo</p>
        </div>
      )}

    {!room.poolAccess && (
        <div className="text-center">
          <i className="fas fa-swimmer text-dark mb-1" style={{ fontSize: "15px" }}></i>
          <p className="text-sm mb-0">Acceso a Piscina</p>
        </div>
      )}

    {!room.gymAccess && (
        <div className="text-center">
          <i className="fas fa-dumbbell text-dark mb-1" style={{ fontSize: "15px" }}></i>
          <p className="text-sm mb-0">Acceso a gimnasio</p>
        </div>
      )}

    </div>
  </div>
</div>
  </div>
</div>
  
{
  room?.reservations?.length > 0 && (<PendingReservations setTriger={set} reservations={room?.reservations}/>)
 }
<div className="row" style={{marginTop:20}}>
      <div >
        <div className='card rounded-4 shadow-sm"'>
          <div className="card-body">
        {room?.gallery?.gallery_images.length >0?
        <Gallery images={room?.gallery?.gallery_images} getRoomsInfo={getRoomsInfo} roomId={id}/>
        :''
        }

        <GalleryUploader
        galleryId={room.galleryId || null} // Si `galleryId` está disponible, se pasa; de lo contrario, null
        galleryName={`Galería de Habitación ${room.roomNumber || 'Sin Número'}`} // Nombre dinámico
        roomId={room.id} // Siempre se pasa el `roomId`
        getRoomsInfo={getRoomsInfo} />
        </div>
        </div>


 </div>
  </div>
</div>

{/* columna derecha */}
  <div className="col-lg-4 col-md-6">
  {/*Checkin*/}
  
  {room &&(<CheckIn id={id} room={room} getRoomsInfo={getRoomsInfo}/>)}


{/*Historial de la habitacion*/}
<div style={{marginTop:'20px'}}>
  {room && id && (
    <History id={room.id}/>
  )}

  </div>

  {room &&(
<div style={{marginTop:'20px'}} id="actualizar">
<AmenitiesUpdate room={room} getRoomsInfo={getRoomsInfo} />
</div>)
}


      </div>
    </div>
  </div>
    </main>
  </div>
  )
}

export default Rooms