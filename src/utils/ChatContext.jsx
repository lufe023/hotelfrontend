import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import getConfig from "./getConfig";
import { useSelector } from "react-redux";

export const ChatContext = createContext();
// Crea el contexto
export const ChatProvider = ({ children }) => {
  const user = useSelector(state => state.userSlice);

  const [messages, setMessages] = useState([]);  // Mensajes del chat
  const [chats, setChats] = useState([]);        // Lista de chats
  const [selectedChat, setSelectedChat] = useState(null); // Chat seleccionado
  const userId = user.id;

  const getMyChats = () => {
    const URL = `${import.meta.env.VITE_API_SERVER}/api/v1/chats`;
    axios
      .get(URL, getConfig())
      .then((res) => {
        setChats(res.data); // Actualiza la lista de chats
        
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    if (userId) {
      getMyChats();
    }

  }, [userId]);

  useEffect(() => {
    if(selectedChat){
      setSelectedChat(chats.find(
      (chat) => chat.id === selectedChat.id
    ))}
  }, [chats])
  
  const handleNewMessageNotification = (data) => {
    if (data.type === "new_message") {
      // Actualizar los mensajes del chat correspondiente
      setChats((prevChats) =>
        prevChats.map((chat) =>
          chat.id === data.message.chatId
            ? { ...chat, messages: [...chat.messages, data.message] }
            : chat
        )
      );

      // Actualizar mensajes del chat seleccionado si coincide
      if (selectedChat?.id === data.message.chatId) {
        setSelectedChat((prev) => ({
          ...prev,
          messages: [...prev.messages, data.message],
        }));
      }
    }
  };


  return (
    <ChatContext.Provider
      value={{
        messages,
        chats,
        selectedChat,
        setSelectedChat,
        handleNewMessageNotification,
        getMyChats,
        user
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};