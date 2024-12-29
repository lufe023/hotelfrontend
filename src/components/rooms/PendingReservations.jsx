import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { es } from 'date-fns/locale'; // Importación directa de la localización

const PendingReservations = ({ reservations }) => {
  const [openDropdown, setOpenDropdown] = useState();

  const toggleDropdown = (id) => {
    setOpenDropdown((prev) => (prev === id ? null : id));
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
    return format(date, "dd 'de' MMMM 'de' yyyy", { locale: es });
  };

  return (
    <div className="col-12" id='pending'>
      <div className="card mb-4">
        <div className="card-header pb-0">
          <h6>Reservaciones Pendientes </h6>
        </div>
        <div className="card-body px-0 pt-0 pb-2">
          <div className="table-responsive p-0" style={{minHeight:250}}>
            <table className="table align-items-center mb-0">
              <thead>
                <tr>
                  <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">
                    Usuario
                  </th>
                  <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">
                    Check-In
                  </th>
                  <th className="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">
                    Check-Out
                  </th>
                  <th className="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">
                    Estado
                  </th>
                  <th
                    className="text-secondary opacity-7"
                    style={{ width: 20 }}
                  />
                </tr>
              </thead>
              <tbody>
                {reservations?.map((reservation) => (
                  <tr key={reservation.id}>
                    <td>
                      <div className="d-flex px-2 py-1">
                        <div className="d-flex flex-column justify-content-center">
                          <h6 className="mb-0 text-sm">
                            {reservation.user.firstName} {reservation.user.lastName}
                          </h6>
                          <p className="text-xs text-secondary mb-0">
                            {reservation.user.email}
                          </p>
                          <p className="text-xs text-secondary mb-0">
                            {reservation.user.phone}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="align-middle text-center">
                      <span className="text-secondary text-xs font-weight-bold">
                        {formatDate(reservation.checkIn)}
                      </span>
                    </td>
                    <td className="align-middle text-center">
                      <span className="text-secondary text-xs font-weight-bold">
                        {formatDate(reservation.checkOut)}
                      </span>
                    </td>
                    <td className="align-middle text-center text-sm">
                      <span className="badge badge-sm bg-gradient-warning">
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
                              <Link
                                className="dropdown-item border-radius-md"
                                to={`/room/`}
                              >
                                Aprobar sin avisar
                              </Link>
                            </li>
                            <li>
                              <Link
                                className="dropdown-item border-radius-md"
                                to={`/room/`}
                              >
                                Aprobar y avisar
                              </Link>
                            </li>
                            <li>
                              <Link
                                className="dropdown-item border-radius-md"
                                to={`/room/`}
                              >
                                Cancelar
                              </Link>
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
