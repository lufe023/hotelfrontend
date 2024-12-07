import React, { createContext, useState, useEffect } from "react";
import { io } from "socket.io-client";
import axios from "axios";
import Swal from "sweetalert2";
import getConfig from "../utils/getConfig";

export const NotificationContext = createContext();

const socket = io(import.meta.env.VITE_API_SERVER);

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const notificationTypeStyles = {
    "new_message": { icon: "fa-comments", color: "bg-primary", title: "Nuevo mensaje" },
    "chat_status_change": { icon: "fa-refresh", color: "bg-info", title: "Cambio de estado de chat" },
    "agent_assigned": { icon: "fa-user-check", color: "bg-success", title: "Agente asignado" },
    "voucher_received": { icon: "fa-credit-card", color: "bg-warning", title: "Comprobante recibido" },
    "user_request_agent": { icon: "fa-headset", color: "bg-danger", title: "Solicitud de agente" },
    "chat_closed": { icon: "fa-times-circle", color: "bg-dark", title: "Chat cerrado" },
    "reminder": { icon: "fa-bell", color: "bg-secondary", title: "Recordatorio" },
    default: { icon: "fa-info-circle", color: "bg-light", title: "Notificación" },
  };

  const handleNewNotification = (data) => {
    Swal.fire({
      toast: true,
      position: "top-end",
      icon: "info",
      title: notificationTypeStyles[data.type]?.title || "Nueva notificación",
      showConfirmButton: false,
      timer: 3000,
    });

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
    socket.on("new-notification", handleNewNotification);
    getMyNotifications();

    return () => {
      socket.off("new-notification");
    };
  }, []);

  return (
    <NotificationContext.Provider value={{ notifications, notificationTypeStyles }}>
      {children}
    </NotificationContext.Provider>
  );
};
