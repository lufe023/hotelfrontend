import axios from 'axios';
import React, { useEffect, useState } from 'react'
import getConfig from '../../utils/getConfig';
import Spinner from '../spinner/Spinner';
import { format } from 'date-fns';
import { es } from 'date-fns/locale'; // Importación directa de la localización

const Bookin = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [reservations, setReservations] = useState()

  //selector de clase segun el estado
  const statusClass = (roomStatus) => {
    switch (roomStatus) {
      case "Pending":
        return { className: "bg-warning", label: "Pendiente" };
      case "Approved":
        return { className: "bg-success", label: "Aprobado" };  
      
      default:
        return { className: "bg-secondary", label: "Desconocido" }; // Respaldo
    }
  };

  const getReservatiosToWork = () =>{
    const URL = `${import.meta.env.VITE_API_SERVER}/api/v1/reservations/getReservationsToWork`;
    axios
        .get(URL, getConfig())
        .then((res) => {
          setIsLoading(false)
          setReservations(res.data);
        })
        .catch((err) => console.log(err));
  }

  useEffect(() => {
    getReservatiosToWork()
  }, [])


  const formatDate = (dateString) => {
    const date = new Date(dateString);
    date.setMinutes(date.getMinutes() + date.getTimezoneOffset()); // Ajuste manual
    return format(date, "dd 'de' MMM 'del' yy", { locale: es });
  };


  console.log(reservations)

  return (
  <div className="col-lg-12 col-md-6 mb-md-0 mb-4">
 <div className="card mb-4">
  <div className="card-header pb-0">
    <h6>Tabla de Clientes</h6>
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
  <div className="card-body px-0 pt-0 pb-2">
    <div className="table-responsive p-0">
      <table className="table align-items-center mb-0">
        <thead>
          <tr>
            <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">Huesped</th>
            <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">Tipo</th>
            <th className="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">Status</th>
            <th className="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">Estadía</th>
          </tr>
        </thead>
        <tbody>
          
          {
            reservations?.results.map((reservation)=> 
                     
       {
        const { className, label } = statusClass(reservation.status);
        return (
       
          <tr key={reservation.id}>
            <td>
              <div className="d-flex px-2 py-1">
                <div className="d-flex flex-column justify-content-center">
                  <h6 className="mb-0 text-sm">{reservation.guest.firstName}</h6>
                  <p className="text-xs text-secondary mb-0">{reservation.guest.email}</p>
                  <p className="text-xs text-secondary mb-0">{reservation.guest.phone}</p>
                </div>
              </div>
            </td>
            <td>
              <p className="text-xs font-weight-bold mb-0">{reservation.Room.roomType}</p>
              <p className="text-xs text-secondary mb-0">No. {reservation.Room.roomNumber}</p>
            </td>
            <td className="align-middle text-center text-sm">
              <span className={`badge badge-sm ${className}`}>{label}</span>
            </td>
            <td className="align-middle">
            <p className="text-xs text-secondary mb-0"><b>Entra: </b>{formatDate(reservation.checkIn)}</p>
         
            <p className="text-xs text-secondary mb-0"> <b>Sale: </b>{formatDate(reservation.checkOut)}</p>
            </td>
          </tr>
          )
}
            )
          }
        
        </tbody>
      </table>
    </div>
  </div>
</div>

  </div>
  )
}

export default Bookin