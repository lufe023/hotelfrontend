import React, { useEffect, useState } from "react";
import axios from "axios";
import getConfig from "../../utils/getConfig";
import Spinner from "../spinner/Spinner";
import FindUser from "../users/FindUser";
import Swal from "sweetalert2";

const CheckIn = ({id, room, getRoomsInfo}) => {


  const [isLoading, setIsLoading] = useState(false);
  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
  const [selectedUser, setSelectedUser] = useState("");
  const [reservationError, setReservationError] = useState("");
  const [totalPrice, setTotalPrice] = useState(0);
  const [results, setResults] = useState([])
  const [status, setStatus] = useState('Approved')
  const handleReservation = (e) => {

    const formatDateTime = (date, time) => `${date}T${time}`;


    e.preventDefault();
    
    if (!selectedUser || !checkInDate || !checkOutDate) {
      setReservationError("Por favor, completa todos los campos.");
      return;
    }
    
    setIsLoading(true)
const reservationData = {
  userId: selectedUser.id,
  roomId: id,
  checkIn: formatDateTime(checkInDate, "13:00:00"),
  checkOut: formatDateTime(checkOutDate, "12:00:00"),
  status,
};

    const URL = `${import.meta.env.VITE_API_SERVER}/api/v1/reservations`;
    axios
      .post(URL, reservationData, getConfig())
      .then(() => {
        Swal.fire({
          icon: "success",
          title: `Reservaciónrealizada exitosamente`,
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
        });
        getRoomsInfo(id); 
        setSelectedUser("");
        setCheckInDate("");
        setCheckOutDate("");
        setReservationError("");
        setTotalPrice(0);
        setResults([]);
        setIsLoading(false)
      })
      .catch((err) => {
        const errorMessage = err.response?.data?.message || "Error al realizar la reservación.";
        setReservationError(errorMessage);
        setIsLoading(false);
      });
  };

  // Calcula el total del precio basado en las fechas seleccionadas
  const calculateTotalPrice = () => {
    if (checkInDate && checkOutDate && room?.pricePerNight) {
      const checkIn = new Date(checkInDate);
      const checkOut = new Date(checkOutDate);

      // Calcula la diferencia en días
      const diffInTime = checkOut - checkIn;
      const diffInDays = Math.floor(diffInTime / (1000 * 60 * 60 * 24));
      // Evita cálculos negativos
      if (diffInDays > 0) {
        setTotalPrice(diffInDays * room.pricePerNight);
      } else {
        setTotalPrice(0);
      }
    } else {
      setTotalPrice(0);
    }
  };

  // Actualiza el precio total cada vez que cambian las fechas
  useEffect(() => {
    calculateTotalPrice();
  }, [checkInDate, checkOutDate, room]);

  return (
<>
        {isLoading && (
          <div
            className="row"
            style={{
              justifyContent: "center",
              paddingTop: 100,
              position: "absolute",
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

        {room && (
                <div className="card">
                  <div className="card-header pb-0">
                    <h6>Hacer una Reservación</h6>
                  </div>
                  <div className="card-body">
                    <form onSubmit={handleReservation}>
                <div className=" mb-3">
                <FindUser setResults={setResults} selectedUser={selectedUser}/>
                <ul className="list-group shadow-sm">
                {results?.map((user)=>(
                <li key={user.id} className={`list-group-item border-0 d-flex align-items-center px-2 mb-2 ${selectedUser===user?'bg-primary':''}`}>
                <div className="avatar me-3">
                <img
  src={user.picture || `${import.meta.env.VITE_API_SERVER}/api/v1/images/images/nobody.jpg`}
  alt="Avatar del usuario"
  className="border-radius-lg shadow"
/>
                </div>
                <div className="d-flex align-items-start flex-column justify-content-center">
                  <h6 className="mb-0 text-sm">{user.firstName}</h6>
                  <p className="mb-0 text-xs">{user.phone}</p>
                </div>
              <a className="btn btn-link pe-3 ps-0 mb-0 ms-auto" onClick={()=>setSelectedUser(user)}>Seleccionar</a>
              </li>
                ))}
                </ul>
            </div>
                      <div className="mb-3">
                        <label htmlFor="checkInDate" className="form-label">
                          Fecha de Check-In
                        </label>
                        <input
                          type="date"
                          id="checkInDate"
                          className="form-control"
                          value={checkInDate}
                          onChange={(e) => setCheckInDate(e.target.value)}
                        />
                      </div>
                      
                      <div className="mb-3">
                        <label htmlFor="checkOutDate" className="form-label">
                          Fecha de Check-Out
                        </label>
                        <input
                          type="date"
                          id="checkOutDate"
                          className="form-control"
                          value={checkOutDate}
                          onChange={(e) => setCheckOutDate(e.target.value)}
                        />
                      </div>
                      <div className="mb-3">
                        <div className="form-group">
                        <label>Estado</label>
                        <select 
                          className="form-control" 
                          value={status} 
                          onChange={(e) => setStatus(e.target.value)}
                          >
                          <option value="Approved">Aprobada (Cliente Pagó)</option>
                          <option value="Pending">Pendiente</option>
                        </select>
                      </div>
                      </div>
                      {reservationError && (
                        <p className="text-danger">{reservationError}</p>
                      )}
                      <div className="mb-3">
                        <strong>Total:</strong> ${totalPrice}
                      </div>
                      <button type="submit" className="btn btn-primary">
                        Reservar
                      </button>
                    </form>
                  </div>
                </div>
        )}
</>
  );
};

export default CheckIn;
