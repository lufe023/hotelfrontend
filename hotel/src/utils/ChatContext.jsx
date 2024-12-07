import React, { createContext, useState, useEffect } from "react";
import { io } from "socket.io-client";

export const ChatContext = createContext();

const socket = io(import.meta.env.VITE_API_SERVER);

export const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessages((prev) => [
        ...prev,
        { from: data.senderId, body: data.content },
      ]);
    });

    return () => {
      socket.off("receive_message");
    };
  }, []);

  const sendMessage = (messageData) => {
    socket.emit("send_message", messageData);
    setMessages((prev) => [
      ...prev,
      { from: "yo", body: messageData.content },
    ]);
  };

  return (
    <ChatContext.Provider value={{ messages, sendMessage }}>
      {children}
    </ChatContext.Provider>
  );
};
