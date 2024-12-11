import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { io } from "socket.io-client";
import Swal from 'sweetalert2';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import getConfig from '../../utils/getConfig';
import { ChatContext } from "../../utils/ChatContext"; // Importa
import { Link } from 'react-router-dom';

const socket = io(import.meta.env.VITE_API_SERVER, {
  autoConnect: true, // Reconectar automáticamente
  reconnection: true, // Habilitar reconexión
  reconnectionAttempts: 5, // Número de intentos antes de fallar
  reconnectionDelay: 1000, // Tiempo entre intentos
});
const token = localStorage.getItem("token");

export const Notifications = () => {
  const [openDropdown, setOpenDropdown] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const { getMyChats } = useContext(ChatContext); 

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
    getMyChats()
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


      // Manejador para la conexión inicial
      const handleConnect = () => {
        // console.log("Conectado al servidor de Socket.IO:", socket.id);
        socket.emit("authenticate", token); // Enviar token al conectarse
      };


  useEffect(() => {
    if (!token) {
      console.error("Token no encontrado. Por favor inicia sesión.");
      return;
    }
  
    handleConnect()
    // Manejador para la reconexión
    const handleReconnect = () => {
      console.log("Reconectado al servidor de Socket.IO:", socket.id);
      socket.emit("authenticate", token); // Reenviar el token tras reconectar
    };
  
    // Configuración de eventos de Socket.IO
    socket.on("connect", handleConnect); // Cuando se conecta
    socket.on("reconnect", handleReconnect); // Cuando se reconecta
    socket.on("disconnect", () => {
      console.warn("Desconectado del servidor de Socket.IO.");
    });
    socket.on("new-notification", handleNewNotification);
  
    // Cleanup al desmontar el componente
    return () => {
      socket.off("connect", handleConnect);
      socket.off("reconnect", handleReconnect);
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

  localStorage.debug = "socket.io-client:socket";

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const isValidDate = (date) => {
    const parsedDate = new Date(date);
    return !isNaN(parsedDate.getTime());
  };
const ternToJson = (text)=>{
return  JSON.parse(text)
}

const putNotificatoionsRead = (id) => {
  const URL = `${import.meta.env.VITE_API_SERVER}/api/v1/notifications/${id}`;
  axios
      .patch(URL,{isRead:true}, getConfig())
      .then((res) => {

      })
      .catch((err) => console.log(err));
}

  return (
    <>
      <button
        className="nav-link text-body p-0"
        // id="dropdownMenuButton"
        // data-bs-toggle="dropdown"
        aria-expanded={openDropdown}
        onClick={toggleDropdown}
      >
        <i className="fa fa-bell cursor-pointer" >
          <span className=" bg-info text-white" style={{padding:3, borderRadius:10, fontSize:"10px",position:"relative", top:"-5px", left:"-1px"}}>{notifications.length}</span>
        </i>
      </button>

      {openDropdown && (
        <ul className="dropdown-menu dropdown-menu-end px-2 py-3 me-sm-n4 show" aria-labelledby="dropdownMenuButton">
          {notifications?.map((notification, index) => {
            const { type, createdAt } = notification;
            const { icon, color, title } = notificationTypeStyles[type] || notificationTypeStyles.default;
           const timeAgo = isValidDate(createdAt)
  ? formatDistanceToNow(new Date(createdAt), { addSuffix: true, locale: es })
  : "Fecha no disponible";

            return (
              <li key={index} className="mb-2">
                <Link to={`/support/${ternToJson(notification.content).chat.chat.id}`} onClick={()=>putNotificatoionsRead(notification.id)} className="dropdown-item border-radius-md">
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
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
};