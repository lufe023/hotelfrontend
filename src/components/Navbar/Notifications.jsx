import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { io } from "socket.io-client";
import Swal from 'sweetalert2';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import getConfig from '../../utils/getConfig';

const socket = io(import.meta.env.VITE_API_SERVER); // URL de tu backend
const token = localStorage.getItem("token");

export const Notifications = () => {
  const [openDropdown, setOpenDropdown] = useState(null);
  const [notifications, setNotifications] = useState([]);

  // Mapa de estilos para los tipos de notificación
  const notificationTypeStyles = {
    "new_message": { icon: "fa-comments", color: "bg-primary", title: "Nuevo mensaje" },
    "chat_status_change": { icon: "fa-refresh", color: "bg-info", title: "Cambio de estado de chat" },
    "agent_assigned": { icon: "fa-user-check", color: "bg-success", title: "Agente asignado" },
    "voucher_received": { icon: "fa-credit-card", color: "bg-warning", title: "Comprobante recibido" },
    "user_request_agent": { icon: "fa-headset", color: "bg-danger", title: "Solicitud de agente" },
    "chat_closed": { icon: "fa-times-circle", color: "bg-dark", title: "Chat cerrado" },
    "reminder": { icon: "fa-bell", color: "bg-secondary", title: "Recordatorio" },
    default: { icon: "fa-info-circle", color: "bg-light", title: "Notificación" }, // Estilo genérico
  };

  const toggleDropdown = () => setOpenDropdown(!openDropdown);


  // Función para manejar nuevas notificaciones
  const handleNewNotification = (data) => {
    // Obtener los detalles del tipo de notificación, o usar 'default' si no existe
    const { title } = notificationTypeStyles[data.type] || notificationTypeStyles.default;
  
    // Mostrar la notificación usando SweetAlert
    const Toast = Swal.mixin({
      toast: true,
      position: "top-end",
      showCloseButton: true,
      showConfirmButton: false,
      timer: 3000,
    });
  
    Toast.fire({
      icon: "info",
      title, // Usar el título del tipo de notificación
    });
  
    // Actualizar el estado de las notificaciones
    setNotifications((prev) => [data, ...prev]);
  };

  const getMyNotifications = async () => {
    try {
      const URL = `${import.meta.env.VITE_API_SERVER}/api/v1/notifications/my`;
      const { data } = await axios.get(URL, getConfig());
      setNotifications(data);
    } catch (err) {
      console.error("Error al obtener notificaciones:", err);
    }
  };

  useEffect(() => {
    if (!token) {
      console.error("Token no encontrado. Por favor inicia sesión.");
      return;
    }
  
    // Escuchar la conexión y reconexión del socket
    socket.on("connect", () => {
      console.log("Conectado al servidor de Socket.IO:", socket.id);
  
      // Emitir evento de autenticación con el token
      socket.emit("authenticate", token);
    });
  
    socket.on("disconnect", () => {
      console.warn("Desconectado del servidor de Socket.IO.");
    });
  
    // Escuchar nuevas notificaciones
    socket.on("new-notification", handleNewNotification);
  
    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("new-notification");
    };
  }, [token]);

  useEffect(() => {
    getMyNotifications();
  }, []);
  
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

  return (
    <>
      <button
        className="nav-link text-body p-0"
        id="dropdownMenuButton"
        data-bs-toggle="dropdown"
        aria-expanded={openDropdown}
        onClick={toggleDropdown}

      >
        <i className="fa fa-bell cursor-pointer" >
          <span className=" bg-info text-white" style={{padding:3, borderRadius:10, fontSize:"10px",position:"relative", top:"-5px", left:"-1px"}}>{notifications.length}</span>
        </i>
      </button>

      {openDropdown && (
        <ul className="dropdown-menu dropdown-menu-end px-2 py-3 me-sm-n4 show" aria-labelledby="dropdownMenuButton">
          {notifications.map((notification, index) => {
            const { type, createdAt } = notification;
            const { icon, color, title } = notificationTypeStyles[type] || notificationTypeStyles.default;
            const timeAgo = formatDistanceToNow(new Date(createdAt), { addSuffix: true, locale: es });

            return (
              <li key={index} className="mb-2">
                <a className="dropdown-item border-radius-md">
                  <div className="d-flex py-1">
                    <div className="my-auto">
                      <div className={`avatar avatar-sm ${color} me-3`}>
                        <i className={`fa ${icon}`} />
                      </div>
                    </div>
                    <div className="d-flex flex-column justify-content-center">
                      <h6 className="text-sm font-weight-normal mb-1">
                        <span className="font-weight-bold">{title}</span>
                      </h6>
                      <p className="text-xs text-secondary mb-0">
                        <i className="fa fa-clock me-1" />
                        {timeAgo}
                      </p>
                    </div>
                  </div>
                </a>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
};