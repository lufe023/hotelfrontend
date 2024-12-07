import axios from 'axios'
import React, { useEffect, useState } from 'react'
import getConfig from '../../utils/getConfig'

const History = ({ id }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [history, setHistory] = useState([])

  // Función para obtener el historial de la habitación
  const getRoomHistory = (id) => {
    setIsLoading(true)
    const URL = `${import.meta.env.VITE_API_SERVER}/api/v1/rooms/history/${id}`;
    axios
      .get(URL, getConfig())
      .then((res) => {
        setHistory(res.data) // Asumimos que la respuesta contiene los datos en 'res.data'
        setIsLoading(false)
      })
      .catch((err) => {
        console.error(err);
        setIsLoading(false);
      });
  }

  // Obtener el historial cuando el id cambie
  useEffect(() => {
    if (id) {
      getRoomHistory(id)
    }
  }, [id]);

  // Función para obtener el color según el estado de la reserva
  const getReservationStatusColor = (status) => {
    switch (status) {
      case 'Pending':
        return 'text-warning'; // Pendiente
      case 'Approved':
        return 'text-success'; // Aprobada
      case 'Rejected':
        return 'text-danger'; // Rechazada
      case 'Cancelled':
        return 'text-secondary'; // Cancelada
      case 'Completed':
        return 'text-info'; // Completada
      case 'No show':
        return 'text-muted'; // No se presentó
      case 'Expired':
        return 'text-dark'; // Expirada
      default:
        return 'text-secondary'; // Color por defecto
    }
  }

  return (
    <div className="card">
      <div className="card-header pb-0">
        <h6>Historial</h6>
        <p className="text-sm">Sobre esta habitación</p>
      </div>
      <div className="card-body  p-3 ps--scrolling-y scroll scrollHistory" style={{height:300, overflow:'scroll'}} >
        <div className="timeline timeline-one-side">
          {isLoading ? (
            <p>Cargando historial...</p>
          ) : (
            history?.map((event, index) => (
              <div className="timeline-block mb-3" key={index}>
                <span className="timeline-step">
                  {event.type === "Reservation" ? (
                    <i className="ni ni-bell-55 text-success text-gradient" />
                  ) : event.type === "ServiceReservation" ? (
                    <i className="fas fa-concierge-bell text-danger text-gradient" />
                  ) : (
                    <i className="ni ni-album-2 text-info text-gradient" />
                  )}
                </span>
                <div className="timeline-content">
                  <h6 className="text-dark text-sm font-weight-bold mb-0">
                    {event.type === "Reservation"
                      ? `Reservada`
                      : event.type === "ServiceReservation"
                      ? `Servicio a la Habitación`
                      : `Problema Reportado`}
                  </h6>
                  <p className="text-secondary font-weight-bold text-xs mt-1 mb-0">
                    {event.date}
                  </p>
                  <p className="text-sm mt-2">{event.description}</p>

                  {/* Mostrar el estado de la reserva con color */}
                  {event.type === "Reservation" && (
                    <p className={`text-sm font-weight-bold mt-2 ${getReservationStatusColor(event.status)}`}>
                      {event.status}
                    </p>
                  )}

                  {/* Verificar si existen 'service_reservations' y mostrarlas */}
                  {event.type === "Reservation" && event.data?.service_reservations?.length > 0 && (
                    <div className='font-italic' style={{marginLeft:'15px'}}>
                      <h6 className="text-dark text-sm font-weight-bold">Servicios a la habitación:</h6>
                      {event.data.service_reservations.map((service, index) => (
                        <div key={index} className="service-item">
                          <p className="text-sm">
                            <strong>{service.service.name}</strong> - Precio:  ${new Intl.NumberFormat('en-US').format(service.totalPrice)}
                          </p>
                          <p className="text-xs">{service.service.description}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default History;
