import React, { useEffect } from 'react';
import Swal from 'sweetalert2';

const HumanRequestNotification = ({ request }) => {
  // useEffect se activa cuando el componente recibe una solicitud
  useEffect(() => {
    if (request?.message === 'customer wants to talk to a human') {
      Swal.fire({
        title: '¡Nuevo mensaje!',
        text: 'El cliente desea hablar con un humano.',
        icon: 'info',
        confirmButtonText: 'Aceptar',
      });
    }
  }, [request]);

  return null;
};

export default HumanRequestNotification;
