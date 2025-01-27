import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { es } from 'date-fns/locale'; // Importación directa de la localización
import axios from 'axios';
import getConfig from '../../utils/getConfig';

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

  // const handleUpdateReservation = (id) => {
  //   const URL = `${import.meta.env.VITE_API_SERVER}/api/v1/rooms/${id}`;
  //   axios
  //       .patch(URL, getConfig())
  //       .then((res) => {
  //         setRoom(res.data)
            
  //       })
  //       .catch((err) => console.log(err));
  // }; 

  return (
    <div className="col-12">
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
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PendingReservations;
