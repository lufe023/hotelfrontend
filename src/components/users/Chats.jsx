import React, { useState, useContext, useEffect } from "react";
import { ChatContext } from "../../utils/ChatContext";
import Navbar from "../Navbar";


const Chats = () => {
  const [message, setMessage] = useState("");
  const [recipientId] = useState("c064508c-17e2-4c9d-a12d-288bd8c6740a"); // ID fijo de Amnia Santana
  
  // Usamos el contexto
  const { messages, sendMessage, chats } = useContext(ChatContext);
  
  // Enviar un mensaje
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!message.trim()) {
      return; // Evitar enviar mensajes vacíos
    }

    const newMessage = {
      chatId: "CHAT_ID", // ID del chat (reemplaza con el real)
      senderId: "userId",  // ID del remitente (usamos el ID del usuario del token)
      recipientId: recipientId, // ID del destinatario (Amnia Santana en este caso)
      content: message,
    };

    sendMessage(newMessage);
    setMessage(""); // Limpiar el campo de texto
  };

  return (
    <div>
      <Navbar />
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Escribe tu mensaje..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button type="submit">Enviar</button>
      </form>
      <ul>
        {messages.map((msg, index) => (
          <li key={index}>
            {msg.from} dice: {msg.body}
          </li>
        ))}
      </ul>

      <div className="col-md-3">
        {/* Direct Chat */}
        <div className="card card-primary card-outline direct-chat direct-chat-primary">
          <div className="card-header">
            <h3 className="card-title">Direct Chat</h3>
            <div className="card-tools">
              <span title="3 New Messages" className="badge bg-primary">3</span>
              <button type="button" className="btn btn-tool" data-card-widget="collapse">
                <i className="fas fa-minus" />
              </button>
              <button type="button" className="btn btn-tool" title="Contacts" data-widget="chat-pane-toggle">
                <i className="fas fa-comments" />
              </button>
              <button type="button" className="btn btn-tool" data-card-widget="remove">
                <i className="fas fa-times" />
              </button>
            </div>
          </div>
          {/* /.card-header */}
          <div className="card-body" style={{ display: 'block' }}>
            <div className="direct-chat-messages">
              {/* Conversaciones */}
              {messages.map((msg, index) => (
                <div className={`direct-chat-msg ${msg.from === "yo" ? "right" : ""}`} key={index}>
                  <div className="direct-chat-infos clearfix">
                    <span className={`direct-chat-name float-${msg.from === "yo" ? "right" : "left"}`}>{msg.from === "yo" ? "Tú" : "Otro"}</span>
                    <span className="direct-chat-timestamp float-right">23 Jan 2:00 pm</span>
                  </div>
                  <div className="direct-chat-text">
                    {msg.body}
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* /.card-body */}
        </div>
      </div>
    </div>
  );
};

export default Chats;
