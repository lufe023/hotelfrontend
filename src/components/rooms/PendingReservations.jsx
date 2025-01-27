import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { es } from 'date-fns/locale'; // Importación directa de la localización
import axios from 'axios';
import getConfig from '../../utils/getConfig';
import Swal from 'sweetalert2';

const PendingReservations = ({ reservations, setTriger }) => {
  const [openDropdown, setOpenDropdown] = useState();

  const toggleDropdown = (id) => {
    setOpenDropdown((prev) => (prev === id ? null : id));
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "Pending":
        return "bg-gradient-warning";
      case "Approved":
        return "bg-gradient-success";
      case "Rejected":
        return "bg-gradient-danger";
      case "Cancelled":
        return "bg-gradient-secondary";
      case "Completed":
        return "bg-gradient-primary";
      case "No show":
        return "bg-gradient-dark";
      case "Expired":
        return "bg-gradient-info";
      default:
        return "bg-gradient-warning";
    }
  };

  const handleClickOutside = (event) => {
    if (
      !event.target.closest('.dropdown-menu') &&
      !event.target.closest('.dropdown-toggle')
    ) {
      setOpenDropdown(null);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    date.setMinutes(date.getMinutes() + date.getTimezoneOffset()); // Ajuste manual
    return format(date, "dd '-' MM ' -' yyyy", { locale: es });
  };

  const handleStatusChange = (id, data) => {
    // Aquí se haría la petición al servidor para cambiar el estado de la reserva
    const URL = `${import.meta.env.VITE_API_SERVER}/api/v1/reservations/${id}`;
    axios
      .patch(URL, data,getConfig())
      .then((res) => {
        if (res.status === 200) {
                  Swal.fire({
                    icon: "success",
                    title: `se ha enviado un mensaje al cliente con la actualización de la reserva`,
                    toast: true,
                    position: "top-end",
                    showConfirmButton: false,
                    timer: 3000,
                    timerProgressBar: true,
                  });
                }
                setTriger((prev) => !prev);
      })
      .catch((err) =>{
        console.log(err)});
  };

  return (
    <div className="" id='pending'>
      <div className="card mb-4">
        <div className="card-header pb-0">
          <h6>Reservaciones Pendientes </h6>
        </div>
        <div className="card-body px-0 pt-0 pb-2">
          <div className="table-responsive p-0" style={{minHeight:300}}>
            <table className="table align-items-center mb-0 table-hover">
              <thead>
                <tr>
                  <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">
                    Usuario
                  </th>
                  <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">
                    Estadía
                  </th>
                  
                  <th className="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">
                    Estado
                  </th>
                  <th
                    className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7"
                    style={{ width: 20 }}
                  >Acciones</th>
                </tr>
              </thead>
              <tbody>
                {reservations?.map((reservation) => (
                  <tr key={reservation.id}>
                    <td>
                      <div className="d-flex px-2 py-1">
                        <div className="d-flex flex-column justify-content-center">
                          <h6 className="mb-0 text-sm">
                            {reservation.guest.firstName} {reservation.guest.lastName}
                          </h6>
                          <p className="text-xs text-secondary mb-0">
                            {reservation.guest.email}
                          </p>
                          <p className="text-xs text-secondary mb-0">
                            {reservation.guest.phone}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="text-sm">
                    <div className="d-flex px-2 py-1 ">

                        <div className="col-4 text-right" >

                          <small className='d-block' >Entrada: </small>
                          <small className='d-block'>Salida: </small>

                        </div>

                        <div className="col-8 text-left">

                          <small className="text-secondary  font-weight-bold d-block">
                            {formatDate(reservation.checkIn)}
                          </small>
                                          
                          <small className="text-secondary  font-weight-bold d-block">
                          {formatDate(reservation.checkOut)}
                          </small>

                        </div>
                      </div>

                    </td>
                    <td className="align-middle text-center text-sm">
                      <span className={`badge badge-sm ${getStatusBadgeClass(reservation.status)}`}>
            {reservation.status}
          </span>
                    </td>
                    <td className="align-middle">
                      <a
                        className="cursor-pointer"
                        onClick={() => toggleDropdown(reservation.id)}
                      >
                        <i className="fa fa-ellipsis-h text-dark"></i>
                      </a>
                      <div className="dropdown mb-3">
                        {openDropdown === reservation.id && (
                          <ul
                            className="dropdown-menu px-2 py-3 show"
                            style={{
                              position: 'absolute',
                              top: -50,
                              left: -155,
                              zIndex: 1,
                              backgroundColor: 'white',
                              boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
                              borderRadius: '4px',
                            }}
                          >
                            <li>
                              <button
                                className="dropdown-item border-radius-md"
                                onClick={(()=>handleStatusChange(reservation.id, {status:'Approved', announce:true}))}
                              >
                                Aprobar y avisar
                              </button>
                            </li>
                            <li>
                              <button
                                className="dropdown-item border-radius-md"
                                onClick={(()=>handleStatusChange(reservation.id, {status:'Approved', announce:false}))}
                              >
                                Aprobar y sin Avisar
                              </button>
                            </li>

                            <li>
                              <button
                                className="dropdown-item border-radius-md"
                                onClick={(()=>handleStatusChange(reservation.id, {status:'Pending', announce:true}))}
                              >
                                Pendiente
                              </button>
                            </li>
                            <li>
                              <button
                                className="dropdown-item border-radius-md"
                                onClick={(()=>handleStatusChange(reservation.id, {status:'Pending', announce:false}))}
                              >
                                Pendiente sin Avisar
                              </button>
                            </li>

                            <li>
                              <button
                                className="dropdown-item border-radius-md"
                                onClick={(()=>handleStatusChange(reservation.id, {status:'Cancelled', announce:true}))}
                              >
                                Cancellar
                              </button>
                            </li>
                            <li>
                              <button
                                className="dropdown-item border-radius-md"
                                onClick={(()=>handleStatusChange(reservation.id, {status:'Cancelled', announce:false}))}
                              >
                                Cancellar sin Avisar
                              </button>
                            </li>
                          </ul>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PendingReservations;
